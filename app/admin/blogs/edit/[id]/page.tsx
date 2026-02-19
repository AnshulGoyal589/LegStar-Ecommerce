import { getBlogById } from "@/lib/db/blogs"
import { notFound } from "next/navigation"
import EditBlogForm from "./EditBlogForm"

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const blog = await getBlogById(params.id)

  if (!blog) {
    notFound()
  }

  // AGGRESSIVE CLEANUP: 
  // 1. JSON stringify/parse removes all Class instances (like ObjectId and Date)
  // 2. We manually ensure _id is a string
  const cleanBlog = JSON.parse(JSON.stringify(blog))
  cleanBlog._id = cleanBlog._id.toString()

  return (
    <div className="container mx-auto py-10">
      <EditBlogForm blog={cleanBlog} />
    </div>
  )
}