import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Award, 
  Users, 
  Leaf, 
  Target, 
  Eye, 
  ArrowRight,
  Feather,
  Palette,
  Sparkles,
  BadgeCheck,
  ThumbsUp
} from "lucide-react"

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

const whyChooseUs = [
    {
        icon: Feather,
        text: "Soft, breathable, skin-friendly fabrics"
    },
    {
        icon: Palette,
        text: "Premium stitching & long-lasting colors"
    },
    {
        icon: Sparkles,
        text: "Trendy yet comfortable designs"
    },
    {
        icon: BadgeCheck,
        text: "Affordable pricing without compromising quality"
    },
    {
        icon: ThumbsUp,
        text: "Trusted by thousands of customers & retailers"
    }
]

export default async function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Who We Are</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-6">A Legacy of Comfort & Quality</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    LegStar was born from a simple belief: everyone deserves to feel comfortable in what they wear, every single day. Founded in 2014, we started as a small team with a big vision – to revolutionize the textile industry in India.
                  </p>
                  <p>
                    Our journey began in a modest workshop in Delhi, where our founder, Naveen Mittal, noticed a gap in the market for high-quality, comfortable wear at accessible prices. With just three sewing machines and an unwavering commitment to quality, LegStar was born.
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
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                  {/* Remember to replace placeholder.svg with a real image path */}
                  <Image
                    src="/placeholder.svg?height=600&width=480" 
                    alt="LegStar Story"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#e6d8b2] rounded-2xl p-6 shadow-lg">
                  <span className="text-4xl font-serif font-bold">11+</span>
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

        {/* NEW: Why Choose LegStar Section */}
        <section className="py-16 md:py-24 bg-muted">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        The LegStar Advantage
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
                        Why Choose LegStar?
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 max-w-5xl mx-auto">
                    {whyChooseUs.map((item) => (
                        <div key={item.text} className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-muted-foreground mt-1.5">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-16 md:py-24 bg-[#e6d8b2]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to Experience LegStar?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join over 500,000 happy customers who have made LegStar their trusted choice for comfort wear.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary bg-transparent text-primary-foreground hover:bg-primary/10 hover:text-primary">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  )
}