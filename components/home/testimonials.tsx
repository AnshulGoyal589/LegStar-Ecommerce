"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The quality of LegStar products is exceptional. I've been buying their innerwear for years and the comfort level is unmatched. Highly recommended!",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Delhi",
    rating: 5,
    text: "Finally found a brand that understands what women need. The seamless collection is so comfortable, I forget I'm even wearing them!",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Amit Kumar",
    location: "Bangalore",
    rating: 5,
    text: "Great quality at reasonable prices. The thermal innerwear kept me warm during my trip to the mountains. Will definitely buy again!",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    location: "Hyderabad",
    rating: 5,
    text: "My kids love the soft cotton vests from LegStar. The fun prints and comfortable fit make them excited to wear them every day.",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#e6d8b2] text-sm font-medium uppercase tracking-wider">Customer Love</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">What Our Customers Say</h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-card text-card-foreground rounded-2xl p-8 md:p-12">
                    <Quote className="h-10 w-10 text-[#e6d8b2] mb-6" />

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-lg md:text-xl leading-relaxed mb-8">&ldquo;{testimonial.text}&rdquo;</p>

                    <div className="flex items-center gap-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="h-12 w-12 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentIndex ? "w-8 bg-[#e6d8b2]" : "w-2 bg-primary-foreground/30",
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="h-12 w-12 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
