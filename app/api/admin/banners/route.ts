import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getAllBanners, createBanner } from "@/lib/db/banners"

export async function GET() {
  try {
    // await requireAdmin()
    const banners = await getAllBanners()
    return NextResponse.json(banners)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch banners" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    const bannerId = await createBanner({
      ...body,
      active: body.active ?? true,
      order: body.order || 1,
    })

    return NextResponse.json({ id: bannerId, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create banner" },
      { status: 500 },
    )
  }
}
