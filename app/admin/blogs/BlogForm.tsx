"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveBlogAction } from "@/lib/actions/blog-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BlogFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
  const [base64File, setBase64File] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    tags: initialData?.tags?.join(", ") || "",
    isPublished: initialData?.isPublished ?? true,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setBase64File(base64)
        setImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const blogPayload = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        tags: formData.tags.split(",").map((t:any) => t.trim()).filter((t:any) => t !== ""),
      }

      await saveBlogAction(blogPayload, base64File, isEdit, initialData?._id)
      router.push("/admin/blogs")
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/admin/blogs" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Link>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{formData.isPublished ? "Public" : "Draft"}</span>
            <Switch 
                checked={formData.isPublished} 
                onCheckedChange={(val) => setFormData({...formData, isPublished: val})}
            />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label>Blog Title</Label>
            <Input 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Enter a catchy title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea 
              value={formData.excerpt}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
              placeholder="Short summary for the listing page..."
              className="h-24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Main Content</Label>
            <Textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="Write your blog post here..."
              className="min-h-[400px] leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Right Column: Meta Data */}
        <div className="space-y-6">
          <div className="p-4 border rounded-xl bg-card space-y-4">
            <Label>Featured Image</Label>
            {imagePreview ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border group">
                <img src={imagePreview} className="object-cover w-full h-full" alt="Preview" />
                <button 
                  type="button"
                  onClick={() => {setImagePreview(null); setBase64File(null)}}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Upload 16:9 Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <Label>Author</Label>
            <Input 
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
              placeholder="e.g. LegStar Team"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (Comma separated)</Label>
            <Input 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="Guide, Cotton, Men"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (isEdit ? "Update Article" : "Publish Article")}
          </Button>
        </div>
      </div>
    </form>
  )
}