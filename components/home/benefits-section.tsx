// import { Truck, RefreshCw, Shield, HeadphonesIcon } from "lucide-react"

import { Feather, Wind, Recycle } from "lucide-react"

const benefits = [
  {
    icon: Feather,
    title: "Skin-friendly properties",
    description: "Crafted from pure cotton for unmatched softness—gentle on your skin, free from irritants.",
  },
  {
    icon: Wind,
    title: "Breathability and comfort",
    description: "Finely spun cotton yarn for unmatched breathability—soft, airy, and designed for all-day comfort.",
  },
  {
    icon: Recycle,
    title: "Sustainability",
    description: "Eco-friendly craftsmanship—designed for comfort, made for the planet.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-[#e6d8b2]/30 flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
