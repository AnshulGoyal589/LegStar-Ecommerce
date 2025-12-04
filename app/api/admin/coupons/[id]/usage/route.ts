import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin-auth"
import { getCouponUsage } from "@/lib/db/coupon-usage"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const usage = await getCouponUsage(id)

    return NextResponse.json(usage)
  } catch (error) {
    console.error("Failed to fetch coupon usage:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
