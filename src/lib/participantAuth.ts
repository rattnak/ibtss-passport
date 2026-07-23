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

// A device that never signed in on this browser before must confirm via
// email — same token shape as registration, shorter-lived since it's just
// re-confirming an already-verified participant, not activating a new one.
const DEVICE_LINK_TTL_MS = 15 * 60 * 1000; // device confirm link valid for 15 minutes

export function createDeviceToken(participantId: string): string {
  return createSignedToken(participantId, DEVICE_LINK_TTL_MS);
}

export function verifyDeviceToken(token: string): { ok: true; participantId: string } | { ok: false; error: string } {
  const result = verifySignedToken(token);
  if (!result.ok) return result;
  return { ok: true, participantId: result.value };
}
