"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, MoreHorizontal, Edit, Trash2, Loader2, FileText, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import type { Blog } from "@/lib/types"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [author, setAuthor] = useState("LegStar Team")
  const [tags, setTags] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs")
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
      }
    } catch (error) {
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const resetForm = () => {
    setTitle("")
    setSlug("")
    setExcerpt("")
    setContent("")
    setImage("")
    setAuthor("LegStar Team")
    setTags("")
    setIsPublished(false)
    setEditingBlog(null)
  }

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog)
    setTitle(blog.title)
    setSlug(blog.slug)
    setExcerpt(blog.excerpt)
    setContent(blog.content)
    setImage(blog.image)
    setAuthor(blog.author)
    setTags(blog.tags.join(", "))
    setIsPublished(blog.isPublished)
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
        setImage(data.url)
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
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        excerpt,
        content,
        image,
        author,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublished,
      }

      const url = editingBlog ? `/api/admin/blogs/${editingBlog._id}` : "/api/admin/blogs"
      const method = editingBlog ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingBlog ? "Blog updated" : "Blog created")
        setDialogOpen(false)
        resetForm()
        fetchBlogs()
      } else {
        toast.error("Failed to save blog")
      }
    } catch (error) {
      toast.error("Failed to save blog")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/blogs/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Blog deleted")
        fetchBlogs()
      } else {
        toast.error("Failed to delete blog")
      }
    } catch (error) {
      toast.error("Failed to delete blog")
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
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-muted-foreground">Manage blog posts and articles</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-background border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No blog posts yet</p>
          <Button
            className="mt-4"
            onClick={() => {
              resetForm()
              setDialogOpen(true)
            }}
          >
            Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-background border rounded-lg overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {blog.image ? (
                  <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge className={`absolute top-2 left-2 ${blog.isPublished ? "bg-green-600" : "bg-gray-600"}`}>
                  {blog.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(blog)}>
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600" onClick={() => setDeleteId(blog._id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{blog.excerpt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{new Date(blog.createdAt).toLocaleDateString()}</p>
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
            <DialogTitle>{editingBlog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Excerpt *</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Guide, Tips, Men" />
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex items-center gap-4">
                {image && (
                  <div className="relative h-20 w-32 rounded border overflow-hidden">
                    <Image src={image || "/placeholder.svg"} alt="" fill className="object-cover" />
                  </div>
                )}
                <label className="h-20 px-4 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-muted">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="text-sm">Upload Image</span>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <Label>Published</Label>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
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
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingBlog ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this blog post?</AlertDialogDescription>
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
