export const NAME = "Lord Kevin Francis G. Jumawak";
export const DISPLAY_NAME = "Kevin Jumawak";
export const ROLE = "Full-Stack Developer / Software Engineer";
export const LOCATION = "General Santos City, Philippines";
export const TIMEZONE = "Philippine Time (GMT+8)";
export const EMAIL = "alphadaryl0425@gmail.com";
export const GITHUB_USERNAME = "OXWiz666";
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
export const AVATAR_URL = "/images/kevin-jumawak-avatar.jfif";
export const RESUME_URL = "/documents/KevinJumawak-Resume.docx";

export const HEADLINE = {
  lead: "I turn complex ideas into",
  emphasis: "useful software.",
};
export const INTRO =
  "I’m a full-stack developer and software engineer focused on modern SaaS products, intelligent automations, and community-focused platforms.";

export const HIGHLIGHTS = [
  {
    label: "Education",
    value: "BS Information Technology · STI College General Santos · 2026",
  },
  {
    label: "Focus",
    value: "Product engineering, cloud architecture, and applied AI",
  },
];

export type WorkEntry = {
  role: string;
  organization?: string;
  period: string;
  details: string[];
  tags: string[];
};
export const WORK: WorkEntry[] = [
  {
    role: "Full-Stack Developer",
    period: "May 2026–Present",
    details: [
      "Designing and developing ForgeKeep across product interfaces, backend services, data workflows, and platform integrations.",
      "Maintaining deployment workflows and the systems that support day-to-day guild operations.",
    ],
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Discord"],
  },
  {
    role: "MIS Intern",
    organization: "STI College General Santos",
    period: "January–May 2026",
    details: [
      "Supported day-to-day technical operations through troubleshooting, device maintenance, and user assistance.",
      "Worked with operating systems, networking, hardware, and practical IT support workflows.",
    ],
    tags: ["IT support", "Networking", "Hardware", "Operating systems"],
  },
];

export const ABOUT_INTRO = [
  "I build software with an emphasis on clarity, performance, security, and maintainability.",
  "My interests include product engineering, cloud architecture, and applied AI for useful automation.",
];
export const ABOUT_SUMMARY =
  "Full-stack developer experienced in building and deploying web applications, from SaaS products to management systems. I work across modern frontend, backend, database, and automation tooling with a focus on dependable workflows and clear interfaces.";

export type StackGroup = { category: string; items: string[] };
export const STACK: StackGroup[] = [
  {
    category: "Languages",
    items: [
      "TypeScript",
      "JavaScript",
      "C#",
      "PHP",
      "HTML",
      "CSS",
    ],
  },
  { category: "Frontend", items: ["Next.js", "React", "Vue.js", "Livewire"] },
  { category: "Backend", items: ["Node.js", "Hono", "Express.js", "Laravel"] },
  {
    category: "Databases & ORM",
    items: ["PostgreSQL", "Supabase", "Prisma", "Redis"],
  },
  {
    category: "Infrastructure & DevOps",
    items: ["Vercel", "Cloudflare", "Git", "GitHub"],
  },
  {
    category: "AI & Automation",
    items: ["OpenAI", "OpenCode", "Claude Code", "OCR workflows"],
  },
];

export type ProjectStatus = "active" | "in-development" | "completed" | "concept";
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Live",
  "in-development": "In Development",
  completed: "Completed",
  concept: "Concept",
};
export type ProjectSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
};
export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  imageAlt?: string;
  technologies: string[];
  sections: ProjectSection[];
};

export const PROJECTS: Project[] = [
  {
    slug: "forgekeep",
    title: "ForgeKeep",
    category: "SaaS platform",
    status: "active",
    summary:
      "An MMORPG guild operations platform for schedules, attendance, loot, and community administration.",
    liveUrl: "https://forgekeep.online",
    images: ["https://www.forgekeep.online/opengraph-image"],
    imageAlt: "Official ForgeKeep website preview",
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Prisma",
      "Hono.js",
    ],
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "ForgeKeep is a SaaS-based MMORPG guild management platform built to bring complex guild operations into one clear, dependable workspace.",
        ],
      },
      {
        title: "The coordination problem",
        paragraphs: [
          "Running a competitive guild means coordinating recurring schedules, participation records, loot decisions, inventory, and accounting across disconnected spreadsheets, chats, and tools.",
        ],
      },
      {
        title: "A unified operating system",
        paragraphs: [
          "The product centralizes member management, boss scheduling, attendance, DKP bidding, loot distribution, inventory, accounting, and Discord-connected workflows.",
        ],
      },
      {
        title: "Core capabilities",
        paragraphs: [
          "Connected tools keep guild leaders and members working from the same source of truth.",
        ],
        items: [
          "MMORPG guild and faction management",
          "Boss schedules, timers, and attendance tracking",
          "DKP bidding and loot distribution",
          "Guild inventory and accounting",
          "Discord bot integrations",
          "OCR-supported attendance automation",
          "Multi-game management support",
        ],
      },
    ],
  },
  {
    slug: "forgekeep-wallet",
    title: "ForgeKeep Wallet",
    category: "Finance product",
    status: "in-development",
    summary: "A financial management component for the ForgeKeep ecosystem.",
    images: [],
    technologies: ["Next.js", "TypeScript", "Supabase"],
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "ForgeKeep Wallet extends the platform with focused financial-management workflows for the wider ForgeKeep ecosystem. The product is currently in development.",
        ],
      },
    ],
  },
  {
    slug: "rural-health-unit-management-system",
    title: "Rural Health Unit Management System",
    category: "Healthcare system",
    status: "completed",
    summary: "A rural health unit system for patient records, appointments, EMR, inventory, and reporting.",
    images: [],
    technologies: ["Laravel", "Inertia.js", "MySQL"],
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "RHUMS organizes the day-to-day information handled by a rural health unit into one management system, giving staff a clearer way to work with patient and operational records.",
        ],
      },
      {
        title: "Core capabilities",
        paragraphs: ["The system connects essential clinical and administrative workflows."],
        items: [
          "Patient records and electronic medical records",
          "Appointment scheduling",
          "Medicine and supply inventory",
          "Operational reports",
        ],
      },
    ],
  },
  {
    slug: "sportscity",
    title: "SportsCity",
    category: "Community platform",
    status: "completed",
    summary: "A sports facility and league platform for reservations, tournaments, schedules, and standings.",
    images: [],
    technologies: ["React", "Laravel", "Inertia.js", "MySQL"],
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "SportsCity brings facility operations and community competition into one role-based platform for organizers, staff, teams, and players.",
        ],
      },
      {
        title: "Core capabilities",
        paragraphs: ["The platform supports both venue operations and league activity."],
        items: [
          "Facility reservations",
          "Tournament and league scheduling",
          "Standings and competition records",
          "Role-based dashboards",
        ],
      },
    ],
  },
  {
    slug: "draftiq",
    title: "DraftIQ",
    category: "AI companion",
    status: "concept",
    summary: "A Dota 2 companion concept for draft analysis and intelligent hero recommendations.",
    images: [],
    technologies: ["Next.js", "TypeScript", "AI / LLM"],
    sections: [
      {
        title: "Overview",
        paragraphs: [
          "DraftIQ explores how structured match context and intelligent recommendations could support better drafting decisions in Dota 2.",
        ],
      },
      {
        title: "Concept focus",
        paragraphs: ["The concept concentrates on a small set of useful draft-time decisions."],
        items: [
          "Draft composition analysis",
          "Context-aware hero recommendations",
          "Clear explanations for suggested picks",
        ],
      },
    ],
  },
];
export const SELECTED_REPOSITORIES = ["ai-bayanihan-challenge"];
export const getProject = (slug: string) =>
  PROJECTS.find((project) => project.slug === slug);
