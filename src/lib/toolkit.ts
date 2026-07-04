// Participant Toolkit + Appendix content, divided into linkable sections.
// Interactive sections render fillable fields whose responses persist to Supabase.

export type ToolkitField =
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; placeholder?: string; rows?: number }
  | { type: "choice"; key: string; label: string; options: string[]; multi?: boolean }
  | { type: "scale"; key: string; label: string; low: string; high: string };

export type ToolkitBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "links"; links: { title: string; url: string; note?: string }[] }
  | { kind: "field"; field: ToolkitField };

export type ToolkitSection = {
  id: string;
  title: string;
  source: string;
  intro: string;
  interactive: boolean;
  blocks: ToolkitBlock[];
};

export const TOOLKIT_SECTIONS: ToolkitSection[] = [
  // ─────────────────────────────────────────────────────────────
  {
    id: "ai-in-my-world",
    title: "AI in My World",
    source: "Participant Toolkit · Page 2",
    intro: "Before we begin, ground yourself in where you stand with AI right now. Your answers save automatically and stay private to you.",
    interactive: true,
    blocks: [
      { kind: "heading", text: "Self-Assessment" },
      { kind: "field", field: { type: "choice", key: "current_use", label: "Current AI use", options: ["Never", "Occasionally", "Regularly"] } },
      { kind: "field", field: { type: "scale", key: "confidence", label: "Confidence with AI tools", low: "1 · None", high: "5 · High" } },
      { kind: "field", field: { type: "scale", key: "policy_familiarity", label: "Familiarity with AI policy at your institution", low: "1 · None", high: "5 · High" } },
      { kind: "field", field: { type: "textarea", key: "concern_curiosity", label: "Your greatest concern or your greatest curiosity about AI in your role", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "private_reflection", label: "A short, private reflection on where you stand with AI right now", rows: 4 } },
      { kind: "heading", text: "Discussion Questions" },
      { kind: "field", field: { type: "textarea", key: "red_lines", label: "What is one AI use case in higher education you would never support, and why?", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "governance", label: "Who should be responsible for AI governance on campus: faculty, administration, IT, students, or a shared model?", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "two_years", label: "If your institution took no action on AI for the next two years, what would happen?", rows: 3 } },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "ai-landscape",
    title: "AI Landscape in Higher Education",
    source: "Participant Toolkit · Page 3",
    intro: "Where we've been, where we are, and why it matters now. Use this page to take notes during the mini-lecture and capture your own context.",
    interactive: true,
    blocks: [
      { kind: "field", field: { type: "textarea", key: "lecture_notes", label: "Lecture notes", placeholder: "Calculators → spell check → Wikipedia → Google → generative AI. What makes AI different this time?", rows: 6 } },
      { kind: "field", field: { type: "textarea", key: "opportunities_challenges", label: "Identify the unique opportunities and critical challenges in YOUR context, from your perspective…", rows: 5 } },
      { kind: "field", field: { type: "textarea", key: "stakeholder_lens", label: "Why is a stakeholder lens useful?", rows: 3 } },
      { kind: "heading", text: "THE Question" },
      { kind: "paragraph", text: "How do we use AI thoughtfully, ethically, and equitably to enhance human learning and capabilities?" },
      { kind: "quote", text: "Our job as educators is to shape how AI is used. To teach students to use it well, not just use it. To design learning experiences that AI enhances rather than replaces. To ensure equity rather than widening divides." },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "research-says",
    title: "What Does the Research Say?",
    source: "Appendix · Pages 3–7",
    intro: "A snapshot of 2024–2025 research on AI in higher education — the encouraging findings, the documented concerns, and what the evidence tells faculty and administrators to do.",
    interactive: false,
    blocks: [
      { kind: "heading", text: "Positive Findings" },
      { kind: "list", items: [
        "AI tutoring effect sizes of 0.3–0.6 confirmed across 50+ studies, strongest in STEM and writing-intensive courses",
        "Students using AI-assisted tools completed problem sets 40% faster with no loss in retention (MIT, 2024)",
        "Adaptive platforms show 20–30% course-completion improvements in community college contexts",
        "AI-augmented courses outperform controls on transfer tasks — suggesting deeper learning (Stanford HAI, 2025)",
        "ESL students using AI writing support improved grades 18–27%; 24/7 availability disproportionately benefits working adults and rural learners",
      ]},
      { kind: "heading", text: "Concerns & Limitations" },
      { kind: "list", items: [
        "\"Cognitive offloading\": heavy AI users show reduced ability to initiate problem-solving independently (Harvard, 2024)",
        "Heavy generative-AI reliance associated with reduced original ideation over a semester (Nature Human Behaviour, 2025)",
        "The \"AI divide\": higher-SES students are 3× more likely to use AI strategically vs. reactively (Educause, 2025)",
        "AI detection tools show false-positive rates up to 61% higher for ESL writers (Stanford, 2024)",
        "Traditional text-based assessments now considered unreliable without process documentation (AERA consensus, 2025)",
        "71% of faculty feel underprepared to teach AI literacy; 58% report inadequate institutional PD",
      ]},
      { kind: "heading", text: "What Research Tells Faculty to Do" },
      { kind: "list", items: [
        "Design AI-transparent assessments (not \"AI-resistant\"): oral exams, process portfolios with AI documentation, locally-situated problems, AI + human hybrid tasks, staged in-class checks",
        "Teach WITH AI: prompt engineering as literacy, SIFT framework adapted for AI outputs, AI red-teaming exercises, model your own AI use transparently",
        "Redefine learning objectives: Bloom's top tiers as the baseline, AI literacy as a program-level outcome, distinguish AI-augmentable vs. human-essential skills",
      ]},
      { kind: "heading", text: "What Research Tells Administrators to Do" },
      { kind: "list", items: [
        "Establish clear, contextual AI policies — course-level and tied to learning objectives; blanket bans are ineffective and erode trust",
        "Adopt AI-use disclosure protocols and consider co-developed \"AI use contracts\" with students",
        "Invest in faculty development: hands-on, discipline-specific, ongoing — with time and course release for redesign",
      ]},
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "ai-tools",
    title: "AI Tools for Faculty, Students & Administrators",
    source: "Toolkit · Page 4 / Appendix · Pages 40–47",
    intro: "The highlight reel of the appendix tool guide — the tools featured at today's stations plus the most broadly useful picks for each audience.",
    interactive: false,
    blocks: [
      { kind: "heading", text: "Today's Station Tools" },
      { kind: "links", links: [
        { title: "NotebookLM (Google)", url: "https://notebooklm.google.com", note: "Station 1 · Faculty — ground AI in YOUR course materials; summaries, study guides, OER support" },
        { title: "gethouston.ai", url: "https://gethouston.ai", note: "Station 2 · Administrators & Staff — low-to-no-code AI agent workflows for office tasks" },
        { title: "Claude (Anthropic)", url: "https://claude.ai", note: "Station 3 · Students — prompt refinement and output evaluation" },
        { title: "Perplexity", url: "https://www.perplexity.ai", note: "Station 3 · Students — source-backed research and claim-checking" },
      ]},
      { kind: "heading", text: "For Faculty" },
      { kind: "links", links: [
        { title: "MagicSchool AI", url: "https://www.magicschool.ai", note: "60+ educator tools in one platform; generous free tier — best starting point" },
        { title: "Diffit", url: "https://www.diffit.me", note: "Adapts readings to multiple literacy/language levels — excellent for multilingual classrooms" },
        { title: "Elicit", url: "https://elicit.com", note: "AI research assistant for literature reviews" },
        { title: "Consensus", url: "https://consensus.app", note: "Ask a research question, get a cited consensus summary" },
        { title: "Gradescope", url: "https://www.gradescope.com", note: "AI-assisted grading for STEM and large-enrollment courses" },
      ]},
      { kind: "heading", text: "For Students" },
      { kind: "links", links: [
        { title: "Khanmigo (Khan Academy)", url: "https://www.khanacademy.org/khan-labs", note: "Socratic AI tutor — guides thinking rather than giving answers" },
        { title: "Grammarly", url: "https://www.grammarly.com", note: "Grammar, tone, and style across all writing levels" },
        { title: "Semantic Scholar", url: "https://www.semanticscholar.org", note: "Free academic search across 200M+ papers with TLDR summaries" },
        { title: "Anki", url: "https://apps.ankiweb.net", note: "Free spaced-repetition flashcards; works offline — strong low-bandwidth option" },
        { title: "DeepL Translator", url: "https://www.deepl.com", note: "High-accuracy translation for academic and professional text" },
      ]},
      { kind: "heading", text: "For Administrators" },
      { kind: "links", links: [
        { title: "ChatGPT / Claude", url: "https://claude.ai", note: "Draft policies, reports, communications — pair with the toolkit's prompt library" },
        { title: "Microsoft Copilot / Google Gemini for Workspace", url: "https://workspace.google.com/solutions/ai/", note: "AI embedded in the office suite your institution already uses" },
        { title: "Otter.ai", url: "https://otter.ai", note: "Meeting transcription, summaries, and action items — 300 free min/month" },
        { title: "Zapier", url: "https://zapier.com", note: "No-code automation connecting 6,000+ apps" },
        { title: "Chatbase", url: "https://www.chatbase.co", note: "No-code chatbots trained on your institutional documents — after-hours student queries" },
      ]},
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "case-study-fhsu",
    title: "FHSU — Example Case Study",
    source: "Participant Toolkit · Pages 5–7",
    intro: "AI Across Program Design at a regional public university. We work through this case together, then you capture your reflections below.",
    interactive: true,
    blocks: [
      { kind: "heading", text: "The Situation" },
      { kind: "paragraph", text: "FHSU (12,849 students; ~70% take some or all coursework online) faced a familiar tension: the same AI tools faculty were embedding as professional practice — clinical simulation chatbots, AI-assisted reading instruction — were framed elsewhere in the same programs as integrity threats. Students received contradictory signals: in one course AI was a required clinical training partner, in the next a banned shortcut. The question became how to build coherence between AI as taught content, AI as instructional tool, and AI as object of professional judgment." },
      { kind: "heading", text: "The Response — Three Active Levels" },
      { kind: "list", items: [
        "Level 1 · Institutional Infrastructure: standing Generative AI Task Force; AI listening sessions across all colleges; standardized AI guidance across Academic Integrity, Teaching, and Scholarly Activities documents; AI literacy in the first-year seminar; AI Institute & Fair, Hackathon, and Living Learning Community",
        "Level 2 · Program-Level Application: BSW/MSW redesign — ten-course curriculum audit in two waves, four-tab curriculum matrix, chatbot simulations, three-level human-in-the-loop governance, realist evaluation for longitudinal study",
        "Level 3 · Faculty Capacity: distributed instructional design team, Digital Teaching Champions peer mentoring, AI workshops for varied audiences, workload recognition reframed as institutional sustainability",
      ]},
      { kind: "heading", text: "Key Lessons" },
      { kind: "list", items: [
        "Program-level coherence is the smallest unit at which the policing-vs-simulation contradiction can be resolved",
        "Curriculum matrices work as discovery tools, not documentation tools",
        "Accreditation acts as a forcing function, not a barrier",
        "Institutional infrastructure is necessary but not sufficient",
        "Regional rural context shapes needs differently than research-intensive contexts",
      ]},
      { kind: "heading", text: "Discussion Questions" },
      { kind: "field", field: { type: "textarea", key: "q1_contradiction", label: "1. Where does the policing-versus-simulation contradiction appear most sharply in your own institution?", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "q2_entry_program", label: "2. Could a single program at your institution serve as the entry point for program-level AI redesign? What makes a program a good candidate?", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "q3_infrastructure", label: "3. What institutional infrastructure already exists that could support program-level AI work? What is missing?", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "q4_accreditation", label: "4. Does accreditation operate as a barrier or a forcing function at your institution, and why?", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "q5_sequencing", label: "5. What does sequencing look like at your institution — are you running a strategy, or stitching one together?", rows: 3 } },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "case-studies-more",
    title: "Case Studies in Different Contexts",
    source: "Appendix · Pages 8–35",
    intro: "Three contrasting institutional responses to AI — worked through independently or in small groups, or facilitated back at your home campus.",
    interactive: false,
    blocks: [
      { kind: "heading", text: "Case 1 · AI Literacy Initiative (Large US Research University)" },
      { kind: "paragraph", text: "A well-resourced university (>80,000 students) responded to the 2023 AI crisis with a three-phase approach: rapid cross-functional task force including students; an AI literacy framework embedded as a graduation requirement; and $2,000–5,000 faculty innovation grants. Results after 18 months: AI-related integrity cases fell from 200+ to 45, faculty comfort rose from 23% to 78%. Cost: $500K+ in year one." },
      { kind: "list", items: [
        "Key lessons: student voice matters · principles over rules · discipline-specific guidance beats one-size-fits-all · faculty support is non-negotiable · reframe from threat to opportunity",
      ]},
      { kind: "heading", text: "Case 2 · AI Tutoring for Working Adults (ASEAN Professional Education)" },
      { kind: "paragraph", text: "A Thai university's evening Digital Marketing certificate piloted \"MarkBot\" — a custom GPT-4 tutor on LINE, available 24/7 in Thai or English, programmed to guide rather than answer. Combined with AI-assisted peer groups, adaptive pre-learning modules, and AI-first draft feedback: completion rose from 65% to 82%, faculty grading time fell 40%, and the Thai–international performance gap narrowed 30%. Cost: ~$15/student/month." },
      { kind: "list", items: [
        "Key lessons: adult learners with time constraints are the ideal AI use case · supplement, don't replace · multilingual support is an equity lever · start small and iterate · faculty buy-in follows visible benefit",
      ]},
      { kind: "heading", text: "Case 3 · Resource-Constrained Innovation (ASEAN Public University, Health Sciences)" },
      { kind: "paragraph", text: "With no budget for tools, detection, or training, a 9,000-student university chose radical transparency: a crowdsourced policy (\"AI as Cognitive Partner, Not Cognitive Replacement\"), the \"Show Your Thinking\" protocol (disclose AI use + reflect, worth 10–15% of the grade — violation is hiding AI, not using it), zero-cost peer learning circles, student-led \"AI 101 for Professors\" workshops, and the 3 Cs assignment redesign test (Context · Creativity · Conversation). Nine months later: 85% faculty adoption, integrity cases down 60%, total cost ~$5,000." },
      { kind: "list", items: [
        "Key lessons: you don't need money, you need community · transparency > policing · principles > prescriptions · students as partners · \"good enough\" beats perfect",
      ]},
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "integration-plan",
    title: "Personal AI Integration Plan",
    source: "Participant Toolkit · Pages 8–11",
    intro: "Set realistic, concrete commitments across three time horizons. Write in specific, observable terms — not \"learn more about AI\" but \"complete one structured prompt-engineering activity using my syllabus.\" Your plan saves automatically.",
    interactive: true,
    blocks: [
      { kind: "heading", text: "Part 1 · Where I Am Now" },
      { kind: "field", field: { type: "text", key: "role", label: "My primary role (faculty / administrator / other)" } },
      { kind: "field", field: { type: "text", key: "institution", label: "My institution type and context" } },
      { kind: "field", field: { type: "text", key: "tool_explored", label: "One AI tool I have already used or explored" } },
      { kind: "field", field: { type: "textarea", key: "biggest_challenge", label: "The biggest AI-related challenge I face in my role right now", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "opportunity", label: "One opportunity I do not want my institution to miss", rows: 3 } },
      { kind: "field", field: { type: "choice", key: "institution_stage", label: "My honest assessment of where my institution stands today", options: [
        "No policy or guidance and little conversation happening",
        "Conversations are starting but there is no formal direction yet",
        "Some policy or guidance but limited faculty development or support",
        "Policy, some training, and early implementation underway",
        "A coordinated institutional approach we are actively refining",
      ] } },
      { kind: "heading", text: "Next 30 Days · Build My Foundation" },
      { kind: "field", field: { type: "textarea", key: "d30_actions", label: "In my teaching or administrative practice, I will (choose 2–3 small, low-risk actions)", rows: 4 } },
      { kind: "field", field: { type: "text", key: "d30_tool", label: "One AI tool from today's workshop I will explore — and the specific use I will try" } },
      { kind: "field", field: { type: "text", key: "d30_conversation", label: "One conversation I will initiate at my institution (and with whom)" } },
      { kind: "field", field: { type: "text", key: "d30_resource", label: "One resource from the Digital Toolkit I will read or apply" } },
      { kind: "heading", text: "3–6 Months · Build Capacity and Expand" },
      { kind: "field", field: { type: "textarea", key: "m36_change", label: "In my course design or administrative workflows, I will make this concrete change", rows: 3 } },
      { kind: "field", field: { type: "choice", key: "m36_sharing", label: "I will share what I have learned with colleagues by", multi: true, options: [
        "Informal conversation or peer sharing",
        "Presenting at a department or team meeting",
        "Proposing a faculty development session or working group",
        "Contributing to or drafting institutional guidance or policy",
      ] } },
      { kind: "field", field: { type: "textarea", key: "m36_concern", label: "One policy, equity, or ethical concern I will actively work on at my institution", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "m36_barrier", label: "A barrier I anticipate and how I will address it", rows: 3 } },
      { kind: "heading", text: "One Year From Now · Sustain and Scale" },
      { kind: "field", field: { type: "textarea", key: "y1_experience", label: "In one year, I want my students or colleagues to experience AI in this way", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "y1_institutional_change", label: "One institutional change I will work toward (policy, program, structure, culture)", rows: 3 } },
      { kind: "field", field: { type: "textarea", key: "y1_indicator", label: "How I will know I have made progress — my measurable indicator", rows: 3 } },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "prompt-library",
    title: "Prompt Library",
    source: "Appendix · Pages 54–62",
    intro: "Copy and adapt these prompts into any AI tool (ChatGPT, Claude, Gemini, Copilot). Text in [brackets] is where you insert your specifics. The full library covers course design, assessment, feedback, and administrative efficiency.",
    interactive: false,
    blocks: [
      { kind: "heading", text: "Syllabus Draft Generator (Beginner)" },
      { kind: "quote", text: "I am designing a [level] course on [TOPIC] for [NUMBER] students at [TYPE OF INSTITUTION]. The course runs [NUMBER] weeks, meeting [FREQUENCY]. Students typically have [prior knowledge] and come from [cultural/linguistic context]. Create a draft syllabus with: a 150-word description, 5–7 measurable learning outcomes using Bloom's Taxonomy, a week-by-week outline, suggested assessments with weightings, and required resources. Prioritize [low-cost/open-access] materials." },
      { kind: "heading", text: "AI-Resistant Assessment Designer (Intermediate)" },
      { kind: "quote", text: "Redesign the following assessment to be more AI-resistant without compromising validity or fairness. Original assessment: [describe]. Learning outcome: [state]. Suggest three modified versions requiring authentic student thinking, how each maintains alignment, the trade-offs, and how to communicate the changes to students." },
      { kind: "heading", text: "Structured Feedback Template (Beginner)" },
      { kind: "quote", text: "I am providing feedback on a [assignment type] by a [level] student. Assignment: [paste]. Rubric criteria: [list]. Score: [grade]. Draft constructive feedback that opens with a specific strength, addresses 2–3 improvements with concrete suggestions, connects to learning outcomes, and closes encouragingly — 150–250 words, culturally sensitive for [regional context]." },
      { kind: "heading", text: "Policy Document Drafter (Intermediate)" },
      { kind: "quote", text: "Draft a [departmental/institutional] policy on [AI use in student assessments] for [institution type] in [country/region]. Use clear, non-legalistic language. Include purpose, scope, definitions, permitted and prohibited uses, consequences, and a review schedule. Balance innovation with academic integrity." },
      { kind: "heading", text: "PD Workshop Designer (Intermediate)" },
      { kind: "quote", text: "Design a [NUMBER]-hour professional development workshop for [NUMBER] faculty at [institution type] on [topic]. Participants: [profile, e.g., senior faculty, skeptical but open]. Include 3–4 learning outcomes, a timed session outline, two hands-on activities, a discussion protocol, a take-home resource, facilitator notes for managing resistance, and pre/post survey questions." },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "policy-templates",
    title: "Policy Language Templates",
    source: "Appendix · Pages 63–69",
    intro: "Draft language for AI use policies, academic integrity guidelines, and student-facing guidance. All templates should be reviewed by legal counsel and governance bodies, and adapted to your local context.",
    interactive: false,
    blocks: [
      { kind: "heading", text: "The Four Templates" },
      { kind: "list", items: [
        "Template 1 · Institutional AI Use Policy Framework — purpose, scope, definitions, guiding principles (learning first, transparency, contextual flexibility, equity, continuous learning), student/faculty responsibilities, misconduct, data privacy, review schedule",
        "Template 2 · Course-Level AI Use Statement — syllabus language setting expectations per assessment, with an \"ask before you submit\" norm",
        "Template 3 · Student-Facing AI Use Guide — quick-reference rules, an AI Use Statement disclosure template, five rules for responsible use, and warning signs AI is hurting your learning",
        "Template 4 · Academic Integrity Policy Addendum — classifies AI-related misconduct by severity and empowers educational-first resolution",
      ]},
      { kind: "heading", text: "The Four Assessment Categories" },
      { kind: "list", items: [
        "Category 1 · AI Not Permitted — closed assessment; submitted work entirely the student's own",
        "Category 2 · AI Permitted for Specified Tasks Only — e.g., grammar checking; all use disclosed",
        "Category 3 · AI Permitted with Full Disclosure — AI throughout the process, documented in an AI Use Statement with critical reflection",
        "Category 4 · AI-Integrated Assessment — AI use required; the critical engagement with the tool is what's assessed",
      ]},
      { kind: "heading", text: "Five Rules for Responsible Student Use" },
      { kind: "list", items: [
        "Disclose when required — hiding AI use is dishonest even if the work is good",
        "Verify everything — AI produces plausible but incorrect information",
        "Protect privacy — never enter personal data into public AI tools",
        "Think critically — AI reproduces biases and cultural assumptions; evaluate, don't accept",
        "Keep your voice — your perspective, experience, and cultural knowledge are valuable",
      ]},
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "resources",
    title: "Curated Resource List",
    source: "Appendix · Pages 47–53",
    intro: "For institutional leaders and policy practitioners. Cross-regional starting points first, then context-specific resources for US/Western, ASEAN, and Indian higher education.",
    interactive: false,
    blocks: [
      { kind: "heading", text: "Start Here — Cross-Regional" },
      { kind: "links", links: [
        { title: "UNESCO (2023) — ChatGPT and AI in Higher Education: Quick Start Guide", url: "https://www.iesalc.unesco.org/en/", note: "Practical policy guidance for administrators; freely available" },
        { title: "OECD (2023) — Generative AI and the Future of Education", url: "https://doi.org/10.1787/17c4a907-en", note: "Cross-national policy analysis on governance, equity, curriculum" },
        { title: "Mollick (2024) — Co-Intelligence: Living and Working with AI", url: "https://www.penguinrandomhouse.com/books/741805/co-intelligence-by-ethan-mollick/", note: "Widely used in faculty development programs" },
        { title: "Dwivedi et al. (2023) — \"So what if ChatGPT wrote it?\"", url: "https://doi.org/10.1016/j.ijinfomgt.2023.102642", note: "Landmark multidisciplinary synthesis; open access" },
      ]},
      { kind: "heading", text: "US & Western Contexts" },
      { kind: "links", links: [
        { title: "EDUCAUSE Horizon Report — Teaching & Learning Edition", url: "https://www.educause.edu/horizon-report", note: "Annual flagship on emerging tech and institutional readiness" },
        { title: "US Dept. of Education (2023) — AI and the Future of Teaching and Learning", url: "https://www2.ed.gov/documents/ai-report/ai-report.pdf", note: "Official US federal policy framework" },
        { title: "Bowen & Watson (2024) — Teaching with AI (Johns Hopkins UP)", url: "https://www.press.jhu.edu/books/title/53869/teaching-ai", note: "Practitioner-focused faculty development staple" },
      ]},
      { kind: "heading", text: "ASEAN Contexts" },
      { kind: "links", links: [
        { title: "ASEAN Digital Masterplan 2025", url: "https://asean.org/asean-digital-masterplan-2025/", note: "The regional policy framework for digital education transformation" },
        { title: "UNESCO Bangkok (2023) — AI in Education in Asia-Pacific", url: "https://bangkok.unesco.org", note: "Equity, infrastructure, and policy gaps for the region" },
        { title: "Chan (2023) — A Comprehensive AI Policy Education Framework", url: "https://doi.org/10.1186/s41239-023-00408-3", note: "Widely referenced practical framework; open access" },
        { title: "e-Conomy SEA Report (Google, Temasek, Bain)", url: "https://services.google.com/fh/files/misc/e-conomy-sea-2023-report.pdf", note: "Context on mobile-first access and digital infrastructure" },
      ]},
      { kind: "heading", text: "Indian Contexts" },
      { kind: "links", links: [
        { title: "National Education Policy 2020", url: "https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf", note: "Foundational policy framework for Indian HE AI initiatives" },
        { title: "NITI Aayog — Responsible AI for All", url: "https://www.niti.gov.in", note: "India's national AI ethics framework" },
        { title: "UGC Guidelines on AI Tools in HE Institutions", url: "https://www.ugc.gov.in", note: "Official national regulatory guidance" },
      ]},
    ],
  },
];

// ─────────────────────────────────────────────────────────────
TOOLKIT_SECTIONS.push({
  id: "post-workshop",
  title: "Post-Workshop Resources",
  source: "After the Workshop",
  intro: "Where to go from here — keep exploring the tools you tried today, continue your learning, and stay connected with the workshop community.",
  interactive: false,
  blocks: [
    { kind: "heading", text: "Keep Exploring Today's Tools" },
    { kind: "links", links: [
      { title: "NotebookLM", url: "https://notebooklm.google.com", note: "Build a notebook from your own course materials this week" },
      { title: "gethouston.ai", url: "https://gethouston.ai", note: "Sketch one agent workflow: trigger → information source → action → human review" },
      { title: "Claude", url: "https://claude.ai", note: "Practice the prompt-refinement exercise from Station 3 on your own task" },
      { title: "Perplexity", url: "https://www.perplexity.ai", note: "Run the same query you gave Claude and compare the sourced answers" },
    ]},
    { kind: "heading", text: "Continue Your Learning" },
    { kind: "links", links: [
      { title: "FHSU Artificial Intelligence Guidelines", url: "https://www.fhsu.edu", note: "Academic integrity, teaching, and scholarly-activity guidance from the FHSU Generative AI Task Force" },
      { title: "UNESCO — ChatGPT and AI in Higher Education: Quick Start Guide", url: "https://www.iesalc.unesco.org/en/", note: "A practical first read for bringing today's ideas to your institution" },
      { title: "Co-Intelligence by Ethan Mollick", url: "https://www.penguinrandomhouse.com/books/741805/co-intelligence-by-ethan-mollick/", note: "The book most cited in faculty development programs on working with AI" },
    ]},
    { kind: "heading", text: "Stay Connected" },
    { kind: "links", links: [
      { title: "IBTSS 2026 International Conference", url: "https://www.aupp.edu.kh", note: "The main conference continues at AUPP, Phnom Penh" },
      { title: "FHSU Professional & Continuing Education", url: "https://www.fhsu.edu/pce/", note: "Upcoming workshops and programs from the team behind today's session" },
      { title: "Share your completion on LinkedIn", url: "https://www.linkedin.com/feed/hashtag/ibtss2026", note: "Post your passport with #IBTSS2026 #AIinEducation and see what other participants took away" },
    ]},
    { kind: "paragraph", text: "Your worksheet responses — including your Personal AI Integration Plan — stay saved under your registered email. Revisit them any time to check your 30-day, 3–6 month, and one-year commitments." },
  ],
});

export function getToolkitSection(id: string): ToolkitSection | undefined {
  return TOOLKIT_SECTIONS.find((s) => s.id === id);
}
