import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createRazorpayOrder } from "@/lib/razorpay"
import { createOrder, generateOrderId } from "@/lib/db/orders"
import { validateCoupon, incrementCouponUsage } from "@/lib/db/coupons"
import { ObjectId } from "mongodb"

// Define a more accurate type for the items coming from the client cart
export type IncomingCartItem = {
  product: {
    _id: string | ObjectId
    name: string
    sku?: string
    price: number
    images: string[]
  }
  quantity: number
  size: string
  color: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, items, shippingAddress, couponCode } = body

    // Validate coupon if provided
    let discount = 0
    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, amount, userId)
      if (couponResult.valid) {
        discount = couponResult.discount || 0
      }
    }

    // Calculate totals using the correct nested data structure
    const subtotal = (items as IncomingCartItem[]).reduce((acc, item) => {
      const itemPrice = Number(item?.product?.price) || 0
      const itemQuantity = Number(item?.quantity) || 0
      return acc + itemPrice * itemQuantity
    }, 0)

    const shippingCost = subtotal >= 999 ? 0 : 99
    const tax = Math.round((subtotal - discount) * 0.18)
    const total = subtotal - discount + shippingCost + tax

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount. Total must be greater than zero." },
        { status: 400 },
      )
    }

    // Generate order ID
    const orderId = await generateOrderId()

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(total, orderId)

    // --- THIS IS THE CORRECTED SECTION ---
    // Save the order to the database with a correctly flattened item structure
    await createOrder({
      orderId,
      userId,
      customerName: shippingAddress.name,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone,
      items: (items as IncomingCartItem[]).map((item) => ({
        // Correctly map from the nested `item.product` object
        productId: item.product._id,
        name: item.product.name,
        sku: item.product.sku || `SKU-${item.product._id}`, // Use product SKU or create a fallback
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.product.images?.[0] || "", // Safely get the first image
      })),
      subtotal,
      discount,
      couponCode: couponCode || undefined,
      shippingCost,
      tax,
      total,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: "India",
      },
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderStatus: "pending",
    })
    // --- END OF CORRECTION ---

    // Increment coupon usage if used
    if (couponCode && discount > 0) {
      await incrementCouponUsage(couponCode)
    }

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}