"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 1. Define the type for the banner data coming from the server
//    ObjectId and Date have been serialized into strings.
interface BannerClient {
  _id: string
  title: string
  image: string
  link: string
  // Add other fields from your schema if you plan to use them
}

// 2. The component now accepts a 'banners' prop
export function HeroSlider({ banners }: { banners: BannerClient[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // If there are no banners, don't render the component
  if (!banners || banners.length === 0) {
    return (
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No banners available.</p>
      </section>
    )
  }

  // 4. Update slide navigation logic to use the 'banners' prop
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, banners.length])

  return (
    <section
      className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-muted"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 5. Map over the dynamic 'banners' prop */}
      {banners.map((banner, index) => (
        <Link href='/products' key={banner._id}>
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>

          {/* Content - Adapted for the simpler Banner schema */}
          {/* <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-xl text-card mr-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 text-balance">{banner.title}</h1>
              <Button asChild size="lg" className="bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3] font-medium">
                <Link href={banner.link}>Shop Now</Link>
              </Button>
            </div>
          </div> */}
        </div>
        </Link>
      ))}

      {/* Navigation Arrows - Logic remains the same */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-card" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-card" />
      </button>

      {/* Dots - Logic now uses 'banners' */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentSlide ? "w-8 bg-[#e6d8b2]" : "w-2 bg-card/50 hover:bg-card/80",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter - Logic now uses 'banners' */}
      <div className="absolute bottom-6 right-6 z-20 text-card font-medium">
        <span className="text-2xl">{String(currentSlide + 1).padStart(2, "0")}</span>
        <span className="text-card/60"> / {String(banners.length).padStart(2, "0")}</span>
      </div>
    </section>
  )
}