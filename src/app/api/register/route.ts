import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createVerifyToken } from "@/lib/participantAuth";
import { sendParticipantVerifyLink } from "@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email required." }, { status: 400 });
  }

  const clean = email.toLowerCase().trim();
  const db = supabaseAdmin();

  const { data: existing } = await db
    .from("participants")
    .select("id")
    .eq("email", clean)
    .single();

  if (existing) {
    // Never silently resume someone else's passport under a "register" action.
    // Send them to sign in instead, where the existing verified/unverified
    // state is handled explicitly.
    return NextResponse.json(
      { error: "This email is already registered. Please sign in instead." },
      { status: 409 }
    );
  }

  const { data, error } = await db
    .from("participants")
    .insert({ name: name.trim(), email: clean })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const token = createVerifyToken(data.id);
  const verifyUrl = `${BASE_URL}/verify?token=${encodeURIComponent(token)}`;
  await sendParticipantVerifyLink(clean, name.trim(), verifyUrl);

  return NextResponse.json({ id: data.id, pendingVerification: true });
}
