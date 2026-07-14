export type Station = {
  id: 1 | 2 | 3;
  title: string;
  /** Short label shown on the passport stamp and station badges, e.g. "Faculty · NotebookLM". */
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
    title: "Station 1 — Faculty: NotebookLM",
    stampLabel: "Faculty · NotebookLM",
    takeHome: "Starter notebook + Course Integration worksheet",
    audience: "Faculty",
    tools: ["NotebookLM"],
    description:
      "Organize course materials, develop Open Educational Resources (OER), and curate resource collections to share directly with students using Google's NotebookLM.",
    color: "from-blue-600 to-blue-800",
    accent: "blue",
    emoji: "📚",
    resources: [
      { title: "NotebookLM Guide", url: "https://notebooklm.google.com" },
      {
        title: "OER Commons",
        url: "https://www.oercommons.org",
      },
      {
        title: "FHSU Library OER Resources",
        url: "https://library.fhsu.edu",
      },
    ],
  },
  {
    id: 2,
    title: "Station 2 — Administrators & Staff: Claude",
    stampLabel: "Admin · Claude",
    takeHome: "Draft AI use policy + Human Review Checklist",
    audience: "Administrators & Staff",
    tools: ["Claude"],
    description:
      "Draft AI use policy language and sketch human-in-the-loop workflows for scheduling, reporting, and recurring office tasks using Claude. Automate the repetitive and focus on what matters, with a clear human review point.",
    color: "from-emerald-600 to-emerald-800",
    accent: "emerald",
    emoji: "⚙️",
    resources: [
      { title: "Claude by Anthropic", url: "https://claude.ai" },
      // TODO: replace with final URL once published
      { title: "Station 2 policy prompt", url: "#" },
      // TODO: replace with final URL once published
      { title: "Human Review Checklist (PDF)", url: "#" },
      { title: "Gemini (backup tool)", url: "https://gemini.google.com" },
    ],
  },
  {
    id: 3,
    title: "Station 3 — Students: Claude + Perplexity",
    stampLabel: "Students · Claude + Perplexity",
    takeHome: "Revised prompt + two-tool comparison reflection",
    audience: "Students",
    tools: ["Claude", "Perplexity"],
    description:
      "Compare AI tools side-by-side: use Claude for prompt refinement and output evaluation, and Perplexity for source-backed research and claim-checking. Practice responsible, critical AI use.",
    color: "from-violet-600 to-violet-800",
    accent: "violet",
    emoji: "🔍",
    resources: [
      { title: "Claude by Anthropic", url: "https://claude.ai" },
      { title: "Perplexity AI", url: "https://www.perplexity.ai" },
      // TODO: replace with final URL once published
      { title: "Station 3 prompt handout (PDF)", url: "#" },
      {
        title: "Responsible AI Use Guide (FHSU)",
        url: "https://www.fhsu.edu",
      },
    ],
  },
];

export function getStation(id: number): Station | undefined {
  return STATIONS.find((s) => s.id === id);
}
