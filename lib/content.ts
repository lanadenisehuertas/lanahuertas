// Single source of truth for all portfolio content.
// Adding a work category = adding an entry to `workTabs`. Nothing else changes.

export type Project = {
  id: string;
  title: string;
  /** One-line caption shown on the card. */
  blurb?: string;
  image?: string;
  video?: string;
  tags?: string[];
  href?: string;

  // --- Detail view -------------------------------------------------------
  /** Full write-up shown in the lightbox. */
  description?: string;
  client?: string;
  year?: string;
  role?: string;
  /** Software/techniques used, e.g. ["Photoshop", "Illustrator"]. */
  tools?: string[];
};

export type WorkTab = {
  id: string;
  label: string;
  heading: string;
  blurb: string;
  accent: "eminence" | "iris" | "deep" | "fawn" | "maize";
  projects: Project[];
};

export const profile = {
  name: "Lana Denise Huertas",
  short: "Lana Huertas",
  roles: ["Graphic Designer", "Video Editor", "Software Engineer"],
  // Street address deliberately omitted — full address lives on the resume only.
  location: "Manila, Philippines",
  email: "lanadenisehuertas@gmail.com",
  tagline: "Let's create something great.",
  years: "7+ years",

  // Title area: name first, then what I solve, then what I make.
  title: "Hi, I'm Lana.",
  titleRole: "Graphic designer, video editor, and problem solver.",
  welcome:
    "Welcome to my portfolio. Manila-based, 7+ years deep in Photoshop and Premiere Pro, turning rough ideas into work that holds attention.",

  // Short version, for the card directly under the title.
  shortAbout:
    "Brand identities, publicity materials, and video edits that get looked at twice. Fast, detail-obsessed, always on time. Now studying Computer Science at FEU Tech — so I build what I design.",

  intro:
    "Manila-based designer and video editor with 7+ years across Photoshop and Premiere Pro. Highly adaptable, obsessed with the details, and always on time.",
  summary:
    "Creative professional with 7+ years in graphic design, video editing, and social media content, dating back to 2019 through freelance, school, and organizational work. Advanced in Photoshop, Illustrator, Premiere Pro, After Effects, and Canva, producing branded graphics, promotional videos, and multi-platform social content aligned to client brand voice. Experienced managing content calendars and coordinating remote creative teams across Facebook, Instagram, TikTok, and X. Currently completing a B.S. in Computer Science — Software Engineering.",
};

// Most recent first.
export const experience = [
  {
    role: "Freelance Graphic Designer & Video Editor",
    org: "Self-directed — client work",
    place: "Remote, PH",
    period: "2023 — Present",
    points: [
      "Design branded graphics, publicity materials, and social content for clients across multiple industries.",
      "Cut and finish video in Premiere Pro and After Effects, from short-form social edits to event recaps.",
      "Deliver final assets as organized, editable Canva templates so clients can make small updates themselves.",
    ],
  },
  {
    role: "Multimedia Team Editor",
    org: "Lord Jesus Fellowship Church",
    place: "Bataan, PH",
    period: "2020 — 2025",
    points: [
      "Produced weekly branded video content for digital outreach and live programs in Premiere Pro and After Effects.",
      "Designed graphics, banners, and visual assets keeping a consistent brand identity across social platforms.",
      "Managed content scheduling and publishing across Facebook, Instagram, and YouTube to grow engagement.",
      "Coordinated remotely with teams on content calendars and weekly publishing deadlines.",
    ],
  },
  {
    role: "Creatives Committee Head",
    org: "Student Coordinating Council & ACM Chapter — FEU Institute of Technology",
    place: "Manila, PH",
    period: "Sep 2023 — Jul 2025",
    points: [
      "Led creative teams producing video edits, motion graphics, and design assets for campus-wide events and interschool competitions.",
      "Planned and ran multi-platform campaigns across Instagram, Facebook, and TikTok to drive attendance and engagement.",
      "Maintained brand consistency across digital and print materials, managing production timelines across two organizations.",
    ],
  },
  {
    role: "Editing Committee Leader",
    org: "CybeRS Robotics Club — RSHS III",
    place: "Zambales, PH",
    period: "Oct 2022 — Jul 2023",
    points: [
      "Co-founded the school's inaugural Robotics Club and established its visual branding, logo, and design guidelines.",
      "Managed a 10-member editing team producing promotional videos and graphic content for competitions.",
    ],
  },
  {
    role: "Graphic Design & Video Editing",
    org: "School & community projects",
    place: "Philippines",
    period: "2019 — 2023",
    points: [
      "Produced branded graphics and video edits for school organizations and community projects.",
      "Built foundational skills across the Adobe Creative Suite and Canva.",
    ],
  },
];

export const education = [
  {
    school: "FEU Institute of Technology",
    place: "Manila, PH",
    period: "Aug 2023 — Present",
    detail: "B.S. Computer Science — Software Engineering (Expected July 2027)",
    honors: ["Elite Scholar — FEU Tech", "DOST Scholar — Dept. of Science and Technology"],
  },
  {
    school: "Regional Science High School III",
    place: "Zambales, PH",
    period: "Graduated July 2023",
    detail: "Senior High School Diploma — Graduated with High Honors (GWA: 96)",
    honors: [],
  },
];

export const skillGroups = [
  {
    label: "graphic design",
    items: ["Photoshop", "Illustrator", "Canva", "brand identity", "layout & typography", "print & digital"],
  },
  {
    label: "video editing",
    items: ["Premiere Pro", "After Effects", "motion graphics", "color grading", "export & compression"],
  },
  {
    label: "social media management",
    items: [
      "Facebook",
      "Instagram",
      "TikTok",
      "X/Twitter",
      "content calendars",
      "organic growth & engagement",
      "community management",
      "copywriting",
      "brand voice adaptation",
    ],
  },
  {
    label: "coordination & VA support",
    items: [
      "task delegation",
      "remote team coordination",
      "scheduling",
      "digital asset management",
      "performance reporting",
    ],
  },
  {
    label: "technical",
    items: ["Python", "JavaScript", "Google Workspace", "Microsoft Office"],
  },
];

export const software = ["Ps", "Ai", "Pr", "Ae", "Ca", "Py", "Js"];

export const languages = ["Filipino (Native)", "English (Advanced)"];

// ---------------------------------------------------------------------------
// Work. Each tab renders identically — adding one is a data change.
// ---------------------------------------------------------------------------

export const workTabs: WorkTab[] = [
  {
    id: "publicity",
    label: "publicity materials",
    heading: "Publicity Materials",
    blurb:
      "Crafted with Photoshop and Illustrator for high-impact design, and delivered as Canva templates for seamless, on-the-go client editing.",
    accent: "eminence",
    projects: [],
  },
  {
    id: "mockups",
    label: "mockups",
    heading: "Mockups",
    blurb:
      "A look at recent design mockups showing how these brands live and breathe off the screen. Crafted in Photoshop to give clients a true sense of their visual identity in action.",
    accent: "fawn",
    projects: [],
  },
  {
    id: "templates",
    label: "templates",
    heading: "Templates",
    blurb:
      "Recent template systems designed for seamless client handoff. Crafted in Ps and Ai, delivered in Canva for easy, on-the-go editing.",
    accent: "maize",
    projects: [],
  },
  {
    id: "videos",
    label: "videos",
    heading: "Videos",
    blurb:
      "Motion, pacing, and impact. Cut in Premiere Pro and polished in After Effects to keep eyes glued to the screen.",
    accent: "iris",
    projects: [],
  },
  {
    id: "engineering",
    label: "engineering",
    heading: "Software Engineering",
    blurb:
      "Computer Science at FEU Tech, specialising in Software Engineering. Building in Python and JavaScript — projects landing here as they ship.",
    accent: "deep",
    projects: [],
  },
];

export const socials = [
  { label: "email", href: "mailto:lanadenisehuertas@gmail.com" },
  { label: "portfolio", href: "https://lanadenisehuertas.my.canva.site" },
];
