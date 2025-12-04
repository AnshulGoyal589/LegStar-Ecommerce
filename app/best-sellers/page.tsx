"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Heart, Star, Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
import type { ComboProduct } from "@/lib/types"

// Mock combo products for demo
const mockCombos: ComboProduct[] = [
  {
    _id: "1",
    name: "Men's Essentials Pack (3 Briefs + 2 Vests)",
    slug: "mens-essentials-pack",
    description: "Complete everyday essentials for men. Includes 3 premium briefs and 2 comfortable vests.",
    price: 1299,
    originalPrice: 1799,
    images: ["/placeholder.svg?height=400&width=300"],
    products: [],
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Assorted", hex: "#333333" }],
    stock: 100,
    savings: 500,
    isFeatured: true,
    badge: "Best Seller",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    name: "Women's Comfort Bundle (3 Panties + 2 Camisoles)",
    slug: "womens-comfort-bundle",
    description: "Soft and comfortable everyday essentials for women. 3 panties and 2 camisoles.",
    price: 1199,
    originalPrice: 1599,
    images: ["/placeholder.svg?height=400&width=300"],
    products: [],
    gender: "women",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Assorted", hex: "#FFB6C1" }],
    stock: 80,
    savings: 400,
    isFeatured: true,
    badge: "Popular",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    name: "Men's Premium Trunk Pack (5 Trunks)",
    slug: "mens-premium-trunk-pack",
    description: "5 premium quality trunks in assorted colors. Perfect for everyday wear.",
    price: 1499,
    originalPrice: 2249,
    images: ["/placeholder.svg?height=400&width=300"],
    products: [],
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Assorted", hex: "#1E3A5F" }],
    stock: 120,
    savings: 750,
    isFeatured: true,
    badge: "Value Pack",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "4",
    name: "Kids' School Pack - Boys (5 Briefs + 3 Vests)",
    slug: "kids-school-pack-boys",
    description: "Complete school essentials for boys. Durable and comfortable for active kids.",
    price: 899,
    originalPrice: 1299,
    images: ["/placeholder.svg?height=400&width=300"],
    products: [],
    gender: "kids",
    sizes: ["2-4Y", "4-6Y", "6-8Y", "8-10Y", "10-12Y"],
    colors: [{ name: "Assorted", hex: "#4169E1" }],
    stock: 60,
    savings: 400,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "5",
    name: "Women's Bra Essentials (3 T-Shirt Bras)",
    slug: "womens-bra-essentials",
    description: "3 comfortable T-shirt bras in neutral colors. Perfect under any outfit.",
    price: 1599,
    originalPrice: 2097,
    images: ["/placeholder.svg?height=400&width=300"],
    products: [],
    gender: "women",
    sizes: ["32B", "34B", "36B", "38B", "32C", "34C", "36C"],
    colors: [{ name: "Nude, Black, White", hex: "#D2B48C" }],
    stock: 50,
    savings: 498,
    isFeatured: true,
    badge: "Must Have",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "6",
    name: "Men's Thermal Set (Top + Bottom)",
    slug: "mens-thermal-set",
    description: "Complete thermal set for winter. Ultra-warm and comfortable.",
    price: 1299,
    originalPrice: 1798,
    images: ["/placeholder.svg?height=400&width=300"],
    products: [],
    gender: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1E3A5F" },
    ],
    stock: 70,
    savings: 499,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function BestSellersPage() {
  const [combos, setCombos] = useState<ComboProduct[]>(mockCombos)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { addItem } = useCart()

  const filteredCombos =
    activeTab === "all" ? combos : combos.filter((c) => c.gender === activeTab || c.gender === "all")

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-primary overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <Badge className="bg-white/20 text-white mb-4">Best Sellers</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
              Multipacks & Combos
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-6">
              Get more value with our best-selling multipacks. Premium quality at unbeatable prices.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Package className="h-5 w-5" />
                <span>Save up to 40%</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground">
                <Star className="h-5 w-5 fill-current" />
                <span>Top Rated</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:block">
          <Image
            src="/placeholder.svg?height=400&width=300"
            alt="Multipacks"
            fill
            className="object-cover opacity-30"
          />
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b sticky top-16 md:top-20 bg-background z-40">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
            <TabsList className="bg-transparent gap-2">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Packs
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
        </div>
      </section>

      {/* Combos Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCombos.map((combo) => (
                <div
                  key={combo._id}
                  className="group bg-background border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={combo.images[0] || "/placeholder.svg"}
                      alt={combo.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {combo.badge && <Badge className="absolute top-3 left-3 bg-primary">{combo.badge}</Badge>}
                    <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Save ₹{combo.savings}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={`/best-sellers/${combo.slug}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">{combo.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{combo.description}</p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-xl font-bold">₹{combo.price}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{combo.originalPrice}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {combo.sizes.slice(0, 5).map((size) => (
                        <span key={size} className="text-xs px-2 py-1 bg-muted rounded">
                          {size}
                        </span>
                      ))}
                      {combo.sizes.length > 5 && (
                        <span className="text-xs px-2 py-1 bg-muted rounded">+{combo.sizes.length - 5}</span>
                      )}
                    </div>
                    <Button className="w-full mt-4 gap-2 bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]" asChild>
                      <Link href={`/best-sellers/${combo.slug}`}>
                        <ShoppingBag className="h-4 w-4" />
                        View Pack
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Multipacks */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold text-center mb-12">Why Choose Multipacks?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Better Value</h3>
              <p className="text-sm text-muted-foreground">Save up to 40% compared to buying individually</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Same quality as individual products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Variety</h3>
              <p className="text-sm text-muted-foreground">Get assorted colors and styles in one pack</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Convenience</h3>
              <p className="text-sm text-muted-foreground">Stock up for the entire season</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
