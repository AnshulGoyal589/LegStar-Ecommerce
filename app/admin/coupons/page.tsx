"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, MoreHorizontal, Edit, Trash2, Copy, Percent, IndianRupee, Loader2, Eye, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { toast } from "sonner"

interface Coupon {
  _id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrder: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  successfulUses: number // Added successful uses tracking
  totalDiscountGiven: number // Added total discount given
  perUserLimit: number
  startDate: string
  endDate: string
  isActive: boolean
}

interface CouponUsageDetail {
  orderId: string
  userId: string
  discountAmount: number
  usedAt: string
}

const getStatusColor = (coupon: Coupon) => {
  const now = new Date()
  const start = new Date(coupon.startDate)
  const end = new Date(coupon.endDate)

  if (!coupon.isActive) return "bg-gray-100 text-gray-700"
  if (now < start) return "bg-blue-100 text-blue-700"
  if (now > end) return "bg-red-100 text-red-700"
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return "bg-yellow-100 text-yellow-700"
  return "bg-green-100 text-green-700"
}

const getStatusLabel = (coupon: Coupon) => {
  const now = new Date()
  const start = new Date(coupon.startDate)
  const end = new Date(coupon.endDate)

  if (!coupon.isActive) return "Inactive"
  if (now < start) return "Scheduled"
  if (now > end) return "Expired"
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return "Exhausted"
  return "Active"
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)

  const [usageDialogOpen, setUsageDialogOpen] = useState(false)
  const [selectedCouponUsage, setSelectedCouponUsage] = useState<{ coupon: Coupon; usage: CouponUsageDetail[] } | null>(
    null,
  )
  const [loadingUsage, setLoadingUsage] = useState(false)

  // Form state
  const [code, setCode] = useState("")
  const [type, setType] = useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = useState("")
  const [minOrder, setMinOrder] = useState("")
  const [maxDiscount, setMaxDiscount] = useState("")
  const [usageLimit, setUsageLimit] = useState("")
  const [perUserLimit, setPerUserLimit] = useState(1)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons")
      if (res.ok) {
        const data = await res.json()
        setCoupons(data)
      }
    } catch (error) {
      toast.error("Failed to fetch coupons")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const resetForm = () => {
    setCode("")
    setType("percentage")
    setValue("")
    setMinOrder("")
    setMaxDiscount("")
    setUsageLimit("")
    setPerUserLimit(1)
    setStartDate("")
    setEndDate("")
    setEditingCoupon(null)
  }

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setCode(coupon.code)
    setType(coupon.type)
    setValue(coupon.value.toString())
    setMinOrder(coupon.minOrder.toString())
    setMaxDiscount(coupon.maxDiscount?.toString() || "")
    setUsageLimit(coupon.usageLimit?.toString() || "")
    setPerUserLimit(coupon.perUserLimit || 1)
    setStartDate(coupon.startDate.split("T")[0])
    setEndDate(coupon.endDate.split("T")[0])
    setDialogOpen(true)
  }

  const viewUsageDetails = async (coupon: Coupon) => {
    setLoadingUsage(true)
    setUsageDialogOpen(true)
    try {
      const res = await fetch(`/api/admin/coupons/${coupon._id}/usage`)
      if (res.ok) {
        const usage = await res.json()
        setSelectedCouponUsage({ coupon, usage })
      }
    } catch (error) {
      toast.error("Failed to fetch usage details")
    } finally {
      setLoadingUsage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        code: code.toUpperCase(),
        type,
        value: Number.parseFloat(value),
        minOrder: Number.parseFloat(minOrder) || 0,
        maxDiscount: maxDiscount ? Number.parseFloat(maxDiscount) : undefined,
        usageLimit: usageLimit ? Number.parseInt(usageLimit) : undefined,
        perUserLimit,
        startDate,
        endDate,
      }

      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon._id}` : "/api/admin/coupons"
      const method = editingCoupon ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingCoupon ? "Coupon updated" : "Coupon created")
        setDialogOpen(false)
        resetForm()
        fetchCoupons()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save coupon")
      }
    } catch (error) {
      toast.error("Failed to save coupon")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/coupons/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Coupon deleted")
        fetchCoupons()
      } else {
        toast.error("Failed to delete coupon")
      }
    } catch (error) {
      toast.error("Failed to delete coupon")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard")
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
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm()
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-background border rounded-lg">
          <p className="text-muted-foreground">No coupons yet</p>
          <Button
            className="mt-4"
            onClick={() => {
              resetForm()
              setDialogOpen(true)
            }}
          >
            Create Your First Coupon
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${coupon.type === "percentage" ? "bg-blue-100" : "bg-green-100"}`}
                  >
                    {coupon.type === "percentage" ? (
                      <Percent className="h-5 w-5 text-blue-600" />
                    ) : (
                      <IndianRupee className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{coupon.code}</h3>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(coupon)}`}>
                      {getStatusLabel(coupon)}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2" onClick={() => viewUsageDetails(coupon)}>
                      <Eye className="h-4 w-4" /> View Usage
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(coupon)}>
                      <Edit className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-red-600" onClick={() => setDeleteId(coupon._id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                    {coupon.maxDiscount && ` (max ₹${coupon.maxDiscount})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Order:</span>
                  <span>₹{coupon.minOrder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage:</span>
                  <span>
                    {coupon.usedCount} / {coupon.usageLimit || "∞"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Successful Uses:
                  </span>
                  <span className="font-medium text-green-600">{coupon.successfulUses || 0}</span>
                </div>
                {(coupon.totalDiscountGiven || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Discount Given:</span>
                    <span className="font-medium">₹{coupon.totalDiscountGiven || 0}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid:</span>
                  <span className="text-xs">
                    {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {coupon.usageLimit && (
                <div className="mt-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}% used
                  </p>
                </div>
              )}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
            </div>

            <div className="space-y-2">
              <Label>Discount Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("percentage")}
                  className={`p-3 border rounded-lg flex items-center gap-2 ${type === "percentage" ? "border-primary bg-primary/5" : ""}`}
                >
                  <Percent className="h-4 w-4" /> Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setType("fixed")}
                  className={`p-3 border rounded-lg flex items-center gap-2 ${type === "fixed" ? "border-primary bg-primary/5" : ""}`}
                >
                  <IndianRupee className="h-4 w-4" /> Fixed Amount
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{type === "percentage" ? "Discount (%)" : "Discount (₹)"} *</Label>
                <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Min Order (₹)</Label>
                <Input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
              </div>
            </div>

            {type === "percentage" && (
              <div className="space-y-2">
                <Label>Max Discount (₹)</Label>
                <Input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="No limit"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Usage Limit</Label>
              <Input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Unlimited"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Limit to one use per customer</Label>
              <Switch checked={perUserLimit === 1} onCheckedChange={(checked) => setPerUserLimit(checked ? 1 : 0)} />
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
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCoupon ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={usageDialogOpen} onOpenChange={setUsageDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Coupon Usage Details - {selectedCouponUsage?.coupon.code}</DialogTitle>
          </DialogHeader>
          {loadingUsage ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedCouponUsage ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedCouponUsage.coupon.successfulUses || 0}</p>
                  <p className="text-sm text-muted-foreground">Successful Uses</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">₹{selectedCouponUsage.coupon.totalDiscountGiven || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Discount Given</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{selectedCouponUsage.coupon.usedCount}</p>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                </div>
              </div>

              {/* Usage List */}
              <div>
                <h4 className="font-medium mb-3">Usage History</h4>
                {selectedCouponUsage.usage.length > 0 ? (
                  <div className="border rounded-lg divide-y">
                    {selectedCouponUsage.usage.map((use, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Order #{use.orderId.slice(-8)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(use.usedAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">-₹{use.discountAmount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No usage recorded yet</p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this coupon?</AlertDialogDescription>
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
