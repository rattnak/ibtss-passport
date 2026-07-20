import Link from "next/link";
import { ChevronLeft, PenLine, BookOpen, ArrowRight } from "lucide-react";
import { TOOLKIT_SECTIONS } from "@/lib/toolkit";
import PostWorkshopCard from "@/components/PostWorkshopCard";

export default function ToolkitIndexPage() {
  const worksheets = TOOLKIT_SECTIONS.filter((s) => s.interactive);
  // post-workshop lives in its own time-gated card at the bottom
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
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#666", fontSize: 13, textDecoration: "none", marginBottom: 18, minHeight: 44 }}>
          <ChevronLeft size={15} strokeWidth={2} aria-hidden="true" /> Back to Agenda
        </Link>

        <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
          Participant Toolkit
        </h1>
        <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, marginBottom: 24 }}>
          Your digital workshop companion. Sign in once and your worksheets save automatically under your passport email; reference sections are yours to keep.
        </p>

        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold-text)", marginBottom: 10 }}>
          Fill-In Worksheets
        </h2>
        <div className="card-grid" style={{ marginBottom: 24 }}>
          {worksheets.map(card)}
        </div>

        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#767676", marginBottom: 10 }}>
          Reference Materials
        </h2>
        <div className="card-grid">          {references.map(card)}
        </div>

        <PostWorkshopCard />
      </div>
    </main>
  );
}
