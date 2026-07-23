import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createDeviceToken } from "@/lib/participantAuth";
import { sendDeviceConfirmLink } from "@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  const clean = email.toLowerCase().trim();
  const db = supabaseAdmin();

  const { data } = await db
    .from("participants")
    .select("id, name, verified_at")
    .eq("email", clean)
    .single();

  // Same response whether or not the account exists, so this can't be used
  // to enumerate registered emails.
  if (!data || !data.verified_at) {
    return NextResponse.json({ ok: true });
  }

  const token = createDeviceToken(data.id);
  const confirmUrl = `${BASE_URL}/verify-device?token=${encodeURIComponent(token)}`;
  const sendResult = await sendDeviceConfirmLink(clean, data.name, confirmUrl);

  if (sendResult.error) {
    return NextResponse.json(
      { error: "Couldn't send the confirmation email. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
