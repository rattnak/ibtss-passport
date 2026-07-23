import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";

// Server-enforced gate: the PDFs live outside public/ (private-assets/), so
// they aren't reachable by a guessed static URL — this route is the only
// way to fetch them, and it requires a verified participant email.
const FILES: Record<string, { file: string; downloadName: string }> = {
  worksheet: { file: "Worksheet.pdf", downloadName: "IBTSS-2026-Worksheet.pdf" },
  toolkit: { file: "Participant-Toolkit.pdf", downloadName: "IBTSS-2026-Participant-Toolkit.pdf" },
};

export async function GET(req: NextRequest) {
  const which = req.nextUrl.searchParams.get("which") ?? "";
  const email = req.nextUrl.searchParams.get("email") ?? "";
  const entry = FILES[which];

  if (!entry) {
    return NextResponse.json({ error: "Unknown file." }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const db = supabaseAdmin();
  const { data } = await db
    .from("participants")
    .select("id, verified_at")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (!data || !data.verified_at) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let bytes: Buffer;
  try {
    bytes = await readFile(path.join(process.cwd(), "private-assets", entry.file));
  } catch {
    return NextResponse.json({ error: "File not available yet." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${entry.downloadName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
