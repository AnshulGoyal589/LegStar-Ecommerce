"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react"
// import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { toast } from "sonner"
// import { getCategories } from "@/lib/db/categories"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal - discount + shipping

  const applyCoupon = () => {
    const response = fetch("/api/coupons/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: couponCode, amount: subtotal }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setDiscount(data.discount)
          toast.success(`Coupon applied! You saved ₹${data.discount}.`)
        } else {
          setDiscount(0)
          toast.error(data.error || "Invalid coupon code.")
        }
      })
      .catch(() => {
        toast.error("Something went wrong while applying the coupon.")
      })
  }


  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Button asChild size="lg" className="bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Shopping Cart</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8">Shopping Cart ({items.length} items)</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                >
                  <div className="relative h-32 w-24 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/products/${item.product._id}`}>
                          <h3 className="font-medium hover:underline">{item.product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                          className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                          className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">₹{item.product.price * item.quantity}</span>
                        {item.product.originalPrice > item.product.price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₹{item.product.originalPrice * item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Apply Coupon</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {/* <p className="text-xs text-muted-foreground mt-1">Try &quot;SAVE10&quot; for 10% off</p> */}
                </div>

                <div className="space-y-3 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  {/* {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">Add ₹{999 - subtotal} more for free shipping</p>
                  )} */}
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full mt-6 bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3] gap-2">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">Secure checkout powered by Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
