import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const collections = [
  {
    id: "thermals",
    title: "Winter Thermals",
    subtitle: "Stay Warm & Cozy",
    description: "Our premium thermal collection designed to keep you comfortable in the coldest weather",
    image: "/placeholder.svg?height=500&width=800",
    link: "/products/thermals",
    color: "bg-blue-900",
  },
  {
    id: "loungewear",
    title: "Loungewear Edit",
    subtitle: "Comfort All Day",
    description: "Relax in style with our ultra-soft loungewear collection",
    image: "/placeholder.svg?height=500&width=800",
    link: "/products/loungewear",
    color: "bg-amber-900",
  },
]

export function TrendingCollection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Seasonal Picks</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">Trending Collections</h2>
        </div>

        {/* Collections */}
        <div className="space-y-8">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`relative rounded-2xl overflow-hidden ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } flex flex-col md:flex-row`}
            >
              {/* Image */}
              <div className="relative w-full md:w-3/5 aspect-[16/9] md:aspect-auto md:min-h-[400px]">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div
                className={`w-full md:w-2/5 ${collection.color} text-white p-8 md:p-12 flex flex-col justify-center`}
              >
                <span className="text-[#e6d8b2] text-sm font-medium uppercase tracking-wider">
                  {collection.subtitle}
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mt-2">{collection.title}</h3>
                <p className="text-white/80 mt-4 leading-relaxed">{collection.description}</p>
                <Button asChild className="mt-6 w-fit bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]">
                  <Link href={collection.link} className="gap-2">
                    Explore Collection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
