import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"

const posts = [
  { id: 1, image: "/placeholder.svg?height=300&width=300" },
  { id: 2, image: "/placeholder.svg?height=300&width=300" },
  { id: 3, image: "/placeholder.svg?height=300&width=300" },
  { id: 4, image: "/placeholder.svg?height=300&width=300" },
  { id: 5, image: "/placeholder.svg?height=300&width=300" },
  { id: 6, image: "/placeholder.svg?height=300&width=300" },
]

export function InstagramFeed() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Instagram className="h-5 w-5 text-[#E1306C]" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              @legstar.official
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Follow Us on Instagram</h2>
          <p className="text-muted-foreground mt-3">Tag us in your photos for a chance to be featured</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden rounded-lg"
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Instagram post"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
