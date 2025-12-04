import clientPromise from "../mongodb"
import type { ComboProduct } from "../types"
import { ObjectId } from "mongodb"

export async function getCombos(filters?: { gender?: string; featured?: boolean }) {
  const client = await clientPromise
  const db = client.db("legstar")

  const query: Record<string, unknown> = {}
  if (filters?.gender && filters.gender !== "all") query.gender = { $in: [filters.gender, "all"] }
  if (filters?.featured) query.isFeatured = true

  return db.collection<ComboProduct>("combos").find(query).sort({ createdAt: -1 }).toArray()
}

export async function getComboBySlug(slug: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection<ComboProduct>("combos").findOne({ slug })
}

export async function getComboById(id: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection<ComboProduct>("combos").findOne({ _id: new ObjectId(id) })
}

export async function createCombo(combo: Omit<ComboProduct, "_id" | "createdAt" | "updatedAt">) {
  const client = await clientPromise
  const db = client.db("legstar")
  const result = await db.collection("combos").insertOne({
    ...combo,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function updateCombo(id: string, combo: Partial<ComboProduct>) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("combos").updateOne({ _id: new ObjectId(id) }, { $set: { ...combo, updatedAt: new Date() } })
}

export async function deleteCombo(id: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("combos").deleteOne({ _id: new ObjectId(id) })
}
