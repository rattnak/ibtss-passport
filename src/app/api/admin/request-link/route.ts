import { NextRequest, NextResponse } from "next/server";
import { createMagicLinkToken, isAllowedAdminEmail } from "@/lib/adminAuth";
import { sendAdminMagicLink } from "@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  const clean = email.toLowerCase().trim();

  // Always return the same response whether or not the email is authorized,
  // so this endpoint can't be used to enumerate the admin allowlist.
  if (isAllowedAdminEmail(clean)) {
    const token = createMagicLinkToken(clean);
    const verifyUrl = `${BASE_URL}/admin/verify?token=${encodeURIComponent(token)}`;
    try {
      const result = await sendAdminMagicLink(clean, verifyUrl);
      if (result?.error) {
        // Log server-side only — the client response stays identical either way.
        console.error("[admin/request-link] Resend returned an error:", result.error);
      }
    } catch (err) {
      console.error("[admin/request-link] Failed to send magic link email:", err);
    }
  } else {
    console.warn("[admin/request-link] Sign-in requested for non-allowlisted email:", clean);
  }

  return NextResponse.json({ ok: true });
}
