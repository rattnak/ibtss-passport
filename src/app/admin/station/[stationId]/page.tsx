"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Settings2, Search, Printer, ChevronLeft } from "lucide-react";
import { getStation } from "@/lib/stations";
import QRCode from "qrcode";

const STATION_ICONS = [BookOpen, Settings2, Search];
const STATION_COLORS = [
  { color: "#1E7167", bg: "rgba(42,157,143,0.12)" },
  { color: "#A34A28", bg: "rgba(194,96,58,0.12)" },
  { color: "#5B4390", bg: "rgba(107,79,160,0.12)" },
];

export default function AdminStationPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const station = getStation(Number(stationId));
  const sc = STATION_COLORS[Number(stationId) - 1];
  const Icon = station ? STATION_ICONS[Number(stationId) - 1] : null;
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (!station) return;
    const stampUrl = `${window.location.origin}/stamp/${station.id}`;
    QRCode.toDataURL(stampUrl, {
      width: 400, margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [station]);

  if (!station || !sc || !Icon) {
    return (
      <main className="min-h-full flex items-center justify-center" style={{ background: "white" }}>
        <p style={{ color: "#767676", fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 18 }}>Invalid station.</p>
      </main>
    );
  }

  const stampUrl = typeof window !== "undefined" ? `${window.location.origin}/stamp/${station.id}` : "";

  return (
    <main className="min-h-full flex flex-col items-center px-4 pt-4 pb-10" style={{ background: "white" }}>
      <div className="page-container">
        <Link href="/admin" className="print:hidden" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#666", fontSize: 13, textDecoration: "none", marginBottom: 20, minHeight: 44 }}>
          <ChevronLeft size={15} strokeWidth={2} aria-hidden="true" /> All Stations
        </Link>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Icon size={28} color={sc.color} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold-text)", marginBottom: 6 }}>
            Fort Hays State University · IBTSS 2026
          </p>
          <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 4 }}>
            {station.title}
          </h1>
          <p style={{ fontSize: 13, color: "#767676" }}>{station.audience} Station</p>
        </div>

        {/* QR Code card */}
        <div style={{
          background: "white", border: "1px solid #E8E8E8", borderRadius: 20, padding: 28,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", textAlign: "center", marginBottom: 20,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
            Scan to Collect Your Stamp
          </p>
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt={`QR code linking to /stamp/${station.id}`} style={{ width: 280, height: 280, borderRadius: 16, border: "1px solid #EEE", display: "block", margin: "0 auto" }} />
          ) : (
            <div style={{ width: 280, height: 280, background: "#F2F2F2", borderRadius: 16, margin: "0 auto" }} />
          )}
          <p style={{ fontSize: 11, color: "#AAA", marginTop: 14, wordBreak: "break-all" }}>{stampUrl}</p>
        </div>

        {/* Station description + resources */}
        <div style={{
          background: "#FAFAFA", border: "1px solid #ECECEC", borderRadius: 14,
          padding: "18px 20px", marginBottom: 20,
        }}>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
            {station.description}
          </p>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#999", marginBottom: 10 }}>
            Station Resources
          </p>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {station.resources.map((r, ri) => (
              <li key={`${station.id}-${ri}-${r.title}`}>
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--gold-text)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  → {r.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => window.print()}
          className="print:hidden"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", minHeight: 50,
            background: "var(--fhsu-black)", color: "var(--fhsu-gold)",
            border: "none", borderRadius: 14, fontSize: 14.5, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Printer size={16} strokeWidth={2} aria-hidden="true" /> Print this page
        </button>
      </div>
    </main>
  );
}
