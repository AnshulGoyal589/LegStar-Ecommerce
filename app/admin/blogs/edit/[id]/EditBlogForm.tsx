"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveBlogAction } from "@/lib/actions/blog-actions" // Updated import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, X, Loader2 } from "lucide-react" // Added icons
import type { Blog } from "@/lib/types"

export default function EditBlogForm({ blog }: { blog: Blog }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // States for Cloudinary Logic
  const [imagePreview, setImagePreview] = useState<string | null>(blog.image || null)
  const [base64File, setBase64File] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: blog.title,
    author: blog.author,
    excerpt: blog.excerpt,
    content: blog.content,
    tags: blog.tags.join(", "),
    isPublished: blog.isPublished
  })

  // Handle Image Selection and Base64 conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setBase64File(base64) // Save for Cloudinary
        setImagePreview(base64) // Show preview
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (!imagePreview) {
      alert("Please upload an image for the blog post.")
      return
    }

    console.log("Submitting blog with data:", imagePreview, formData );

    try {
      const blogPayload = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
        image: imagePreview.startsWith("data:") ? blog.image : imagePreview, 
        imagePublicId: blog.imagePublicId
      }

      // Updated to use saveBlogAction(data, base64, isEdit, id)
      await saveBlogAction(blogPayload, base64File, true, blog._id!.toString())
      
      router.push("/admin/blogs")
      router.refresh()
    } catch (error) {
      console.error("Failed to update blog:", error)
      alert("Error updating blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 border rounded-2xl shadow-sm">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Article Title</Label>
          <Input 
            id="title"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author Name</Label>
          <Input 
            id="author"
            value={formData.author} 
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            required 
          />
        </div>
      </div>

      {/* NEW: Cloudinary Image Upload UI */}
      <div className="space-y-4">
        <Label>Featured Image</Label>
        {imagePreview ? (
          <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border group">
            <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
            <button 
              type="button"
              onClick={() => {setImagePreview(null); setBase64File(null)}}
              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Click to upload new image</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
        <Textarea 
          id="excerpt"
          value={formData.excerpt} 
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          className="h-20"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Main Content</Label>
        <Textarea 
          id="content"
          value={formData.content} 
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          className="min-h-[300px] font-sans text-base"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Comma separated)</Label>
        <Input 
          id="tags"
          value={formData.tags} 
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="Style, Care, Men" 
        />
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
        <div className="space-y-0.5">
          <Label>Visibility Status</Label>
          <p className="text-xs text-muted-foreground">Is this article live on the website?</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{formData.isPublished ? "Published" : "Draft"}</span>
          <Switch 
            checked={formData.isPublished} 
            onCheckedChange={(val) => setFormData({...formData, isPublished: val})}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            "Update Article"
          )}
        </Button>
      </div>
    </form>
  )
}