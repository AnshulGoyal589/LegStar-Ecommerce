import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/account(.*)", "/checkout(.*)", "/orders(.*)"])
// const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // Protect account, checkout, and orders routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
