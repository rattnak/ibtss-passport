"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Settings2, Search, CheckCircle2, Circle, Copy } from "lucide-react";
import { STATIONS } from "@/lib/stations";
import WorkshopCredentialSummary from "@/components/WorkshopCredentialSummary";
import { Footer } from "@/components/Footer";

type Progress = {
  id: string;
  name: string;
  stamps_collected: number;
  stations_completed: number[] | null;
  is_complete: boolean;
};

const STATION_ICONS = [BookOpen, Settings2, Search];
const STATION_COLORS = [
  { color: "#2A9D8F", colorLight: "#3BBFB0" },
  { color: "#C2603A", colorLight: "#E07A58" },
  { color: "#6B4FA0", colorLight: "#8B6EC0" },
];

export default function BadgePage() {
  const { id } = useParams<{ id: string }>();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [badgeUrl, setBadgeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/passport/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject("not found")))
      .then(setProgress)
      .catch(() => setError("Badge not found."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setBadgeUrl(window.location.href);
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(badgeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(badgeUrl)}`;

  if (loading) {
    return (
      <main className="min-h-full flex items-center justify-center" style={{ background: "white" }}>
        <p role="status" style={{ color: "#666", fontSize: 15 }}>Loading badge…</p>
      </main>
    );
  }

  if (error || !progress) {
    return (
      <main className="min-h-full flex items-center justify-center px-4" style={{ background: "white" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <p style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
            Badge Not Found
          </p>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>{error}</p>
          <Link href="/" style={{ color: "var(--gold-text)", fontWeight: 700, fontSize: 14 }}>Back to home →</Link>
        </div>
      </main>
    );
  }

  const completed = (progress.stations_completed ?? []).filter(
    (s): s is number => s !== null
  );

  return (
    <main style={{ flex: 1, background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 672, display: "flex", flexDirection: "column", flex: 1, padding: "16px 16px 32px" }}>

        {/* ── Unified credential card: navy header band flows directly into
             the white body, single rounded shell — matches how public
             credential pages (Credly, LinkedIn certificates) present a
             badge as one continuous surface rather than stacked boxes. ── */}
        <div style={{
          borderRadius: 20, overflow: "hidden", marginBottom: 24,
          border: "1px solid #ECECEC", boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
        }}>
          {/* Header band — same passport-page treatment as the owner view:
              navy background with an inset gold-bordered card carrying the
              transparent watermark, not just a flat padded panel. */}
          <div className="passport-cover-bg" style={{ padding: "20px 16px 18px" }}>
            <div style={{
              border: "1.5px solid rgba(247,168,0,0.5)", borderRadius: 22,
              padding: "18px 16px 12px", position: "relative", overflow: "hidden",
              background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
            }}>
              {/* watermark */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/FHSU-Ai.png" alt="" aria-hidden="true"
                style={{ position: "absolute", right: -20, bottom: -30, width: 150, opacity: 0.07, transform: "rotate(-12deg)", pointerEvents: "none" }} />

              <p style={{ color: "rgba(247,168,0,0.8)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
                AI Learning Passport · IBTSS 2026
              </p>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/FHSU-Ai.png"
                  alt="FHSU AI in Higher Education — IBTSS 2026 Pre-Conference badge"
                  style={{ width: 76, height: "auto", flexShrink: 0, filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.35))" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Holder</p>
                  <h1 style={{ color: "var(--fhsu-gold)", fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 23, fontWeight: 700, lineHeight: 1.15, marginBottom: 10, overflowWrap: "anywhere" }}>
                    {progress.name}
                  </h1>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Event</p>
                      <p style={{ color: "white", fontSize: 11.5, fontWeight: 600 }}>Pre-Conference Workshop</p>
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Date</p>
                      <p style={{ color: "white", fontSize: 11.5, fontWeight: 600 }}>05 AUG 2026</p>
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Issued by</p>
                      <a href="https://fhsu.edu/" target="_blank" rel="noopener noreferrer" style={{ color: "white", fontSize: 11.5, fontWeight: 600, textDecoration: "underline" }}>
                        <span className="full-name">Fort Hays State University</span>
                        <span className="short-name">FHSU</span>
                      </a>
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Status</p>
                      <p style={{
                        display: "inline-block", fontSize: 10.5, fontWeight: 800, letterSpacing: 0.5,
                        color: progress.is_complete ? "var(--fhsu-black)" : "var(--fhsu-gold)",
                        background: progress.is_complete ? "var(--fhsu-gold)" : "rgba(247,168,0,0.14)",
                        border: progress.is_complete ? "none" : "1px solid rgba(247,168,0,0.5)",
                        borderRadius: 6, padding: "2px 8px",
                      }}>
                        {progress.is_complete ? "COMPLETE" : "IN PROGRESS"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MRZ strip */}
              <p aria-hidden="true" style={{
                marginTop: 14, paddingTop: 8, borderTop: "1px dashed rgba(255,255,255,0.2)",
                fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 1,
                color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden",
              }}>
                {`P<IBTSS2026<<${progress.name.toUpperCase().replace(/[^A-Z]+/g, "<")}<<FHSU<AI<PASSPORT<<<<<<<<<<<<`}
              </p>
            </div>
          </div>

          {/* Body — same shell, white background, no seam/border between
              this and the header band above */}
          <div style={{ background: "white", padding: "20px" }}>
            {progress.is_complete ? (
              <>
                <WorkshopCredentialSummary name={progress.name} />

                {/* Share bar — anyone viewing this public badge can re-share it */}
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    onClick={copyLink}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      flex: 1, background: "white", color: "var(--fhsu-black)",
                      border: "1.5px solid #CCCCCC", borderRadius: 14,
                      padding: "13px 0", minHeight: 52, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                  <a
                    href={linkedInUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      flex: 1.4, background: "#0A66C2", color: "white", textDecoration: "none",
                      borderRadius: 14, padding: 15, fontSize: 14, fontWeight: 700, minHeight: 52,
                      boxShadow: "0 6px 20px rgba(10,102,194,0.35)",
                    }}
                  >
                    <svg style={{ width: 18, height: 18, flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Share on LinkedIn
                  </a>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/FHSU-Ai.png" alt="" aria-hidden="true" style={{ width: 64, height: "auto", margin: "0 auto 12px", opacity: 0.4 }} />
                <h2 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  {progress.name} is working toward this badge
                </h2>
                <p style={{ fontSize: 13, color: "#767676" }}>
                  {completed.length} of 3 stations completed at the IBTSS 2026 Pre-Conference Workshop.
                </p>
              </div>
            )}

            <hr style={{ border: "none", borderTop: "1px solid #ECECEC", margin: "20px 0" }} />

            <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
              Station Stamps
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {STATIONS.map((station, i) => {
              const Icon = STATION_ICONS[i];
              const sc = STATION_COLORS[i];
              const stamped = completed.includes(station.id);
              const tilt = [-5, 4, -3][i];
              return (
                <Link key={station.id} href={`/stations?station=${station.id}`} className="stamp-tap" style={{
                  display: "block", textDecoration: "none",
                  background: "white", border: "1px solid #ECECEC", borderRadius: 16,
                  padding: "16px 8px 12px", textAlign: "center",
                  boxShadow: stamped ? "0 2px 12px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.03)",
                }}>
                  {stamped ? (
                    <div style={{
                      width: 78, height: 78, borderRadius: "50%", margin: "0 auto 10px",
                      background: `radial-gradient(circle at 30% 30%, ${sc.colorLight}, ${sc.color})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative", color: "white",
                      boxShadow: `0 5px 16px ${sc.color}55`,
                      transform: `rotate(${tilt}deg)`,
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: 4 }}>
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                        <span style={{ fontSize: 7.5, fontWeight: 800, lineHeight: 1.2, maxWidth: 60, textTransform: "uppercase", letterSpacing: 0.4 }}>
                          {station.stampLabel}
                        </span>
                        <span style={{ fontSize: 6.5, opacity: 0.85, letterSpacing: 0.8 }}>IBTSS 2026</span>
                      </div>
                      <svg style={{ position: "absolute", inset: 3, width: "calc(100% - 6px)", height: "calc(100% - 6px)", pointerEvents: "none" }} viewBox="0 0 100 100" aria-hidden="true">
                        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="5 3" />
                      </svg>
                    </div>
                  ) : (
                    <div style={{
                      width: 78, height: 78, borderRadius: "50%", margin: "0 auto 10px",
                      border: "2px dashed #D8D8D8", background: "#FAFAFA",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                    }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#C9C9C9", fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", lineHeight: 1 }}>
                        {station.id}
                      </span>
                      <span style={{ fontSize: 7, letterSpacing: 1, textTransform: "uppercase", color: "#C9C9C9" }}>Empty</span>
                    </div>
                  )}
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--fhsu-black)", lineHeight: 1.25 }}>
                    {station.stampLabel}
                  </p>
                  <p style={{ fontSize: 9.5, color: "#999", marginTop: 2 }}>{station.audience}</p>
                  <p style={{ marginTop: 6 }}>
                    {stamped
                      ? <CheckCircle2 size={16} color={sc.color} strokeWidth={2.5} aria-label="Collected" style={{ display: "inline" }} />
                      : <Circle size={16} color="#D8D8D8" strokeWidth={1.5} aria-label="Not collected" style={{ display: "inline" }} />}
                  </p>
                </Link>
              );
            })}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
