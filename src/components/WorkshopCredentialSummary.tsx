// Public credential summary, following the structure of FHSU's real Credly
// badge page (credly.com/org/fort-hays-state-university/badge/
// ibtss-2026-ai-in-higher-education): badge image, title, issuer, earned-by
// statement, description, skills, and earning criteria — in that order.

import { CheckCircle2 } from "lucide-react";

export const BADGE_TITLE = "IBTSS 2026: AI in Higher Education";

export const BADGE_DESCRIPTION =
  "In this intensive, hands-on pre-conference workshop, higher education leaders, faculty, and administrators navigate the rapidly evolving landscape of artificial intelligence. Participants gain a shared understanding of AI's current impact on higher education globally and within the ASEAN region, examining both the challenges and promises for students, faculty, and institutions, gaining hands-on experience with AI applications on various topics in teaching, learning, and instruction.";

export const BADGE_SKILLS = [
  "AI Challenges",
  "AI Ethics",
  "Artificial Intelligence (AI)",
  "Artificial Intelligence Applications",
  "Digital Skills Development",
  "Embrace Change",
  "Organizational Readiness",
];

export const BADGE_CRITERIA =
  "Participate in the IBTSS 2026 Pre-Conference Workshop: AI in Higher Education in Phnom Penh, Cambodia.";

// Name/title/issuer/date are already shown by the navy ID hero this renders
// beneath (same unified card, white body section) — this covers what the
// hero doesn't: the earned statement, description, skills, and criteria.
// No own border/shadow/background — the parent card provides the surface.
export default function WorkshopCredentialSummary({ name }: { name: string }) {
  return (
    <div>
      {/* Solid gold fill + checkmark sets this apart from the outlined gold
          pill styling used for skill tags below, so it reads as the
          headline confirmation moment rather than another tag. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "var(--fhsu-gold)", borderRadius: 12,
        padding: "12px 16px", marginBottom: 20,
      }}>
        <CheckCircle2 size={20} color="var(--fhsu-black)" strokeWidth={2.2} aria-hidden="true" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 14.5, fontWeight: 700, color: "var(--fhsu-black)", lineHeight: 1.4 }}>
          {name} has earned this badge
        </p>
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
        Description
      </p>
      <p style={{ fontSize: 13.5, color: "#444", lineHeight: 1.65, marginBottom: 20 }}>
        {BADGE_DESCRIPTION}
      </p>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
        Skills
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {BADGE_SKILLS.map((skill) => (
          <span key={skill} style={{
            fontSize: 12, fontWeight: 700, color: "var(--gold-text)",
            background: "rgba(247,168,0,0.12)", border: "1px solid rgba(247,168,0,0.3)",
            borderRadius: 999, padding: "5px 12px",
          }}>
            {skill}
          </span>
        ))}
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#999", marginBottom: 8 }}>
        Earning Criteria
      </p>
      <p style={{ fontSize: 13.5, color: "#444", lineHeight: 1.65 }}>
        {BADGE_CRITERIA}
      </p>
    </div>
  );
}
