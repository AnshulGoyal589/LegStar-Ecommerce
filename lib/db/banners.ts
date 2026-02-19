import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Banner {
  _id?: ObjectId
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  align?: "left" | "center" | "right"
  resourceType: "image" | "video"
  image: string
  imagePublicId?: string
  link: string
  position: "hero" | "sidebar" | "popup"
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getBanners(position?: Banner["position"]) {
  const db = await getDb()
  const collection = db.collection<Banner>("banners")
  const filter = position ? { position, active: true } : {}
  return collection.find(filter).sort({ order: 1 }).toArray()
}

export async function getAllBanners() {
  const db = await getDb()
  const collection = db.collection<Banner>("banners")
  return collection.find({}).sort({ position: 1, order: 1 }).toArray()
}

export async function getBannerById(id: string) {
  const db = await getDb()
  const collection = db.collection<Banner>("banners")
  return collection.findOne({ _id: new ObjectId(id) })
}


export async function saveBanner(id: string | null, data: any) {
  const db = await getDb()
  const collection = db.collection("banners")

  if (id) {
    // Update existing
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...data, 
          updatedAt: new Date() 
        } 
      }
    )
  }
  
  // Create new
  return collection.insertOne({ 
    ...data, 
    createdAt: new Date(), 
    updatedAt: new Date() 
  })
}

export async function deleteBanner(id: string) {
  const db = await getDb()
  const collection = db.collection("banners")
  return collection.deleteOne({ _id: new ObjectId(id) })
}

export async function createBanner(banner: Omit<Banner, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDb()
  const collection = db.collection<Banner>("banners")

  const result = await collection.insertOne({
    ...banner,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Banner)

  return result.insertedId
}

export async function updateBanner(id: string, update: Partial<Banner>) {
  const db = await getDb()
  const collection = db.collection<Banner>("banners")
  return collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...update, updatedAt: new Date() } })
}
