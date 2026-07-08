"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Settings2, Search, CheckCircle2, Lock, ChevronRight } from "lucide-react";
import { getStation } from "@/lib/stations";

const STATION_ICONS = [BookOpen, Settings2, Search];
const STATION_COLORS = [
  { color: "#2A9D8F", colorLight: "#3BBFB0", colorBg: "rgba(42,157,143,0.12)" },
  { color: "#C2603A", colorLight: "#E07A58", colorBg: "rgba(194,96,58,0.12)" },
  { color: "#6B4FA0", colorLight: "#8B6EC0", colorBg: "rgba(107,79,160,0.12)" },
];

export default function StampPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = Number(params.stationId);
  const station = getStation(stationId);
  const sc = STATION_COLORS[stationId - 1];
  const Icon = station ? STATION_ICONS[stationId - 1] : null;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    alreadyStamped?: boolean;
    isComplete?: boolean;
    participantId?: string;
    stampsCollected?: number;
    error?: string;
  } | null>(null);

  if (!station || !sc || !Icon) {
    return (
      <main className="min-h-full flex items-center justify-center" style={{ background: "white" }}>
        <p style={{ color: "var(--gold-text)", fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 18 }}>Invalid station.</p>
      </main>
    );
  }

  async function handleStamp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const lookupRes = await fetch(`/api/participant-by-email?email=${encodeURIComponent(email)}`);
    if (!lookupRes.ok) {
      setResult({ success: false, error: "No passport found for this email. Please register first at the event welcome desk." });
      setLoading(false);
      return;
    }
    const { id: participantId } = await lookupRes.json();
    try { localStorage.setItem("ibtss_email", email.toLowerCase().trim()); } catch {}
    const stampRes = await fetch("/api/stamp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, stationId }),
    });
    const data = await stampRes.json();
    if (!stampRes.ok) { setResult({ success: false, error: data.error }); setLoading(false); return; }
    setResult({ ...data, participantId });
    setLoading(false);
  }

  const remaining = result ? 3 - (result.stampsCollected ?? 0) : 0;

  return (
    <main className="min-h-full flex flex-col items-center justify-center px-4 py-10" style={{ background: "white" }}>

      {/* Station header card */}
      <div style={{
        background: `radial-gradient(circle at 30% 30%, ${sc.colorLight}, ${sc.color})`,
        borderRadius: 20, padding: "28px 24px", textAlign: "center",
        width: "100%", maxWidth: 360, marginBottom: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", backdropFilter: "blur(4px)",
        }}>
          <Icon size={32} color="white" strokeWidth={1.8}/>
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
          Station {station.id} · {station.audience}
        </p>
        <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 10, lineHeight: 1.2 }}>
          {station.title}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{station.description}</p>
        {/* Dashed ring decoration */}
        <svg style={{ position: "absolute", top: 16, right: 16, opacity: 0.2 }} width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 3"/>
        </svg>
      </div>

      {/* Action card */}
      {!result ? (
        <div style={{ background: "var(--cream)", borderRadius: 20, padding: "24px", width: "100%", maxWidth: 360, boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 18, color: "var(--navy)", fontWeight: 700, marginBottom: 4 }}>
            Collect your stamp
          </h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Enter your email to record your visit.</p>

          <form onSubmit={handleStamp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@fhsu.edu"
              style={{
                width: "100%", border: "1.5px solid #DDD5C4", borderRadius: 12,
                padding: "12px 14px", fontSize: 14, color: "#1a1a1a",
                background: "white", outline: "none", fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = sc.color)}
              onBlur={(e) => (e.target.style.borderColor = "#DDD5C4")}
            />
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", background: loading ? "#aaa" : sc.color, color: "white",
                border: "none", borderRadius: 14, padding: "14px 0",
                fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Stamping…" : "Stamp My Passport"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 16 }}>
            No passport yet?{" "}
            <a href="/" style={{ color: sc.color, fontWeight: 600 }}>Register here</a>
          </p>
        </div>
      ) : result.error ? (
        <div style={{ background: "var(--cream)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(192,57,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Lock size={28} color="#c0392b" strokeWidth={1.8}/>
          </div>
          <p style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 18, color: "var(--navy)", fontWeight: 700, marginBottom: 8 }}>Not Found</p>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.5 }}>{result.error}</p>
          <button onClick={() => setResult(null)} style={{ color: sc.color, fontSize: 14, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            ← Try again
          </button>
        </div>
      ) : result.alreadyStamped ? (
        <div style={{ background: "var(--cream)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: sc.colorBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle2 size={36} color={sc.color} strokeWidth={1.8}/>
          </div>
          <p style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 20, color: "var(--navy)", fontWeight: 700, marginBottom: 8 }}>Already Collected</p>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.5 }}>You already have a stamp from this station.</p>
          <button onClick={() => router.push(`/passport/${result.participantId}`)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: sc.color, color: "white", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            View My Passport <ChevronRight size={16} strokeWidth={2.5}/>
          </button>
        </div>
      ) : result.isComplete ? (
        <div style={{ background: "var(--cream)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: 36 }}>🏆</span>
          </div>
          <p style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 20, color: "var(--navy)", fontWeight: 700, marginBottom: 8 }}>Passport Complete!</p>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.5 }}>
            You&apos;ve visited all three stations. Your completion passport is ready to share!
          </p>
          <button onClick={() => router.push(`/passport/${result.participantId}`)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: "var(--gold)", color: "var(--navy)", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            View & Share Passport <ChevronRight size={16} strokeWidth={2.5}/>
          </button>
        </div>
      ) : (
        <div style={{ background: "var(--cream)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, textAlign: "center" }}>
          <div className="stamp-animate" style={{ width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle at 30% 30%, ${sc.colorLight}, ${sc.color})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 4px 20px ${sc.color}40` }}>
            <Icon size={34} color="white" strokeWidth={1.8}/>
          </div>
          <p style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 20, color: "var(--navy)", fontWeight: 700, marginBottom: 8 }}>Stamp Collected!</p>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 4, lineHeight: 1.5 }}>
            Station {stationId} complete. Resources sent to your email.
          </p>
          {remaining > 0 && (
            <p style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>
              {remaining} station{remaining !== 1 ? "s" : ""} left to complete your passport.
            </p>
          )}
          <button onClick={() => router.push(`/passport/${result.participantId}`)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: sc.color, color: "white", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            View My Passport <ChevronRight size={16} strokeWidth={2.5}/>
          </button>
        </div>
      )}
    </main>
  );
}
