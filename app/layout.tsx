import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { getCategories } from "@/lib/db/categories"
import { recordVisit } from "@/lib/actions/analytics"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "LegStar - Premium Comfort Wear",
  description:
    "Discover premium quality innerwear and comfort clothing for Men, Women, and Kids at LegStar. Experience unmatched comfort and style.",
  keywords: ["innerwear", "comfort wear", "clothing", "men", "women", "kids", "LegStar"],
    generator: 'v0.app'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const allCategories = await getCategories() 
  const serializedCategories = JSON.parse(JSON.stringify(allCategories))

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "unknown";
  
  // Record the visit (don't 'await' if you don't want to slow down page load)
  recordVisit(ip, userAgent).catch(err => console.error("Visit tracking error:", err));

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
          <CartProvider>
            <Header allCategories={serializedCategories} />
            {children}
            <Toaster />
          </CartProvider>
          {/* <Analytics /> */}
        </body>
      </html>
    </ClerkProvider>
  )
}
