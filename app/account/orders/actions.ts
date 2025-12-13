// app/orders/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { Order } from "@/lib/types" // Assuming you have a type for Order
import { ObjectId } from "mongodb"
import { currentUser } from "@clerk/nextjs/server"
import { getDb } from "@/lib/mongodb"
import { cancelOrder } from "@/lib/shiprocket"

// This is the function you provided
export const deleteOrderFromDb = async (id: string, userId: string) => {
  const db = await getDb()
  const collection = db.collection<Order>("orders")
  // Important: Also check if the order belongs to the user trying to delete it for security
  return collection.deleteOne({ orderId: id, userId: userId })
}

// This is the server action that our button will call
export async function deleteOrderAction(orderId: string) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be logged in to delete an order.")
  }
  
  try {
    const result = await deleteOrderFromDb(orderId, user.id)
    if (result.deletedCount === 0) {
        throw new Error("Order not found or you do not have permission to delete it.")
    }

    const result2 = await cancelOrder(orderId)
    if (!result2.success) {
        console.warn("Failed to cancel order in Shiprocket:", result2.message)
    }

    revalidatePath("/orders") // This tells Next.js to refetch the data for the orders page
    return { success: true, message: "Order deleted successfully." }

  } catch (error) {
    console.error("Failed to delete order:", error)
    // In a real app, you might want to return a more user-friendly error message
    return { success: false, message: "Failed to delete the order." }
  }
}