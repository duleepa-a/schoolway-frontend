import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get JWT token safely in both dev and production
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = request.nextUrl;

  // 🔍 Debug logs (optional — remove after testing)
  // console.log("Middleware: TOKEN =", token);
  // console.log("Middleware: PATH =", pathname);

  // Redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = token.role;

  // Role-based protection
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/vanowner") && role !== "SERVICE") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/parent") && role !== "PARENT") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vanowner/:path*",
    "/parent/:path*",
  ],
};
