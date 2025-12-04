import Razorpay from "razorpay"
import crypto from "crypto"

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("Razorpay credentials not found. Payment features will not work.")
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function createRazorpayOrder(amount: number, orderId: string) {
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: orderId,
    notes: {
      orderId: orderId,
    },
  }

  const order = await razorpay.orders.create(options)
  return order
}

export function verifyRazorpaySignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
): boolean {
  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(body.toString())
    .digest("hex")

  return expectedSignature === razorpay_signature
}

export async function refundPayment(paymentId: string, amount?: number) {
  const refund = await razorpay.payments.refund(paymentId, {
    amount: amount ? amount * 100 : undefined,
  })
  return refund
}
