"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { Product } from "@/lib/types"

// --- Helper Types & Constants ---
interface CategoryOption {
  value: string
  label: string
  gender: "men" | "women" | "kids" | "unknown"
  categorySlug?: string
  subcategorySlug: string
}

interface Variant {
  size: string
  color: string
  stock: number
  price: number
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]
const COLOR_MAP: Record<string, string> = {
  White: "#FFFFFF", Black: "#000000", Navy: "#000080", Grey: "#808080",
  Skin: "#F1C27D", Pink: "#FFC0CB", Blue: "#0000FF", Red: "#FF0000",
}
const COLORS = Object.keys(COLOR_MAP)

export interface CategoryClient {
    _id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    gender?: "men" | "women" | "kids";
}


export default function EditProductForm({
  initialProduct,
  allCategories,
}: {
  initialProduct: Product
  allCategories: CategoryClient[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)


  const categoryOptions = useMemo((): CategoryOption[] => {
    const categoryMap = new Map(allCategories.map((c) => [c._id, c]))
    return allCategories
      .filter((cat) => cat.parentId)
      .map((cat) => {
        const parent = cat.parentId ? categoryMap.get(cat.parentId) : undefined
        const gender: CategoryOption["gender"] =
          parent && (parent.gender === "men" || parent.gender === "women" || parent.gender === "kids")
            ? parent.gender
            : "unknown"
        const label = `${gender.charAt(0).toUpperCase() + gender.slice(1)} > ${parent?.name || ""} > ${cat.name}`
        return { value: cat._id, label, gender, categorySlug: parent?.slug, subcategorySlug: cat.slug }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [allCategories])

  const initialCategoryValue = useMemo(() =>
    categoryOptions.find(opt => opt.categorySlug === initialProduct.category && opt.subcategorySlug === initialProduct.subcategory)?.value || "",
    [categoryOptions, initialProduct]
  );


  const [name, setName] = useState(initialProduct.name || "")
  const [description, setDescription] = useState(initialProduct.description || "")
  const [price, setPrice] = useState(initialProduct.price?.toString() || "")
  const [originalPrice, setOriginalPrice] = useState(initialProduct.originalPrice?.toString() || "")
  const [images, setImages] = useState<string[]>(initialProduct.images || [])
  const [category, setCategory] = useState(initialCategoryValue)
  const [status, setStatus] = useState(initialProduct.status || "active")
  const [variants, setVariants] = useState<Variant[]>(initialProduct.variantsData?.length ? initialProduct.variantsData : [{ size: "M", color: "White", stock: 50, price: 499 }])
  const [isFeatured, setIsFeatured] = useState(initialProduct.isFeatured || false)
  const [badge, setBadge] = useState(initialProduct.badge || "")
  const [tags, setTags] = useState(initialProduct.tags?.join(", ") || "")
  const [brand, setBrand] = useState(initialProduct.brand || "LegStar")
  const [sku, setSku] = useState(initialProduct.sku || "")
  const [barcode, setBarcode] = useState(initialProduct.barcode || "")
  const [costPerItem, setCostPerItem] = useState(initialProduct.costPerItem?.toString() || "")
  const [isTaxable, setIsTaxable] = useState(initialProduct.isTaxable !== false)
  const [metaTitle, setMetaTitle] = useState(initialProduct.seo?.title || "")
  const [metaDesc, setMetaDesc] = useState(initialProduct.seo?.description || "")
  const [slug, setSlug] = useState(initialProduct.slug || "")

  const [isUploading, setIsUploading] = useState(false)


  const addVariant = () => setVariants([...variants, { size: "M", color: "White", stock: 0, price: 0 }])
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index))
  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const selectedCategory = categoryOptions.find((opt) => opt.value === category)
      if (!name || !price || !selectedCategory) {
        toast({ title: "Missing Fields", description: "Name, Price, and Category are required.", variant: "destructive" })
        setIsSaving(false)
        return
      }

      const totalStock = variants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)
      const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)))
      const uniqueColorNames = Array.from(new Set(variants.map((v) => v.color)))
      const colorObjects = uniqueColorNames.map((name) => ({ name, hex: COLOR_MAP[name] || "#000000" }))

      const payload: Partial<Product> = {
        name,
        slug,
        description,
        price: parseFloat(price) || 0,
        originalPrice: parseFloat(originalPrice) || 0,
        images,
        category: selectedCategory.categorySlug,
        subcategory: selectedCategory.subcategorySlug,
        gender: selectedCategory.gender === "unknown" ? undefined : selectedCategory.gender,
        sizes: uniqueSizes,
        colors: colorObjects,
        stock: totalStock,
        isFeatured,
        badge: badge || undefined,
        status: status as Product['status'],
        tags: tags.split(",").map((t: any) => t.trim()).filter(Boolean),
        brand,
        sku,
        barcode,
        costPerItem: parseFloat(costPerItem) || 0,
        isTaxable,
        seo: { title: metaTitle, description: metaDesc },
        variantsData: variants,
      }

      const response = await fetch(`/api/admin/products/${initialProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to update product")

      toast({ title: "Success", description: "Product updated successfully." })
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // This new handler will replace the inline onChange logic.
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files || files.length === 0) return

  setIsUploading(true)
  try {
    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append("files", file)
    })

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Image upload failed")
    }

    // Append the new Cloudinary URLs to your images state
    setImages((prevImages) => [...prevImages, ...data.urls])
    toast({ title: "Success", description: `${data.urls.length} image(s) uploaded.` })
  } catch (error) {
    toast({
      title: "Upload Error",
      description: error instanceof Error ? error.message : "Something went wrong",
      variant: "destructive",
    })
  } finally {
    setIsUploading(false)
    // Clear the file input value to allow re-uploading the same file
    e.target.value = ""
  }
}

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon"> <ArrowLeft className="h-5 w-5" /> </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update details for: <span className="font-medium text-primary">{initialProduct.name}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="sku">SKU</Label><Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} /></div>
                <div><Label htmlFor="barcode">Barcode</Label><Input id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-6 w-6 text-muted-foreground animate-spin mb-2" />
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">First image will be the main product image.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="price">Regular Price (₹) *</Label><Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
                <div><Label htmlFor="originalPrice">Original Price (₹)</Label><Input id="originalPrice" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} /></div>
                <div><Label htmlFor="costPerItem">Cost per Item (₹)</Label><Input id="costPerItem" type="number" value={costPerItem} onChange={(e) => setCostPerItem(e.target.value)} /></div>
              </div>
              <div className="flex items-center gap-2"><Checkbox id="taxable" checked={isTaxable} onCheckedChange={(c: CheckedState) => setIsTaxable(Boolean(c))} /><Label htmlFor="taxable">Charge tax on this product</Label></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="gap-1"><Plus className="h-4 w-4" /> Add Variant</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-end gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div><Label>Size</Label><Select value={variant.size} onValueChange={(v) => updateVariant(index, "size", v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Color</Label><Select value={variant.color} onValueChange={(v) => updateVariant(index, "color", v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Stock</Label><Input type="number" value={variant.stock} onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)} /></div>
                    <div><Label>Price (₹)</Label><Input type="number" value={variant.price} onChange={(e) => updateVariant(index, "price", parseInt(e.target.value) || 0)} /></div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)} disabled={variants.length === 1}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Product Status</Label>
                <Select value={status} onValueChange={(v: string) => setStatus(v as "active" | "draft" | "archived")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-2"><Checkbox id="isFeatured" checked={isFeatured} onCheckedChange={(c: CheckedState) => setIsFeatured(Boolean(c))} /><Label htmlFor="isFeatured">Feature this product</Label></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categoryOptions.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}</SelectContent></Select>
              </div>
              <div><Label htmlFor="badge">Badge</Label><Input id="badge" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g., New Arrival"/></div>
              <div><Label htmlFor="tags">Tags</Label><Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Separate with commas" /></div>
              <div><Label htmlFor="brand">Brand</Label><Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="metaTitle">Meta Title</Label><Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} /></div>
              <div><Label htmlFor="metaDesc">Meta Description</Label><Textarea id="metaDesc" rows={3} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} /></div>
              <div><Label htmlFor="slug">URL Slug</Label><Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}