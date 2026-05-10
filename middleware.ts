import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow new login page to be accessed without auth
  if (pathname === "/auth/admin-login") {
    return NextResponse.next();
  }

  // Redirect old login path to new one
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/auth/admin-login", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/admin-login"],
  runtime: "nodejs",
};
