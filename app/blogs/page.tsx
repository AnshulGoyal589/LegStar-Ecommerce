"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Blog } from "@/lib/types"

// Mock blogs for demo
const mockBlogs: Blog[] = [
  {
    _id: "b1",
    title: "How to Choose the Right Underwear for Your Body Type",
    slug: "choose-right-underwear-body-type",
    excerpt:
      "Finding the perfect fit starts with understanding your body. Here's our comprehensive guide to choosing underwear that fits perfectly.",
    content: "",
    image: "/placeholder.svg?height=400&width=600",
    author: "LegStar Style Team",
    tags: ["Guide", "Men", "Fitting"],
    isPublished: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "b2",
    title: "The Ultimate Guide to Caring for Your Innerwear",
    slug: "ultimate-guide-caring-innerwear",
    excerpt: "Learn how to properly wash, dry, and store your innerwear to make them last longer and stay comfortable.",
    content: "",
    image: "/placeholder.svg?height=400&width=600",
    author: "LegStar Care Expert",
    tags: ["Care", "Tips", "Laundry"],
    isPublished: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    _id: "b3",
    title: "5 Signs It's Time to Replace Your Underwear",
    slug: "signs-replace-underwear",
    excerpt: "Your underwear won't last forever. Here are the telltale signs that it's time to refresh your drawer.",
    content: "",
    image: "/placeholder.svg?height=400&width=600",
    author: "LegStar Style Team",
    tags: ["Tips", "Guide"],
    isPublished: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    _id: "b4",
    title: "Women's Bra Guide: Finding Your Perfect Fit",
    slug: "womens-bra-guide-perfect-fit",
    excerpt:
      "80% of women wear the wrong bra size. Learn how to measure yourself and find the perfect bra for every occasion.",
    content: "",
    image: "/placeholder.svg?height=400&width=600",
    author: "LegStar Style Expert",
    tags: ["Women", "Guide", "Bras"],
    isPublished: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    _id: "b5",
    title: "Sustainable Fashion: Our Commitment to the Environment",
    slug: "sustainable-fashion-commitment-environment",
    excerpt:
      "Discover how LegStar is working towards a more sustainable future with eco-friendly materials and practices.",
    content: "",
    image: "/placeholder.svg?height=400&width=600",
    author: "LegStar Team",
    tags: ["Sustainability", "Environment"],
    isPublished: true,
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2023-12-20"),
  },
  {
    _id: "b6",
    title: "Kids' Comfort: Choosing Innerwear for Children",
    slug: "kids-comfort-choosing-innerwear-children",
    excerpt: "Tips for parents on selecting comfortable, durable, and safe innerwear for their little ones.",
    content: "",
    image: "/placeholder.svg?height=400&width=600",
    author: "LegStar Parenting Guide",
    tags: ["Kids", "Guide", "Parents"],
    isPublished: true,
    createdAt: new Date("2023-12-15"),
    updatedAt: new Date("2023-12-15"),
  },
]

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags)))

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || blog.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const featuredBlog = filteredBlogs[0]
  const otherBlogs = filteredBlogs.slice(1)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">LegStar Blog</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Style tips, care guides, and everything you need to know about comfort and fashion.
          </p>
        </div>
      </section>

      {/* Search & Tags */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedTag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredBlog && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Link href={`/blogs/${featuredBlog.slug}`} className="group">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={featuredBlog.image || "/placeholder.svg"}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredBlog.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{featuredBlog.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredBlog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredBlog.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Button className="gap-2">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold mb-8">Latest Articles</h2>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : otherBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog.slug}`}
                  className="group bg-background rounded-xl overflow-hidden border hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{blog.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
