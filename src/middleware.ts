import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/adminAuth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public admin routes: the login page and the magic-link verifier itself.
  if (pathname === "/admin/login" || pathname === "/admin/verify") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!session.ok) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
  runtime: "nodejs",
};
