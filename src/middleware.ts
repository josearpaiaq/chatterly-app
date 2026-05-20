import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// const isProtectedRoute = createRouteMatcher(["/api/generate"]);
// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect();
// });

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block API routes during maintenance
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Service under maintenance" },
      { status: 503 }
    );
  }

  // Redirect any non-root route to the maintenance page
  if (pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
