import { getDb } from "@/lib/mongodb"
import { Order } from "../db/orders"

export async function getDashboardStats() {
  const db = await getDb()
  const ordersCol = db.collection<Order>("orders")
  const productsCol = db.collection("products")

  // 1. Get basic counts
  const totalProducts = await productsCol.countDocuments()
  const totalOrders = await ordersCol.countDocuments()
  
  // 2. Calculate Revenue (Sum of 'total' from paid orders)
  const revenueData = await ordersCol.aggregate([
    { $match: { paymentStatus: "paid" } },
    // { $match: { paymentStatus: "paid" | '' } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]).toArray()
  const totalRevenue = revenueData[0]?.total || 0

  // 3. Count Unique Customers
  const uniqueCustomers = await ordersCol.distinct("customerEmail")
  const totalCustomers = uniqueCustomers.length

  // 4. Get Recent Orders (Latest 5)
  const recentOrders = await ordersCol
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  // 5. Top Selling Products (Aggregation logic)
  const topProducts = await ordersCol.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        name: { $first: "$items.name" },
        sales: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    },
    { $sort: { sales: -1 } },
    { $limit: 5 }
  ]).toArray()

  
// 1. Total Unique Visitors (Lifetime)
// We count how many unique IPs have ever visited
const totalVisitors = await db.collection("visitors").distinct("ip").then(ips => ips.length);

// 2. Today's Visitors (Optional but cool)
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayVisitors = await db.collection("visitors").countDocuments({ date: today });

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    totalVisitors,
    todayVisitors,
    recentOrders: recentOrders.map(order => ({
        id: order.orderId,
        customer: order.customerName,
        amount: `₹${order.total.toLocaleString('en-IN')}`,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString()
    })),
    topProducts: topProducts.map(p => ({
        name: p.name,
        sales: p.sales,
        revenue: `₹${p.revenue.toLocaleString('en-IN')}`
    }))
  }
}