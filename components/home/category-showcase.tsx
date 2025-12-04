import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    id: "men",
    title: "Men's Collection",
    subtitle: "Comfort Redefined",
    image: "https://res.cloudinary.com/dgzj1itlu/image/upload/v1764819230/infashion-1703672261_iplyp7.jpg",
    link: "/products/men",
  },
  {
    id: "women",
    title: "Women's Collection",
    subtitle: "Elegance & Comfort",
    image: "https://res.cloudinary.com/dgzj1itlu/image/upload/v1764819270/817wM4ikutL._AC_UY1000__gwkbtk.jpg",
    link: "/products/women",
  },
  {
    id: "kids",
    title: "Kids' Collection",
    subtitle: "Fun & Playful",
    image: "https://res.cloudinary.com/dgzj1itlu/image/upload/v1764819306/manufactured-by-fayon-kids-noida-u-p-white-waist-coat-with-pant-and-shirt-for-boys-40946021368064_cb6m8x.jpg",
    link: "/products/kids",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-16 md:py-24 bg-[#e6d8b2]/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Shop By Category</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">For Everyone</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <span className="text-[#e6d8b2] text-sm font-medium">{category.subtitle}</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">{category.title}</h3>
                <div className="flex items-center gap-2 mt-4 text-white font-medium group-hover:gap-3 transition-all">
                  <span>Shop Now</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
