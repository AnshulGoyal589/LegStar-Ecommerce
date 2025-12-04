import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin-auth"
import { getBlogById, updateBlog, deleteBlog } from "@/lib/db/blogs"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blog = await getBlogById(id)

    if (!blog) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Failed to fetch blog:", error)
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
    await updateBlog(id, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update blog:", error)
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
    await deleteBlog(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete blog:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
