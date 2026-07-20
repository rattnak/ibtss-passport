"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserCircle2 } from "lucide-react";
import { useSession } from "@/lib/session";

// Show just the first name in the top bar so it never gets clipped on
// small screens — assumes registration follows "First Last" order.
function firstName(fullName: string | null): string | null {
  if (!fullName) return null;
  return fullName.trim().split(/\s+/)[0] || null;
}

export default function TopBar() {
  const pathname = usePathname() ?? "/";
  const { email, name } = useSession();
  const displayName = firstName(name) ?? email;

  if (pathname.startsWith("/admin")) return null;

  const onPassportPage = pathname.startsWith("/passport/");

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--fhsu-black)",
        borderBottom: "3px solid var(--fhsu-gold)",
        display: "flex", justifyContent: "center",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 672, minHeight: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 14px", gap: 10,
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 44, alignSelf: "stretch" }}>
          <span style={{ color: "var(--fhsu-gold)", fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>FHSU</span>
          <span className="topbar-sub" style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>IBTSS 2026</span>
        </Link>

        {email ? (
          <Link
            href="/my-passport"
            aria-label={`${name ?? email} — open my passport`} // full name for screen readers
            style={{
              display: "flex", alignItems: "center", gap: 6, minWidth: 0, minHeight: 40,
              textDecoration: "none", padding: "6px 10px", borderRadius: 10,
              background: "rgba(247,168,0,0.14)",
            }}
          >
            <UserCircle2 size={17} color="var(--fhsu-gold)" aria-hidden="true" style={{ flexShrink: 0 }} />
            <span className="topbar-name" style={{ color: "white", fontSize: 13, fontWeight: 700 }}>
              {displayName}
            </span>
          </Link>
        ) : onPassportPage ? null : (
          <Link
            href="/my-passport"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--fhsu-gold)", textDecoration: "none",
              color: "var(--fhsu-black)", borderRadius: 10,
              padding: "9px 14px", minHeight: 40, fontSize: 13, fontWeight: 700,
            }}
          >
            <LogIn size={14} aria-hidden="true" /> Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
