import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("participants")
    .select("id, name, verified_at")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ id: data.id, name: data.name, verified: !!data.verified_at });
}
