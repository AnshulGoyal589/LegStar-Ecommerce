import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getCategories, createCategory } from "@/lib/db/categories"

export async function GET() {
  try {
    await requireAdmin()
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    const categoryId = await createCategory({
      ...body,
      isActive: true,
      order: body.order || 0,
    })

    return NextResponse.json({ id: categoryId, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create category" },
      { status: 500 },
    )
  }
}
