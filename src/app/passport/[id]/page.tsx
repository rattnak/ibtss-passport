"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  BookOpen, Settings2, Search, Trophy, CheckCircle2, Circle,
  Share2, Copy, ExternalLink, ChevronRight, FileText, Library
} from "lucide-react";
import { STATIONS } from "@/lib/stations";

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
  { color: "#2A9D8F", colorLight: "#3BBFB0", colorBg: "rgba(42,157,143,0.1)" },
  { color: "#C2603A", colorLight: "#E07A58", colorBg: "rgba(194,96,58,0.1)" },
  { color: "#6B4FA0", colorLight: "#8B6EC0", colorBg: "rgba(107,79,160,0.1)" },
];

const BASE_POST = `I just completed all 3 AI tool stations at the IBTSS 2026 Pre-Conference Workshop — exploring NotebookLM, gethouston.ai, Claude, and Perplexity for higher education! #IBTSS2026 #AIinEducation #FHSU`;

const RESOURCES = [
  { group: "Workshop Materials", items: [
    { title: "Session Overview", url: "#" },
    { title: "Participant Toolkit", url: "#" },
    { title: "Station Activity Sheets", url: "#" },
  ]},
  { group: "AI Tools", items: [
    { title: "NotebookLM", url: "https://notebooklm.google.com" },
    { title: "gethouston.ai", url: "https://gethouston.ai" },
    { title: "Claude", url: "https://claude.ai" },
    { title: "Perplexity", url: "https://perplexity.ai" },
  ]},
  { group: "References", items: [
    { title: "IBTSS 2026 Conference Site", url: "#" },
    { title: "FHSU AI Task Force", url: "#" },
  ]},
];

export default function PassportPage() {
  const { id } = useParams<{ id: string }>();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"passport" | "share" | "resources">("passport");
  const [reflection, setReflection] = useState("");
  const [copied, setCopied] = useState(false);
  const [newlyStamped] = useState<number | null>(null);
  const animRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    fetch(`/api/passport/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject("not found"))
      .then(setProgress)
      .catch(() => setError("Passport not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen passport-cover-bg flex items-center justify-center">
        <p style={{ color: "rgba(201,168,76,0.7)", fontFamily: "'Playfair Display', serif", fontSize: 18 }}>
          Loading passport…
        </p>
      </main>
    );
  }

  if (error || !progress) {
    return (
      <main className="min-h-screen passport-cover-bg flex items-center justify-center px-4">
        <div style={{ background: "var(--cream)", borderRadius: 20, padding: "32px 24px", textAlign: "center", maxWidth: 320 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--navy)", marginBottom: 8 }}>
            Passport Not Found
          </p>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>{error}</p>
          <a href="/" style={{ color: "var(--navy)", fontWeight: 700, fontSize: 14 }}>Register for a passport →</a>
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

  const TABS = [
    { id: "passport", label: "Passport", icon: BookOpen },
    { id: "share",    label: "Share",    icon: Share2 },
    { id: "resources",label: "Resources",icon: Library },
  ] as const;

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--cream)", position: "relative" }}>

        {/* ── Tab Content ── */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

          {/* ════ PASSPORT TAB ════ */}
          {activeTab === "passport" && (
            <div>
              {/* Cover */}
              <div className="passport-cover-bg" style={{ padding: "20px 20px 24px" }}>
                <div style={{
                  border: "1.5px solid rgba(201,168,76,0.45)", borderRadius: 12,
                  padding: "24px 20px 20px", textAlign: "center", position: "relative",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  background: "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
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

                  <svg viewBox="0 0 120 120" style={{ width: 80, height: 80, marginBottom: 8 }} xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#C9A84C" strokeWidth="0.6" strokeDasharray="3 2"/>
                    <g opacity="0.85">
                      <path d="M18 68 Q12 55 18 42 Q24 55 18 68Z" fill="#C9A84C"/>
                      <path d="M14 60 Q8 47 15 35 Q20 48 14 60Z" fill="#C9A84C" opacity="0.7"/>
                      <path d="M21 76 Q15 63 22 51 Q27 63 21 76Z" fill="#C9A84C" opacity="0.7"/>
                    </g>
                    <g opacity="0.85">
                      <path d="M102 68 Q108 55 102 42 Q96 55 102 68Z" fill="#C9A84C"/>
                      <path d="M106 60 Q112 47 105 35 Q100 48 106 60Z" fill="#C9A84C" opacity="0.7"/>
                      <path d="M99 76 Q105 63 98 51 Q93 63 99 76Z" fill="#C9A84C" opacity="0.7"/>
                    </g>
                    <polygon points="60,22 64,36 78,36 67,45 71,59 60,50 49,59 53,45 42,36 56,36" fill="#C9A84C"/>
                    <rect x="34" y="82" width="52" height="10" rx="2" fill="#C9A84C" opacity="0.75"/>
                    <text x="60" y="90" textAnchor="middle" fontSize="5.5" fill="#1B2A4A" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="0.5">FHSU · IBTSS</text>
                  </svg>

                  <p style={{ color: "rgba(201,168,76,0.6)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>
                    2026 Pre-Conference Workshop
                  </p>
                  <h1 style={{ color: "var(--gold)", fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                    {progress.name}&apos;s Passport
                  </h1>
                  <p style={{ color: "rgba(201,168,76,0.5)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
                    AI in Higher Education
                  </p>
                </div>
              </div>

              {/* Inside pages */}
              <div className="passport-paper" style={{ padding: "20px 16px 24px" }}>

                {/* Progress bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {completed.length} of 3 stations completed
                  </span>
                  <div style={{ flex: 1, height: 4, background: "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "var(--navy)", borderRadius: 99, width: `${(completed.length / 3) * 100}%`, transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
                  </div>
                </div>

                {/* Stamp slots */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {STATIONS.map((station, i) => {
                    const Icon = STATION_ICONS[i];
                    const sc = STATION_COLORS[i];
                    const stamped = completed.includes(station.id);
                    const isNew = newlyStamped === station.id;
                    return (
                      <div key={station.id} style={{
                        display: "flex", alignItems: "center", gap: 14,
                        background: "white", borderRadius: 16,
                        padding: "14px 12px 14px 14px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: stamped ? "0 2px 12px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
                      }}>
                        {/* Stamp circle */}
                        <div style={{ flexShrink: 0 }}>
                          {stamped ? (
                            <div
                              className={isNew ? "stamp-animate" : ""}
                              style={{
                                width: 84, height: 84, borderRadius: "50%",
                                background: `radial-gradient(circle at 30% 30%, ${sc.colorLight}, ${sc.color})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "relative", color: "white",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                flexShrink: 0,
                              }}
                            >
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, zIndex: 1, padding: 4, pointerEvents: "none" }}>
                                <Icon size={20} strokeWidth={2} />
                                <span style={{ fontSize: 8, fontWeight: 700, textAlign: "center", lineHeight: 1.2, maxWidth: 66 }}>
                                  {station.title.split(" for ")[0]}
                                </span>
                                <span style={{ fontSize: 7, opacity: 0.75 }}>Collected</span>
                              </div>
                              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: "50%", pointerEvents: "none" }} viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeDasharray="5 3"/>
                              </svg>
                            </div>
                          ) : (
                            <div style={{
                              width: 84, height: 84, borderRadius: "50%",
                              border: "2px dashed #D4CCB8",
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                              gap: 2, background: "rgba(255,255,255,0.5)", flexShrink: 0,
                            }}>
                              <span style={{ fontSize: 22, fontWeight: 700, color: "#D4CCB8", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                                {station.id}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Station info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: "inline-block", fontSize: 10, fontWeight: 700,
                            letterSpacing: 0.5, padding: "2px 8px", borderRadius: 99,
                            background: sc.colorBg, color: sc.color, marginBottom: 4,
                          }}>
                            Station {station.id}
                          </div>
                          <p style={{ fontSize: 11, color: "#888", marginBottom: 1 }}>{station.audience}</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
                            {station.title.split(" for ")[0]}
                          </p>
                          <p style={{ fontSize: 11, color: "#999", marginTop: 3, lineHeight: 1.4 }}>{station.description.slice(0, 80)}…</p>
                        </div>

                        {/* Status */}
                        <div style={{ flexShrink: 0 }}>
                          {stamped
                            ? <CheckCircle2 size={22} color={sc.color} strokeWidth={2.5} />
                            : <Circle size={22} color="#D1C9B8" strokeWidth={1.5} />
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Completion banner */}
                {progress.is_complete && (
                  <div className="slide-up" style={{
                    marginTop: 16,
                    background: "linear-gradient(135deg, var(--navy), var(--navy-light))",
                    borderRadius: 14, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 12,
                    border: "1px solid rgba(201,168,76,0.2)",
                  }}>
                    <Trophy size={22} color="#C9A84C" strokeWidth={2} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>Passport Complete!</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>Tap Share to post your achievement.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("share")}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        background: "var(--gold)", color: "var(--navy)",
                        border: "none", borderRadius: 10, padding: "8px 12px",
                        fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                      }}
                    >
                      Share <ChevronRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════ SHARE TAB ════ */}
          {activeTab === "share" && (
            <div style={{ background: "var(--cream)", display: "flex", flexDirection: "column" }}>
              {!progress.is_complete ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", gap: 14 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(27,42,74,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Share2 size={30} color="var(--navy)" strokeWidth={1.5} />
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--navy)", fontWeight: 700 }}>Share Locked</h2>
                  <p style={{ fontSize: 13, color: "#888", maxWidth: 240, lineHeight: 1.5 }}>
                    Complete all 3 stations to unlock your shareable passport.
                  </p>
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                    {STATIONS.map((s, i) => {
                      const Icon = STATION_ICONS[i];
                      const sc = STATION_COLORS[i];
                      const done = completed.includes(s.id);
                      return (
                        <div key={s.id} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 14px", borderRadius: 12,
                          background: "white", border: "1px solid rgba(0,0,0,0.06)",
                          borderLeft: `3px solid ${done ? sc.color : "transparent"}`,
                          fontSize: 13, color: done ? "var(--navy)" : "#aaa",
                          fontWeight: done ? 600 : 400,
                        }}>
                          {done ? <CheckCircle2 size={18} color={sc.color} strokeWidth={2.5}/> : <Circle size={18} color="#ccc" strokeWidth={1.5}/>}
                          <Icon size={16} color={done ? sc.color : "#aaa"} strokeWidth={2}/>
                          <span>{s.title.split(" for ")[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Share card */}
                  <div style={{ background: "var(--navy)", borderRadius: 20, padding: 20, boxShadow: "0 4px 24px rgba(27,42,74,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <svg viewBox="0 0 120 120" style={{ width: 48, height: 48, flexShrink: 0 }}>
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
                        <polygon points="60,26 64,40 78,40 67,49 71,63 60,54 49,63 53,49 42,40 56,40" fill="#C9A84C"/>
                      </svg>
                      <div>
                        <p style={{ fontSize: 9, color: "var(--gold)", letterSpacing: 1.5, textTransform: "uppercase" }}>IBTSS 2026 · FHSU</p>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "white", fontWeight: 700 }}>AI Learning Passport</h3>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{progress.name} · Completed</p>
                      </div>
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 14 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {STATIONS.map((s, i) => {
                        const Icon = STATION_ICONS[i];
                        const sc = STATION_COLORS[i];
                        return (
                          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, borderLeft: `3px solid ${sc.color}`, paddingLeft: 12 }}>
                            <Icon size={18} color={sc.color} strokeWidth={2}/>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{s.title.split(" for ")[0]}</p>
                              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{s.audience}</p>
                            </div>
                            <CheckCircle2 size={16} color="#34D399" strokeWidth={2.5}/>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reflection */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>Add a personal reflection</label>
                    <p style={{ fontSize: 11, color: "#aaa" }}>Optional — appended to your LinkedIn post</p>
                    <textarea
                      value={reflection} onChange={(e) => setReflection(e.target.value)}
                      placeholder="What was your biggest takeaway from today's workshop?"
                      rows={3}
                      style={{
                        width: "100%", border: "1.5px solid #E0D9CC", borderRadius: 12,
                        padding: "12px 14px", fontSize: 14, fontFamily: "inherit",
                        background: "white", color: "#333", resize: "none", outline: "none",
                        lineHeight: 1.5,
                      }}
                    />
                    <div style={{ background: "white", border: "1px solid #E0D9CC", borderRadius: 12, padding: "12px 14px" }}>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Post preview</p>
                      <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {reflection.trim() ? `${reflection.trim()}\n\n` : ""}{BASE_POST}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <a
                    href={buildLinkedInUrl()} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      background: "#0A66C2", color: "white", textDecoration: "none",
                      borderRadius: 14, padding: 16, fontSize: 15, fontWeight: 700, minHeight: 56,
                    }}
                  >
                    <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Share on LinkedIn
                    <ExternalLink size={14} strokeWidth={2} style={{ opacity: 0.7 }}/>
                  </a>

                  <button
                    onClick={copyLink}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "white", color: "var(--navy)",
                      border: "1.5px solid #DDD5C4", borderRadius: 14,
                      padding: "14px 0", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <Copy size={16} strokeWidth={2}/>
                    {copied ? "Link copied!" : "Copy shareable link"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════ RESOURCES TAB ════ */}
          {activeTab === "resources" && (
            <div style={{ background: "#F0EBE1" }}>
              <div className="passport-cover-bg" style={{ padding: "32px 20px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Library size={28} color="#C9A84C" strokeWidth={1.5}/>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--gold)", fontWeight: 700 }}>Workshop Resources</h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>IBTSS 2026 Pre-Conference · AI in Higher Education</p>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {RESOURCES.map((group) => (
                  <div key={group.group} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ padding: "12px 16px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--navy)", background: "rgba(27,42,74,0.03)", borderBottom: "1px solid #F0EBE1" }}>
                      {group.group}
                    </p>
                    {group.items.map((item, j) => (
                      <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "13px 14px 13px 16px", textDecoration: "none",
                          borderBottom: j < group.items.length - 1 ? "1px solid #F5F0E8" : "none",
                          minHeight: 52,
                          color: "#2a2a2a",
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(27,42,74,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--navy)" }}>
                          <FileText size={16} strokeWidth={2}/>
                        </div>
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>{item.title}</span>
                        <ChevronRight size={18} color="#C0B89A" strokeWidth={2}/>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Tab Bar ── */}
        <nav style={{
          height: 68, display: "flex", background: "white",
          borderTop: "1px solid rgba(0,0,0,0.07)", flexShrink: 0,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}>
          {TABS.map((tab) => {
            const Icon = tab.id === "share" && !progress.is_complete ? Share2 : tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 4, border: "none", background: "none", cursor: "pointer",
                  fontFamily: "inherit", position: "relative", paddingTop: 2,
                }}
              >
                <div style={{
                  width: 32, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 8, background: active ? "rgba(27,42,74,0.07)" : "transparent",
                  color: active ? "var(--navy)" : "#B0A89A",
                }}>
                  <Icon size={22} strokeWidth={1.8}/>
                </div>
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "var(--navy)" : "#B0A89A", lineHeight: 1 }}>
                  {tab.label}
                </span>
                {active && (
                  <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 2.5, background: "var(--navy)", borderRadius: 99 }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
