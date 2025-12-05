"use client"

import { useState, useCallback } from "react"
import { Search, MoreHorizontal, Eye, Truck, XCircle, ChevronLeft, ChevronRight, Download, MapPin, CreditCard, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Order } from "@/lib/db/orders" // Import types only
import { fetchOrdersAction } from "./actions" // Import the Server Action

// --- Helpers ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered": return "bg-green-100 text-green-700 hover:bg-green-100"
    case "shipped": return "bg-blue-100 text-blue-700 hover:bg-blue-100"
    case "processing": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    case "confirmed": return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
    case "pending": return "bg-orange-100 text-orange-700 hover:bg-orange-100"
    case "cancelled": return "bg-red-100 text-red-700 hover:bg-red-100"
    default: return "bg-gray-100 text-gray-700 hover:bg-gray-100"
  }
}

const getPaymentColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid": return "bg-green-100 text-green-700 hover:bg-green-100"
    case "pending": return "bg-orange-100 text-orange-700 hover:bg-orange-100"
    case "failed": return "bg-red-100 text-red-700 hover:bg-red-100"
    case "refunded": return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    default: return "bg-gray-100 text-gray-700 hover:bg-gray-100"
  }
}

interface OrdersClientProps {
  initialOrders: Order[]
  initialTotal: number
}

export default function OrdersClient({ initialOrders, initialTotal }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [totalOrders, setTotalOrders] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const limit = 10 

  // Function to fetch data when user interacts (Client-Side)
  const updateOrders = useCallback(async (newPage: number, newStatus: string) => {
    setLoading(true)
    try {
      const skip = (newPage - 1) * limit
      const filterOptions: any = { limit, skip }
      
      if (newStatus !== "all") {
        filterOptions.status = newStatus
      }

      // Call the Server Action
      const { orders: fetchedOrders, total } = await fetchOrdersAction(filterOptions)
      
      setOrders(fetchedOrders)
      setTotalOrders(total)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateOrders(newPage, statusFilter)
  }

  const handleFilterChange = (val: string) => {
    setStatusFilter(val)
    setPage(1) // Reset to page 1
    updateOrders(1, val)
  }

  const totalPages = Math.ceil(totalOrders / limit)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by Order ID or Customer..." className="pl-9" />
        </div>
        
        <Select value={statusFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-background border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Order ID</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Customer</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Total</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Payment</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    <div className="flex justify-center items-center">Loading orders...</div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{order.orderId}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customerName}</span>
                        <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4 font-medium">
                      {formatCurrency(order.total)}
                      <span className="text-xs text-muted-foreground block">
                        {order.items.length} items
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className={getPaymentColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1 uppercase">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)} className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Truck className="h-4 w-4" /> Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600 cursor-pointer">
                            <XCircle className="h-4 w-4" /> Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing {orders.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalOrders)} of {totalOrders} orders
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              disabled={page <= 1 || loading}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Page {page} of {totalPages || 1}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              disabled={page >= totalPages || loading}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Detail Dialog - Kept same as previous */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order {selectedOrder?.orderId}
              <Badge variant="secondary" className={getStatusColor(selectedOrder?.orderStatus || "")}>
                {selectedOrder?.orderStatus}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <div className="p-2 bg-primary/10 rounded-full"><MapPin className="h-4 w-4" /></div>
                    Shipping Address
                  </div>
                  <div className="pl-10 text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium text-foreground">{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                    <p className="mt-2 text-foreground">{selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <div className="p-2 bg-primary/10 rounded-full"><CreditCard className="h-4 w-4" /></div>
                    Payment Details
                  </div>
                  <div className="pl-10 text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span>
                      
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className={getPaymentColor(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </Badge>

                      <span className="text-muted-foreground">Date:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                      
                      {selectedOrder.paymentId && (
                        <>
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <span className="font-mono text-xs">{selectedOrder.paymentId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <div className="p-2 bg-primary/10 rounded-full"><Package className="h-4 w-4" /></div>
                  Order Items
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  SKU: {item.sku} | Size: {item.size}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{selectedOrder.shippingCost === 0 ? "Free" : formatCurrency(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gap-2">
                  <Truck className="h-4 w-4" /> Update Shipment
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" /> Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}