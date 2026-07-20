export type Station = {
  id: 1 | 2 | 3;
  title: string;
  /** Short label shown on the passport stamp and station badges, e.g. "Faculty · Claude". */
  stampLabel: string;
  /** What participants leave the station with, shown on the passport/toolkit. */
  takeHome: string;
  audience: string;
  tools: string[];
  description: string;
  color: string;
  accent: string;
  emoji: string;
  resources: Resource[];
};

export type Resource = {
  title: string;
  url: string;
};

export const STATIONS: Station[] = [
  {
    id: 1,
    title: "Station 1 — Faculty: Claude",
    stampLabel: "Faculty · Claude",
    takeHome: "Revised prompt + reflection",
    audience: "Faculty",
    tools: ["Claude"],
    description:
      "Use Claude for course design and research: prompt refinement, drafting, and output evaluation. Practice responsible, critical AI use you can model for students.",
    color: "from-blue-600 to-blue-800",
    accent: "blue",
    emoji: "📚",
    resources: [
      { title: "Claude by Anthropic", url: "https://claude.ai" },
      { title: "Responsible AI Use Guide (FHSU)", url: "https://www.fhsu.edu/ai/images/ai-use.pdf" },
    ],
  },
  {
    id: 2,
    title: "Station 2 — Administrators & Staff: Claude Cowork",
    stampLabel: "Admin · Claude Cowork",
    takeHome: "Draft AI use policy + Human Review Checklist",
    audience: "Administrators & Staff",
    tools: ["Claude Cowork"],
    description:
      "Delegate real office work to Claude Cowork — reading and writing files, working across connected apps like Slack and Google Drive, and carrying multi-step tasks through to a finished deliverable. Draft AI use policy language and sketch human-in-the-loop workflows for scheduling, reporting, and recurring office tasks, with a clear human review point at every step.",
    color: "from-emerald-600 to-emerald-800",
    accent: "emerald",
    emoji: "⚙️",
    resources: [
      { title: "Claude Cowork — Product Overview", url: "https://www.anthropic.com/product/claude-cowork" },
      { title: "Get Started with Claude Cowork", url: "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork" },
      { title: "Claude by Anthropic", url: "https://claude.ai" },
    ],
  },
  {
    id: 3,
    title: "Station 3 — Students: Gemini Notebook",
    stampLabel: "Students · Gemini Notebook",
    takeHome: "Starter notebook + Course Integration worksheet",
    audience: "Students",
    tools: ["Gemini Notebook"],
    description:
      "Organize course materials, build study guides, and curate source-grounded resource collections using Google's Gemini Notebook (formerly NotebookLM) — a hands-on introduction to AI-assisted, source-backed learning.",
    color: "from-violet-600 to-violet-800",
    accent: "violet",
    emoji: "🔍",
    resources: [
      { title: "Gemini Notebook (formerly NotebookLM)", url: "https://notebooklm.google.com" },
      { title: "Gemini Notebook for Students (Google for Education)", url: "https://edu.google.com/ai-notebooklm/" },
      { title: "Quickstart Guide: Gemini & Gemini Notebook for Education", url: "https://knowledge.workspace.google.com/admin/getting-started/editions/quickstart-guide-to-gemini-and-notebooklm-for-education" },
    ],
  },
];

export function getStation(id: number): Station | undefined {
  return STATIONS.find((s) => s.id === id);
}
