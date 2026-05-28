export type Station = {
  id: 1 | 2 | 3;
  title: string;
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
    title: "NotebookLM for Faculty",
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
    title: "gethouston.ai for Administrators",
    audience: "Administrators & Staff",
    tools: ["gethouston.ai"],
    description:
      "Build low-to-no-code AI agent workflows for scheduling, reporting, and recurring office tasks. Automate the repetitive and focus on what matters.",
    color: "from-emerald-600 to-emerald-800",
    accent: "emerald",
    emoji: "⚙️",
    resources: [
      { title: "gethouston.ai Platform", url: "https://gethouston.ai" },
      {
        title: "AI Automation Starter Guide",
        url: "https://gethouston.ai/docs",
      },
      {
        title: "No-Code AI Workflow Templates",
        url: "https://gethouston.ai/templates",
      },
    ],
  },
  {
    id: 3,
    title: "Claude + Perplexity for Students",
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
