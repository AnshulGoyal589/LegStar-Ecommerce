import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { validateCoupon } from "@/lib/db/coupons"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const body = await request.json()
    const { code, orderTotal } = body

    if (!code || !orderTotal) {
      return NextResponse.json({ valid: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await validateCoupon(code, orderTotal, userId || undefined)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ valid: false, error: "Failed to validate coupon" }, { status: 500 })
  }
}
