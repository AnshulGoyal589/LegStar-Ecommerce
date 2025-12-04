import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin-auth"
import { getBlogs, createBlog } from "@/lib/db/blogs"

export async function GET() {
  try {
    const blogs = await getBlogs()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Failed to fetch blogs:", error)
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
    const result = await createBlog(body)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Failed to create blog:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
