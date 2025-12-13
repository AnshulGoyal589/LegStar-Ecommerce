import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface OrderItem {
  productId: ObjectId | string
  name: string
  sku: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

export interface Order {
  _id?: ObjectId
  orderId: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  discount: number
  couponCode?: string
  shippingCost: number
  // tax: number
  total: number
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  billingAddress?: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  paymentMethod: "razorpay" | "cod"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentId?: string
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  trackingNumber?: string
  trackingUrl?: string
  shiprocketOrderId?: string
  shiprocketShipmentId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export async function createOrder(order: Omit<Order, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")

  const result = await collection.insertOne({
    ...order,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Order)

  return result.insertedId
}

export async function getOrderById(id: string) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")
  return collection.findOne({ _id: new ObjectId(id) })
}

export async function getOrderByOrderId(orderId: string) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")
  return collection.findOne({ orderId })
}

export async function getOrdersByUserId(userId: string) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")
  return collection.find({ userId }).sort({ createdAt: -1 }).toArray()
}

export async function updateOrderStatus(id: string, status: Order["orderStatus"]) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")

  return collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        orderStatus: status,
        updatedAt: new Date(),
      },
    },
  )
}

export async function updatePaymentStatus(id: string, status: Order["paymentStatus"], paymentId?: string) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")

  return collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        paymentStatus: status,
        paymentId,
        updatedAt: new Date(),
      },
    },
  )
}

export async function updateShiprocketDetails(
  id: string,
  shiprocketOrderId: string,
  shiprocketShipmentId: string,
  trackingNumber?: string,
) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")

  return collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        shiprocketOrderId,
        shiprocketShipmentId,
        trackingNumber,
        updatedAt: new Date(),
      },
    },
  )
}

export async function getAllOrders(options?: {
  status?: string
  limit?: number
  skip?: number
}) {
  const db = await getDb()
  const collection = db.collection<Order>("orders")

  const filter: Record<string, unknown> = {}
  if (options?.status) {
    filter.orderStatus = options.status
  }

  const orders = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(options?.skip || 0)
    .limit(options?.limit || 50)
    .toArray()

  const total = await collection.countDocuments(filter)

  return { orders, total }
}

export async function generateOrderId() {
  const db = await getDb()
  const collection = db.collection<{ _id: string; seq: number }>("counters")

  // increment the sequence (upsert if missing)
  await collection.updateOne(
    { _id: "orderId" },
    { $inc: { seq: 1 } },
    { upsert: true },
  )

  // read the updated document to get the current seq
  const doc = await collection.findOne({ _id: "orderId" })
  const seq = doc?.seq ?? 1
  const year = new Date().getFullYear()
  return `ORD-${year}-${String(seq).padStart(6, "0")}`
}

export const deleteOrder = async (id: string) => {
  const db = await getDb()
  const collection = db.collection<Order>("orders")
  return collection.deleteOne({ _id: new ObjectId(id) })
}
