import { NextResponse } from "next/server"
import { createB2BLead, getB2BLeads } from "@/lib/db/b2b-leads"
import { isAdmin } from "@/lib/admin-auth"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      companyName,
      contactName,
      email,
      phone,
      gstNumber,
      city,
      state,
      partnerType,
      experience,
      investment,
      message,
    } = body

    if (!companyName || !contactName || !email || !phone || !gstNumber || !city || !state || !partnerType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await createB2BLead({
      companyName,
      contactName,
      email,
      phone,
      gstNumber,
      city,
      state,
      partnerType,
      experience: experience || "",
      investment: investment || "",
      message: message || "",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to create B2B lead:", error)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leads = await getB2BLeads()
    return NextResponse.json(leads)
  } catch (error) {
    console.error("Failed to fetch B2B leads:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
