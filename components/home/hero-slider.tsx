"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface BannerClient {
  _id: string
  title: string
  image: string // This is the URL (works for both image/video)
  link: string
  resourceType: "image" | "video"
}

export function HeroSlider({ banners }: { banners: BannerClient[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // If there are no banners, don't render the component
  if (!banners || banners.length === 0) {
    return (
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No banners available.</p>
      </section>
    )
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  // Autoplay Logic
  useEffect(() => {
    // Disable autoplay if current slide is a video
    const currentBanner = banners[currentSlide]
    if (!isAutoPlaying || banners.length <= 1 || currentBanner.resourceType === "video") return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, banners.length, currentSlide, banners])

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  return (
    <section
      className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {banners.map((banner, index) => {
        const isActive = index === currentSlide
        const isVideo = banner.resourceType === "video"

        return (
          <div
            key={banner._id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {/* Conditional Wrapper: Link only for images */}
            {!isVideo ? (
              <Link href={banner.link || "/products"}>
                <div className="absolute inset-0 cursor-pointer">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                </div>
              </Link>
            ) : (
              <div className="absolute inset-0 bg-black">
                <video
                  ref={isActive ? videoRef : null}
                  src={banner.image}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Mute Toggle Button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-20 left-6 z-30 p-3 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white hover:bg-black/60 transition-all"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentSlide ? "w-8 bg-[#e6d8b2]" : "w-2 bg-white/40 hover:bg-white/60",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 z-30 text-white font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm text-sm">
        <span className="text-lg">{String(currentSlide + 1).padStart(2, "0")}</span>
        <span className="opacity-60"> / {String(banners.length).padStart(2, "0")}</span>
      </div>
    </section>
  )
}