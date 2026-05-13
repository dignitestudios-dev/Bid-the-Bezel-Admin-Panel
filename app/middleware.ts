import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const PROTECTED_ROUTES = [
  "/profile",
  "/dashboard",
  "/seller",
  "/favorites",
  "/buy-now",
  "/buyer",
  "/chats",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
