import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, verifyMagicLinkToken, ADMIN_COOKIE, SESSION_TTL_MS } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const result = verifyMagicLinkToken(token ?? "");

  if (!result.ok) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", result.error);
    return NextResponse.redirect(url);
  }

  const sessionToken = createSessionToken(result.email);
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set(ADMIN_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
  return res;
}
