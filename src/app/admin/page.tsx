"use client";

import Link from "next/link";
import { BookOpen, Settings2, Search, ArrowRight, LogOut, ShieldCheck } from "lucide-react";
import { STATIONS } from "@/lib/stations";

const STATION_ICONS = [BookOpen, Settings2, Search];
const STATION_COLORS = [
  { color: "#1E7167", bg: "rgba(42,157,143,0.12)" },
  { color: "#A34A28", bg: "rgba(194,96,58,0.12)" },
  { color: "#5B4390", bg: "rgba(107,79,160,0.12)" },
];

export default function AdminPage() {
  return (
    <main className="min-h-full flex flex-col items-center px-4 pt-4 pb-8" style={{ background: "white" }}>
      <div className="page-container">

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldCheck size={20} color="var(--gold-text)" strokeWidth={2} aria-hidden="true" />
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold-text)" }}>Admin</p>
              <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--fhsu-black)" }}>
                Station QR Codes
              </h1>
            </div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "white", color: "#666", border: "1px solid #DDD",
                borderRadius: 10, padding: "9px 14px", minHeight: 40,
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <LogOut size={14} aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>

        <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, marginBottom: 24 }}>
          Open a station page and display it on a tablet or monitor, or print it as a poster for that station.
        </p>

        <div className="card-grid" style={{ marginBottom: 28 }}>
          {STATIONS.map((station, i) => {
            const Icon = STATION_ICONS[i];
            const sc = STATION_COLORS[i];
            return (
              <Link
                key={station.id}
                href={`/admin/station/${station.id}`}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "white",
                  border: "1px solid #E8E8E8",
                  borderLeft: `4px solid ${sc.color}`,
                  borderRadius: 14, padding: "16px", minHeight: 64, textDecoration: "none",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={19} color={sc.color} strokeWidth={2} aria-hidden="true" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: "#767676", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2, fontWeight: 700 }}>
                    Station {station.id} · {station.audience}
                  </p>
                  <p style={{ fontSize: 14.5, color: "var(--fhsu-black)", fontWeight: 700, lineHeight: 1.25 }}>{station.title}</p>
                </div>
                <ArrowRight size={16} color="#999" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>

        <div style={{ background: "#FAFAFA", border: "1px solid #ECECEC", borderRadius: 14, padding: "18px 20px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#999", marginBottom: 10 }}>
            Setup Checklist
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Open each station page on a tablet or monitor at the station",
              "Participants scan the QR code with their phone camera",
              "They sign in (or register) to collect the stamp",
              "Resources are auto-emailed; completion triggers a final email + passport link",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: 10, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                <span aria-hidden="true" style={{ color: "var(--gold-text)", fontWeight: 700 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
