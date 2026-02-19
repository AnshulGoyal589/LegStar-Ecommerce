import clientPromise from "../mongodb"
import type { Blog } from "../types"
import { ObjectId } from "mongodb"

export async function getBlogs(filters?: { published?: boolean; tag?: string }) {
  const client = await clientPromise
  const db = client.db("legstar")

  const query: Record<string, unknown> = {}
  if (filters?.published) query.isPublished = true
  if (filters?.tag) query.tags = filters.tag

  return db.collection<Blog>("blogs").find(query).sort({ createdAt: -1 }).toArray()
}

export async function getBlogBySlug(slug: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection<Blog>("blogs").findOne({ slug })
}

export async function getBlogById(id: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection<Blog>("blogs").findOne({ _id: new ObjectId(id) } as any)
}

export async function createBlog(blog: Omit<Blog, "_id" | "createdAt" | "updatedAt">) {
  const client = await clientPromise
  const db = client.db("legstar")
  const result = await db.collection("blogs").insertOne({
    ...blog,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result.acknowledged
}

export async function updateBlog(id: string, blog: any) {
  const client = await clientPromise
  const db = client.db("legstar")
  const result = await db.collection("blogs").updateOne(
    { _id: new ObjectId(id) }, 
    { $set: blog }
  )
  return result.acknowledged
}

export async function deleteBlog(id: string) {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection("blogs").deleteOne({ _id: new ObjectId(id) })
}


export async function getAllBlogsForAdmin() {
  const client = await clientPromise
  const db = client.db("legstar")
  return db.collection<Blog>("blogs").find().sort({ createdAt: -1 }).toArray()
}