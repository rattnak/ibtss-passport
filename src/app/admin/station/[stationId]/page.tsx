"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Settings2, Search, Printer } from "lucide-react";
import { getStation } from "@/lib/stations";
import QRCode from "qrcode";

const STATION_ICONS = [BookOpen, Settings2, Search];
const STATION_COLORS = [
  { color: "#2A9D8F", colorLight: "#3BBFB0" },
  { color: "#C2603A", colorLight: "#E07A58" },
  { color: "#6B4FA0", colorLight: "#8B6EC0" },
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
      color: { dark: "#1B2A4A", light: "#F5F0E8" },
    }).then(setQrDataUrl);
  }, [station]);

  if (!station || !sc || !Icon) {
    return (
      <main className="min-h-screen passport-cover-bg flex items-center justify-center">
        <p style={{ color: "rgba(201,168,76,0.7)", fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 18 }}>Invalid station.</p>
      </main>
    );
  }

  const stampUrl = typeof window !== "undefined" ? `${window.location.origin}/stamp/${station.id}` : "";

  return (
    <main style={{
      minHeight: "100vh",
      background: `radial-gradient(circle at 30% 20%, ${sc.colorLight}33 0%, #1B2A4A 50%, #0f1c34 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "32px 20px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p style={{ color: "rgba(201,168,76,0.6)", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>
          Fort Hays State University · IBTSS 2026
        </p>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${sc.colorLight}, ${sc.color})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", boxShadow: `0 4px 24px ${sc.color}66`,
        }}>
          <Icon size={32} color="white" strokeWidth={1.8}/>
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 4, lineHeight: 1.2 }}>
          {station.title}
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{station.audience} Station</p>
      </div>

      {/* QR Code on cream card */}
      <div style={{
        background: "var(--cream)",
        borderRadius: 24, padding: 28,
        boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
        border: "1px solid rgba(201,168,76,0.2)",
        textAlign: "center", marginBottom: 20,
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--navy)", marginBottom: 16, opacity: 0.5 }}>
          Scan to Collect Your Stamp
        </p>
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" style={{ width: 280, height: 280, borderRadius: 16 }}/>
        ) : (
          <div style={{ width: 280, height: 280, background: "#E0D9CC", borderRadius: 16, animation: "pulse 1.5s infinite" }}/>
        )}
        <p style={{ fontSize: 11, color: "#aaa", marginTop: 14, wordBreak: "break-all" }}>{stampUrl}</p>
      </div>

      {/* Station description + resources */}
      <div style={{
        background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)",
        borderRadius: 16, padding: "18px 20px",
        width: "100%", maxWidth: 400, marginBottom: 16,
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 14 }}>
          {station.description}
        </p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
          Station Resources
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {station.resources.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--gold)", fontSize: 13, textDecoration: "none" }}>
                → {r.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.1)", color: "white",
          border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 14,
          padding: "12px 24px", fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
        }}
        className="print:hidden"
      >
        <Printer size={16} strokeWidth={2}/> Print this page
      </button>
    </main>
  );
}
