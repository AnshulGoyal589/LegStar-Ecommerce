import { getAllOrders } from "@/lib/db/orders"
import OrdersClient from "./orders-client"
  
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data))
}

export default async function OrdersPage() {
  
  const { orders, total } = await getAllOrders({
    limit: 10,
    skip: 0
  })

  const serializedOrders = serializeData(orders)

  return (
    <OrdersClient 
      initialOrders={serializedOrders} 
      initialTotal={total} 
    />
  )
}