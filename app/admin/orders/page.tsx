"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Eye, Truck, XCircle, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const orders = [
  {
    id: "ORD-2024-001",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    items: 3,
    total: "₹2,597",
    status: "Delivered",
    payment: "Paid",
    date: "2024-01-15",
    address: "123 Main Street, Sector 15, Noida, UP 201301",
  },
  {
    id: "ORD-2024-002",
    customer: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 98765 43211",
    items: 2,
    total: "₹1,498",
    status: "Shipped",
    payment: "Paid",
    date: "2024-01-15",
    address: "456 Park Avenue, Andheri West, Mumbai, MH 400053",
  },
  {
    id: "ORD-2024-003",
    customer: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 98765 43212",
    items: 1,
    total: "₹899",
    status: "Processing",
    payment: "Paid",
    date: "2024-01-14",
    address: "789 Lake View, Koramangala, Bangalore, KA 560034",
  },
  {
    id: "ORD-2024-004",
    customer: "Sneha Gupta",
    email: "sneha@example.com",
    phone: "+91 98765 43213",
    items: 4,
    total: "₹3,996",
    status: "Pending",
    payment: "COD",
    date: "2024-01-14",
    address: "321 Green Park, Hauz Khas, New Delhi, DL 110016",
  },
  {
    id: "ORD-2024-005",
    customer: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98765 43214",
    items: 2,
    total: "₹1,598",
    status: "Cancelled",
    payment: "Refunded",
    date: "2024-01-13",
    address: "654 Ring Road, Civil Lines, Jaipur, RJ 302006",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700"
    case "Shipped":
      return "bg-blue-100 text-blue-700"
    case "Processing":
      return "bg-yellow-100 text-yellow-700"
    case "Pending":
      return "bg-orange-100 text-orange-700"
    case "Cancelled":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getPaymentColor = (payment: string) => {
  switch (payment) {
    case "Paid":
      return "bg-green-100 text-green-700"
    case "COD":
      return "bg-blue-100 text-blue-700"
    case "Refunded":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-36">
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
        <Select defaultValue="all">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cod">COD</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Order ID</th>
                <th className="p-4 text-left text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-sm font-medium">Items</th>
                <th className="p-4 text-left text-sm font-medium">Total</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Payment</th>
                <th className="p-4 text-left text-sm font-medium">Date</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="p-4 font-medium">{order.id}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{order.items} items</td>
                  <td className="p-4 font-medium">{order.total}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentColor(order.payment)}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{order.date}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedOrder(order)} className="gap-2">
                          <Eye className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Truck className="h-4 w-4" /> Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <XCircle className="h-4 w-4" /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">Showing 1-5 of 128 orders</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="ghost" size="sm">
              2
            </Button>
            <Button variant="ghost" size="sm">
              3
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p>{selectedOrder.customer}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Payment:</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getPaymentColor(selectedOrder.payment)}`}>
                    {selectedOrder.payment}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="ml-2 font-bold">{selectedOrder.total}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Truck className="h-4 w-4" /> Update Status
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
