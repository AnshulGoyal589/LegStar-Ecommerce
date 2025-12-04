
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductSort } from "@/components/products/product-sort"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getCategories } from "@/lib/db/categories"
import { getProducts } from "@/lib/db/products"
import type { Product } from "@/lib/types"
import { SlidersHorizontal } from "lucide-react"
import Link from "next/link"

const getAsArray = (value: string | string[] | undefined): string[] | undefined => {
  if (value === undefined) {
    return undefined
  }
  if (Array.isArray(value)) {
    return value
  }
  return value.split(",")
}

// This is the main Server Component
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const searchParam = await searchParams
  // 1. Use the robust helper function to parse all array-based filters.
  const filters = {
    categories: getAsArray(searchParam.categories),
    sizes: getAsArray(searchParam.sizes),
    colors: getAsArray(searchParam.colors),
    minPrice: searchParam.minPrice ? Number(searchParam.minPrice) : undefined,
    maxPrice: searchParam.maxPrice ? Number(searchParam.maxPrice) : undefined,
    sort: typeof searchParam.sort === "string" ? searchParam.sort : "newest",
  }

  // 2. Fetch products and categories using the parsed filters.
  const [{ products, total }, allCategories] = await Promise.all([getProducts(filters), getCategories()])

  // 3. Serialize data to safely pass from Server to Client Components.
  const serializedProducts = JSON.parse(JSON.stringify(products))
  const serializedCategories = JSON.parse(JSON.stringify(allCategories))

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">All Products</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters (Client Component) */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <ProductFilters categories={serializedCategories} />
            </aside>

            {/* Products Section */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold">All Products</h1>
                  <p className="text-sm text-muted-foreground mt-1">{total} products found</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
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

                  {/* Sort Dropdown (Client Component) */}
                  <ProductSort />
                </div>
              </div>

              {/* Product Grid or "No Results" Message */}
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

              {/* Load More Button (conditionally rendered) */}
              {total > products.length && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Products
                  </Button>
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