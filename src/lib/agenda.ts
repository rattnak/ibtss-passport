export type AgendaLink = {
  title: string;
  href: string;
  source: string; // e.g. "Toolkit · Page 2"
  interactive?: boolean; // fillable worksheet vs. reference reading
};

export type AgendaSession = {
  id: string;
  start: string;
  end: string;
  label: string; // "Section 1", "Break", etc.
  title: string;
  format: string;
  description: string;
  isBreak?: boolean;
  links: AgendaLink[];
};

export const WORKSHOP_INFO = {
  title: "AI in Higher Education: From Challenge to Opportunity",
  event: "IBTSS 2026 Pre-Conference Workshop",
  date: "Wednesday, August 5, 2026",
  time: "1:00 – 5:00 PM",
  presenters: [
    { name: "Dr. Jeni McRay", role: "Assistant Provost of Internationalization & Strategic Initiatives, FHSU" },
    { name: "Dr. Magdalene Moy", role: "Director of Innovative Learning Strategies & Chair of Generative AI Task Force, FHSU" },
  ],
};

// Workshop ends Aug 5, 2026, 5:00 PM Indochina Time (Phnom Penh, UTC+7).
// Post-workshop resources unlock after this moment.
export const WORKSHOP_END = new Date("2026-08-05T17:00:00+07:00");

export function isWorkshopOver(now: Date = new Date()): boolean {
  return now.getTime() >= WORKSHOP_END.getTime();
}

export const AGENDA: AgendaSession[] = [
  {
    id: "welcome",
    start: "1:00",
    end: "1:20",
    label: "Welcome",
    title: "AI in My World",
    format: "Large Group · Live Polling",
    description:
      "Who is in the room, and what we already think. A show-of-hands and Menti-powered check-in on where each of us stands with AI right now — current use, confidence, policy familiarity, and our biggest concern or curiosity.",
    links: [
      { title: "AI in My World — Self-Assessment", href: "/toolkit/ai-in-my-world", source: "Toolkit · Page 2", interactive: true },
    ],
  },
  {
    id: "section-1",
    start: "1:20",
    end: "2:10",
    label: "Section 1",
    title: "The AI Landscape in Higher Education + What Does the Research Say?",
    format: "Mini-Lecture + Discussion",
    description:
      "Where we've been, where we are, and why it matters now. From calculators to generative AI, the ASEAN context, a three-stakeholder lens (faculty, students, administrators), and what current research tells us to do.",
    links: [
      { title: "AI Landscape — Lecture Notes & Reflection", href: "/toolkit/ai-landscape", source: "Toolkit · Page 3", interactive: true },
      { title: "What Does the Research Say?", href: "/toolkit/research-says", source: "Appendix · Pages 3–7" },
    ],
  },
  {
    id: "break-1",
    start: "2:10",
    end: "2:20",
    label: "Break",
    title: "Break — Identify & Discuss",
    format: "Informal",
    isBreak: true,
    description:
      "One thing so far that surprised you, confirmed something you already believed, or raised a question you want to explore today.",
    links: [],
  },
  {
    id: "section-2",
    start: "2:20",
    end: "3:30",
    label: "Section 2",
    title: "AI Tool Rotation Stations",
    format: "Hands-On Rotations · 3 × 20 min",
    description:
      "Rotate through three hands-on stations: NotebookLM for faculty, gethouston.ai for administrators & staff, and Claude + Perplexity for students. Check in at each station to stamp your AI Learning Passport.",
    links: [
      { title: "Station Check-In & Passport", href: "/stations", source: "AI Learning Passport", interactive: true },
      { title: "AI Tools for Faculty, Students & Administrators", href: "/toolkit/ai-tools", source: "Toolkit · Page 4 / Appendix · Pages 40–47" },
    ],
  },
  {
    id: "break-2",
    start: "3:30",
    end: "3:40",
    label: "Break",
    title: "Break",
    format: "Informal",
    isBreak: true,
    description: "Stretch, refill, and compare notes on what you noticed at the stations.",
    links: [],
  },
  {
    id: "section-3",
    start: "3:40",
    end: "4:30",
    label: "Section 3",
    title: "Case Studies & Strategic Reflection",
    format: "Case Analysis + Worksheets",
    description:
      "We work through the FHSU case study together — AI across program design at a regional public university — then explore cases from a large US research university, an ASEAN professional-education program, and a resource-constrained ASEAN public university.",
    links: [
      { title: "FHSU Case Study — Discussion & Reflection", href: "/toolkit/case-study-fhsu", source: "Toolkit · Pages 5–7", interactive: true },
      { title: "Case Studies in Different Contexts", href: "/toolkit/case-studies-more", source: "Appendix · Pages 8–35" },
    ],
  },
  {
    id: "closing",
    start: "4:30",
    end: "5:00",
    label: "Closing",
    title: "Toolkit Walkthrough + Personal AI Integration Plan",
    format: "Large Group",
    description:
      "A guided tour of the digital toolkit you take home — prompt library, policy templates, curated resources — and time to draft your Personal AI Integration Plan: 30 days, 3–6 months, and one year from now.",
    links: [
      { title: "Personal AI Integration Plan", href: "/toolkit/integration-plan", source: "Toolkit · Pages 8–11", interactive: true },
      { title: "Prompt Library", href: "/toolkit/prompt-library", source: "Appendix · Pages 54–62" },
      { title: "Policy Language Templates", href: "/toolkit/policy-templates", source: "Appendix · Pages 63–69" },
      { title: "Curated Resource List", href: "/toolkit/resources", source: "Appendix · Pages 47–53" },
    ],
  },
];
