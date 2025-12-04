import { Package, ShoppingCart, Users, IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Revenue",
    value: "₹4,52,340",
    change: "+12.5%",
    trend: "up",
    icon: IndianRupee,
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Total Products",
    value: "256",
    change: "+4",
    trend: "up",
    icon: Package,
  },
  {
    title: "Total Customers",
    value: "3,891",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
]

const recentOrders = [
  { id: "ORD-001", customer: "Rahul Sharma", amount: "₹1,299", status: "Delivered", date: "2024-01-15" },
  { id: "ORD-002", customer: "Priya Patel", amount: "₹2,499", status: "Processing", date: "2024-01-15" },
  { id: "ORD-003", customer: "Amit Kumar", amount: "₹899", status: "Shipped", date: "2024-01-14" },
  { id: "ORD-004", customer: "Sneha Gupta", amount: "₹3,199", status: "Pending", date: "2024-01-14" },
  { id: "ORD-005", customer: "Vikram Singh", amount: "₹1,599", status: "Delivered", date: "2024-01-13" },
]

const topProducts = [
  { name: "Classic Cotton Brief - 3 Pack", sales: 234, revenue: "₹1,17,000" },
  { name: "Premium Vest - White", sales: 189, revenue: "₹94,500" },
  { name: "Sports Trunk - Black", sales: 156, revenue: "₹78,000" },
  { name: "Kids Comfort Brief", sales: 145, revenue: "₹43,500" },
  { name: "Women's Camisole - Pack of 2", sales: 132, revenue: "₹79,200" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <p className="font-medium">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
