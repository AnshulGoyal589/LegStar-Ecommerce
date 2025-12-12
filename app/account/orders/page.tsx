import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOrdersByUserId } from "@/lib/db/orders"


const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-600" />
    default:
      return <Package className="h-5 w-5 text-yellow-600" />
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "delivered":
      return "Delivered"
    case "shipped":
      return "Shipped"
    case "processing":
      return "Processing"
    default:
      return "Pending"
  }
}

export default async function OrdersPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const orders = await getOrdersByUserId(user.id)

  return (
    <main className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.orderId}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <p className="font-semibold">{order.orderId}</p>
                      <p className="text-sm text-muted-foreground">Ordered on {order.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.orderStatus)}
                      <span className="font-medium">{getStatusLabel(order.orderStatus)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{item.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="font-semibold">Total: {order.total}</p>
                    {/* <div className="flex gap-2">
                      {order.status === "shipped" && (
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
