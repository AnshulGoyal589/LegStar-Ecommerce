import BlogForm from "../BlogForm"

export default function NewBlogPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif">Create New Article</h1>
        <p className="text-muted-foreground">Share your knowledge with your customers.</p>
      </div>
      <BlogForm />
    </div>
  )
}