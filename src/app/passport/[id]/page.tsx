"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BookOpen, Settings2, Search, Trophy, CheckCircle2, Circle,
  Share2, Copy, ExternalLink, Lock, ArrowRight,
} from "lucide-react";
import { STATIONS } from "@/lib/stations";
import CredlyBadgeCard from "@/components/CredlyBadgeCard";

type Progress = {
  id: string;
  name: string;
  email: string;
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

const BASE_POST = `I completed all three AI tool stations at the IBTSS 2026 Pre-Conference Workshop — AI in Higher Education: From Challenge to Opportunity (Fort Hays State University × American University of Phnom Penh). #IBTSS2026 #AIinEducation #FHSU`;

export default function PassportPage() {
  const { id } = useParams<{ id: string }>();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reflection, setReflection] = useState("");
  const [copied, setCopied] = useState(false);
  const [newlyStamped] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/passport/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject("not found"))
      .then(setProgress)
      .catch(() => setError("Passport not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-full flex items-center justify-center" style={{ background: "white" }}>
        <p role="status" style={{ color: "#666", fontSize: 15 }}>Loading passport…</p>
      </main>
    );
  }

  if (error || !progress) {
    return (
      <main className="min-h-full flex items-center justify-center px-4" style={{ background: "white" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <p style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
            Passport Not Found
          </p>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>{error}</p>
          <Link href="/my-passport" style={{ color: "var(--gold-text)", fontWeight: 700, fontSize: 14 }}>Register for a passport →</Link>
        </div>
      </main>
    );
  }

  const completed = progress.stations_completed ?? [];
  const passportUrl = typeof window !== "undefined" ? window.location.href : "";

  function buildLinkedInUrl() {
    const text = reflection.trim() ? `${reflection.trim()}\n\n${BASE_POST}` : BASE_POST;
    return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(passportUrl)}&title=${encodeURIComponent("IBTSS 2026 AI Learning Passport")}&summary=${encodeURIComponent(text)}`;
  }

  async function copyLink() {
    await navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main style={{ flex: 1, background: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 672, display: "flex", flexDirection: "column", flex: 1 }}>

        {/* ── ID page hero ── */}
        <div className="passport-cover-bg" style={{ padding: "20px 16px 18px" }}>
          <div style={{
            border: "1.5px solid rgba(247,168,0,0.5)", borderRadius: 14,
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
                    <p style={{ color: "white", fontSize: 11.5, fontWeight: 600 }}>FHSU</p>
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

        {/* ── Body ── */}
        <div style={{ padding: "20px 16px 32px" }}>

          {/* Progress ring + stats */}
          <div style={{
            display: "flex", alignItems: "center", gap: 18,
            background: "white", border: "1px solid #ECECEC", borderRadius: 16,
            padding: "16px 18px", marginBottom: 18, boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}
              role="img" aria-label={`${completed.length} of 3 stations completed`}>
              <svg viewBox="0 0 84 84" style={{ width: 84, height: 84, transform: "rotate(-90deg)" }}>
                <circle cx="42" cy="42" r="34" fill="none" stroke="#EFEFEF" strokeWidth="8" />
                <circle cx="42" cy="42" r="34" fill="none" stroke="var(--fhsu-gold)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - completed.length / 3)}
                  style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 21, fontWeight: 800, color: "var(--fhsu-black)", lineHeight: 1 }}>{completed.length}<span style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>/3</span></span>
                <span style={{ fontSize: 8.5, letterSpacing: 1, textTransform: "uppercase", color: "#999", marginTop: 3 }}>Stamps</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 4 }}>
                {progress.is_complete
                  ? "All three lenses collected!"
                  : `${3 - completed.length} station${3 - completed.length !== 1 ? "s" : ""} to go`}
              </p>
              <p style={{ fontSize: 12.5, color: "#767676", lineHeight: 1.55 }}>
                {progress.is_complete
                  ? "Check the Toolkit tab for everything you used today."
                  : "Scan the QR code at each station to collect its stamp."}
              </p>
              {!progress.is_complete && (
                <Link href="/stations" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 12.5, fontWeight: 700, color: "var(--gold-text)", textDecoration: "none" }}>
                  Go to stations <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>

          {/* Stamp grid */}
          <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
            Station Stamps
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {STATIONS.map((station, i) => {
              const Icon = STATION_ICONS[i];
              const sc = STATION_COLORS[i];
              const stamped = completed.includes(station.id);
              const isNew = newlyStamped === station.id;
              const tilt = [-5, 4, -3][i];
              return (
                <div key={station.id} style={{
                  background: "white", border: "1px solid #ECECEC", borderRadius: 16,
                  padding: "16px 8px 12px", textAlign: "center",
                  boxShadow: stamped ? "0 2px 12px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.03)",
                }}>
                  {stamped ? (
                    <div className={isNew ? "stamp-animate" : ""} style={{
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
                </div>
              );
            })}
          </div>

          {/* ── Share (inline, same page) ── */}
          <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", margin: "24px 0 12px" }}>
            Share Your Achievement
          </h2>

          {!progress.is_complete ? (
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#FAFAFA", border: "1px dashed #D8D8D8", borderRadius: 14,
              padding: "14px 16px",
            }}>
              <Lock size={18} color="#999" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "#767676", lineHeight: 1.55 }}>
                Sharing unlocks when all 3 stamps are collected — {3 - completed.length} to go.
              </p>
            </div>
          ) : (
            <div className="slide-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Completion banner */}
              <div style={{
                background: "var(--fhsu-black)", borderRadius: 16, padding: "16px 18px",
                display: "flex", alignItems: "center", gap: 14,
                border: "1.5px solid var(--fhsu-gold)",
              }}>
                <Trophy size={26} color="var(--fhsu-gold)" strokeWidth={2} aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "var(--fhsu-gold)" }}>Passport Complete!</p>
                  <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
                    Post your achievement — add a personal reflection if you like.
                  </p>
                </div>
              </div>

              <CredlyBadgeCard isComplete={progress.is_complete} />

              {/* Reflection + preview */}
              <div>
                <label htmlFor="reflection" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Add a personal reflection <span style={{ fontWeight: 400, color: "#999" }}>(optional)</span>
                </label>
                <textarea
                  id="reflection" value={reflection} onChange={(e) => setReflection(e.target.value)}
                  placeholder="What was your biggest takeaway from today's workshop?"
                  rows={3}
                  style={{
                    width: "100%", border: "1.5px solid #CCCCCC", borderRadius: 12,
                    padding: "12px 14px", fontSize: 16, fontFamily: "inherit",
                    background: "white", color: "#1a1a1a", resize: "vertical", lineHeight: 1.5,
                  }}
                />
              </div>
              <div style={{ background: "#FAFAFA", border: "1px solid #ECECEC", borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Post preview</p>
                <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {reflection.trim() ? `${reflection.trim()}\n\n` : ""}{BASE_POST}
                </p>
              </div>

              {/* Actions */}
              <a
                href={buildLinkedInUrl()} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "#0A66C2", color: "white", textDecoration: "none",
                  borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, minHeight: 52,
                }}
              >
                <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
                <ExternalLink size={14} strokeWidth={2} style={{ opacity: 0.7 }} aria-hidden="true" />
              </a>
              <button
                onClick={copyLink}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "white", color: "var(--fhsu-black)",
                  border: "1.5px solid #CCCCCC", borderRadius: 14,
                  padding: "13px 0", minHeight: 48, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <Copy size={16} strokeWidth={2} aria-hidden="true" />
                {copied ? "Link copied!" : "Copy shareable link"}
              </button>
            </div>
          )}

          <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: "#AAA", marginTop: 20 }}>
            <Share2 size={11} aria-hidden="true" /> {progress.email}
          </p>
        </div>
      </div>
    </main>
  );
}
