"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Stamp, NotebookPen, BookOpen } from "lucide-react";

const TABS = [
  { href: "/", label: "Agenda", icon: CalendarDays, match: (p: string) => p === "/" },
  { href: "/stations", label: "Stations", icon: Stamp, match: (p: string) => p.startsWith("/stations") || p.startsWith("/stamp") },
  { href: "/toolkit", label: "Toolkit", icon: NotebookPen, match: (p: string) => p.startsWith("/toolkit") },
  { href: "/my-passport", label: "Passport", icon: BookOpen, match: (p: string) => p.startsWith("/my-passport") || p.startsWith("/passport") },
];

export default function BottomNav() {
  // Visibility is decided by AppShell so the reserved bottom padding stays in sync.
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "center",
        background: "white",
        borderTop: "1px solid #E5E5E5",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div style={{ display: "flex", width: "100%", maxWidth: 672, height: 64 }}>
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              style={{
                flex: 1, minWidth: 44, minHeight: 44,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 4, textDecoration: "none", position: "relative", paddingTop: 4,
              }}
            >
              {active && (
                <span aria-hidden="true" style={{
                  position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: 32, height: 3, background: "var(--fhsu-gold)", borderRadius: "0 0 4px 4px",
                }} />
              )}
              <span style={{
                width: 36, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, background: active ? "rgba(247,168,0,0.18)" : "transparent",
              }}>
                <Icon size={21} strokeWidth={active ? 2.2 : 1.8} color={active ? "var(--fhsu-black)" : "#767676"} aria-hidden="true" />
              </span>
              <span style={{
                fontSize: 10.5, lineHeight: 1,
                fontWeight: active ? 700 : 500,
                color: active ? "var(--fhsu-black)" : "#767676",
              }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
