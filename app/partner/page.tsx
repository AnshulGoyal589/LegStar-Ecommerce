"use client"

import type React from "react"

import { useState } from "react"
import {
  Store,
  TrendingUp,
  Truck,
  Headphones,
  Award,
  Users,
  Building,
  ShoppingBag,
  Globe,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const benefits = [
  {
    icon: TrendingUp,
    title: "High Profit Margins",
    description: "Enjoy competitive pricing and attractive margins on all LegStar products.",
  },
  {
    icon: Truck,
    title: "Reliable Supply Chain",
    description: "Consistent stock availability with efficient logistics and quick deliveries.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Get a dedicated account manager to help you grow your business.",
  },
  {
    icon: Award,
    title: "Marketing Support",
    description: "Access to marketing materials, displays, and promotional campaigns.",
  },
  {
    icon: Users,
    title: "Training Programs",
    description: "Regular training sessions on products and sales techniques.",
  },
  {
    icon: Store,
    title: "Exclusive Territory",
    description: "Protected territories ensure healthy business opportunities.",
  },
]

const partnerTypes = [
  {
    icon: Store,
    title: "Retail Partner",
    description: "Open a LegStar exclusive store or add our products to your existing retail outlet.",
    features: ["Exclusive product range", "Store branding support", "Visual merchandising", "Staff training"],
  },
  {
    icon: Building,
    title: "Distributor",
    description: "Become a regional distributor and supply LegStar products to retailers in your area.",
    features: ["Bulk pricing", "Regional exclusivity", "Marketing budget", "Sales team support"],
  },
  {
    icon: ShoppingBag,
    title: "Franchise",
    description: "Own and operate a LegStar branded store with our complete business model.",
    features: ["Turn-key solution", "Proven business model", "Brand recognition", "Ongoing support"],
  },
  {
    icon: Globe,
    title: "Online Seller",
    description: "Sell LegStar products on e-commerce platforms with our authorized seller program.",
    features: ["MAP pricing protection", "Product images & content", "Inventory sync", "Platform support"],
  },
]

const testimonials = [
  {
    name: "Vikram Singh",
    role: "Retail Partner, Delhi",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "Partnering with LegStar has been the best business decision. The brand recognition and product quality make sales effortless.",
  },
  {
    name: "Priya Sharma",
    role: "Distributor, Mumbai",
    image: "/placeholder.svg?height=80&width=80",
    quote: "The support from the LegStar team is exceptional. They truly care about their partners' success.",
  },
  {
    name: "Rajesh Kumar",
    role: "Franchise Owner, Bangalore",
    image: "/placeholder.svg?height=80&width=80",
    quote: "From day one, LegStar provided everything needed to run a successful store. Highly recommended!",
  },
]

export default function PartnerPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    gstNumber: "",
    city: "",
    state: "",
    partnerType: "",
    experience: "",
    investment: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/b2b/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Application submitted successfully!", {
          description: "Our team will contact you within 48 hours.",
        })
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          gstNumber: "",
          city: "",
          state: "",
          partnerType: "",
          experience: "",
          investment: "",
          message: "",
        })
      } else {
        toast.error("Failed to submit application")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Partner With LegStar (B2B)</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Join India&apos;s fastest-growing innerwear brand and build a profitable business with our trusted
            partnership programs.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Become a Partner <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Partner With Us?</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            LegStar offers comprehensive support and benefits to help our partners succeed and grow.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-background p-6 rounded-lg border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Partnership Opportunities</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Choose the partnership model that best fits your goals and investment capacity.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {partnerTypes.map((type) => (
              <div key={type.title} className="bg-background border rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <type.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Partners Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-background p-6 rounded-xl border">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form - Updated with GST and Phone */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Apply Now</h2>
            <p className="text-muted-foreground text-center mb-8">
              Fill out the form below and our partnership team will get in touch with you.
            </p>
            <form onSubmit={handleSubmit} className="bg-background border rounded-xl p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company/Business Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerType">Partnership Type *</Label>
                  <Select
                    value={formData.partnerType}
                    onValueChange={(value) => setFormData({ ...formData, partnerType: value })}
                  >
                    <SelectTrigger id="partnerType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail Partner</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="franchise">Franchise</SelectItem>
                      <SelectItem value="online">Online Seller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Business Experience (Years)</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investment">Investment Capacity (INR)</Label>
                  <Select
                    value={formData.investment}
                    onValueChange={(value) => setFormData({ ...formData, investment: value })}
                  >
                    <SelectTrigger id="investment">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-10">5-10 Lakhs</SelectItem>
                      <SelectItem value="10-25">10-25 Lakhs</SelectItem>
                      <SelectItem value="25-50">25-50 Lakhs</SelectItem>
                      <SelectItem value="50+">50+ Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your business background and why you want to partner with LegStar..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
