"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Settings2, Search } from "lucide-react";
import { STATIONS } from "@/lib/stations";

const STATION_ICONS = [BookOpen, Settings2, Search];
const STATION_COLORS = [
  { color: "#2A9D8F", colorLight: "#3BBFB0", colorBg: "rgba(42,157,143,0.1)" },
  { color: "#C2603A", colorLight: "#E07A58", colorBg: "rgba(194,96,58,0.1)" },
  { color: "#6B4FA0", colorLight: "#8B6EC0", colorBg: "rgba(107,79,160,0.1)" },
];

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Something went wrong."); setLoading(false); return; }
    router.push(`/passport/${data.id}`);
  }

  return (
    <main className="min-h-screen passport-cover-bg flex flex-col items-center justify-center px-4 py-10">

      {/* Passport Cover Card */}
      <div className="w-full max-w-sm mb-8">
        <div style={{
          border: "1.5px solid rgba(201,168,76,0.45)",
          borderRadius: 16,
          padding: "28px 24px 24px",
          textAlign: "center",
          background: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
          position: "relative",
        }}>
          {/* Corner marks */}
          {[
            { top: -1, left: -1, borderWidth: "2px 0 0 2px", borderRadius: "10px 0 0 0" },
            { top: -1, right: -1, borderWidth: "2px 2px 0 0", borderRadius: "0 10px 0 0" },
            { bottom: -1, left: -1, borderWidth: "0 0 2px 2px", borderRadius: "0 0 0 10px" },
            { bottom: -1, right: -1, borderWidth: "0 2px 2px 0", borderRadius: "0 0 10px 0" },
          ].map((s, i) => (
            <span key={i} style={{ position: "absolute", width: 14, height: 14, borderColor: "var(--gold)", borderStyle: "solid", ...s }} />
          ))}

          {/* SVG Emblem */}
          <svg viewBox="0 0 120 120" style={{ width: 88, height: 88, margin: "0 auto 12px" }} xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
            <circle cx="60" cy="60" r="45" fill="none" stroke="#C9A84C" strokeWidth="0.6" strokeDasharray="3 2"/>
            <g opacity="0.85">
              <path d="M18 68 Q12 55 18 42 Q24 55 18 68Z" fill="#C9A84C"/>
              <path d="M14 60 Q8 47 15 35 Q20 48 14 60Z" fill="#C9A84C" opacity="0.7"/>
              <path d="M21 76 Q15 63 22 51 Q27 63 21 76Z" fill="#C9A84C" opacity="0.7"/>
              <path d="M11 52 Q7 41 13 30 Q17 41 11 52Z" fill="#C9A84C" opacity="0.5"/>
            </g>
            <g opacity="0.85">
              <path d="M102 68 Q108 55 102 42 Q96 55 102 68Z" fill="#C9A84C"/>
              <path d="M106 60 Q112 47 105 35 Q100 48 106 60Z" fill="#C9A84C" opacity="0.7"/>
              <path d="M99 76 Q105 63 98 51 Q93 63 99 76Z" fill="#C9A84C" opacity="0.7"/>
              <path d="M109 52 Q113 41 107 30 Q103 41 109 52Z" fill="#C9A84C" opacity="0.5"/>
            </g>
            <polygon points="60,22 64,36 78,36 67,45 71,59 60,50 49,59 53,45 42,36 56,36" fill="#C9A84C"/>
            <rect x="34" y="82" width="52" height="10" rx="2" fill="#C9A84C" opacity="0.75"/>
            <text x="60" y="90" textAnchor="middle" fontSize="5.5" fill="#1B2A4A" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="0.5">FHSU · IBTSS</text>
          </svg>

          <p style={{ color: "rgba(201,168,76,0.6)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            2026 Pre-Conference Workshop
          </p>
          <h1 style={{ color: "var(--gold)", fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, lineHeight: 1.15, marginBottom: 6 }}>
            AI Learning<br />Passport
          </h1>
          <p style={{ color: "rgba(201,168,76,0.5)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
            AI in Higher Education
          </p>
        </div>
      </div>

      {/* Station preview pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 360, marginBottom: 24 }}>
        {STATIONS.map((station, i) => {
          const Icon = STATION_ICONS[i];
          const sc = STATION_COLORS[i];
          return (
            <div key={station.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderLeft: `3px solid ${sc.color}`,
              borderRadius: 12, padding: "12px 14px",
            }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: sc.colorBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={sc.color} strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>
                  Station {station.id} · {station.audience}
                </p>
                <p style={{ fontSize: 13, color: "white", fontWeight: 600 }}>{station.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration form */}
      <div style={{
        background: "var(--cream)", borderRadius: 20,
        padding: "28px 24px", width: "100%", maxWidth: 360,
        boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--navy)", fontWeight: 700, marginBottom: 4 }}>
          Get your passport
        </h2>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
          Enter your details to start collecting stamps.
        </p>

        <form onSubmit={handleStart} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>
              Full Name
            </label>
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              style={{
                width: "100%", border: "1.5px solid #DDD5C4", borderRadius: 12,
                padding: "12px 14px", fontSize: 14, color: "#1a1a1a",
                background: "white", outline: "none", fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--navy)")}
              onBlur={(e) => (e.target.style.borderColor = "#DDD5C4")}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@fhsu.edu"
              style={{
                width: "100%", border: "1.5px solid #DDD5C4", borderRadius: 12,
                padding: "12px 14px", fontSize: 14, color: "#1a1a1a",
                background: "white", outline: "none", fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--navy)")}
              onBlur={(e) => (e.target.style.borderColor = "#DDD5C4")}
            />
          </div>

          {error && <p style={{ fontSize: 13, color: "#c0392b" }}>{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", background: loading ? "#aaa" : "var(--gold)", color: "var(--navy)",
              border: "none", borderRadius: 14, padding: "14px 0",
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", marginTop: 4,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Starting…" : "Start My Passport →"}
          </button>
        </form>
      </div>
    </main>
  );
}
