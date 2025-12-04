import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/account(.*)", "/checkout(.*)", "/orders(.*)"])
// const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // Protect account, checkout, and orders routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // if (isAdminRoute(req)) {
  //   const { userId } = await auth.protect()

  //   const adminIds = process.env.ADMIN_CLERK_IDS?.split(",").map((id) => id.trim()) || []

  //   if (!adminIds.includes(userId)) {
  //     return NextResponse.redirect(new URL("/", req.url))
  //   }
  // }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
