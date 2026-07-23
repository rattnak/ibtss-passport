"use client";

// Shown on a completed passport once the workshop has ended: congratulates
// the participant and links to the Credly claim-your-badge guide.

import { useEffect, useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { isWorkshopOver, WORKSHOP_END } from "@/lib/agenda";

export default function CredlyBadgeCard({ isComplete }: { isComplete: boolean }) {
  const [workshopOver, setWorkshopOver] = useState(false);

  useEffect(() => {
    setWorkshopOver(isWorkshopOver());
    const remaining = WORKSHOP_END.getTime() - Date.now();
    if (remaining > 0 && remaining < 6 * 60 * 60 * 1000) {
      const t = setTimeout(() => setWorkshopOver(true), remaining);
      return () => clearTimeout(t);
    }
  }, []);

  if (!isComplete || !workshopOver) return null;

  return (
    <div className="slide-up" style={{
      background: "var(--fhsu-black)", borderRadius: 16, padding: "18px 18px",
      border: "1.5px solid var(--fhsu-gold)", marginTop: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <Award size={24} color="var(--fhsu-gold)" strokeWidth={2} aria-hidden="true" />
        <div>
          <p style={{ fontSize: 14, fontWeight: 800, color: "var(--fhsu-gold)" }}>Congratulations!</p>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
            You completed the IBTSS 2026 AI in Higher Education workshop.
          </p>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 14 }}>
        Your digital badge is issued after the workshop team processes completions —
        you&apos;ll get a separate email from Credly when it&apos;s ready. The guide below walks
        you through creating your account, accepting your badge, and adding it to LinkedIn.
      </p>
      <a
        href="/Credly%20Badges%20at%20FHSU%20-%20Earner%20Experience.pdf"
        target="_blank" rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: "var(--fhsu-gold)", color: "var(--fhsu-black)", textDecoration: "none",
          borderRadius: 12, padding: "13px 0", minHeight: 48, fontSize: 14, fontWeight: 700,
        }}
      >
        Claim Your Credly Badge <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
      </a>
    </div>
  );
}
