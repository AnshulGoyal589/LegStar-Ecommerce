import { Package, ShoppingCart, Users, IndianRupee, ArrowUpRight, Eye, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/actions/dashboard" // Adjust import path

export default async function AdminDashboard() {
  const data = await getDashboardStats()

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue.toLocaleString('en-IN')}`,
      change: "Live Data", 
      trend: "up",
      icon: IndianRupee,
    },
    {
      title: "Total Orders",
      value: data.totalOrders.toString(),
      change: "Lifetime",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Total Products",
      value: data.totalProducts.toString(),
      change: "In Inventory",
      trend: "up",
      icon: Package,
    },
    {
      title: "Total Customers",
      value: data.totalCustomers.toString(),
      change: "Unique Emails",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Visitors",
      value: data.totalVisitors.toLocaleString(),
      change: `${data.todayVisitors} today`,
      trend: "up",
      icon: Eye,
    },
    {
        title: "Today's Visitors",
        value: data.todayVisitors.toString(),
        subtext: "Visitors today",
        icon: Activity,
        color: "text-orange-500",
        isLive: true
    },
    // {
    //   title: "Total Customers",
    //   value: data.totalCustomers.toString(),
    //   change: "Registered users",
    //   trend: "up",
    //   icon: Users,
    // },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {stat.change}
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
              {data.recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground">No orders found.</p>
              )}
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-[10px] text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "pending"
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
              {data.topProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">No sales data yet.</p>
              )}
              {data.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <p className="font-medium text-sm">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}