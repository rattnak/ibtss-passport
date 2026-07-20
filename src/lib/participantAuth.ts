import { createSignedToken, verifySignedToken } from "./signedToken";

// Participant registration is verified once via a magic link emailed at
// sign-up. After that, the browser's existing localStorage session (see
// src/lib/session.tsx) is trusted for the rest of the event — this token
// only guards the one-time "activate my passport" step, not every sign-in.

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // registration link valid for 24 hours

export function createVerifyToken(participantId: string): string {
  return createSignedToken(participantId, VERIFY_TTL_MS);
}

export function verifyParticipantToken(token: string): { ok: true; participantId: string } | { ok: false; error: string } {
  const result = verifySignedToken(token);
  if (!result.ok) return result;
  return { ok: true, participantId: result.value };
}
