import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createRazorpayOrder } from "@/lib/razorpay"
import { createOrder, generateOrderId } from "@/lib/db/orders"
import { validateCoupon, incrementCouponUsage } from "@/lib/db/coupons"
import { ObjectId } from "mongodb"
import { createShiprocketOrder, ShiprocketOrderPayload } from "@/lib/shiprocket"

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

    let discount = 0
    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, amount, userId)
      if (couponResult.valid) {
        discount = couponResult.discount || 0
      }
    }

    // const subtotal = (items as IncomingCartItem[]).reduce((acc, item) => {
    //   const itemPrice = Number(item?.product?.price) || 0
    //   const itemQuantity = Number(item?.quantity) || 0
    //   return acc + itemPrice * itemQuantity
    // }, 0)

    // const shippingCost = amount >= 999 ? 0 : 99
          // const tax = Math.round((subtotal - discount) * 0.05)
    // const total = amount + shippingCost;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount. Total must be greater than zero." },
        { status: 400 },
      )
    }

    

    const orderId = await generateOrderId()

    const razorpayOrder = await createRazorpayOrder(amount, orderId)

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
      subtotal: parseInt(amount),
      discount,
      couponCode: couponCode || undefined,
      shippingCost:0,
      // tax,
      total: parseInt(amount),
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

    // if (paymentMethod === "cod") {
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
              order_items: (items as IncomingCartItem[]).map((item) => ({
                name: item.product.name,  // Use nested product.name
                sku: item.product.sku || `SKU-${item.product._id}`,
                units: item.quantity,
                selling_price: item.product.price,  // Use nested product.price (number)
              })),
              payment_method: "COD",
              sub_total: parseInt(amount),
              length: 20,
              breadth: 15,
              height: 10,
              weight: 0.5,
            }
    
            const data  = await createShiprocketOrder(shiprocketPayload);
            // console.log("Shiprocket order created:", data)
          } catch (shiprocketError) {
            console.error("Shiprocket error:", shiprocketError)
          }
        // }

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}