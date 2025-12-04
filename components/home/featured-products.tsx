"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// 1. Define the type for the product data coming from the server
//    This matches your schema, but with complex types serialized to strings.
interface ProductClient {
  _id: string
  name: string
  slug: string
  price: number
  originalPrice: number
  images: string[]
  gender: "men" | "women" | "kids"
  colors: { name: string; hex: string }[]
  rating: number
  reviews: number
  badge?: string
}

const tabs = [
  { id: "all", label: "All" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
]

// 2. The component now accepts 'initialProducts' as a prop
export function FeaturedProducts({ initialProducts }: { initialProducts: ProductClient[] }) {
  
  const [activeTab, setActiveTab] = useState("all")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const filteredProducts =
    activeTab === "all" ? initialProducts : initialProducts.filter((p) => p.gender === activeTab)

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header (unchanged) */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Curated For You</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">Featured Products</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Discover our handpicked selection of premium comfort wear, designed for everyday luxury
          </p>
        </div>

        {/* Tabs (unchanged) */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 md:px-6 py-2 text-sm font-medium rounded-full transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 5. Product Grid - Updated to use dynamic data and correct schema fields */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id} // Use database _id for the key
              className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Badge */}
              {product.badge && (
                <Badge
                  className={cn("absolute top-3 left-3 z-10", "bg-red-600")} // Simplified badge color for now
                >
                  {product.badge}
                </Badge>
              )}

              {/* Wishlist Button */}
              <button className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                <Heart className="h-4 w-4" />
              </button>

              {/* Image */}
              <Link href={`/products/${product.slug}`} className="block aspect-[3/4] relative overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"} // Use the first image from the array
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Quick Actions */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-3 flex items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300",
                    hoveredProduct === product._id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  )}
                >
                  <Button size="sm" variant="secondary" className="gap-1">
                    <Eye className="h-4 w-4" /> Quick View
                  </Button>
                  <Button size="sm" className="gap-1 bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]">
                    <ShoppingBag className="h-4 w-4" /> Add
                  </Button>
                </div>
              </Link>

              {/* Details */}
              <div className="p-4">
                {/* Colors - now map over array of objects */}
                <div className="flex items-center gap-1 mb-2">
                  {product.colors.map((color) => (
                    <span
                      key={color.name}
                      className="h-3 w-3 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-medium text-sm line-clamp-2 hover:underline">{product.name}</h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                      <span className="text-xs text-green-600 font-medium">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All (unchanged) */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
            <Link href="/products">
              View All Products
              <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}