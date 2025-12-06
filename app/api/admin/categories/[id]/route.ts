import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { updateCategory, deleteCategory } from "@/lib/db/categories"
// import { deleteImage } from "@/lib/cloudinary"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const db = await getDb()
    const category = await db.collection("categories").findOne({ _id: new ObjectId(id) })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch category" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()

    await updateCategory(id, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    // Check if category has products
    const db = await getDb()
    const productCount = await db.collection("products").countDocuments({ categoryId: new ObjectId(id) })

    if (productCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with products. Move or delete products first." },
        { status: 400 },
      )
    }

    // Get category to delete image if exists
    // const category = await db.collection("categories").findOne({ _id: new ObjectId(id) })
    // if (category?.imagePublicId) {
    //   await deleteImage(category.imagePublicId)
    // }

    await deleteCategory(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete category" },
      { status: 500 },
    )
  }
}
