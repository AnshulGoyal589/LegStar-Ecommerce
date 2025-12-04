"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <Badge
          className={cn(
            "absolute top-3 left-3 z-10",
            product.badge === "Bestseller" && "bg-primary",
            product.badge === "New" && "bg-green-600",
            product.badge === "Top Rated" && "bg-amber-500",
            product.badge === "Popular" && "bg-blue-600",
            product.badge.includes("Off") && "bg-red-600",
          )}
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
          src={product.images[0] || "/placeholder.svg?height=400&width=300"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Actions */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 flex items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <Button size="sm" variant="secondary" className="gap-1" asChild>
            <Button size="sm" variant="secondary" className="gap-1">
              <Eye className="h-4 w-4" />
              Quick View
            </Button>
          </Button>
          <Button size="sm" className="gap-1 bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]">
            <ShoppingBag className="h-4 w-4" />
            Add
          </Button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-4">
        {/* Colors */}
        <div className="flex items-center gap-1 mb-2">
          {product.colors.slice(0, 4).map((color, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
          )}
        </div>

        <Link href={`/products/${product._id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:underline">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              <span className="text-xs text-green-600 font-medium">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
