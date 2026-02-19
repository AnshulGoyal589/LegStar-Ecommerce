import { getBlogs } from "@/lib/db/blogs"
import BlogsClient from "./BlogsClient" // We'll move the UI logic here

export default async function BlogsPage() {
  // Fetch real data from MongoDB
  const blogs = await getBlogs({ published: true })
  
  // Serialize MongoDB objects for Client Component
  const serializedBlogs = JSON.parse(JSON.stringify(blogs))

  return <BlogsClient initialBlogs={serializedBlogs} />
}