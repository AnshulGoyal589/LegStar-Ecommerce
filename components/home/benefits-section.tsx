import { Truck, RefreshCw, Shield, HeadphonesIcon } from "lucide-react"

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders above ₹999",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment processing",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Dedicated customer support team",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
