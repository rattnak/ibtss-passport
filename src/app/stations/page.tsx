"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, Settings2, Search, ChevronDown, ChevronLeft,
  ExternalLink, Stamp, Timer, ScanLine, CheckCircle2, Trophy, LogIn,
} from "lucide-react";
import { STATIONS, getStation } from "@/lib/stations";
import { useSession } from "@/lib/session";
import QrScanner from "@/components/QrScanner";

const STATION_ICONS = [BookOpen, Settings2, Search];
// Darkened for WCAG AA contrast on white
const STATION_COLORS = [
  { color: "#1E7167", bg: "rgba(42,157,143,0.12)" },
  { color: "#A34A28", bg: "rgba(194,96,58,0.12)" },
  { color: "#5B4390", bg: "rgba(107,79,160,0.12)" },
];

type StampResult = {
  stationId: number;
  success: boolean;
  alreadyStamped?: boolean;
  isComplete?: boolean;
  stampsCollected?: number;
  error?: string;
};

function parseStationId(text: string): number | null {
  // QR codes encode the /stamp/[id] URL; also accept a bare station number.
  const urlMatch = text.match(/\/stamp\/(\d+)/);
  const raw = urlMatch ? urlMatch[1] : (/^\d+$/.test(text.trim()) ? text.trim() : null);
  if (!raw) return null;
  const id = Number(raw);
  return getStation(id) ? id : null;
}

export default function StationsPage() {
  const router = useRouter();
  const { email, participantId, openSignIn } = useSession();
  const [openId, setOpenId] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [result, setResult] = useState<StampResult | null>(null);

  const stamp = useCallback(async (stationId: number) => {
    if (!participantId) { openSignIn(); return; }
    setStamping(true);
    setResult(null);
    const res = await fetch("/api/stamp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, stationId }),
    });
    const data = await res.json();
    setResult(res.ok
      ? { stationId, ...data }
      : { stationId, success: false, error: data.error ?? "Could not record your stamp." });
    setStamping(false);
  }, [participantId, openSignIn]);

  const onScan = useCallback((text: string) => {
    setScanning(false);
    const stationId = parseStationId(text);
    if (!stationId) {
      setResult({ stationId: 0, success: false, error: "That QR code isn't one of today's station codes. Look for the station sign and try again." });
      return;
    }
    stamp(stationId);
  }, [stamp]);

  const resultStation = result && result.stationId ? getStation(result.stationId) : null;

  return (
    <main className="min-h-full flex flex-col items-center px-4 pt-4 pb-8" style={{ background: "white" }}>
      <div className="page-container">

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#666", fontSize: 13, textDecoration: "none", marginBottom: 18, minHeight: 44 }}>
          <ChevronLeft size={15} strokeWidth={2} aria-hidden="true" /> Back to Agenda
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(247,168,0,0.16)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Stamp size={26} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
            AI Tool Stations
          </h1>
          <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>
            Rotate through all three stations — 20 minutes each. Scan the QR code
            posted at each station to stamp your AI Learning Passport.
          </p>
          <p style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--gold-text)", marginTop: 12, fontWeight: 700 }}>
            <Timer size={13} strokeWidth={2} aria-hidden="true" /> 2:20 – 3:30 PM · 3-minute warning before each rotation
          </p>
        </div>

        {/* Scan button */}
        <button
          onClick={() => (email ? setScanning(true) : openSignIn())}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", minHeight: 56,
            background: "var(--fhsu-gold)", color: "var(--fhsu-black)",
            border: "none", borderRadius: 14,
            fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(247,168,0,0.35)",
          }}
        >
          {email ? <ScanLine size={20} strokeWidth={2.2} aria-hidden="true" /> : <LogIn size={18} strokeWidth={2.2} aria-hidden="true" />}
          {email ? "Scan QR to Check In" : "Sign In to Check In"}
        </button>
        <p style={{ fontSize: 12, color: "#767676", textAlign: "center", marginTop: 8 }}>
          {email
            ? "Scan as you finish each station — collect all three."
            : <>Sign in with your passport email first, then scan the station&apos;s QR code.</>}
        </p>

        {/* Result banner */}
        {stamping && (
          <p role="status" style={{ textAlign: "center", fontSize: 13.5, color: "#555", marginTop: 14 }}>Recording your stamp…</p>
        )}
        {result && !stamping && (
          <div role="status" className="slide-up" style={{
            marginTop: 14, borderRadius: 14, padding: "16px 16px",
            background: result.error ? "#FDECEA" : result.isComplete ? "var(--fhsu-black)" : "#EDF7EF",
            border: result.error ? "1px solid #F5C6C0" : result.isComplete ? "2px solid var(--fhsu-gold)" : "1px solid #CDE8D2",
          }}>
            {result.error ? (
              <p style={{ fontSize: 13.5, color: "#8C1D18", lineHeight: 1.5 }}>{result.error}</p>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {result.isComplete
                  ? <Trophy size={26} color="var(--fhsu-gold)" strokeWidth={2} aria-hidden="true" />
                  : <CheckCircle2 size={26} color="#1E7167" strokeWidth={2} aria-hidden="true" />}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: result.isComplete ? "var(--fhsu-gold)" : "#14532D" }}>
                    {result.isComplete
                      ? "All three lenses collected!"
                      : result.alreadyStamped
                        ? `Already stamped: ${resultStation?.stampLabel}`
                        : `Stamp collected: ${resultStation?.stampLabel}`}
                  </p>
                  <p style={{ fontSize: 12, color: result.isComplete ? "rgba(255,255,255,0.75)" : "#3F6212", marginTop: 2 }}>
                    {result.isComplete
                      ? "View your passport to share your achievement."
                      : `${result.stampsCollected ?? "–"} of 3 stations stamped.`}
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/passport/${participantId}`)}
                  style={{
                    background: result.isComplete ? "var(--fhsu-gold)" : "#1E7167",
                    color: result.isComplete ? "var(--fhsu-black)" : "white",
                    border: "none", borderRadius: 10, padding: "10px 14px", minHeight: 44,
                    fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                  }}
                >
                  Passport →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Station cards */}
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#767676", margin: "26px 0 10px" }}>
          Today&apos;s Stations
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STATIONS.map((station, i) => {
            const Icon = STATION_ICONS[i];
            const sc = STATION_COLORS[i];
            const open = openId === station.id;
            return (
              <div key={station.id} style={{
                background: "white",
                border: "1px solid #E8E8E8",
                borderLeft: `4px solid ${sc.color}`,
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <button
                  onClick={() => setOpenId(open ? null : station.id)}
                  aria-expanded={open}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%",
                    padding: "14px 16px", minHeight: 64, background: "none", border: "none",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
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
                  <ChevronDown size={17} color="#999" strokeWidth={2} aria-hidden="true"
                    style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {open && (
                  <div className="slide-up" style={{ padding: "0 16px 16px 68px" }}>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
                      {station.description}
                    </p>

                    <p style={{
                      fontSize: 12, color: sc.color, fontWeight: 700, lineHeight: 1.5,
                      background: sc.bg, borderRadius: 8, padding: "8px 12px", marginBottom: 14,
                    }}>
                      Take home: {station.takeHome}
                    </p>

                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#767676", marginBottom: 8 }}>
                      Station Resources
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {station.resources.map((r, ri) => (
                        <a key={`${station.id}-${ri}-${r.title}`} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                          display: "flex", alignItems: "center", gap: 8,
                          fontSize: 13, color: "var(--fhsu-black)", fontWeight: 500, textDecoration: "none",
                          background: "#FAFAFA", border: "1px solid #EEE", borderRadius: 8, padding: "10px 12px", minHeight: 44,
                        }}>
                          <ExternalLink size={13} color={sc.color} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
                          {r.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 12, color: "#767676", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          Scanning the station&apos;s printed QR code with your phone&apos;s camera app also works.
        </p>
      </div>

      {scanning && <QrScanner onResult={onScan} onClose={() => setScanning(false)} />}
    </main>
  );
}
