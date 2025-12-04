"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/lib/types"

// Mock new arrivals for demo
const mockNewArrivals: Product[] = [
  {
    _id: "n1",
    name: "Premium Modal Briefs",
    slug: "premium-modal-briefs",
    description: "Ultra-soft modal fabric with superior stretch and comfort.",
    price: 599,
    originalPrice: 799,
    images: ["/placeholder.svg?height=400&width=300"],
    category: "innerwear",
    subcategory: "briefs",
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy", hex: "#1E3A5F" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 100,
    rating: 4.8,
    reviews: 24,
    isFeatured: true,
    badge: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "n2",
    name: "Seamless T-Shirt Bra",
    slug: "seamless-tshirt-bra",
    description: "Invisible under clothing. Smooth finish with no visible lines.",
    price: 899,
    originalPrice: 1199,
    images: ["/placeholder.svg?height=400&width=300"],
    category: "innerwear",
    subcategory: "bras",
    gender: "women",
    sizes: ["32B", "34B", "36B", "32C", "34C", "36C"],
    colors: [
      { name: "Nude", hex: "#D2B48C" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 80,
    rating: 4.9,
    reviews: 45,
    isFeatured: true,
    badge: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "n3",
    name: "Bamboo Fiber Boxers",
    slug: "bamboo-fiber-boxers",
    description: "Eco-friendly bamboo fabric. Naturally antibacterial and breathable.",
    price: 649,
    originalPrice: 849,
    images: ["/placeholder.svg?height=400&width=300"],
    category: "innerwear",
    subcategory: "boxers",
    gender: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Olive", hex: "#556B2F" },
      { name: "Grey", hex: "#808080" },
    ],
    stock: 60,
    rating: 4.7,
    reviews: 18,
    isFeatured: true,
    badge: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "n4",
    name: "High-Waist Shaping Panty",
    slug: "high-waist-shaping-panty",
    description: "Gentle tummy control with comfortable high waist design.",
    price: 499,
    originalPrice: 699,
    images: ["/placeholder.svg?height=400&width=300"],
    category: "innerwear",
    subcategory: "shapewear",
    gender: "women",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Skin", hex: "#FFDAB9" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 90,
    rating: 4.6,
    reviews: 32,
    isFeatured: true,
    badge: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "n5",
    name: "Kids Fun Print Briefs (3 Pack)",
    slug: "kids-fun-print-briefs",
    description: "Colorful fun prints kids love. Soft cotton for all-day comfort.",
    price: 399,
    originalPrice: 549,
    images: ["/placeholder.svg?height=400&width=300"],
    category: "innerwear",
    subcategory: "briefs",
    gender: "kids",
    sizes: ["2-4Y", "4-6Y", "6-8Y", "8-10Y"],
    colors: [{ name: "Assorted", hex: "#FF6B6B" }],
    stock: 70,
    rating: 4.8,
    reviews: 56,
    isFeatured: true,
    badge: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "n6",
    name: "Athletic Compression Trunks",
    slug: "athletic-compression-trunks",
    description: "Performance fabric with moisture-wicking technology.",
    price: 749,
    originalPrice: 999,
    images: ["/placeholder.svg?height=400&width=300"],
    category: "innerwear",
    subcategory: "trunks",
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Blue", hex: "#0066CC" },
    ],
    stock: 55,
    rating: 4.9,
    reviews: 28,
    isFeatured: true,
    badge: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function NewCollectionPage() {
  const [products, setProducts] = useState<Product[]>(mockNewArrivals)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const filteredProducts = activeTab === "all" ? products : products.filter((p) => p.gender === activeTab)

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary-foreground/80 mb-4">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Just Arrived</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
                Discover What&apos;s New
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Fresh fits for everyday comfort and style. Explore our latest arrivals crafted with premium materials.
              </p>
              <Button size="lg" variant="secondary" className="gap-2">
                Shop New Arrivals <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative aspect-square max-w-md mx-auto">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="New Collection"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="border-b sticky top-16 md:top-20 bg-background z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent gap-2">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All New
                </TabsTrigger>
                <TabsTrigger
                  value="men"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Men
                </TabsTrigger>
                <TabsTrigger
                  value="women"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Women
                </TabsTrigger>
                <TabsTrigger
                  value="kids"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Kids
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-sm text-muted-foreground hidden md:block">{filteredProducts.length} new products</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold text-center mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Men's Innerwear",
                image: "/placeholder.svg?height=300&width=300",
                href: "/products/men/innerwear",
              },
              {
                name: "Women's Innerwear",
                image: "/placeholder.svg?height=300&width=300",
                href: "/products/women/innerwear",
              },
              { name: "Kids' Wear", image: "/placeholder.svg?height=300&width=300", href: "/products/kids" },
              { name: "Loungewear", image: "/placeholder.svg?height=300&width=300", href: "/products/men/loungewear" },
            ].map((cat) => (
              <Link key={cat.name} href={cat.href} className="group relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-white font-semibold">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
