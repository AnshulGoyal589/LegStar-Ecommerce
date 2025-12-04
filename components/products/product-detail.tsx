"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Truck, RefreshCw, Shield, Star, Minus, Plus, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
import { ProductCard } from "./product-card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { SizeChartDialog } from "@/components/size-chart-dialog"

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }
    addItem(product, selectedSize, selectedColor.name, quantity)
    toast.success("Added to cart!", {
      description: `${product.name} (${selectedSize}, ${selectedColor.name})`,
    })
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href={`/products/${product.gender}`} className="hover:text-foreground capitalize">
              {product.gender}
            </Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && <Badge className="absolute top-4 left-4 bg-primary">{product.badge}</Badge>}
              <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative h-20 w-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors",
                      selectedImage === index ? "border-primary" : "border-transparent",
                    )}
                  >
                    <Image src={image || "/placeholder.svg"} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{product.name}</h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted",
                      )}
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Color: {selectedColor.name}</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all flex items-center justify-center",
                      selectedColor.name === color.name ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110",
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check className={cn("h-5 w-5", color.hex === "#FFFFFF" ? "text-black" : "text-white")} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Size</span>
                <SizeChartDialog gender={product.gender} />
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-11 min-w-[48px] px-4 rounded-md border text-sm font-medium transition-colors",
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted border-border",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 flex items-center justify-center hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-11 w-11 flex items-center justify-center hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                size="lg"
                className="flex-1 bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3] gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>

              <Button size="lg" variant="outline" className="px-4 bg-transparent">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-xs mt-2">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-xs mt-2">Easy Returns</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-xs mt-2">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info Tabs */}
        <div className="mt-16">
          {/* <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent"> */}
              {/* <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Details & Care
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList> */}
            {/* <TabsContent value="description" className="mt-6"> */}
              <div className="prose max-w-none">
                <p>{product.description}</p>
                {/* <ul className="mt-4 space-y-2">
                  <li>Premium quality fabric for ultimate comfort</li>
                  <li>Breathable material keeps you cool all day</li>
                  <li>Durable stitching for long-lasting wear</li>
                  <li>Easy care - machine washable</li>
                </ul> */}
              </div>
            {/* </TabsContent> */}
            {/* <TabsContent value="details" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-3">Product Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Material</dt>
                      <dd>100% Combed Cotton</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Fit</dt>
                      <dd>Regular Fit</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Pattern</dt>
                      <dd>Solid</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Pack Contains</dt>
                      <dd>3 Pieces</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Care Instructions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Machine wash cold with similar colors</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low</li>
                    <li>Warm iron if needed</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Reviews coming soon!</p>
              </div>
            </TabsContent> */}
          {/* </Tabs> */}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
