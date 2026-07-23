"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, Clock, MapPin, Coffee, PenLine, BookOpen,
  Stamp, ArrowRight, FileText,
} from "lucide-react";
import { AGENDA, WORKSHOP_INFO, AgendaSession } from "@/lib/agenda";
import { Footer } from "@/components/Footer";

function SessionCard({ session }: { session: AgendaSession }) {
  const [open, setOpen] = useState(false);
  const hasLinks = session.links.length > 0;

  if (session.isBreak) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 16px", borderRadius: 12,
        border: "1px dashed #D5D5D5",
        color: "#999",
      }}>
        <Coffee size={15} strokeWidth={2} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
          {session.start} – {session.end}
        </span>
        <span style={{ fontSize: 12, lineHeight: 1.4 }}>{session.description}</span>
      </div>
    );
  }

  return (
    <div style={{
      background: "white",
      border: "1px solid #E8E8E8",
      borderLeft: `3px solid var(--gold)`,
      borderRadius: 14, overflow: "hidden",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "flex-start", gap: 14, width: "100%",
          padding: "16px 16px", minHeight: 64, background: "none", border: "none",
          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}
      >
        <div style={{ flexShrink: 0, textAlign: "center", minWidth: 52 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: "var(--fhsu-black)", lineHeight: 1.2 }}>{session.start}</p>
          <p style={{ fontSize: 10, color: "#AAA", marginTop: 2 }}>{session.end}</p>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold-text)", marginBottom: 3 }}>
            {session.label} · {session.format}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--fhsu-black)", lineHeight: 1.3 }}>{session.title}</p>
        </div>
        <ChevronDown
          size={18} color="#BBB" strokeWidth={2}
          style={{ flexShrink: 0, marginTop: 4, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        />
      </button>

      {open && (
        <div className="slide-up" style={{ padding: "0 16px 16px 82px" }}>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: hasLinks ? 14 : 0 }}>
            {session.description}
          </p>
          {hasLinks && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#AAA" }}>
                Session Materials
              </p>
              {session.links.map((link) => (
                <Link key={link.href} href={link.href} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#FAFAFA",
                  border: "1px solid #ECECEC",
                  borderRadius: 10, padding: "10px 12px",
                  textDecoration: "none",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: link.interactive ? "rgba(247,168,0,0.16)" : "#EFEFEF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {link.href === "/stations"
                      ? <Stamp size={14} color="var(--gold-text)" strokeWidth={2} />
                      : link.interactive
                        ? <PenLine size={14} color="var(--gold-text)" strokeWidth={2} />
                        : <FileText size={14} color="#888" strokeWidth={2} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--fhsu-black)", lineHeight: 1.3 }}>{link.title}</p>
                    <p style={{ fontSize: 10.5, color: "#999", marginTop: 1 }}>
                      {link.source}{link.interactive ? " · fill-in worksheet" : ""}
                    </p>
                  </div>
                  <ArrowRight size={14} color="#BBB" strokeWidth={2} style={{ flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-full flex flex-col items-center px-4 py-8" style={{ background: "white" }}>

      {/* ── Header / Banner ── */}
      <div className="mb-8" style={{ width: "100%", maxWidth: 672 }}>
        <div className="passport-cover-bg" style={{
          border: "1.5px solid var(--gold)",
          borderRadius: 16,
          padding: "20px 24px 18px",
          textAlign: "center",
          position: "relative",
        }}>
          {[
            { top: -1, left: -1, borderWidth: "2px 0 0 2px", borderRadius: "10px 0 0 0" },
            { top: -1, right: -1, borderWidth: "2px 2px 0 0", borderRadius: "0 10px 0 0" },
            { bottom: -1, left: -1, borderWidth: "0 0 2px 2px", borderRadius: "0 0 0 10px" },
            { bottom: -1, right: -1, borderWidth: "0 2px 2px 0", borderRadius: "0 0 10px 0" },
          ].map((s, i) => (
            <span key={i} style={{ position: "absolute", width: 14, height: 14, borderColor: "var(--gold)", borderStyle: "solid", ...s }} />
          ))}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/FHSU-Ai.png"
            alt="FHSU AI in Higher Education — IBTSS 2026 Pre-Conference badge"
            style={{ width: 76, height: "auto", margin: "0 auto 10px", display: "block", filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.4))" }}
          />
          <p style={{ color: "var(--gold)", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
            FHSU · {WORKSHOP_INFO.event}
          </p>
          <h1 style={{ color: "var(--gold)", fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 24, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>
            AI in Higher Education
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontStyle: "italic", marginBottom: 12 }}>
            From Challenge to Opportunity
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              <Clock size={13} color="var(--gold)" strokeWidth={2} /> {WORKSHOP_INFO.date} · {WORKSHOP_INFO.time}
            </span>
            <a href="#location-map" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
              <MapPin size={13} color="var(--gold)" strokeWidth={2} />
              <span className="full-name">American University of Phnom Penh</span>
              <span className="short-name">AUPP</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Agenda ── */}
      <div style={{ width: "100%", maxWidth: 672, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--fhsu-black)" }}>
            Workshop Agenda
          </h2>
          <p style={{ fontSize: 11, color: "#999" }}>Tap a session for materials</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AGENDA.map((session) => <SessionCard key={session.id} session={session} />)}
        </div>
      </div>

      {/* ── Stations shortcut ── */}
      <Link href="/stations" style={{
        width: "100%", maxWidth: 672,
        display: "flex", alignItems: "center", gap: 14, textDecoration: "none",
        background: "linear-gradient(135deg, rgba(247,168,0,0.16), rgba(247,168,0,0.06))",
        border: "1px solid var(--gold)",
        borderRadius: 14, padding: "14px 16px", marginBottom: 28,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(247,168,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Stamp size={19} color="var(--gold-text)" strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fhsu-black)" }}>AI Tool Stations Check-In</p>
          <p style={{ fontSize: 11.5, color: "var(--gold-text)", marginTop: 2 }}>
            Visit all 3 stations to complete your AI Learning Passport
          </p>
        </div>
        <ArrowRight size={17} color="var(--gold-text)" strokeWidth={2} style={{ flexShrink: 0 }} />
      </Link>

      {/* ── Passport CTA (register/sign in lives on the Passport tab) ── */}
      <Link href="/my-passport" style={{
        width: "100%", maxWidth: 672,
        display: "flex", alignItems: "center", gap: 14, textDecoration: "none",
        background: "var(--fhsu-black)",
        borderRadius: 14, padding: "16px 18px", marginBottom: 28,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(247,168,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <BookOpen size={19} color="var(--fhsu-gold)" strokeWidth={2} aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fhsu-gold)" }}>Get your AI Learning Passport</p>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
            Register or sign in to collect stamps and save your worksheets
          </p>
        </div>
        <ArrowRight size={17} color="var(--fhsu-gold)" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
      </Link>

      {/* ── Location map ── */}
      <div id="location-map" style={{ width: "100%", maxWidth: 672, marginBottom: 28, scrollMarginTop: 20 }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 12 }}>
          Location
        </h2>
        <div style={{
          border: "1px solid #ECECEC", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}>
          <iframe
            title="American University of Phnom Penh location"
            src="https://www.google.com/maps?q=American+University+of+Phnom+Penh&output=embed"
            width="100%" height="220" style={{ border: 0, display: "block" }}
            loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
