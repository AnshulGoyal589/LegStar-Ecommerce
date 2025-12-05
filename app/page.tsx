import { Footer } from "@/components/layout/footer"
import { HeroSlider } from "@/components/home/hero-slider"
import { BenefitsSection } from "@/components/home/benefits-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { TrendingCollection } from "@/components/home/trending-collection"
import { Testimonials } from "@/components/home/testimonials"
import { getBanners } from "@/lib/db/banners"
import { getFeaturedProducts } from "@/lib/db/products"
import PromotionalImage from "@/components/home/promotional-image"
import PromotionalVideo from "@/components/home/promotional-video"

export default async function HomePage() {
  // const allCategories = await getCategories()
  const heroBanners = await getBanners("hero")
  const featuredProducts = await getFeaturedProducts(8)
  const serializedProducts = JSON.parse(JSON.stringify(featuredProducts))
  // const serializedCategories = JSON.parse(JSON.stringify(allCategories))
  const serializedBanners = JSON.parse(JSON.stringify(heroBanners))
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSlider banners={serializedBanners} />
        <BenefitsSection />
        <FeaturedProducts initialProducts={serializedProducts} />
        <PromotionalImage/>
        <CategoryShowcase />
        <TrendingCollection />
        <PromotionalVideo/>
        <Testimonials />
        {/* <InstagramFeed /> */}
      </main>
      <Footer />
    </div>
  )
}
