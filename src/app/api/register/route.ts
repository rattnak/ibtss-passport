import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email required." }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Upsert: if email already exists, return the existing participant
  const { data: existing } = await db
    .from("participants")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (existing) {
    return NextResponse.json({ id: existing.id });
  }

  const { data, error } = await db
    .from("participants")
    .insert({ name: name.trim(), email: email.toLowerCase().trim() })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
