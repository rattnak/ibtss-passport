import { createHmac, timingSafeEqual } from "crypto";

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

const SECRET = process.env.ADMIN_TOKEN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-secret-change-me";
const LINK_TTL_MS = 15 * 60 * 1000; // magic link valid for 15 minutes
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // admin session valid for 8 hours
export const ADMIN_COOKIE = "ibtss_admin_session";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Email addresses can contain dots (e.g. "first.last@fhsu.edu"), so a naive
// `.split(".")` on "email.expiresAt.sig" breaks. The signature (base64url)
// and timestamp (digits) never contain a dot, so peel them off from the
// right instead and leave whatever remains as the email.
function splitSignedPayload(decoded: string): [string, string, string] | null {
  const sigIdx = decoded.lastIndexOf(".");
  if (sigIdx === -1) return null;
  const sig = decoded.slice(sigIdx + 1);
  const rest = decoded.slice(0, sigIdx);

  const tsIdx = rest.lastIndexOf(".");
  if (tsIdx === -1) return null;
  const expiresAtStr = rest.slice(tsIdx + 1);
  const email = rest.slice(0, tsIdx);

  if (!email || !expiresAtStr || !sig) return null;
  return [email, expiresAtStr, sig];
}

// ── Magic link token: emailed to the facilitator, single use within TTL ──
export function createMagicLinkToken(email: string): string {
  const payload = `${email.toLowerCase().trim()}.${Date.now() + LINK_TTL_MS}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyMagicLinkToken(token: string): { ok: true; email: string } | { ok: false; error: string } {
  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return { ok: false, error: "Malformed link." };
  }
  const parts = splitSignedPayload(decoded);
  if (!parts) return { ok: false, error: "Malformed link." };
  const [email, expiresAtStr, sig] = parts;
  const payload = `${email}.${expiresAtStr}`;
  const expected = sign(payload);
  if (!safeEqual(sig, expected)) return { ok: false, error: "Invalid or tampered link." };
  if (Date.now() > Number(expiresAtStr)) return { ok: false, error: "This link has expired. Request a new one." };
  if (!isAllowedAdminEmail(email)) return { ok: false, error: "This email is not authorized for admin access." };
  return { ok: true, email };
}

// ── Session token: stored in an httpOnly cookie after successful verification ──
export function createSessionToken(email: string): string {
  const payload = `${email.toLowerCase().trim()}.${Date.now() + SESSION_TTL_MS}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySessionToken(token: string | undefined): { ok: true; email: string } | { ok: false } {
  if (!token) return { ok: false };
  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return { ok: false };
  }
  const parts = splitSignedPayload(decoded);
  if (!parts) return { ok: false };
  const [email, expiresAtStr, sig] = parts;
  const payload = `${email}.${expiresAtStr}`;
  const expected = sign(payload);
  if (!safeEqual(sig, expected)) return { ok: false };
  if (Date.now() > Number(expiresAtStr)) return { ok: false };
  if (!isAllowedAdminEmail(email)) return { ok: false };
  return { ok: true, email };
}
