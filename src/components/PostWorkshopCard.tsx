"use client";

// Post-workshop resources entry — locked until the workshop ends (Aug 5, 2026, 5:00 PM ICT).

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Lock, ArrowRight } from "lucide-react";
import { isWorkshopOver, WORKSHOP_END } from "@/lib/agenda";

export default function PostWorkshopCard() {
  // Evaluate on the client so the card unlocks without a redeploy.
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    setUnlocked(isWorkshopOver());
    // Flip automatically if someone has the page open when the session ends
    const remaining = WORKSHOP_END.getTime() - Date.now();
    if (remaining > 0 && remaining < 6 * 60 * 60 * 1000) {
      const t = setTimeout(() => setUnlocked(true), remaining);
      return () => clearTimeout(t);
    }
  }, []);

  if (!unlocked) {
    return (
      <div
        role="status"
        style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#FAFAFA", border: "1px dashed #D8D8D8", borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <Lock size={18} color="#999" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: "#767676" }}>Post-Workshop Resources</p>
          <p style={{ fontSize: 12, color: "#999", marginTop: 2, lineHeight: 1.5 }}>
            Unlocks when the session ends — Aug 5, 5:00 PM.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/toolkit/post-workshop"
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "var(--fhsu-black)", border: "1.5px solid var(--fhsu-gold)",
        borderRadius: 14, padding: "15px 16px", textDecoration: "none",
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(247,168,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Gift size={17} color="var(--fhsu-gold)" strokeWidth={2} aria-hidden="true" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fhsu-gold)" }}>Post-Workshop Resources</p>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
          Keep exploring the tools, continue learning, stay connected
        </p>
      </div>
      <ArrowRight size={15} color="var(--fhsu-gold)" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
    </Link>
  );
}
