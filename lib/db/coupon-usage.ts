import clientPromise from "../mongodb"
import type { CouponUsage } from "../types"
import { ObjectId } from "mongodb"

export async function getCouponUsage(couponId: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection<CouponUsage>("coupon_usage").find({ couponId }).sort({ usedAt: -1 }).toArray()
}

export async function getCouponUsageStats() {
  const client = await clientPromise
  const db = client.db("legstar")

  return db
    .collection("coupon_usage")
    .aggregate([
      {
        $group: {
          _id: "$couponId",
          totalUses: { $sum: 1 },
          totalDiscount: { $sum: "$discountAmount" },
          lastUsed: { $max: "$usedAt" },
        },
      },
    ])
    .toArray()
}

export async function recordCouponUsage(usage: Omit<CouponUsage, "_id" | "usedAt">) {
  const client = await clientPromise
  const db = client.db("legstar")

  // Record usage
  await db.collection("coupon_usage").insertOne({
    ...usage,
    usedAt: new Date(),
  })

  // Increment usedCount on coupon
  await db.collection("coupons").updateOne({ _id: new ObjectId(usage.couponId) }, { $inc: { usedCount: 1 } })
}
