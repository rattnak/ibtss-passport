"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen, Settings2, Search, CheckCircle2, Circle,
  Share2, Copy, Lock, ArrowRight, LogOut,
} from "lucide-react";
import { STATIONS } from "@/lib/stations";
import CredlyBadgeCard from "@/components/CredlyBadgeCard";
import { Footer } from "@/components/Footer";
import { useSession } from "@/lib/session";

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
  return (
    <Suspense fallback={null}>
      <PassportPageContent />
    </Suspense>
  );
}

function PassportPageContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { participantId, completeDeviceSignIn, signOut } = useSession();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reflection, setReflection] = useState("");
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [newlyStamped] = useState<number | null>(null);
  // The shareable link points at the public /badge/[id] page (a simplified,
  // owner-UI-free view), not this page's own URL.
  const [badgeUrl, setBadgeUrl] = useState("");
  const wasOwner = useRef(false);
  const signedInFromVerify = useRef(false);

  // window.location is only available client-side; reading it during the
  // first render (or via a typeof-window ternary in the render body) makes
  // that render differ from the server-rendered HTML and triggers a
  // hydration mismatch. Setting it in an effect runs only after hydration.
  useEffect(() => {
    setBadgeUrl(`${window.location.origin}/badge/${id}`);
  }, [id]);

  useEffect(() => {
    fetch(`/api/passport/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject("not found"))
      .then(setProgress)
      .catch(() => {
        setError("Passport not found.");
        // The session pointed at a participant that no longer exists (e.g.
        // deleted directly in the database) — clear it rather than leave
        // the navbar showing a name for an account this page can't find.
        if (participantId === id) signOut();
      })
      .finally(() => setLoading(false));
  }, [id, participantId, signOut]);

  // The email-verification link redirects here straight from the server
  // (no client-side sign-in happens along the way), so without this the
  // navbar and every other page keep treating you as signed out even
  // though this page itself shows your data by URL id. The server already
  // proved ownership via the signed token, so this completes sign-in
  // directly (and trusts the device) rather than going through signIn()'s
  // new-device email-confirmation gate, which would otherwise loop.
  useEffect(() => {
    if (signedInFromVerify.current || searchParams.get("justVerified") !== "1" || !progress) return;
    signedInFromVerify.current = true;
    completeDeviceSignIn(progress.id);
    const url = new URL(window.location.href);
    url.searchParams.delete("justVerified");
    window.history.replaceState({}, "", url);
  }, [searchParams, progress, completeDeviceSignIn]);

  // Same idea for the new-device confirmation link (/verify-device) — the
  // server already verified the signed token, so trust this device directly.
  useEffect(() => {
    if (signedInFromVerify.current || searchParams.get("deviceVerified") !== "1" || !progress) return;
    signedInFromVerify.current = true;
    completeDeviceSignIn(progress.id);
    const url = new URL(window.location.href);
    url.searchParams.delete("deviceVerified");
    window.history.replaceState({}, "", url);
  }, [searchParams, progress, completeDeviceSignIn]);

  // If you sign out while viewing your own passport, leave the page —
  // the page itself stays public (LinkedIn share links point here), but
  // seeing your own stamps after signing out reads as sign-out not working.
  useEffect(() => {
    if (participantId === id) wasOwner.current = true;
    else if (wasOwner.current && !participantId) router.replace("/");
  }, [participantId, id, router]);

  const isOwner = participantId === id;

  function handleSignOut() {
    signOut();
    router.replace("/");
  }

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

  // Postgres's array_agg over a left join with no matching stamps returns
  // [null] rather than [] or null, so filter that out here.
  const completed = (progress.stations_completed ?? []).filter(
    (s): s is number => s !== null
  );

  function buildLinkedInUrl() {
    // LinkedIn's share dialog no longer accepts pre-filled post text (title/summary
    // params are ignored) — it only takes the URL and pulls its preview card from
    // that page's Open Graph tags. The caption below is meant to be copied into
    // the post LinkedIn opens, not auto-inserted.
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(badgeUrl)}`;
  }

  function fullCaption() {
    return reflection.trim() ? `${BASE_POST}\n\n${reflection.trim()}` : BASE_POST;
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(fullCaption());
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(badgeUrl);
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
                    <a href="https://fhsu.edu/" target="_blank" rel="noopener noreferrer" style={{ color: "white", fontSize: 11.5, fontWeight: 600, textDecoration: "underline" }}>Fort Hays State University</a>
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

          {/* Progress ring (with its instruction stacked beneath it) and
              the 3 station stamps share one outer bordered container, laid
              out in a row — each stamp keeps its own inner border/shadow
              for a clear interactive boundary and full-size tap target. */}
          <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
            Station Stamps
          </h2>
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 14,
            background: "#FAFAFA", border: "1px solid #ECECEC", borderRadius: 18,
            padding: "16px", marginBottom: 18,
          }}>
            {/* Ring + instruction — its own tinted panel, set apart from
                the stamps as the summary metric rather than sized to
                compete with them */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
              justifyContent: "center", flex: "1 1 180px",
              background: "white", border: "1px solid #ECECEC", borderRadius: 16,
              padding: "20px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
            }}>
              <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}
                role="img" aria-label={`${completed.length} of 3 stations completed`}>
                <svg viewBox="0 0 110 110" style={{ width: 110, height: 110, transform: "rotate(-90deg)" }}>
                  <circle cx="55" cy="55" r="46" fill="none" stroke="#EFEFEF" strokeWidth="9" />
                  <circle cx="55" cy="55" r="46" fill="none" stroke="var(--fhsu-gold)" strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - completed.length / 3)}
                    style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 27, fontWeight: 800, color: "var(--fhsu-black)", lineHeight: 1 }}>{completed.length}<span style={{ fontSize: 14, color: "#999", fontWeight: 600 }}>/3</span></span>
                  <span style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "#999", marginTop: 3 }}>Stamps</span>
                </div>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fhsu-black)", marginTop: 12, lineHeight: 1.3 }}>
                {progress.is_complete
                  ? "All three lenses collected!"
                  : `${3 - completed.length} station${3 - completed.length !== 1 ? "s" : ""} to go`}
              </p>
              {!progress.is_complete && (
                <Link href="/stations" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5, fontSize: 12, fontWeight: 700, color: "var(--gold-text)", textDecoration: "none" }}>
                  Go to stations <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              )}
            </div>

            {/* Stamps — grouped in their own panel to the right, each
                stamp keeping its own card so the tap target and boundary
                stay clear */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10,
              flex: "2 1 260px",
            }}>
              {STATIONS.map((station, i) => {
                const Icon = STATION_ICONS[i];
                const sc = STATION_COLORS[i];
                const stamped = completed.includes(station.id);
                const isNew = newlyStamped === station.id;
                const tilt = [-5, 4, -3][i];
                return (
                  <Link key={station.id} href={`/stations?station=${station.id}`} className="stamp-tap" style={{
                    display: "block", textDecoration: "none", flex: "1 1 90px",
                    background: "white", border: "1px solid #ECECEC", borderRadius: 16,
                    padding: "14px 6px 10px", textAlign: "center",
                    boxShadow: stamped ? "0 2px 12px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.03)",
                  }}>
                    {stamped ? (
                      <div className={isNew ? "stamp-animate" : ""} style={{
                        width: 66, height: 66, borderRadius: "50%", margin: "0 auto 8px",
                        background: `radial-gradient(circle at 30% 30%, ${sc.colorLight}, ${sc.color})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative", color: "white",
                        boxShadow: `0 5px 16px ${sc.color}55`,
                        transform: `rotate(${tilt}deg)`,
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: 4 }}>
                          <Icon size={16} strokeWidth={2} aria-hidden="true" />
                          <span style={{ fontSize: 6.5, fontWeight: 800, lineHeight: 1.2, maxWidth: 52, textTransform: "uppercase", letterSpacing: 0.3 }}>
                            {station.stampLabel}
                          </span>
                        </div>
                        <svg style={{ position: "absolute", inset: 3, width: "calc(100% - 6px)", height: "calc(100% - 6px)", pointerEvents: "none" }} viewBox="0 0 100 100" aria-hidden="true">
                          <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="5 3" />
                        </svg>
                      </div>
                    ) : (
                      <div style={{
                        width: 66, height: 66, borderRadius: "50%", margin: "0 auto 8px",
                        border: "2px dashed #D8D8D8", background: "#FAFAFA",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#C9C9C9", fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", lineHeight: 1 }}>
                          {station.id}
                        </span>
                      </div>
                    )}
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--fhsu-black)", lineHeight: 1.2 }}>
                      {station.stampLabel}
                    </p>
                    <p style={{ marginTop: 4 }}>
                      {stamped
                        ? <CheckCircle2 size={13} color={sc.color} strokeWidth={2.5} aria-label="Collected" style={{ display: "inline" }} />
                        : <Circle size={13} color="#D8D8D8" strokeWidth={1.5} aria-label="Not collected" style={{ display: "inline" }} />}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Share (inline, same page) ── */}
          {!progress.is_complete ? (
            <>
              <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", margin: "24px 0 12px" }}>
                Share Your Achievement
              </h2>
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
            </>
          ) : (
            <div className="slide-up" style={{
              background: "rgba(247,168,0,0.08)", border: "1.5px solid rgba(247,168,0,0.3)", borderRadius: 16,
              padding: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column", gap: 14,
              marginTop: 24,
            }}>
              <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold-text)" }}>
                Share Your Achievement
              </h2>

              {/* Completion status — sits directly on the tinted card
                  background; icon color is the only success signal, kept
                  minimal rather than introducing another colored panel */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                paddingBottom: 14, borderBottom: "1px solid rgba(247,168,0,0.25)",
              }}>
                <CheckCircle2 size={22} color="#1E9E4A" strokeWidth={2.2} aria-hidden="true" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fhsu-black)" }}>Passport Complete!</p>
                  <p style={{ fontSize: 12, color: "#6B6B6B", marginTop: 2 }}>
                    Post your achievement — add a personal reflection if you like.
                  </p>
                </div>
              </div>

              <CredlyBadgeCard isComplete={progress.is_complete} />

              {/* Reflection + preview */}
              <div>
                <label htmlFor="reflection" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Add a personal reflection <span style={{ fontWeight: 400, color: "#6B6B6B" }}>(optional)</span>
                </label>
                <textarea
                  id="reflection" value={reflection} onChange={(e) => setReflection(e.target.value)}
                  placeholder="What was your biggest takeaway from today's workshop?"
                  rows={3}
                  style={{
                    width: "100%", border: "1.5px solid #CCCCCC", borderRadius: 12,
                    padding: "12px 14px", fontSize: 13, fontFamily: "inherit",
                    background: "white", color: "#1a1a1a", resize: "vertical", lineHeight: 1.5,
                  }}
                />
              </div>

              <div>
                <label htmlFor="caption-preview" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Caption
                </label>
                {/* Single bordered box owns both the text and the copy
                    control — the button is anchored inside its top-right
                    corner, the same relationship a code block's copy
                    button has to its content. */}
                <div style={{
                  position: "relative",
                  border: "1.5px solid rgba(247,168,0,0.3)", borderRadius: 12,
                  background: "white",
                }}>
                  <button
                    onClick={copyCaption}
                    aria-label={captionCopied ? "Caption copied to clipboard" : "Copy caption to clipboard"}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      background: captionCopied ? "rgba(247,168,0,0.14)" : "white",
                      color: captionCopied ? "var(--gold-text)" : "var(--fhsu-black)",
                      border: "1.5px solid " + (captionCopied ? "var(--fhsu-gold)" : "rgba(247,168,0,0.3)"),
                      borderRadius: 8, padding: "5px 10px", minHeight: 28,
                      fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <Copy size={12} strokeWidth={2} aria-hidden="true" />
                    <span aria-live="polite">{captionCopied ? "Copied!" : "Copy"}</span>
                  </button>
                  <p id="caption-preview" style={{
                    fontSize: 13, color: "#333", lineHeight: 1.6, whiteSpace: "pre-wrap",
                    padding: "14px 90px 14px 14px", margin: 0,
                  }}>
                    {fullCaption()}
                  </p>
                </div>
                <p style={{ fontSize: 11.5, color: "#6B6B6B", lineHeight: 1.5, marginTop: 8, padding: "0 14px" }}>
                  Copy the caption above, then paste it into the post LinkedIn opens.
                </p>
              </div>

              {/* Actions — copy-link is secondary, so it sits to the side of
                  the primary LinkedIn CTA rather than stacked below it */}
              <div style={{ display: "flex", gap: 10 }}>
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
                  href={buildLinkedInUrl()} target="_blank" rel="noopener noreferrer"
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
            </div>
          )}

          <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: "#AAA", marginTop: 20 }}>
            <Share2 size={11} aria-hidden="true" /> {progress.email}
          </p>

          {isOwner && (
            <button
              onClick={handleSignOut}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                margin: "20px auto 0", background: "white", color: "#888",
                border: "1px solid #DDD", borderRadius: 12,
                padding: "10px 20px", minHeight: 40, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "color 0.15s, border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#C0392B"; e.currentTarget.style.background = "#C0392B"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#DDD"; e.currentTarget.style.background = "white"; }}
            >
              <LogOut size={14} strokeWidth={2} aria-hidden="true" /> Sign out
            </button>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
