import { createSignedToken, verifySignedToken } from "./signedToken";

// Facilitators allowed to access /admin, comma-separated in env.
// e.g. ADMIN_ALLOWED_EMAILS="jeni.mcray@fhsu.edu,magdalene.moy@fhsu.edu"
export function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string): boolean {
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

const LINK_TTL_MS = 15 * 60 * 1000; // magic link valid for 15 minutes
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // admin session valid for 8 hours
export const ADMIN_COOKIE = "ibtss_admin_session";

// ── Magic link token: emailed to the facilitator, valid within TTL ──
export function createMagicLinkToken(email: string): string {
  return createSignedToken(email.toLowerCase().trim(), LINK_TTL_MS);
}

export function verifyMagicLinkToken(token: string): { ok: true; email: string } | { ok: false; error: string } {
  const result = verifySignedToken(token);
  if (!result.ok) return result;
  if (!isAllowedAdminEmail(result.value)) {
    return { ok: false, error: "This email is not authorized for admin access." };
  }
  return { ok: true, email: result.value };
}

// ── Session token: stored in an httpOnly cookie after successful verification ──
export function createSessionToken(email: string): string {
  return createSignedToken(email.toLowerCase().trim(), SESSION_TTL_MS);
}

export function verifySessionToken(token: string | undefined): { ok: true; email: string } | { ok: false } {
  if (!token) return { ok: false };
  const result = verifySignedToken(token);
  if (!result.ok) return { ok: false };
  if (!isAllowedAdminEmail(result.value)) return { ok: false };
  return { ok: true, email: result.value };
}
