import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createOrder, generateOrderId } from "@/lib/db/orders"
import { validateCoupon, incrementCouponUsage } from "@/lib/db/coupons"
import { createShiprocketOrder, type ShiprocketOrderPayload } from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, paymentMethod, couponCode } = body

    // Calculate totals
    const subtotal = items.reduce(
      (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
      0,
    )

    // Validate coupon if provided
    let discount = 0
    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, subtotal, userId)
      if (couponResult.valid) {
        discount = couponResult.discount || 0
      }
    }

    const shippingCost = subtotal >= 999 ? 0 : 99
    const tax = Math.round((subtotal - discount) * 0.05)
    const total = subtotal - discount + shippingCost + tax

    // Generate order ID
    const orderId = await generateOrderId()

    // Create order in database
    const orderData = {
      orderId,
      userId,
      customerName: shippingAddress.name,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone,
      items: items.map(
        (item: {
          id: string
          name: string
          sku: string
          price: number
          quantity: number
          size: string
          color: string
          image: string
        }) => ({
          productId: item.id,
          name: item.name,
          sku: item.sku || "SKU-" + item.id,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        }),
      ),
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
      paymentMethod: paymentMethod as "razorpay" | "cod",
      paymentStatus: paymentMethod === "cod" ? ("pending" as const) : ("pending" as const),
      orderStatus: "confirmed" as const,
    }

    await createOrder(orderData)

    // Increment coupon usage if used
    if (couponCode && discount > 0) {
      await incrementCouponUsage(couponCode)
    }

    // Create Shiprocket order for COD
    if (paymentMethod === "cod") {
      try {
        const shiprocketPayload: ShiprocketOrderPayload = {
          order_id: orderId,
          order_date: new Date().toISOString().split("T")[0],
          pickup_location: "Primary",
          billing_customer_name: shippingAddress.name.split(" ")[0],
          billing_last_name: shippingAddress.name.split(" ").slice(1).join(" ") || "",
          billing_address: shippingAddress.address,
          billing_city: shippingAddress.city,
          billing_pincode: shippingAddress.pincode,
          billing_state: shippingAddress.state,
          billing_country: "India",
          billing_email: shippingAddress.email,
          billing_phone: shippingAddress.phone,
          shipping_is_billing: true,
          order_items: items.map((item: { name: string; sku: string; quantity: number; price: number }) => ({
            name: item.name,
            sku: item.sku || "SKU",
            units: item.quantity,
            selling_price: item.price,
          })),
          payment_method: "COD",
          sub_total: total,
          length: 20,
          breadth: 15,
          height: 10,
          weight: 0.5,
        }

        await createShiprocketOrder(shiprocketPayload)
      } catch (shiprocketError) {
        console.error("Shiprocket error:", shiprocketError)
      }
    }

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
