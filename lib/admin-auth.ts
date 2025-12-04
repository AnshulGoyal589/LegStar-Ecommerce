import { auth, currentUser } from "@clerk/nextjs/server"

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth()

  if (!userId) return false

  const adminIds = process.env.ADMIN_CLERK_IDS?.split(",").map((id) => id.trim()) || []
  return adminIds.includes(userId)
}

export async function requireAdmin(): Promise<{ userId: string; isAdmin: true }> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized: Not authenticated")
  }

  const adminIds = process.env.ADMIN_CLERK_IDS?.split(",").map((id) => id.trim()) || []

  if (!adminIds.includes(userId)) {
    throw new Error("Forbidden: Admin access required")
  }

  return { userId, isAdmin: true }
}

export async function getAdminUser() {
  const user = await currentUser()
  if (!user) return null

  const adminIds = process.env.ADMIN_CLERK_IDS?.split(",").map((id) => id.trim()) || []

  if (!adminIds.includes(user.id)) return null

  return user
}
