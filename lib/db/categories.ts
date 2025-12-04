import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Category {
  _id?: ObjectId
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: ObjectId | null
  gender?: "men" | "women" | "kids"
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getCategories() {
  const db = await getDb()
  const collection = db.collection<Category>("categories")
  return collection.find({ isActive: true }).sort({ order: 1 }).toArray()
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb()
  const collection = db.collection<Category>("categories")
  return collection.findOne({ slug, isActive: true })
}

export async function getCategoriesByGender(gender: "men" | "women" | "kids") {
  const db = await getDb()
  const collection = db.collection<Category>("categories")
  return collection.find({ gender, isActive: true }).sort({ order: 1 }).toArray()
}

export async function createCategory(category: Omit<Category, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDb()
  const collection = db.collection<Category>("categories")

  const result = await collection.insertOne({
    ...category,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Category)

  return result.insertedId
}

export async function updateCategory(id: string, update: Partial<Category>) {
  const db = await getDb()
  const collection = db.collection<Category>("categories")

  return collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...update, updatedAt: new Date() } })
}

export async function deleteCategory(id: string) {
  const db = await getDb()
  const collection = db.collection<Category>("categories")
  return collection.deleteOne({ _id: new ObjectId(id) })
}
