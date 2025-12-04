"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Category } from "@/lib/types"
import debounce from "lodash.debounce"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Cream", hex: "#E6D8B2" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Blue", hex: "#3B82F6" },
]

interface ProductFiltersProps {
  categories?: Category[]
  className?: string
}

export function ProductFilters({ categories, className }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL search params to persist selections on refresh
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || [],
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 5000,
  ])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.get("sizes")?.split(",") || [])
  const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.get("colors")?.split(",") || [])

  // Debounced function to update URL to avoid excessive re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateUrl = useCallback(
    debounce((filters) => {
      const params = new URLSearchParams(searchParams.toString())

      // Helper function to set or delete a parameter
      const setOrDelete = (key: string, value: string) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }

      setOrDelete("categories", filters.categories.join(","))
      setOrDelete("sizes", filters.sizes.join(","))
      setOrDelete("colors", filters.colors.join(","))

      if (filters.price[0] > 0) params.set("minPrice", filters.price[0].toString())
      else params.delete("minPrice")
      if (filters.price[1] < 5000) params.set("maxPrice", filters.price[1].toString())
      else params.delete("maxPrice")

      // Use router.push to trigger re-render of the server component page
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, 500), // 500ms delay is good for sliders
    [pathname, router, searchParams],
  )

  // Effect to watch for filter changes and call the debounced update function
  useEffect(() => {
    debouncedUpdateUrl({
      categories: selectedCategories,
      price: priceRange,
      sizes: selectedSizes,
      colors: selectedColors,
    })
    // Cleanup the debounced function on unmount
    return () => debouncedUpdateUrl.cancel()
  }, [selectedCategories, priceRange, selectedSizes, selectedColors, debouncedUpdateUrl])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange([newRange[0], newRange[1]])
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 5000])
    setSelectedSizes([])
    setSelectedColors([])
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            Clear all
            <X className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "size", "color"]} className="space-y-4">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <AccordionItem value="categories" className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">Categories</AccordionTrigger>
            <AccordionContent className="pb-4 pt-2">
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      id={category._id}
                      checked={selectedCategories.includes(category._id)}
                      onCheckedChange={() => toggleCategory(category._id)}
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range */}
        <AccordionItem value="price" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline">Price Range</AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4 pt-2">
              <Slider value={priceRange} onValueChange={handlePriceChange} max={5000} step={100} />
              <div className="flex items-center justify-between text-sm">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline">Size</AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={cn(
                    "h-9 min-w-[40px] px-3 rounded border text-sm font-medium transition-colors",
                    selectedSizes.includes(size)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline">Color</AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all",
                    selectedColors.includes(color.name) ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110",
                  )}
                  style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#e5e7eb' : 'transparent' }}
                  title={color.name}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}