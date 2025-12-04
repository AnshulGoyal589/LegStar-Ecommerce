import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Coupon {
  _id?: ObjectId
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrder: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  perUserLimit: number
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getCouponByCode(code: string) {
  const db = await getDb()
  const collection = db.collection<Coupon>("coupons")
  return collection.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  })
}

export async function validateCoupon(code: string, orderTotal: number, userId?: string) {
  const coupon = await getCouponByCode(code)

  if (!coupon) {
    return { valid: false, error: "Invalid or expired coupon code" }
  }

  if (orderTotal < coupon.minOrder) {
    return { valid: false, error: `Minimum order amount is ₹${coupon.minOrder}` }
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: "This coupon has reached its usage limit" }
  }

  if (userId && coupon.perUserLimit > 0) {
    const db = await getDb()
    const usageCount = await db.collection("orders").countDocuments({
      userId,
      couponCode: coupon.code,
    })

    if (usageCount >= coupon.perUserLimit) {
      return { valid: false, error: "You have already used this coupon" }
    }
  }

  let discount = 0
  if (coupon.type === "percentage") {
    discount = (orderTotal * coupon.value) / 100
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }
  } else {
    discount = coupon.value
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `Coupon applied! You save ₹${discount}`,
  }
}

export async function incrementCouponUsage(code: string) {
  const db = await getDb()
  const collection = db.collection<Coupon>("coupons")

  return collection.updateOne(
    { code: code.toUpperCase() },
    {
      $inc: { usedCount: 1 },
      $set: { updatedAt: new Date() },
    },
  )
}

export async function createCoupon(coupon: Omit<Coupon, "_id" | "createdAt" | "updatedAt" | "usedCount">) {
  const db = await getDb()
  const collection = db.collection<Coupon>("coupons")

  const result = await collection.insertOne({
    ...coupon,
    code: coupon.code.toUpperCase(),
    usedCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Coupon)

  return result.insertedId
}

export async function getAllCoupons() {
  const db = await getDb()
  const collection = db.collection<Coupon>("coupons")
  return collection.find({}).sort({ createdAt: -1 }).toArray()
}

export async function getCouponById(id: string) {
  const db = await getDb()
  const collection = db.collection<Coupon>("coupons")
  return collection.findOne({ _id: new ObjectId(id) })
}

export async function updateCoupon(id: string, update: Partial<Coupon>) {
  const db = await getDb()
  const collection = db.collection<Coupon>("coupons")
  return collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...update, updatedAt: new Date() } })
}

export async function deleteCoupon(id: string) {
  const db = await getDb()
  const collection = db.collection<Coupon>("coupons")
  return collection.deleteOne({ _id: new ObjectId(id) })
}
