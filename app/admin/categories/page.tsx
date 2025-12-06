"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, MoreHorizontal, Edit, Trash2, ChevronRight, FolderOpen, Package, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
// import MultipleImageUpload from "@/components/MultipleImageUpload"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  // image?: string
  // imagePublicId?: string
  parentId?: string | null
  gender?: string
  order: number
  isActive: boolean
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  // const [uploading, setUploading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  // Form state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [parentId, setParentId] = useState<string>("none")
  const [gender, setGender] = useState<string>("men")
  // const [image, setImage] = useState<{ url: string; publicId?: string } | null>(null)

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
        setExpandedCategories(data.filter((c: Category) => !c.parentId).map((c: Category) => c._id))
      }
    } catch (error) {
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setName("")
    setSlug("")
    setDescription("")
    setParentId("none")
    setGender("men")
    // setImage(null)
    setEditingCategory(null)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description || "")
    setParentId(category.parentId || "none")
    setGender(category.gender || "men")
    // setImage(category.image ? { url: category.image, publicId: category.imagePublicId } : null)
    setDialogOpen(true)
  }

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return

  //   setUploading(true)
  //   try {
  //     const formData = new FormData()
  //     formData.append("files", file)
  //     formData.append("folder", "legstar/categories")

  //     const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
  //     if (res.ok) {
  //       const data = await res.json()
  //       setImage(data.images[0])
  //       toast.success("Image uploaded")
  //     }
  //   } catch (error) {
  //     toast.error("Failed to upload image")
  //   } finally {
  //     setUploading(false)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description,
        parentId: parentId === "none" ? null : parentId,
        gender,
        // image: image?.url,
        // imagePublicId: image?.publicId,
      }

      const url = editingCategory ? `/api/admin/categories/${editingCategory._id}` : "/api/admin/categories"
      const method = editingCategory ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingCategory ? "Category updated" : "Category created")
        setDialogOpen(false)
        resetForm()
        fetchCategories()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save category")
      }
    } catch (error) {
      toast.error("Failed to save category")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Category deleted")
        fetchCategories()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete category")
      }
    } catch (error) {
      toast.error("Failed to delete category")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const parentCategories = categories.filter((c) => !c.parentId)
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId)

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
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your product catalog with categories</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Tree */}
      <div className="bg-background border rounded-lg divide-y">
        {parentCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories yet</p>
            <Button
              className="mt-4"
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
            >
              Add Your First Category
            </Button>
          </div>
        ) : (
          parentCategories.map((category) => {
            const children = getChildren(category._id)
            return (
              <div key={category._id}>
                <div className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(category._id)}
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${expandedCategories.includes(category._id) ? "rotate-90" : ""}`}
                      />
                    </button>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                      {/* {category.image ? (
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : ( */}
                        <FolderOpen className="h-5 w-5 text-primary" />
                      {/* )} */}
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description || `/${category.slug}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{children.length} subcategories</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(category)}>
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600" onClick={() => setDeleteId(category._id)}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedCategories.includes(category._id) && children.length > 0 && (
                  <div className="bg-muted/20">
                    {children.map((child) => (
                      <div
                        key={child._id}
                        className="flex items-center justify-between p-4 pl-16 border-t hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                              {/* {child.image ? (
                                <img
                                  src={child.image || "/placeholder.svg"}
                                  alt={child.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : ( */}
                              <Package className="h-4 w-4 text-muted-foreground" />
                             {/* )} */}
                          </div>
                          <div>
                            <h4 className="font-medium">{child.name}</h4>
                            <p className="text-sm text-muted-foreground">/{child.slug}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(child)}>
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600" onClick={() => setDeleteId(child._id)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
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
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {parentCategories
                      .filter((c) => c._id !== editingCategory?._id)
                      .map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {/* <div className="space-y-2">
              <Label>Category Image</Label>
              <MultipleImageUpload 
                    label="Banner Image (1 Required)" 
                    value={image ? [image] : []}
                    onChange={(images) => setImage(images[0] || null)}
                    maxImages={1}
                  />
            </div> */}
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
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will also affect any subcategories. Products in this category will need to be
              reassigned.
            </AlertDialogDescription>
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
