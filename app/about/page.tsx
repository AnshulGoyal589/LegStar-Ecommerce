import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Heart, Award, Users, Leaf, Target, Eye, ArrowRight } from "lucide-react"
import { getCategories } from "@/lib/db/categories"

const stats = [
  { label: "Happy Customers", value: "500K+" },
  { label: "Products Sold", value: "2M+" },
  { label: "Years of Trust", value: "15+" },
  { label: "Cities Served", value: "200+" },
]

const values = [
  {
    icon: Heart,
    title: "Comfort First",
    description:
      "We believe everyone deserves to feel comfortable in their own skin. Our products are designed with your comfort as the top priority.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description:
      "Every product undergoes rigorous quality testing. We use only premium materials that stand the test of time.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    description:
      "We are committed to reducing our environmental footprint through sustainable sourcing and eco-friendly packaging.",
  },
  {
    icon: Users,
    title: "Customer Centric",
    description: "Your satisfaction is our success. We listen, adapt, and continuously improve based on your feedback.",
  },
]

const team = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=400&width=400",
    description:
      "With 20+ years in the textile industry, Rajesh founded LegStar with a vision to redefine comfort wear.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Design",
    image: "/placeholder.svg?height=400&width=400",
    description: "Priya brings innovative designs that blend style with functionality, making comfort fashionable.",
  },
  {
    name: "Amit Patel",
    role: "Operations Director",
    image: "/placeholder.svg?height=400&width=400",
    description: "Amit ensures seamless operations from manufacturing to delivery, maintaining our quality standards.",
  },
  {
    name: "Sneha Reddy",
    role: "Customer Experience Head",
    image: "/placeholder.svg?height=400&width=400",
    description: "Sneha leads our customer-first approach, ensuring every interaction exceeds expectations.",
  },
]

const milestones = [
  {
    year: "2009",
    title: "The Beginning",
    description: "LegStar was founded with a small team and big dreams in Mumbai.",
  },
  {
    year: "2012",
    title: "First 100K Customers",
    description: "Reached our first major milestone of 100,000 happy customers.",
  },
  {
    year: "2015",
    title: "Pan-India Expansion",
    description: "Expanded operations to cover all major cities across India.",
  },
  {
    year: "2018",
    title: "Women's Collection Launch",
    description: "Introduced our premium women's comfort wear line.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Launched our e-commerce platform for nationwide accessibility.",
  },
  { year: "2024", title: "500K+ Customers", description: "Crossed half a million customers and still growing strong." },
]

export default async function AboutPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        {/* <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="LegStar About Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1 bg-[#e6d8b2] text-foreground text-sm font-medium rounded-full mb-4">
                  Our Story
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
                  Comfort That <br />
                  Defines You
                </h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  For over 15 years, LegStar has been crafting premium comfort wear that makes you feel confident and
                  comfortable every single day.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Stats Section */}
        {/* <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-3xl md:text-4xl font-serif font-bold text-[#e6d8b2]">{stat.value}</span>
                  <p className="text-sm mt-1 text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Who We Are</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-6">A Legacy of Comfort & Quality</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    LegStar was born from a simple belief: everyone deserves to feel comfortable in what they wear,
                    every single day. Founded in 2009, we started as a small team with a big vision – to revolutionize
                    the innerwear industry in India.
                  </p>
                  <p>
                    Our journey began in a modest workshop in Mumbai, where our founder, Rajesh Kumar, noticed a gap in
                    the market for high-quality, comfortable innerwear at accessible prices. With just three sewing
                    machines and an unwavering commitment to quality, LegStar was born.
                  </p>
                  <p>
                    Today, we serve over 500,000 customers across 200+ cities in India. But our mission remains the same
                    – to deliver uncompromising comfort and quality that you can trust, day after day.
                  </p>
                </div>
                <Button asChild className="mt-8 bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3]">
                  <Link href="/products" className="gap-2">
                    Explore Our Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=480"
                    alt="LegStar Story"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#e6d8b2] rounded-2xl p-6 shadow-lg">
                  <span className="text-4xl font-serif font-bold">15+</span>
                  <p className="text-sm font-medium">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-[#e6d8b2]/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm">
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide every individual with premium quality comfort wear that enhances their daily life. We
                  strive to make comfort accessible, sustainable, and stylish for everyone, regardless of age or gender.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm">
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become India&apos;s most loved and trusted comfort wear brand, known for innovation, quality, and
                  customer satisfaction. We envision a future where LegStar is synonymous with everyday comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                What We Stand For
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">Our Core Values</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-[#e6d8b2]/50 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#e6d8b2] text-sm font-medium uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">Milestones Along The Way</h2>
            </div>
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-primary-foreground/20" />

              <div className="space-y-8 md:space-y-0">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative md:flex items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                      {index % 2 === 0 && (
                        <div className={index % 2 === 0 ? "md:text-right" : "md:text-left"}>
                          <span className="text-[#e6d8b2] font-serif text-2xl font-bold">{milestone.year}</span>
                          <h3 className="font-bold text-lg mt-1">{milestone.title}</h3>
                          <p className="text-primary-foreground/70 text-sm mt-1">{milestone.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-[#e6d8b2]" />
                    <div className="md:w-1/2 md:pl-12">
                      {index % 2 !== 0 && (
                        <div>
                          <span className="text-[#e6d8b2] font-serif text-2xl font-bold">{milestone.year}</span>
                          <h3 className="font-bold text-lg mt-1">{milestone.title}</h3>
                          <p className="text-primary-foreground/70 text-sm mt-1">{milestone.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                The People Behind LegStar
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">Meet Our Leadership</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-card rounded-xl overflow-hidden border border-border group">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-[#e6d8b2] font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-2">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-[#e6d8b2]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to Experience LegStar?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join over 500,000 happy customers who have made LegStar their trusted choice for comfort wear.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary bg-transparent">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
