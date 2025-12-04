"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { SignedIn, SignedOut } from "@clerk/nextjs"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Your bag is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
            </div>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="relative h-24 w-20 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                          className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                          className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">₹{item.product.price * item.quantity}</span>
                    {item.product.originalPrice > item.product.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{item.product.originalPrice * item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">Shipping and taxes calculated at checkout</p>

              <SignedIn>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild onClick={() => onOpenChange(false)} className="bg-transparent">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                  <Button asChild className="bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]">
                    <Link href="/checkout" onClick={() => onOpenChange(false)}>
                      Checkout
                    </Link>
                  </Button>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="bg-muted/50 rounded-lg p-4 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">Sign in to proceed with checkout</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="bg-transparent" onClick={() => onOpenChange(false)}>
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]"
                      onClick={() => onOpenChange(false)}
                    >
                      <Link href="/sign-up">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </SignedOut>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
