import Link from "next/link"
import { CheckCircle2, Package, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOrderByOrderId } from "@/lib/db/orders"

interface Props {
  params: Promise<{ orderId: string }>
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params
  const order = await getOrderByOrderId(orderId)
  // In production, fetch order details from database
  // const order = {
  //   id: orderId,
  //   status: "confirmed",
  //   total: "₹2,597",
  //   estimatedDelivery: "3-5 business days",
  // }

  return (
    <main className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your order and will begin processing it soon.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-bold text-lg">{order?.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg">INR {order?.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-muted-foreground">We're preparing your order for shipment</p>
                </div>
              </div>
              {/* <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Shipping</p>
                  <p className="text-sm text-muted-foreground">Estimated delivery: {order.estimatedDelivery}</p>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address with order details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <Button variant="outline" className="gap-2 bg-transparent">
                View Order Details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button className="gap-2">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
