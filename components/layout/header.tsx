"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { CartSheet } from "@/components/cart/cart-sheet"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"

export interface CategoryClient {
  _id: string
  name: string
  slug: string
  parentId?: string | null
  gender?: "men" | "women" | "kids"
  order: number
}

interface Subcategory {
  name: string
  slug: string
}
interface TopLevelCategory {
  name: string
  slug: string
  subcategories: Subcategory[]
}
interface StructuredCategories {
  men: { categories: TopLevelCategory[] }
  women: { categories: TopLevelCategory[] }
  kids: { categories: TopLevelCategory[] }
}

function structureCategories(allCategories: CategoryClient[]): StructuredCategories {
  const structured: StructuredCategories = {
    men: { categories: [] },
    women: { categories: [] },
    kids: { categories: [] },
  }
  const categoryMap: { [key: string]: TopLevelCategory } = {}

  // First pass: Identify and place all top-level categories (no parentId)
  allCategories.forEach((cat) => {
    if (!cat.parentId && cat.gender) {
      const topLevelCat: TopLevelCategory = {
        name: cat.name,
        slug: cat.slug,
        subcategories: [],
      }
      structured[cat.gender].categories.push(topLevelCat)
      categoryMap[cat._id] = topLevelCat
    }
  })

  // Second pass: Place subcategories under their respective parents
  allCategories.forEach((cat) => {
    if (cat.parentId) {
      const parent = categoryMap[cat.parentId]
      if (parent) {
        parent.subcategories.push({ name: cat.name, slug: cat.slug })
      }
    }
  })

  return structured
}

export function Header({ allCategories }: { allCategories: CategoryClient[] }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { itemCount } = useCart()
  const { user } = useUser()

  const structuredCategories = useMemo(() => structureCategories(allCategories), [allCategories])

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <span>Free Shipping on orders above ₹999</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Easy 30-day Returns</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
                <SignedIn>
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <UserButton afterSignOutUrl="/" />
                    <div>
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </div>
                </SignedIn>
                <SignedOut>
                  <div className="flex gap-2 pb-4 border-b">
                    <Button asChild className="flex-1">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href="/sign-up">Sign Up</Link>
                    </Button>
                  </div>
                </SignedOut>

                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                {Object.entries(structuredCategories).map(([gender, data]) => (
                  <div key={gender} className="space-y-2">
                    <Link href={`/products/${gender}`} className="text-lg font-medium capitalize">
                      {gender}
                    </Link>
                    {data.categories.map((cat:any) => (
                      <div key={cat.slug} className="pl-4 space-y-1">
                        <Link
                          href={`/products/${gender}/${cat.slug}`}
                          className="text-sm font-medium text-muted-foreground block"
                        >
                          {cat.name}
                        </Link>
                        {cat.subcategories.map((sub:any) => (
                          <Link
                            key={sub.slug}
                            href={`/products/${gender}/${cat.slug}/${sub.slug}`}
                            className="block text-sm pl-4 py-1 hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
                {/* ... other static links */}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              LEG<span className="text-[#e6d8b2]">STAR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {Object.entries(structuredCategories).map(([gender, data]) => (
              <div
                key={gender}
                className="relative"
                onMouseEnter={() => setHoveredCategory(gender)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href={`/products/${gender}`}
                  className="flex items-center gap-1 text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors py-6"
                >
                  {gender}
                  <ChevronDown className="h-4 w-4" />
                </Link>

                {/* Mega Menu */}
                {hoveredCategory === gender && data.categories.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-card border border-border shadow-lg p-6 rounded-lg">
                    <div className="grid grid-cols-3 gap-8">
                      {data.categories.map((cat:any) => (
                        <div key={cat.slug}>
                          <Link
                            href={`/products/${gender}/${cat.slug}`}
                            className="font-medium text-sm uppercase tracking-wide hover:underline"
                          >
                            {cat.name}
                          </Link>
                          <ul className="mt-3 space-y-2">
                            {cat.subcategories.map((sub:any) => (
                              <li key={sub.slug}>
                                <Link
                                  href={`/products/${gender}/${cat.slug}/${sub.slug}`}
                                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-border">
                      <Link href={`/products/${gender}`} className="text-sm font-medium hover:underline">
                        View All {gender.charAt(0).toUpperCase() + gender.slice(1)}&apos;s Collection →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/best-sellers"
              className="text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors"
            >
              Best Sellers
            </Link>
            <Link
              href="/new-collection"
              className="text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors"
            >
              New
            </Link>
             <Link
              href="/blogs"
              className="text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors"
            >
              Blogs
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
           
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="font-medium text-sm">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
            <SignedOut>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-up">Create Account</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedOut>
          </div>
        </div>
      </div>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  )
}