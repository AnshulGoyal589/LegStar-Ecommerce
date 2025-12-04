import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin-auth"
import { getCombos, createCombo } from "@/lib/db/combos"

export async function GET() {
  try {
    const combos = await getCombos()
    return NextResponse.json(combos)
  } catch (error) {
    console.error("Failed to fetch combos:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = await createCombo(body)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Failed to create combo:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
