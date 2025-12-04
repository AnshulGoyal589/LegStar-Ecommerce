import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin-auth"
import { deleteB2BLead } from "@/lib/db/b2b-leads"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await deleteB2BLead(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete B2B lead:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
