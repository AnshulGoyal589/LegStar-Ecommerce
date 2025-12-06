import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="bg-[#e6d8b2] text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-serif font-bold">Stay in the Loop</h3>
              <p className="text-muted-foreground mt-1">Subscribe for exclusive offers and updates</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input type="email" placeholder="Enter your email" className="bg-card border-border md:w-80" />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold">
                LEG<span className="text-[#e6d8b2]">STAR</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80 leading-relaxed">
              Premium comfort wear for the modern individual. Experience unmatched quality and style with LegStar.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="#" className="hover:text-[#e6d8b2] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#e6d8b2] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#e6d8b2] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-[#e6d8b2] transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>
                <Link href="/products/men" className="hover:text-[#e6d8b2] transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/products/women" className="hover:text-[#e6d8b2] transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/products/kids" className="hover:text-[#e6d8b2] transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#e6d8b2] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#e6d8b2] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-[#e6d8b2] transition-colors">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-medium text-lg mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>
                <Link href="/contact" className="hover:text-[#e6d8b2] transition-colors">
                  Contact & FAQ
                </Link>
              </li>
              <li>
                <Link href="/refund-cancellation" className="hover:text-[#e6d8b2] transition-colors">
                  Refund Cancellation
                </Link>
              </li>
              <li>
                <Link href="/return-exchange" className="hover:text-[#e6d8b2] transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#e6d8b2] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2025 LegStar. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <img src="/placeholder.svg?height=24&width=40" alt="Visa" className="h-6" />
              <img src="/placeholder.svg?height=24&width=40" alt="Mastercard" className="h-6" />
              <img src="/placeholder.svg?height=24&width=40" alt="RuPay" className="h-6" />
              <img src="/placeholder.svg?height=24&width=40" alt="UPI" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
