import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyParticipantToken } from "@/lib/participantAuth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const result = verifyParticipantToken(token ?? "");

  if (!result.ok) {
    const url = new URL("/my-passport", req.url);
    url.searchParams.set("verifyError", result.error);
    return NextResponse.redirect(url);
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("participants")
    .update({ verified_at: new Date().toISOString() })
    .eq("id", result.participantId)
    .is("verified_at", null) // idempotent: only set once
    .select("id")
    .single();

  // If already verified (no row matched the .is() filter), that's fine —
  // fall through and send them to their passport either way.
  if (error && error.code !== "PGRST116") {
    const url = new URL("/my-passport", req.url);
    url.searchParams.set("verifyError", "Something went wrong confirming your passport.");
    return NextResponse.redirect(url);
  }

  const url = new URL(`/passport/${result.participantId}`, req.url);
  url.searchParams.set("justVerified", "1");
  return NextResponse.redirect(url);
}
