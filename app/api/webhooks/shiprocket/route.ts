import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

// Shiprocket webhook for order status updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook (in production, verify signature)
    const { order_id, current_status, awb_code, shipment_id, courier_name } = body

    if (!order_id) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
    }

    const db = await getDb()
    const ordersCollection = db.collection("orders")

    // Map Shiprocket status to our status
    let orderStatus: string
    switch (current_status?.toLowerCase()) {
      case "pickup scheduled":
      case "pickup generated":
        orderStatus = "processing"
        break
      case "picked up":
      case "in transit":
      case "out for delivery":
        orderStatus = "shipped"
        break
      case "delivered":
        orderStatus = "delivered"
        break
      case "cancelled":
      case "rto initiated":
      case "rto delivered":
        orderStatus = "cancelled"
        break
      default:
        orderStatus = "processing"
    }

    // Update order in database
    await ordersCollection.updateOne(
      { orderId: order_id },
      {
        $set: {
          orderStatus,
          trackingNumber: awb_code,
          shiprocketShipmentId: shipment_id?.toString(),
          trackingUrl: awb_code ? `https://shiprocket.co/tracking/${awb_code}` : undefined,
          courierName: courier_name,
          updatedAt: new Date(),
        },
      },
    )

    // TODO: Send email notification to customer about status change

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Shiprocket webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
