import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getToolkitSection } from "@/lib/toolkit";

async function findParticipant(db: ReturnType<typeof supabaseAdmin>, email: string) {
  const { data } = await db
    .from("participants")
    .select("id, name")
    .eq("email", email.toLowerCase().trim())
    .single();
  return data;
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const sectionId = req.nextUrl.searchParams.get("section");
  if (!email || !sectionId) {
    return NextResponse.json({ error: "Email and section required." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const participant = await findParticipant(db, email);
  if (!participant) {
    return NextResponse.json({ error: "No passport found for this email." }, { status: 404 });
  }

  const { data } = await db
    .from("toolkit_responses")
    .select("responses")
    .eq("participant_id", participant.id)
    .eq("section_id", sectionId)
    .single();

  return NextResponse.json({ name: participant.name, responses: data?.responses ?? {} });
}

export async function POST(req: NextRequest) {
  const { email, section, responses } = await req.json();
  if (!email || !section || typeof responses !== "object") {
    return NextResponse.json({ error: "Email, section, and responses required." }, { status: 400 });
  }
  if (!getToolkitSection(section)?.interactive) {
    return NextResponse.json({ error: "Unknown or read-only section." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const participant = await findParticipant(db, email);
  if (!participant) {
    return NextResponse.json({ error: "No passport found for this email. Please register first." }, { status: 404 });
  }

  const { error } = await db
    .from("toolkit_responses")
    .upsert(
      { participant_id: participant.id, section_id: section, responses, updated_at: new Date().toISOString() },
      { onConflict: "participant_id,section_id" }
    );

  if (error) {
    return NextResponse.json({ error: "Could not save responses." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
