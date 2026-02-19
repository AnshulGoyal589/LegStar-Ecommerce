"use client"

import { useState, useEffect } from "react"
import { saveBannerAction, deleteBannerAction } from "@/lib/actions/banner-actions"
import { Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff, GripVertical, Loader2, Upload, X, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function BannersPage({ banners: initialBanners }: { banners: any[] }) {
  const [banners, setBanners] = useState(initialBanners || [])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Media state
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaBase64, setMediaBase64] = useState<string | null>(null)
  const [resourceType, setResourceType] = useState<"image" | "video">("image")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    position: "hero",
    order: 1,
    active: true,
    image: "",         // Keep existing URL
    imagePublicId: ""  // Keep existing ID
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("File too large (Max 5MB)")
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setMediaBase64(base64)
        setMediaPreview(base64)
        setResourceType(file.type.startsWith("video") ? "video" : "image")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mediaPreview) {
    toast.error("Please upload an image or video")
    return
  }
  
    setSaving(true)
    try {
      await saveBannerAction(
        editingBanner?._id || null, 
        { ...formData, resourceType }, 
        mediaBase64
      )
      toast.success("Banner saved successfully")
      setDialogOpen(false)
      window.location.reload() // Quickest way to refresh server data
    } catch (error) {
      toast.error("Error saving banner")
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      link: banner.link,
      position: banner.position,
      order: banner.order,
      active: banner.active,
      image: banner.image,          // Set existing URL
    imagePublicId: banner.imagePublicId
    })
    setMediaPreview(banner.image)
    setResourceType(banner.resourceType || "image")
    setMediaBase64(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners & Promotions</h1>
        <Button onClick={() => { setEditingBanner(null); setMediaPreview(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="grid gap-4">
        {banners.map((banner: any) => (
          <div key={banner._id} className="flex items-center gap-4 p-4 bg-background border rounded-xl shadow-sm">
            <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
               {banner.resourceType === "video" ? (
                 <video src={banner.image} className="w-full h-full object-cover muted" />
               ) : (
                 <img src={banner.image} className="w-full h-full object-cover" />
               )}
               {banner.resourceType === "video" && <PlayCircle className="absolute inset-0 m-auto text-white h-6 w-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{banner.title}</h3>
              <p className="text-xs text-muted-foreground uppercase">{banner.position} • Order: {banner.order}</p>
            </div>
            <div className="flex items-center gap-4">
               <DropdownMenu>
                  <DropdownMenuTrigger><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(banner)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                      </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={async () => {
                        if(confirm("Are you sure?")) {
                          await deleteBannerAction(banner._id.toString());
                          toast.success("Banner and media deleted.");
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingBanner ? "Edit Banner" : "New Banner"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Media (Image or Video)</Label>
              {mediaPreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border">
                  {resourceType === "video" ? (
                    <video src={mediaPreview} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={mediaPreview} className="w-full h-full object-cover" />
                  )}
                  <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2" onClick={() => {setMediaPreview(null); setMediaBase64(null)}}>
                    <X />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm">Upload Image or Video</span>
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="/products/..." />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Position</Label>
                <Select value={formData.position} onValueChange={v => setFormData({...formData, position: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Slider</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
              </div>
              <div className="flex flex-col justify-end pb-2">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.active} onCheckedChange={v => setFormData({...formData, active: v})} />
                  <Label>Active</Label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Banner"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}