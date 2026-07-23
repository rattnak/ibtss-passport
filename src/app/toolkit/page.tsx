"use client";

import Link from "next/link";
import { PenLine, BookOpen, ArrowRight, FileText, ExternalLink, Lock } from "lucide-react";
import { TOOLKIT_SECTIONS, WORKSHEET_PDF_KEY, PARTICIPANT_TOOLKIT_PDF_KEY } from "@/lib/toolkit";
import PostWorkshopCard from "@/components/PostWorkshopCard";
import { Footer } from "@/components/Footer";
import { useSession } from "@/lib/session";

function PdfLink({ pdfKey, label }: { pdfKey: string; label: string }) {
  const { email, openSignIn } = useSession();

  if (!email) {
    return (
      <button
        onClick={openSignIn}
        style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%",
          background: "#FAFAFA", border: "1px solid #ECECEC",
          borderRadius: 10, padding: "10px 12px", marginBottom: 14,
          cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: "#EFEFEF", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Lock size={13} color="#888" strokeWidth={2} aria-hidden="true" />
        </div>
        <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#767676" }}>Sign in to open {label}</p>
      </button>
    );
  }

  return (
    <a
      href={`/api/toolkit/pdf?which=${pdfKey}&email=${encodeURIComponent(email)}`}
      target="_blank" rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "#FAFAFA", border: "1px solid #ECECEC",
        borderRadius: 10, padding: "10px 12px", marginBottom: 14,
        textDecoration: "none",
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: "#EFEFEF", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FileText size={14} color="#888" strokeWidth={2} aria-hidden="true" />
      </div>
      <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--fhsu-black)" }}>{label}</p>
      <ExternalLink size={14} color="#999" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
    </a>
  );
}

export default function ToolkitIndexPage() {
  const worksheets = TOOLKIT_SECTIONS.filter((s) => s.interactive);
  const references = TOOLKIT_SECTIONS.filter((s) => !s.interactive && s.id !== "post-workshop");

  const card = (s: (typeof TOOLKIT_SECTIONS)[number]) => (
    <Link key={s.id} href={`/toolkit/${s.id}`} style={{
      display: "flex", alignItems: "center", gap: 12,
      background: "white",
      border: "1px solid #E8E8E8",
      borderLeft: `4px solid ${s.interactive ? "var(--fhsu-gold)" : "#CCCCCC"}`,
      borderRadius: 12, padding: "13px 14px", minHeight: 64, textDecoration: "none",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: s.interactive ? "rgba(247,168,0,0.16)" : "#F2F2F2",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {s.interactive
          ? <PenLine size={16} color="var(--gold-text)" strokeWidth={2} aria-hidden="true" />
          : <BookOpen size={16} color="#666" strokeWidth={2} aria-hidden="true" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fhsu-black)", lineHeight: 1.3 }}>{s.title}</p>
        <p style={{ fontSize: 11, color: "#767676", marginTop: 2 }}>
          {s.source}{s.interactive ? " · fill-in worksheet" : ""}
        </p>
      </div>
      <ArrowRight size={14} color="#999" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
    </Link>
  );

  return (
    <main className="min-h-full flex flex-col items-center px-4 pt-4 pb-8" style={{ background: "white" }}>
      <div className="page-container">
        <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
          Participant Toolkit
        </h1>
        <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, marginBottom: 24 }}>
          Your digital workshop companion. Sign in once and your worksheets save automatically under your passport email; reference sections are yours to keep.
        </p>

        {/* ── Box 1: Worksheets ── */}
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold-text)", marginBottom: 10 }}>
          Fill-In Worksheets
        </h2>
        <PdfLink pdfKey={WORKSHEET_PDF_KEY} label="Open full Worksheet PDF" />
        <div className="card-grid">
          {worksheets.map(card)}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #ECECEC", margin: "28px 0" }} />

        {/* ── Box 2: Reference Materials ── */}
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#767676", marginBottom: 10 }}>
          Reference Materials
        </h2>
        <PdfLink pdfKey={PARTICIPANT_TOOLKIT_PDF_KEY} label="Open full Participant Toolkit PDF" />
        <div className="card-grid">
          {references.map(card)}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #ECECEC", margin: "28px 0" }} />

        {/* ── Box 3: Post-Workshop Resources (time-gated) ── */}
        <PostWorkshopCard />

        <Footer />
      </div>
    </main>
  );
}
