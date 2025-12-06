"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff, GripVertical, Upload, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { toast } from "sonner"
import MultipleImageUpload from "@/components/MultipleImageUpload"

interface Banner {
  _id: string
  title: string
  image: string
  imagePublicId?: string
  link: string
  position: "hero" | "sidebar" | "popup"
  order: number
  active: boolean
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  // const [uploading, setUploading] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [position, setPosition] = useState<"hero" | "sidebar" | "popup">("hero")
  const [order, setOrder] = useState(1)
  const [active, setActive] = useState(true)
  const [images, setImages] = useState<string[]>([])
  // const [image, setImage] = useState<{ url: string; publicId?: string } | null>(null)

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners")
      if (res.ok) {
        const data = await res.json()
        setBanners(data)
      }
    } catch (error) {
      toast.error("Failed to fetch banners")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const resetForm = () => {
    setTitle("")
    setLink("")
    setPosition("hero")
    setOrder(1)
    setActive(true)
    setImages([]) // Changed from setImage(null)
    setEditingBanner(null)
  }

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner)
    setTitle(banner.title)
    setLink(banner.link)
    setPosition(banner.position)
    setOrder(banner.order)
    setActive(banner.active)
    // Convert single image string to array for the component
    setImages(banner.image ? [banner.image] : []) 
    setDialogOpen(true)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check array length
    if (images.length === 0) {
      toast.error("Please upload an image")
      return
    }

    setSaving(true)
    try {
      const payload = {
        title,
        link,
        position,
        order,
        active,
        image: images[0], // Extract the first URL
        // Removed imagePublicId as the new simple uploader only returns URLs
      }

      const url = editingBanner ? `/api/admin/banners/${editingBanner._id}` : "/api/admin/banners"
      const method = editingBanner ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      // ... rest of the function remains the same

      if (res.ok) {
        toast.success(editingBanner ? "Banner updated" : "Banner created")
        setDialogOpen(false)
        resetForm()
        fetchBanners()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save banner")
      }
    } catch (error) {
      toast.error("Failed to save banner")
    } finally {
      setSaving(false)
    }
  }

  const toggleBannerActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !banner.active }),
      })
      if (res.ok) {
        toast.success(banner.active ? "Banner hidden" : "Banner activated")
        fetchBanners()
      }
    } catch (error) {
      toast.error("Failed to update banner")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/banners/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Banner deleted")
        fetchBanners()
      } else {
        toast.error("Failed to delete banner")
      }
    } catch (error) {
      toast.error("Failed to delete banner")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const heroBanners = banners.filter((b) => b.position === "hero")
  const sidebarBanners = banners.filter((b) => b.position === "sidebar")

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
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Manage homepage and promotional banners</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {/* Hero Banners */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Hero Slider Banners</h2>
        {heroBanners.length === 0 ? (
          <div className="text-center py-8 bg-background border rounded-lg">
            <p className="text-muted-foreground">No hero banners yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {heroBanners.map((banner) => (
              <div
                key={banner._id}
                className={`flex items-center gap-4 p-4 bg-background border rounded-lg ${!banner.active ? "opacity-60" : ""}`}
              >
                <button className="cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-5 w-5" />
                </button>
                <img
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-32 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground">{banner.link}</p>
                </div>
                <div className="flex items-center gap-2">
                  {banner.active ? (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <Eye className="h-4 w-4" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <EyeOff className="h-4 w-4" /> Hidden
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(banner)}>
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => toggleBannerActive(banner)}>
                        {banner.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {banner.active ? "Hide" : "Show"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600" onClick={() => setDeleteId(banner._id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Banners */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Sidebar Banners</h2>
        {sidebarBanners.length === 0 ? (
          <div className="text-center py-8 bg-background border rounded-lg">
            <p className="text-muted-foreground">No sidebar banners yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sidebarBanners.map((banner) => (
              <div
                key={banner._id}
                className={`bg-background border rounded-lg overflow-hidden ${!banner.active ? "opacity-60" : ""}`}
              >
                <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="w-full h-32 object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{banner.title}</h3>
                    <span className={`text-xs ${banner.active ? "text-green-600" : "text-muted-foreground"}`}>
                      {banner.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(banner)}>
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600" onClick={() => setDeleteId(banner._id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm()
          setDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Inside the <form> in the DialogContent */}

            <div className="space-y-2">
              <Label>Banner Image *</Label>
              <MultipleImageUpload 
                value={images}
                onChange={setImages}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Upload the banner image. If multiple are uploaded, the first one will be used.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Banner Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/products or https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={(v) => setPosition(v as "hero" | "sidebar" | "popup")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Slider</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(Number.parseInt(e.target.value) || 1)} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
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
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingBanner ? "Update" : "Add Banner"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this banner?</AlertDialogDescription>
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
