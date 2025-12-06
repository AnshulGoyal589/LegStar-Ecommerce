"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, Trash2, X } from "lucide-react" // Removed unused 'Upload' icon
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import MultipleImageUpload from "@/components/MultipleImageUpload" // Assuming this component exists and works as described
import type { Product } from "@/lib/types"
import type { CheckedState } from "@radix-ui/react-checkbox"

interface Image {
  url: string;
  publicId?: string;
  alt?: string;
}

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

  // --- State Management ---
  const [name, setName] = useState(initialProduct.name || "")
  const [description, setDescription] = useState(initialProduct.description || "")
  const [price, setPrice] = useState(initialProduct.price?.toString() || "")
  const [originalPrice, setOriginalPrice] = useState(initialProduct.originalPrice?.toString() || "")
  const [images, setImages] = useState<string[]>(initialProduct.images || [])
  const [category, setCategory] = useState("") // Initialized below in useMemo
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
  
  // --- Memoized Derived State ---
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

  // Initialize category state after options are calculated
  useMemo(() => {
    const initialCategoryValue = categoryOptions.find(opt => opt.categorySlug === initialProduct.category && opt.subcategorySlug === initialProduct.subcategory)?.value || ""
    setCategory(initialCategoryValue)
  }, [categoryOptions, initialProduct])


  // --- Variant Handlers ---
  const addVariant = () => setVariants([...variants, { size: "M", color: "White", stock: 0, price: 0 }])
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index))
  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  // --- Form Submission ---
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
      
      if (images.length === 0) {
        toast({ title: "Missing Image", description: "At least one product image is required.", variant: "destructive" })
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
        tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
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
            <CardHeader><CardTitle>Product Images *</CardTitle></CardHeader>
               {/* --- CORRECTED IMAGE UPLOAD SECTION --- */}
               <MultipleImageUpload
                  label="Product Images"
                  value={images.map(url => ({ url }))}
                  onChange={(newImages) => setImages(newImages.map(img => img.url))}
               />
              <CardContent>
               <p className="text-sm text-muted-foreground mt-2">First image is the main image. Drag to reorder.</p>
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