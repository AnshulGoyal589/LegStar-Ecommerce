"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@clerk/nextjs"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useUser()
  const { items, subtotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const shippingCost = subtotal >= 999 ? 0 : 99

  
  // const tax = Math.round((subtotal - discount) * 0.05)
  const total = subtotal - discount + shippingCost + (paymentMethod==='cod' ? 10 : 0)

  const applyCoupon = async () => {
    
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, orderTotal: subtotal + shippingCost + (paymentMethod==='cod' ? 10 : 0)  }),
    })
    const data = await response.json()

    if (data.valid) {
      setDiscount(data.discount || 0)
    } else {
      setDiscount(0)
      // Optionally, show an error message to the user
    }
  }

  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      if (paymentMethod === "razorpay") {
        // Create order and initiate Razorpay payment

        // console.log("Initiating Razorpay payment for amount:", total);
        const response = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            items,
            shippingAddress,
            couponCode: couponCode || undefined,
          }),
        })

        const data = await response.json()

        if (data.orderId) {
          // Initialize Razorpay
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: total * 100,
            currency: "INR",
            name: "LegStar",
            description: "Purchase from LegStar",
            order_id: data.razorpayOrderId,
            handler: async (response: {
              razorpay_payment_id: string
              razorpay_order_id: string
              razorpay_signature: string
            }) => {
              // Verify payment
              const verifyResponse = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: data.orderId,
                }),
              })

              if (verifyResponse.ok) {
                clearCart()
                router.push(`/order-confirmation/${data.orderId}`)
              }
            },
            prefill: {
              name: shippingAddress.name,
              email: shippingAddress.email,
              contact: shippingAddress.phone,
            },
            theme: {
              color: "#e6d8b2",
            },
          }

          // @ts-ignore - Razorpay is loaded from script
          const razorpay = new window.Razorpay(options)
          razorpay.open()
        }
      } else {
        // COD Order
        const response = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            items,
            shippingAddress,
            couponCode: couponCode || undefined,
          }),
        })

        const data = await response.json()

        if (data.orderId) {
          clearCart()
          router.push(`/order-confirmation/${data.orderId}`)
        }
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to checkout</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30 py-8">
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-background border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Address
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input
                    id="pincode"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    placeholder="House No, Building, Street, Area"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-background border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <div className="flex-1">
                    <p className="font-medium">Pay Online</p>
                    <p className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                  </div>
                  <img src="/placeholder.svg?height=24&width=100" alt="Razorpay" className="h-6" />
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="flex-1">
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-auto mb-4">
                {items.map((item: any, index) => (
                  <div key={`${item.name}-${item.size}-${item.color}-${index}`} className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} / {item.color} × {item.quantity}
                      </p>
                      <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Coupon */}
              <div className="mb-4">
                <Label className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  Apply Coupon
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="uppercase"
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
                {discount > 0 && <p className="text-sm text-green-600 mt-2">Coupon applied! You save ₹{discount}</p>}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                </div>
                {
                  paymentMethod=='razorpay' ? null : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">COD charges</span>
                  <span>₹10</span>
                </div>
                  )
                }
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? "Processing..." : paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Secure checkout powered by Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
