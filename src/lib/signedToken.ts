import { createHmac, timingSafeEqual } from "crypto";

// Shared HMAC-signed, expiring token helpers used by both the admin
// magic-link flow and participant email verification.

const SECRET = process.env.ADMIN_TOKEN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-secret-change-me";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Values (email, uuid, etc.) can contain dots, so a naive split on "." breaks.
// The signature (base64url) and timestamp (digits) never contain a dot, so
// peel them off from the right instead and leave whatever remains as the value.
function splitSignedPayload(decoded: string): [string, string, string] | null {
  const sigIdx = decoded.lastIndexOf(".");
  if (sigIdx === -1) return null;
  const sig = decoded.slice(sigIdx + 1);
  const rest = decoded.slice(0, sigIdx);

  const tsIdx = rest.lastIndexOf(".");
  if (tsIdx === -1) return null;
  const expiresAtStr = rest.slice(tsIdx + 1);
  const value = rest.slice(0, tsIdx);

  if (!value || !expiresAtStr || !sig) return null;
  return [value, expiresAtStr, sig];
}

export function createSignedToken(value: string, ttlMs: number): string {
  const payload = `${value}.${Date.now() + ttlMs}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySignedToken(token: string): { ok: true; value: string } | { ok: false; error: string } {
  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return { ok: false, error: "Malformed link." };
  }
  const parts = splitSignedPayload(decoded);
  if (!parts) return { ok: false, error: "Malformed link." };
  const [value, expiresAtStr, sig] = parts;
  const payload = `${value}.${expiresAtStr}`;
  const expected = sign(payload);
  if (!safeEqual(sig, expected)) return { ok: false, error: "Invalid or tampered link." };
  if (Date.now() > Number(expiresAtStr)) return { ok: false, error: "This link has expired. Request a new one." };
  return { ok: true, value };
}
