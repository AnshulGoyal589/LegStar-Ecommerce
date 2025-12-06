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
import MultipleImageUpload from "@/components/MultipleImageUpload"

// --- TYPES for client-side data ---
export interface CategoryClient {
  _id: string
  name: string
  slug: string
  parentId?: string | null
  gender?: "men" | "women" | "kids"
}

interface CategoryOption {
  value: string // The category _id
  label: string // e.g., "Men > Innerwear > Briefs"
  gender: "men" | "women" | "kids" | "unknown"
  categorySlug?: string
  subcategorySlug: string
}

// --- Constants & Helpers ---
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]
const COLOR_MAP: Record<string, string> = {
  White: "#FFFFFF",
  Black: "#000000",
  Navy: "#000080",
  Grey: "#808080",
  Skin: "#F1C27D",
  Pink: "#FFC0CB",
  Blue: "#0000FF",
  Red: "#FF0000",
}
const COLORS = Object.keys(COLOR_MAP)

// --- COMPONENT ---
// It now accepts `allCategories` as a prop from the server component
export default function NewProductPage({ allCategories }: { allCategories: CategoryClient[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // --- Form State ---
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState("") // Will now store the selected category's _id
  const [status, setStatus] = useState("draft")
  const [variants, setVariants] = useState([{ size: "M", color: "White", stock: 50, price: 499 }])
  const [isUploading, setIsUploading] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  const categoryOptions = useMemo((): CategoryOption[] => {
    const categoryMap = new Map(allCategories.map((c) => [c._id, c]))
    return allCategories
      .filter((cat) => cat.parentId) // We only want to assign products to subcategories
      .map((cat) => {
        const parent = cat.parentId ? categoryMap.get(cat.parentId) : undefined
        const gender: CategoryOption["gender"] =
          parent && (parent.gender === "men" || parent.gender === "women" || parent.gender === "kids")
            ? parent.gender
            : "unknown"
        const label = `${gender.charAt(0).toUpperCase() + gender.slice(1)} > ${parent?.name || "Uncategorized"} > ${cat.name}`

        return {
          value: cat._id,
          label,
          gender,
          categorySlug: parent?.slug,
          subcategorySlug: cat.slug,
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically for better UX
  }, [allCategories])

  // --- Handlers ---
  const addVariant = () => setVariants([...variants, { size: "M", color: "White", stock: 0, price: 0 }])
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index))
  const updateVariant = (index: number, field: string, value: string | number) => {
    const updated = [...variants]
    // @ts-ignore
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }
  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("name") as string

      // Find the selected category object from our dynamic options
      const selectedCategory = categoryOptions.find((opt) => opt.value === category)

      if (!name || !formData.get("price") || !selectedCategory) {
        toast({
          title: "Missing Fields",
          description: "Please fill in Name, Price, and select a valid Category.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const totalStock = variants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)
      const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)))
      const uniqueColorNames = Array.from(new Set(variants.map((v) => v.color)))
      const colorObjects = uniqueColorNames.map((name) => ({
        name,
        hex: COLOR_MAP[name] || "#000000",
      }))

      // Construct payload using reliable data from the selectedCategory object
      const payload = {
        name,
        slug: (formData.get("slug") as string) || generateSlug(name),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        originalPrice: Number(formData.get("comparePrice")) || 0,
        images,
        category: selectedCategory.categorySlug,
        subcategory: selectedCategory.subcategorySlug,
        gender: selectedCategory.gender,
        sizes: uniqueSizes,
        colors: colorObjects,
        stock: totalStock,
        rating: 0, // Default for new products
        reviews: 0, // Default for new products
        // NEW FIELDS: Added 'isFeatured' and 'badge' to match the Product schema.
        isFeatured: isFeatured,
        badge: (formData.get("badge") as string) || undefined,
        // --- Other data for backend processing ---
        status,
        sku: formData.get("sku"),
        barcode: formData.get("barcode"),
        costPerItem: Number(formData.get("cost")),
        isTaxable: formData.get("taxable") === "on",
        tags: formData.get("tags")?.toString().split(",").map((t) => t.trim()).filter(Boolean),
        brand: formData.get("brand"),
        seo: {
          title: formData.get("metaTitle"),
          description: formData.get("metaDesc"),
        },
        variantsData: variants,
      }

      console.log("Submitting product payload:", payload)
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create product")

      toast({ title: "Success", description: "Product created successfully" })
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product in your catalog</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" placeholder="Enter product name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} placeholder="Enter product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" placeholder="e.g., MCB-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" name="barcode" placeholder="Enter barcode" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
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
                  <MultipleImageUpload
                    label="Product Images"
                    value={images.map(url => ({ url }))}
                    onChange={(newImages) => setImages(newImages.map(img => img.url))}
                />
                </label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">First image will be the main product image.</p>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price (₹) *</Label>
                  <Input id="price" name="price" type="number" placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Original Price (₹)</Label>
                  <Input id="comparePrice" name="comparePrice" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost per Item (₹)</Label>
                  <Input id="cost" name="cost" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="taxable" name="taxable" defaultChecked />
                <Label htmlFor="taxable">Charge tax on this product</Label>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="gap-1 bg-transparent">
                <Plus className="h-4 w-4" /> Add Variant
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-end gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Select value={variant.size} onValueChange={(v) => updateVariant(index, "size", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {SIZES.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Select value={variant.color} onValueChange={(v) => updateVariant(index, "color", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            {COLORS.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, "stock", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (₹)</Label>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, "price", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(index)}
                      disabled={variants.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* NEW FIELD ADDED: 'isFeatured' checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked: CheckedState) => setIsFeatured(Boolean(checked))}
                />
                <Label htmlFor="isFeatured" className="text-sm font-medium">
                  Feature this product
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Organization - NOW DYNAMIC */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* NEW FIELD ADDED: 'badge' input */}
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input id="badge" name="badge" placeholder="e.g., New Arrival, Bestseller" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" name="tags" placeholder="Separate tags with commas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" name="brand" defaultValue="LegStar" />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" name="metaTitle" placeholder="Enter meta title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea id="metaDesc" name="metaDesc" rows={3} placeholder="Enter meta description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" name="slug" placeholder="auto-generated-from-name" />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" disabled={isLoading}>
              Save Draft
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}