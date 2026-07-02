"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, UserCircle2 } from "lucide-react";
import { useSession } from "@/lib/session";

export default function TopBar() {
  const pathname = usePathname() ?? "/";
  const { email, name, signOut } = useSession();

  if (pathname.startsWith("/admin")) return null;

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
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <Link
              href="/my-passport"
              aria-label={`${name ?? email} — open my passport`}
              style={{
                display: "flex", alignItems: "center", gap: 6, minWidth: 0, minHeight: 40,
                textDecoration: "none", padding: "6px 10px", borderRadius: 10,
                background: "rgba(247,168,0,0.14)",
              }}
            >
              <UserCircle2 size={17} color="var(--fhsu-gold)" aria-hidden="true" style={{ flexShrink: 0 }} />
              <span className="topbar-name" style={{ color: "white", fontSize: 13, fontWeight: 700 }}>
                {name ?? email}
              </span>
            </Link>
            <button
              onClick={signOut}
              aria-label={`Sign out ${name ?? email}`}
              title="Sign out"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "1px solid rgba(255,255,255,0.35)",
                color: "rgba(255,255,255,0.85)", borderRadius: 10,
                width: 40, minHeight: 40, cursor: "pointer", flexShrink: 0,
              }}
            >
              <LogOut size={14} aria-hidden="true" />
            </button>
          </div>
        ) : (
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
