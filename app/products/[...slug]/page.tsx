
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductSort } from "@/components/products/product-sort"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import type { Product } from "@/lib/types"
import { ProductDetail } from "@/components/products/product-detail"
import { getCategories } from "@/lib/db/categories"
import { getProducts, getProductBySlug } from "@/lib/db/products" // Import both functions
import Link from "next/link"

const getAsArray = (value: string | string[] | undefined): string[] | undefined => {
  if (value === undefined) return undefined
  if (Array.isArray(value)) return value
  return value.split(",")
}

export default async function ProductCatchAllPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const searchParam = await searchParams

  const potentialProductSlug = slug.join("-")
  const [product, allCategories] = await Promise.all([getProductBySlug(potentialProductSlug), getCategories()])

  const serializedCategories = JSON.parse(JSON.stringify(allCategories))

  if (product) {
    const { products: relatedProducts } = await getProducts({
      gender: product.gender,
      limit: 4,
    })

    const filteredRelated = relatedProducts.filter((p) => p._id !== product._id)
    const serializedProduct = JSON.parse(JSON.stringify(product))

    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <ProductDetail product={serializedProduct} relatedProducts={filteredRelated} />
        </main>
        <Footer />
      </div>
    )
  }

  // 1. Parse slugs and searchParams to build a single filter object
  const [gender, category, subcategory] = slug
  const filters = {
    gender: gender,
    categorySlug: category,
    subcategorySlug: subcategory, // Assumes your getProducts can handle this
    categories: getAsArray(searchParam.categories),
    sizes: getAsArray(searchParam.sizes),
    colors: getAsArray(searchParam.colors),
    minPrice: searchParam.minPrice ? Number(searchParam.minPrice) : undefined,
    maxPrice: searchParam.maxPrice ? Number(searchParam.maxPrice) : undefined,
    sort: typeof searchParam.sort === "string" ? searchParam.sort : "newest",
  }

  // 2. Fetch products based on the combined filters
  const { products, total } = await getProducts(filters)
  const serializedProducts = JSON.parse(JSON.stringify(products))

  // 3. Generate breadcrumbs and page title dynamically
  const breadcrumbs = [{ label: "Home", href: "/" }]
  let pageTitle = "All Products"

  if (gender) {
    pageTitle = `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`
    breadcrumbs.push({ label: pageTitle, href: `/products/${gender}` })
  }
  if (category) {
    const categoryName = category.replace("-", " ")
    pageTitle = categoryName
    breadcrumbs.push({ label: categoryName, href: `/products/${gender}/${category}` })
  }
  if (subcategory) {
    const subcategoryName = subcategory.replace("-", " ")
    pageTitle = subcategoryName
    breadcrumbs.push({ label: subcategoryName, href: `/products/${gender}/${category}/${subcategory}` })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2 capitalize">
                  {i > 0 && <span>/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-foreground">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-foreground">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-64 flex-shrink-0">
              <ProductFilters categories={serializedCategories} />
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold capitalize">{pageTitle}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{total} products found</p>
                </div>
                <div className="flex items-center gap-3">
                  <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <ProductFilters categories={serializedCategories} className="mt-6" />
                    </SheetContent>
                  </Sheet>
                  <ProductSort />
                </div>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {serializedProducts.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed rounded-lg">
                  <h2 className="text-2xl font-bold tracking-tight">No products found</h2>
                  <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}