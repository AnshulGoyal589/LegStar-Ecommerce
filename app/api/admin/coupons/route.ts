import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { getAllCoupons, createCoupon } from "@/lib/db/coupons"

export async function GET() {
  try {
    await requireAdmin()
    const coupons = await getAllCoupons()
    return NextResponse.json(coupons)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch coupons" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    const couponId = await createCoupon({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isActive: true,
    })

    return NextResponse.json({ id: couponId, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create coupon" },
      { status: 500 },
    )
  }
}
