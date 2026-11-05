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
  lead: "I build software that solves",
  emphasis: "real problems.",
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
    details: [],
    tags: [],
  },
  {
    role: "MIS Intern",
    organization: "STI College General Santos",
    period: "January–May 2026",
    details: [],
    tags: [],
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

export type ProjectStatus = "active" | "in-development";
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

const unavailable = (title: string): ProjectSection => ({
  title,
  paragraphs: ["Not publicly available yet."],
});
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
          "ForgeKeep is an MMORPG guild operations platform for boss schedules, attendance, member management, loot, inventory, DKP, accounting, and Discord operations.",
        ],
      },
      {
        title: "Problem",
        paragraphs: [
          "Guild administration brings recurring schedules, member participation, loot records, inventory, and financial tracking into one operational workflow.",
        ],
      },
      {
        title: "Solution",
        paragraphs: [
          "ForgeKeep brings those guild workflows together in a dedicated platform, with automation and Discord operations supporting day-to-day coordination.",
        ],
      },
      {
        title: "Technical architecture",
        paragraphs: [
          "The verified development stack includes Next.js and TypeScript on the application side, with Supabase, PostgreSQL, Prisma, and Hono.js supporting the product. Further internal architecture details are not publicly documented.",
        ],
      },
      {
        title: "Features",
        paragraphs: [
          "Core guild operations are represented as connected tools rather than separate spreadsheets or messages.",
        ],
        items: [
          "Boss schedules and attendance tracking",
          "Member, loot, and inventory management",
          "DKP and accounting workflows",
          "Discord operations and real-time data synchronization",
          "OCR-supported attendance automation",
        ],
      },
      unavailable("Engineering challenges"),
      unavailable("Lessons learned"),
    ],
  },
  {
    slug: "forgekeep-wallet",
    title: "ForgeKeep Wallet",
    category: "Product feature",
    status: "in-development",
    summary: "An in-development ForgeKeep project.",
    images: [],
    technologies: [],
    sections: [
      unavailable("Overview"),
      unavailable("Problem"),
      unavailable("Solution"),
      unavailable("Technical architecture"),
      unavailable("Features"),
      unavailable("Engineering challenges"),
      unavailable("Lessons learned"),
      unavailable("Screenshots"),
    ],
  },
  {
    slug: "rural-health-unit-management-system",
    title: "Rural Health Unit Management System",
    category: "Management system",
    status: "active",
    summary: "A portfolio project with details not publicly available.",
    images: [],
    technologies: [],
    sections: [
      unavailable("Overview"),
      unavailable("Problem"),
      unavailable("Solution"),
      unavailable("Technical architecture"),
      unavailable("Features"),
      unavailable("Engineering challenges"),
      unavailable("Lessons learned"),
      unavailable("Screenshots"),
    ],
  },
  {
    slug: "sportscity",
    title: "SportsCity",
    category: "Platform",
    status: "active",
    summary: "A portfolio project with details not publicly available.",
    images: [],
    technologies: [],
    sections: [
      unavailable("Overview"),
      unavailable("Problem"),
      unavailable("Solution"),
      unavailable("Technical architecture"),
      unavailable("Features"),
      unavailable("Engineering challenges"),
      unavailable("Lessons learned"),
      unavailable("Screenshots"),
    ],
  },
  {
    slug: "draftiq",
    title: "DraftIQ",
    category: "Application",
    status: "in-development",
    summary: "An in-development portfolio project.",
    images: [],
    technologies: [],
    sections: [
      unavailable("Overview"),
      unavailable("Problem"),
      unavailable("Solution"),
      unavailable("Technical architecture"),
      unavailable("Features"),
      unavailable("Engineering challenges"),
      unavailable("Lessons learned"),
      unavailable("Screenshots"),
    ],
  },
];
export const SELECTED_REPOSITORIES = ["ai-bayanihan-challenge"];
export const getProject = (slug: string) =>
  PROJECTS.find((project) => project.slug === slug);
