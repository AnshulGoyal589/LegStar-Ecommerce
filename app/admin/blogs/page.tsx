import Link from "next/link"
import { getAllBlogsForAdmin } from "@/lib/db/blogs"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { deleteBlogAction } from "@/lib/actions/blog-actions"

export default async function AdminBlogsPage() {
  const rawBlogs = await getAllBlogsForAdmin()

  // FORCE SERIALIZATION: Convert everything to plain strings/booleans
  const blogs = JSON.parse(JSON.stringify(rawBlogs)).map((blog: any) => ({
    ...blog,
    _id: blog._id.toString(), // Ensure ID is a string
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Link href="/admin/blogs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Blog
          </Button>
        </Link>
      </div>

      <div className="bg-background border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blogs.map((blog:any) => (
              <tr key={blog._id?.toString()} className="hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">{blog.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Link href={`/admin/blogs/edit/${blog._id}`}>
                    <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                  </Link>
                  <form action={deleteBlogAction.bind(null, blog._id.toString())}>
    <Button variant="destructive" size="icon" type="submit">
      <Trash2 className="h-4 w-4" />
    </Button>
  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}