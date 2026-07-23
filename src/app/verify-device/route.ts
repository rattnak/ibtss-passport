import { NextRequest, NextResponse } from "next/server";
import { verifyDeviceToken } from "@/lib/participantAuth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const result = verifyDeviceToken(token ?? "");

  if (!result.ok) {
    const url = new URL("/my-passport", req.url);
    url.searchParams.set("verifyError", result.error);
    return NextResponse.redirect(url);
  }

  const url = new URL(`/passport/${result.participantId}`, req.url);
  url.searchParams.set("deviceVerified", "1");
  return NextResponse.redirect(url);
}
