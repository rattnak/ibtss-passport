import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getStation } from "@/lib/stations";
import { sendStationResources, sendCompletionEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { participantId, stationId } = await req.json();

  if (!participantId || !stationId) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const station = getStation(stationId);
  if (!station) {
    return NextResponse.json({ error: "Invalid station." }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { data: participant } = await db
    .from("participants")
    .select("id, name, email")
    .eq("id", participantId)
    .single();

  if (!participant) {
    return NextResponse.json({ error: "Participant not found." }, { status: 404 });
  }

  // Insert stamp (ignore duplicate)
  const { error: stampError } = await db
    .from("stamps")
    .insert({ participant_id: participantId, station_id: stationId });

  const alreadyStamped = stampError?.code === "23505";
  if (stampError && !alreadyStamped) {
    return NextResponse.json({ error: stampError.message }, { status: 500 });
  }

  // Send station resource email (only on first stamp)
  if (!alreadyStamped) {
    await sendStationResources(participant.email, participant.name, station);
  }

  // Check completion
  const { data: progress } = await db
    .from("passport_progress")
    .select("stamps_collected, is_complete")
    .eq("id", participantId)
    .single();

  const isComplete = progress?.is_complete ?? false;
  const stampsCollected = progress?.stamps_collected ?? 0;

  if (isComplete && !alreadyStamped) {
    await sendCompletionEmail(participant.email, participant.name, participantId);
  }

  return NextResponse.json({
    success: true,
    alreadyStamped,
    stampsCollected,
    isComplete,
  });
}
