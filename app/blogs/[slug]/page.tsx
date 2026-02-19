import { getBlogBySlug, getBlogs } from "@/lib/db/blogs"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Generate SEO Metadata for the blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) return { title: "Blog Not Found" }

  return {
    title: `${blog.title} | LegStar Blog`,
    description: blog.excerpt,
    openGraph: {
      images: [blog.image],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)

  // 404 if blog doesn't exist or isn't published
  if (!blog || !blog.isPublished) {
    notFound()
  }

  // Fetch recent blogs for the "Read More" sidebar
  const allBlogs = await getBlogs({ published: true })
  const recentBlogs = allBlogs.filter((b) => b.slug !== params.slug).slice(0, 3)

  return (
    <article className="min-h-screen pb-20">
      {/* Hero Header */}
      <header className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {blog.author[0]}
              </div>
              <span className="font-medium text-foreground">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <Image
            src={blog.image || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* The actual content of the blog */}
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed">
              {/* 
                If you use a Rich Text Editor later, use dangerouslySetInnerHTML. 
                For now, we handle plain text with line breaks:
              */}
              <div className="whitespace-pre-wrap text-lg text-foreground/90">
                {blog.content}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-12 pt-8 border-t flex items-center justify-between">
              {/* <div className="flex gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div> */}
              <p className="text-sm text-muted-foreground italic">
                Thank you for reading the LegStar blog.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-muted-foreground">
                Recent Posts
              </h3>
              <div className="space-y-6">
                {recentBlogs.map((recent) => (
                  <Link key={recent.slug} href={`/blogs/${recent.slug}`} className="group block">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                      <Image 
                        src={recent.image || "/placeholder.svg"} 
                        alt={recent.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform" 
                      />
                    </div>
                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {recent.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop CTA */}
            <div className="bg-primary text-primary-foreground p-6 rounded-2xl">
              <h3 className="font-bold text-xl mb-2 font-serif">Upgrade Your Drawer</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Experience the comfort described in our articles.
              </p>
              <Link href="/products">
                <Button variant="secondary" className="w-full">Shop Collection</Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}