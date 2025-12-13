import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getDb } from "@/lib/mongodb"

// Razorpay webhook for payment events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    // const expectedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    //   .update(body)
    //   .digest("hex")

    // if (signature !== expectedSignature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    // }

    const payload = JSON.parse(body)
    const event = payload.event

    const db = await getDb()
    const ordersCollection = db.collection("orders")

    switch (event) {
      case "payment.captured": {
        const { order_id, id: payment_id } = payload.payload.payment.entity

        // Update order payment status
        await ordersCollection.updateOne(
          { "paymentDetails.razorpayOrderId": order_id },
          {
            $set: {
              paymentStatus: "paid",
              "paymentDetails.razorpayPaymentId": payment_id,
              orderStatus: "confirmed",
              updatedAt: new Date(),
            },
          },
        )
        break
      }

      case "payment.failed": {
        const { order_id, error_description } = payload.payload.payment.entity

        await ordersCollection.updateOne(
          { "paymentDetails.razorpayOrderId": order_id },
          {
            $set: {
              paymentStatus: "failed",
              "paymentDetails.failureReason": error_description,
              updatedAt: new Date(),
            },
          },
        )
        break
      }

      case "refund.created": {
        const { payment_id, amount } = payload.payload.refund.entity

        await ordersCollection.updateOne(
          { "paymentDetails.razorpayPaymentId": payment_id },
          {
            $set: {
              paymentStatus: "refunded",
              "paymentDetails.refundAmount": amount / 100,
              updatedAt: new Date(),
            },
          },
        )
        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Razorpay webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
