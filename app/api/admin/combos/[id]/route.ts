import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin-auth"
import { getComboById, updateCombo, deleteCombo } from "@/lib/db/combos"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const combo = await getComboById(id)

    if (!combo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(combo)
  } catch (error) {
    console.error("Failed to fetch combo:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    await updateCombo(id, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update combo:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await deleteCombo(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete combo:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
