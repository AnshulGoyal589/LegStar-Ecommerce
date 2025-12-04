import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { verifyRazorpaySignature } from "@/lib/razorpay"
import { getOrderByOrderId, updatePaymentStatus, updateOrderStatus } from "@/lib/db/orders"
import { createShiprocketOrder, type ShiprocketOrderPayload } from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = body

    // Verify payment signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Get order from database
    const order = await getOrderByOrderId(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update payment status
    await updatePaymentStatus(order._id!.toString(), "paid", razorpay_payment_id)
    await updateOrderStatus(order._id!.toString(), "confirmed")

    // Create Shiprocket order
    try {
      const shiprocketPayload: ShiprocketOrderPayload = {
        order_id: order.orderId,
        order_date: new Date().toISOString().split("T")[0],
        pickup_location: "Primary",
        billing_customer_name: order.shippingAddress.name.split(" ")[0],
        billing_last_name: order.shippingAddress.name.split(" ").slice(1).join(" ") || "",
        billing_address: order.shippingAddress.address,
        billing_city: order.shippingAddress.city,
        billing_pincode: order.shippingAddress.pincode,
        billing_state: order.shippingAddress.state,
        billing_country: "India",
        billing_email: order.customerEmail,
        billing_phone: order.customerPhone,
        shipping_is_billing: true,
        order_items: order.items.map((item) => ({
          name: item.name,
          sku: item.sku,
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: "Prepaid",
        sub_total: order.total,
        length: 20,
        breadth: 15,
        height: 10,
        weight: 0.5,
      }

      const shiprocketOrder = await createShiprocketOrder(shiprocketPayload)

      if (shiprocketOrder.order_id) {
        // Update order with Shiprocket details - you would call updateShiprocketDetails here
        console.log("Shiprocket order created:", shiprocketOrder.order_id)
      }
    } catch (shiprocketError) {
      console.error("Shiprocket error:", shiprocketError)
      // Don't fail the payment verification if Shiprocket fails
    }

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
