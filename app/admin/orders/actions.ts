"use server"

import { getAllOrders } from "@/lib/db/orders"

// This helper ensures MongoDB Objects (like ObjectId and Date) are converted 
// to plain strings/JSON so they can be passed to the Client Component.
function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data))
}

export async function fetchOrdersAction(options: {
  status?: string
  limit?: number
  skip?: number
}) {
  try {
    const { orders, total } = await getAllOrders(options)
    
    // Serialize data to prevent "Only plain objects can be passed to Client Components" error
    return {
      orders: serializeData(orders),
      total
    }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { orders: [], total: 0 }
  }
}