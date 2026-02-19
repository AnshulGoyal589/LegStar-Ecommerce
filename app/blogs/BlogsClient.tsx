"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Blog } from "@/lib/types"

interface BlogsClientProps {
  initialBlogs: Blog[]
}

export default function BlogsClient({ initialBlogs }: BlogsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Derive all unique tags from the actual database blogs
  const allTags = Array.from(new Set(initialBlogs.flatMap((b) => b.tags || [])))

  // Filter logic
  const filteredBlogs = initialBlogs.filter((blog) => {
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
            LegStar Blog
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Style tips, care guides, and everything you need to know about comfort and fashion.
          </p>
        </div>
      </section>

      {/* Search & Tags */}
      <section className="border-b bg-background sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedTag ? "default" : "outline"}
                className="cursor-pointer px-4 py-1"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer px-4 py-1"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {featuredBlog ? (
            <Link href={`/blogs/${featuredBlog.slug}`} className="group">
              <div className="grid md:grid-cols-2 gap-8 items-center border rounded-2xl overflow-hidden p-2 bg-card hover:shadow-xl transition-all">
                <div className="relative aspect-[16/10] md:aspect-square lg:aspect-[16/10] rounded-xl overflow-hidden">
                  <Image
                    src={featuredBlog.image || "/placeholder.svg"}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 md:p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredBlog.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {featuredBlog.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredBlog.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Button className="gap-2 group-hover:px-6 transition-all">
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground">No featured articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold">Latest Articles</h2>
            <p className="text-sm text-muted-foreground">{filteredBlogs.length} Articles found</p>
          </div>

          {otherBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherBlogs.map((blog) => (
                <Link
                  key={blog._id?.toString()}
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col bg-background rounded-2xl overflow-hidden border hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wider">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors mb-3 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t">
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : filteredBlogs.length === 1 ? (
             <p className="text-center py-10 text-muted-foreground italic">You've reached the end of the list.</p>
          ) : (
            <div className="text-center py-20 bg-background rounded-2xl border">
              <p className="text-muted-foreground">No more articles found for this selection.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}