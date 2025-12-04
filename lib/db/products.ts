import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Product } from "@/lib/types"

interface GetProductsOptions {
  categories?: string[] // Changed from category to categories (plural)
  sizes?: string[]
  colors?: string[]
  minPrice?: number
  maxPrice?: number
  gender?: string
  limit?: number
  skip?: number
  sort?: string
  search?: string
}

export async function getProducts(options: GetProductsOptions = {}) {
  const db = await getDb()
  const collection = db.collection<Product>("products")

  // Build the filter query dynamically
  const filter: Record<string, any> = { status: "active" }

  if (options.categories && options.categories.length > 0) {
    // Assumes your product document has a 'categorySlug' field.
    // Use 'category' if that's the field name.
    filter.categorySlug = { $in: options.categories }
  }

  if (options.gender) {
    filter.gender = options.gender
  }

  if (options.sizes && options.sizes.length > 0) {
    filter.sizes = { $in: options.sizes }
  }

  if (options.colors && options.colors.length > 0) {
    // Assumes your product has a 'colors' array with objects like { name: 'Black', hex: '#000' }
    filter["colors.name"] = { $in: options.colors }
  }

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    filter.price = {}
    if (options.minPrice !== undefined) {
      filter.price.$gte = options.minPrice
    }
    if (options.maxPrice !== undefined) {
      filter.price.$lte = options.maxPrice
    }
  }

  if (options.search) {
    filter.$text = { $search: options.search }
  }

  // Build sort options
  const sortOptions: Record<string, 1 | -1> = {}
  switch (options.sort) {
    case "price-asc":
      sortOptions.price = 1
      break
    case "price-desc":
      sortOptions.price = -1
      break
    case "newest":
    default:
      sortOptions.createdAt = -1
      break
  }

  const products = await collection
    .find(filter)
    .sort(sortOptions)
    .skip(options.skip || 0)
    .limit(options.limit || 20)
    .toArray()

  const total = await collection.countDocuments(filter)

  return { products, total }
}
export async function getProductById(id: string) {
  const db = await getDb()
  const collection = db.collection<Product>("products")
  return collection.findOne({ _id: new ObjectId(id) } as any)
}

export async function getProductBySlug(slug: string) {
  try {
    const db = await getDb()
    const collection = db.collection<Product>("products")
    const product = await collection.findOne({ slug: slug, status: "active" })
    return product
  } catch (error) {
    console.error("Failed to get product by slug:", error)
    return null
  }
}

export async function createProduct(product: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDb()
  const collection = db.collection<Product>("products")
  const result = await collection.insertOne({
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Product)

  return result.insertedId
}

export async function updateProduct(id: string, update: Partial<Product>) {
  const db = await getDb()
  const collection = db.collection<Product>("products")

  return collection.updateOne(
    { _id: new ObjectId(id) } as any,
    {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    },
  )
}

export async function deleteProduct(id: string) {
  const db = await getDb()
  const collection = db.collection<Product>("products")
  return collection.deleteOne({ _id: new ObjectId(id) } as any)
}

export async function getFeaturedProducts(limit = 8) {
  const db = await getDb()
  const collection = db.collection<Product>("products")
  return collection.find({ status: "active", isFeatured: true }).limit(limit).toArray()
}
