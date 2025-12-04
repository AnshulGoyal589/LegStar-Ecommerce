"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, MoreHorizontal, Edit, Trash2, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import type { ComboProduct } from "@/lib/types"

export default function CombosPage() {
  const [combos, setCombos] = useState<ComboProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCombo, setEditingCombo] = useState<ComboProduct | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [gender, setGender] = useState<"men" | "women" | "kids" | "all">("all")
  const [sizes, setSizes] = useState("")
  const [stock, setStock] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isFeatured, setIsFeatured] = useState(false)
  const [badge, setBadge] = useState("")

  const fetchCombos = async () => {
    try {
      const res = await fetch("/api/admin/combos")
      if (res.ok) {
        const data = await res.json()
        setCombos(data)
      }
    } catch (error) {
      toast.error("Failed to fetch combos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCombos()
  }, [])

  const resetForm = () => {
    setName("")
    setSlug("")
    setDescription("")
    setPrice("")
    setOriginalPrice("")
    setGender("all")
    setSizes("")
    setStock("")
    setImages([])
    setIsFeatured(false)
    setBadge("")
    setEditingCombo(null)
  }

  const openEditDialog = (combo: ComboProduct) => {
    setEditingCombo(combo)
    setName(combo.name)
    setSlug(combo.slug)
    setDescription(combo.description)
    setPrice(combo.price.toString())
    setOriginalPrice(combo.originalPrice.toString())
    setGender(combo.gender)
    setSizes(combo.sizes.join(", "))
    setStock(combo.stock.toString())
    setImages(combo.images)
    setIsFeatured(combo.isFeatured)
    setBadge(combo.badge || "")
    setDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", files[0])

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setImages([...images, data.url])
        toast.success("Image uploaded")
      } else {
        toast.error("Failed to upload image")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description,
        price: Number.parseFloat(price),
        originalPrice: Number.parseFloat(originalPrice),
        gender,
        sizes: sizes.split(",").map((s) => s.trim()),
        colors: [{ name: "Assorted", hex: "#333333" }],
        stock: Number.parseInt(stock) || 0,
        savings: Number.parseFloat(originalPrice) - Number.parseFloat(price),
        images,
        products: [],
        isFeatured,
        badge: badge || undefined,
      }

      const url = editingCombo ? `/api/admin/combos/${editingCombo._id}` : "/api/admin/combos"
      const method = editingCombo ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingCombo ? "Combo updated" : "Combo created")
        setDialogOpen(false)
        resetForm()
        fetchCombos()
      } else {
        toast.error("Failed to save combo")
      }
    } catch (error) {
      toast.error("Failed to save combo")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/combos/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Combo deleted")
        fetchCombos()
      } else {
        toast.error("Failed to delete combo")
      }
    } catch (error) {
      toast.error("Failed to delete combo")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Combos & Multipacks</h1>
          <p className="text-muted-foreground">Manage best seller combo packs</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add Combo
        </Button>
      </div>

      {combos.length === 0 ? (
        <div className="text-center py-12 bg-background border rounded-lg">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No combos yet</p>
          <Button
            className="mt-4"
            onClick={() => {
              resetForm()
              setDialogOpen(true)
            }}
          >
            Create Your First Combo
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {combos.map((combo) => (
            <div key={combo._id} className="bg-background border rounded-lg overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {combo.images[0] ? (
                  <Image src={combo.images[0] || "/placeholder.svg"} alt={combo.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {combo.badge && <Badge className="absolute top-2 left-2">{combo.badge}</Badge>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{combo.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{combo.gender}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(combo)}>
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600" onClick={() => setDeleteId(combo._id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-bold">₹{combo.price}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{combo.originalPrice}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    Save ₹{combo.savings}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm()
          setDialogOpen(open)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCombo ? "Edit Combo" : "Create New Combo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Original Price (₹) *</Label>
                <Input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={(v: "men" | "women" | "kids" | "all") => setGender(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g., Best Seller" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sizes (comma separated)</Label>
              <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L, XL" />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded border overflow-hidden">
                    <Image src={img || "/placeholder.svg"} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-muted">
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCombo ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Combo</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this combo?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
