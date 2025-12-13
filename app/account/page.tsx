import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, Package, MapPin, Heart, CreditCard, Settings, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const menuItems = [
  { icon: Package, label: "My Orders", href: "/account/orders", description: "Track, return, or buy things again" },
  // { icon: MapPin, label: "Addresses", href: "/account/addresses", description: "Manage your delivery addresses" },
  // { icon: Heart, label: "Wishlist", href: "/account/wishlist", description: "Your saved items" },
  // { icon: CreditCard, label: "Payment Methods", href: "/account/payments", description: "Manage payment options" },
  // {
  //   icon: Settings,
  //   label: "Account Settings",
  //   href: "/account/settings",
  //   description: "Update your profile and preferences",
  // },
]

export default async function AccountPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">My Account</h1>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl || "/placeholder.svg"}
                    alt={user.firstName || ""}
                    width={64}
                    height={64}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
