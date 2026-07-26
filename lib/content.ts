// Single source of truth for all portfolio content.
// Adding a work category = adding an entry to `workTabs`. Nothing else changes.

export type ProjectImage = {
  src: string;
  /** Intrinsic pixel size — reserves layout space so nothing shifts on load. */
  w: number;
  h: number;
  caption?: string;
};

export type Project = {
  id: string;
  title: string;
  /** images[0] is the cover shown on the card; the rest open in the lightbox. */
  images: ProjectImage[];
  /** Columns out of 12. Art direction, not derived — some pieces earn more room. */
  span?: 3 | 6;

  description?: string;
  client?: string;
  year?: string;
  role?: string;
  tools?: string[];
  href?: string;
  hrefLabel?: string;

  // --- Video only --------------------------------------------------------
  isVideo?: boolean;
  duration?: string;
  /** YouTube/Vimeo watch URL. Until set, the lightbox shows the poster only. */
  videoUrl?: string;
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
  roles: ["UI/UX Designer", "Graphic Designer", "Video Editor", "Software Engineer"],
  // Street address deliberately omitted — full address lives on the resume only.
  location: "Manila, Philippines",
  email: "lanadenisehuertas@gmail.com",
  years: "7+ years",

  title: "Hi, I'm Lana.",
  titleRole: "UI/UX designer, graphic designer, video editor, and problem solver.",
  // Hero. Kept to one line and one supporting line — everything else about
  // her is stated properly further down the page.
  heroLead: "I make work that's",
  heroAccent: "hard to scroll past.",
  heroSub: "UI/UX and visual designer, Manila-based · 7+ years across Figma, Photoshop and Premiere · CS student who ships what she designs.",

  welcome:
    "Welcome to my portfolio. Manila-based UI/UX and visual designer, 7+ years deep in Figma, Photoshop and Premiere Pro, turning rough ideas into work that holds attention.",

  shortAbout:
    "Brand identities, publicity materials, and video edits that get looked at twice. Fast, detail-obsessed, always on time. Now studying Computer Science at FEU Tech — so I build what I design.",

  // Long-form about, shown in the About Me folder tab.
  aboutHeadline: "I build high-quality visual content and adaptable designs for brands that want to stand out.",
  aboutKicker: "And I can do it for you, too.",
  aboutBody:
    "I pride myself on being a highly adaptable creative. I bring a meticulous eye for detail and a versatile skill set, backed by 7+ years in Photoshop, 6 years in Premiere Pro, and a sharp command of Illustrator. From crafting high-impact publicity materials and scalable templates to pacing dynamic video edits, I handle the creative heavy lifting so you don't have to.",

  summary:
    "Creative professional with 7+ years in graphic design, video editing, and social media content, dating back to 2019 through freelance, school, and organizational work. Advanced in Photoshop, Illustrator, Premiere Pro, After Effects, and Canva, producing branded graphics, promotional videos, and multi-platform social content aligned to client brand voice. Experienced managing content calendars and coordinating remote creative teams across Facebook, Instagram, TikTok, and X. Currently completing a B.S. in Computer Science — Software Engineering.",
};

/** Tool badges shown floating around the portrait. */
export const toolkit = [
  { id: "ps", label: "Ps", name: "Adobe Photoshop", bg: "#001E36", fg: "#31A8FF" },
  { id: "ai", label: "Ai", name: "Adobe Illustrator", bg: "#330000", fg: "#FF9A00" },
  { id: "pr", label: "Pr", name: "Adobe Premiere Pro", bg: "#2A0634", fg: "#EA77FF" },
  { id: "ae", label: "Ae", name: "Adobe After Effects", bg: "#1F0740", fg: "#9999FF" },
  { id: "ca", label: "Ca", name: "Canva", bg: "#0B0F2B", fg: "#00C4CC" },
  { id: "fg", label: "Fg", name: "Figma", bg: "#12111A", fg: "#F24E1E" },
  { id: "py", label: "Py", name: "Python", bg: "#0E2233", fg: "#FFD43B" },
  { id: "js", label: "Js", name: "JavaScript", bg: "#2B2A15", fg: "#F7DF1E" },
] as const;

// Most recent first. Bullets kept to two lines each — the detail lives in the
// projects, not here.
export const experience = [
  {
    role: "Freelance Graphic Designer & Video Editor",
    org: "Self-directed — client work",
    place: "Remote, PH",
    period: "2023 — Present",
    points: [
      "Branded graphics, publicity materials, and social content for clients across several industries.",
      "Video cut and finished in Premiere Pro and After Effects, delivered with editable Canva templates for handoff.",
    ],
  },
  {
    role: "Multimedia Team Editor",
    org: "Lord Jesus Fellowship Church",
    place: "Bataan, PH",
    period: "2020 — 2025",
    points: [
      "Produced weekly video and graphics for digital outreach and live programs.",
      "Ran content scheduling across Facebook, Instagram, and YouTube on a fixed weekly deadline.",
    ],
  },
  {
    role: "Creatives Committee Head",
    org: "Student Coordinating Council & ACM Chapter — FEU Tech",
    place: "Manila, PH",
    period: "Sep 2023 — Jul 2025",
    points: [
      "Led creative teams across two organizations, producing campaign art for campus-wide events.",
      "Planned multi-platform campaigns on Instagram, Facebook, and TikTok, and held brand consistency across print and digital.",
    ],
  },
  {
    role: "Editing Committee Leader",
    org: "CybeRS Robotics Club — RSHS III",
    place: "Zambales, PH",
    period: "Oct 2022 — Jul 2023",
    points: [
      "Co-founded the club and built its visual identity — logo, palette, and design guidelines.",
      "Managed a 10-member editing team producing competition video and graphics.",
    ],
  },
  {
    role: "Graphic Design & Video Editing",
    org: "School & community projects",
    place: "Philippines",
    period: "2019 — 2023",
    points: [
      "Graphics and video edits for school organizations and community projects.",
      "Where the Adobe Creative Suite habit started.",
    ],
  },
];

export const education = [
  {
    school: "FEU Institute of Technology",
    place: "Manila, PH",
    period: "Aug 2023 — Present",
    detail: "B.S. Computer Science — Software Engineering (Expected July 2027)",
    coursework:
      "Digital Image Processing · Discrete Mathematics & Number Theory · Logic & Critical Thinking",
    honors: ["Elite Scholar — FEU Tech", "DOST Scholar — Dept. of Science and Technology"],
  },
  {
    school: "Regional Science High School III",
    place: "Zambales, PH",
    period: "Graduated July 2023",
    detail: "Senior High School Diploma — Graduated with High Honors (GWA: 96)",
    coursework: "",
    honors: [],
  },
];

export const certifications = [
  {
    name: "IT Specialist — Python",
    issuer: "Certiport · Pearson VUE",
    date: "July 2025",
    detail: "Credential ID JdyU-4wb2 · verify.certiport.com",
  },
  {
    name: "Complete Guide to Android Development with Kotlin",
    issuer: "LinkedIn Learning",
    date: "November 2025",
    detail: "6h 45m · Kotlin, Android Development",
  },
];

export const skillGroups = [
  {
    label: "design",
    items: [
      "UI/UX principles",
      "design systems",
      "typography & visual hierarchy",
      "Figma",
      "Photoshop",
      "Illustrator",
      "Canva",
      "brand identity",
      "print & digital",
    ],
  },
  {
    label: "programming",
    items: ["Python", "JavaScript/TypeScript", "Java", "PHP", "Kotlin", "Next.js", "Tailwind"],
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
      "copywriting",
      "brand voice adaptation",
    ],
  },
  {
    label: "ways of working",
    items: [
      "project management",
      "cross-functional coordination",
      "remote team coordination",
      "scheduling",
      "digital asset management",
    ],
  },
  {
    label: "AI tools",
    items: ["ChatGPT", "Claude"],
  },
];

export const software = ["Ps", "Ai", "Pr", "Ae", "Ca", "Py", "Js"];

export const languages = ["Filipino (Native)", "English (Advanced)"];

// ---------------------------------------------------------------------------
// Case study — rendered as its own layout, not a gallery card.
// Mirrors the information architecture of the live product site.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Software engineering. A numbered list — add the next project to the array.
// ---------------------------------------------------------------------------

export type EngineeringProject = {
  n: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  stack: string[];
  href?: string;
  hrefLabel?: string;
  /** Which visual to render beside it. */
  visual: "psyclick" | "debtledger";
};

export const engineeringProjects: EngineeringProject[] = [
  {
    n: "01",
    id: "psyclick",
    title: "PsyClick",
    tagline: "Calmer clinical screening",
    description:
      "A clinician-guided screening companion that combines questionnaires, typing rhythm, and mouse dynamics into clear decision-support reports. It captures keystroke and cursor telemetry during a clinical intake, then shows the psychologist where the client hesitated — so the session can open on what actually registered. It flags; it does not diagnose.\n\nI designed the full experience — clinician dashboards, client intake, calibration tasks, and exportable session reports — balancing clinical usability against a calm, accessible visual style, and directed a four-person cross-functional team across design, backend, and research. In use by a practising clinical psychologist.",
    role: "Lead UI/UX designer · Project manager · Backend developer",
    year: "2025 — 2026",
    stack: ["React", "Vite", "Electron", "Python", "NumPy", "SciPy", "Supabase", "SQLite"],
    href: "https://psyclick-app.vercel.app/",
    hrefLabel: "Visit the live site",
    visual: "psyclick",
  },
  {
    n: "02",
    id: "debt-ledger",
    title: "Debt Payoff Ledger",
    tagline: "Weekly allocator for a student budget",
    description:
      "A personal finance app that takes a weekly allowance, keeps back what is needed for food and school, then puts the remainder against whichever debt is due soonest. Entries stay editable until confirmed, and every week is logged.\n\nRebuilt from a single-file prototype into a production Next.js app. Rather than restart the look, I refined the original visual identity into a token-based design system. The data model was redesigned around privacy: hardcoded sample data was replaced with a real onboarding flow, and everything stays local-first by default.",
    role: "Designer · Full-stack developer",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Tailwind", "Vitest", "GitHub Actions"],
    href: "https://debt-ledger-puce.vercel.app/",
    hrefLabel: "Visit the live site",
    visual: "debtledger",
  },
];

export const workTabs: WorkTab[] = [
  {
    id: "publicity",
    label: "graphic design",
    heading: "Graphic Design",
    blurb:
      "Campaign key art and announcement sets for student organizations and campus offices. Built in Photoshop and Illustrator, sized for every platform each one had to run on.",
    accent: "eminence",
    projects: [
      {
        id: "technorun",
        title: "TechnoRun 2025",
        span: 3,
        year: "2025",
        client: "Student Coordinating Council — FEU Tech",
        role: "Event branding — full identity",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Full event identity for a charity fun run at the Quirino Grandstand, run under the line \u201ca run for a healthier FEUture\u201d.\n\nThe announcement had to carry real logistics — four race distances priced 499 to 1,499, venue, call time, a six-step registration flow, and a QR code — without losing the rainbow-track motion of the artwork. The hardest layout in the set, because every detail had to survive being read at a glance on a phone.\n\nThe race kit that shipped alongside it lives under Brand Systems.",
        href: "https://www.facebook.com/share/p/19F1hRVPpk/",
        hrefLabel: "See the event post",
        images: [{ src: "/work/technorun-poster.webp", w: 1176, h: 1600 }],
      },
      {
        id: "battle-of-the-bands",
        title: "Battle of the Bands",
        span: 3,
        year: "2024",
        client: "Student Coordinating Council — FEU Tech",
        role: "Event branding — full identity",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Identity for a campus band competition at the FEU Tech Student Plaza, 8 June 2024.\n\nThe poster is assembled as a print-and-tape collage: halftone amps, cassette decks, and vintage microphones layered under torn-paper title lettering. Deliberately rough where the rest of the campus material was clean, to match a brief about guitar battles and stage presence.",
        images: [{ src: "/work/battle-of-the-bands.webp", w: 1200, h: 1600 }],
        href: "https://www.facebook.com/share/p/1JqSHiJsb7/",
        hrefLabel: "See the event post",
      },
      {
        id: "rock-of-aces",
        title: "Rock of Aces",
        span: 6,
        year: "2025",
        client: "Student Coordinating Council — FEU Tech",
        role: "Event branding — full identity",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Identity for Rock of Aces 6.0 — the sixth annual band competition, staged as part of Technoweek 2025 at the FEU Tech gymnasium and open to bands from both FEU Tech and FEU Manila.\n\nGuitars, drums, and a keyboard burst out of a halftone starburst in hot pink and orange, with the title set as stacked, outlined lettering over the collage.",
        href: "https://www.facebook.com/share/p/1KiZ7sbrdp/",
        hrefLabel: "See the event post",
        images: [{ src: "/work/rock-of-sales.webp", w: 1600, h: 900 }],
      },
      {
        id: "feu-library",
        title: "FEU Tech Library",
        span: 3,
        year: "2025",
        client: "FEU Tech Library",
        role: "Concept, copy, and design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "An ongoing series for the campus library, where the brief was almost always the same: make an administrative notice worth stopping for.\n\nThe database announcement became a what-this-means-for-you list. The Halloween reading activity became a detective corkboard, its game mechanics doubling as the layout. Finals-week opening hours arrived disguised as a multiple-choice question — the schedule only turns up after the joke has landed.",
        images: [
          { src: "/work/biblioboo.webp", w: 1600, h: 1600, caption: "Biblioboo's Haunted Book Nook" },
          { src: "/work/finals-motivation.webp", w: 1600, h: 1600, caption: "You Can Do It, iTamaraw — finals hours" },
          { src: "/work/ebsco-office365.webp", w: 1080, h: 1080, caption: "EBSCO in Office 365" },
        ],
      },
      {
        id: "techibig",
        title: "TechIbig",
        span: 3,
        year: "2024",
        client: "FEU Institute of Technology",
        role: "Key art and layout",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Valentine's event key art built around a Las Vegas-style marquee standing in a dusk landscape, with heart-shaped bulbs and arrow signage. The chrome-and-blush palette carries the season-of-love line so the copy never has to say it twice.",
        images: [{ src: "/work/techibig.webp", w: 1382, h: 1600 }],
      },
      {
        id: "acm-dystopia",
        title: "Dystopia",
        span: 3,
        year: "2024",
        client: "ACM — FEU Tech Student Chapter",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Flagship poster for a week-long tech celebration. Distressed chrome lettering over a magenta-lit skyline, with the title echoed as a ghosted reflection underneath — a cyberpunk read that stayed legible scaled down to a feed thumbnail.",
        images: [{ src: "/work/acm-dystopia.webp", w: 1600, h: 1582 }],
      },
      {
        id: "women-in-cs",
        title: "Women in Computer Science",
        span: 3,
        year: "2025",
        client: "ACM — FEU Tech Student Chapter",
        role: "Design and retouching",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Women's History Month feature honouring seven computing pioneers — Grace Hopper, Ada Lovelace, Annie Easley, Margaret Hamilton, Gladys West, Dorothy Vaughan, and Sister Mary Keller. Archival portraits were cut out and unified under a single violet grade, so a century of source photography reads as one piece.",
        images: [{ src: "/work/women-in-cs.webp", w: 1445, h: 1600 }],
      },
      {
        id: "acm-ignition",
        title: "ACM Ignition",
        span: 3,
        year: "2024",
        client: "ACM — FEU Tech Student Chapter",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Officer engagement series poster. A lone silhouette stands at the end of a perspective corridor blowing open into a white burst — the vanishing point doing the work of pointing at the headline.",
        images: [{ src: "/work/acm-ignition.webp", w: 1276, h: 1600 }],
      },
      {
        id: "cs-night",
        title: "CS Night",
        span: 3,
        year: "2026",
        client: "ACM — FEU Tech Student Chapter",
        role: "Design and compositing",
        tools: ["Photoshop"],
        description:
          "Performer lineup for CS Night 2026, the chapter\u2019s 19th anniversary, staged as a masquerade ball.\n\nEight acts and two hosts had to sit on one graphic without any of them getting lost. Each act gets its own gilded frame arranged up a staircase, hosts anchored at the base — a billing hierarchy that reads instantly without a single label.",
        href: "https://www.facebook.com/share/p/1DqJRPbhVz/",
        hrefLabel: "See the event post",
        images: [{ src: "/work/cs-night.webp", w: 1280, h: 1600 }],
      },
      {
        id: "techno-week",
        title: "Techno Week",
        span: 3,
        year: "2025",
        client: "Student Coordinating Council — FEU Tech",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Week-long festival poster in a pastel Memphis style — overlapping colour blocks, floating app icons, and a ribbon banner carrying the dates. Built to anchor a full set of matching sub-event graphics.",
        images: [{ src: "/work/techno-week.webp", w: 1208, h: 1600 }],
      },
      {
        id: "acm-revival",
        title: "ACM Revival",
        span: 3,
        year: "2025",
        client: "ACM — FEU Tech Student Chapter",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Three-day event announcement using reaching chrome hands and light-trail ribbons against deep blue. The liquid-metal title ties it to the chapter's other chrome-led key art.",
        images: [{ src: "/work/acm-revival.webp", w: 1347, h: 1600 }],
      },
      {
        id: "student-orgs-fair",
        title: "Student Organizations Fair",
        span: 6,
        year: "2024",
        client: "Student Coordinating Council — FEU Tech",
        role: "Banner design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Header for an org fair spread across four floors of campus — leadership and recreation, engineering, computing and esports, arts and innovation.\n\nAn illustrated skyline of oversized objects (chess piece, molecule, telescope, guitar) stands in for that range, with the title held in a clean centre panel so it survives social-platform cropping.",
        href: "https://www.facebook.com/share/p/1Bgn5UtXoW/",
        hrefLabel: "See the event post",
        images: [{ src: "/work/student-orgs-fair.webp", w: 1600, h: 900 }],
      },
      {
        id: "pacsa-speakers",
        title: "PACSA Guest Speakers",
        span: 6,
        year: "2025",
        client: "Philippine Association of Campus Student Advisers",
        role: "Layout and compositing",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Speaker lineup for a national convention. Five portraits sit in alternating colour panels inside a woven, festival-inspired border — a layout that could absorb late additions without a redesign.\n\nThe certificate and delegate frame from the same convention are under Brand Systems.",
        images: [{ src: "/work/pacsa-speakers.webp", w: 1600, h: 900 }],
      },
      {
        id: "back-to-school",
        title: "Back to School Essentials",
        span: 3,
        year: "2025",
        client: "FEU Institute of Technology",
        role: "Concept, copy, and design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Semester-opening post built as an annotated flat-lay. Each item gets a hand-drawn callout with a joke attached — headphones that cancel noise, not responsibilities — which turned a routine announcement into something students actually shared.",
        images: [{ src: "/work/back-to-school.webp", w: 1080, h: 1321 }],
      },
      {
        id: "junior-officer-perks",
        title: "Perks of Being a Junior Officer",
        span: 3,
        year: "2024",
        client: "ACM — FEU Tech Student Chapter",
        role: "Infographic design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Recruitment infographic breaking four benefits into translucent glass panels over a violet event photo. Body copy is evenly ragged so the four blocks read as a set rather than a list.",
        images: [{ src: "/work/junior-officer-perks.webp", w: 1600, h: 1599 }],
      },
      {
        id: "never-again",
        title: "Never Again, Never Forget",
        span: 3,
        year: "2024",
        client: "Student Coordinating Council — FEU Tech",
        role: "Design and compositing",
        tools: ["Photoshop"],
        description:
          "Martial Law commemoration. Archival protest photography and headline clippings collaged under a hard red wash, with the title reversed out of a black block at centre — restrained on purpose, given the subject.",
        images: [{ src: "/work/never-again.webp", w: 1440, h: 1440 }],
      },
      {
        id: "pride-month",
        title: "Pride is Everywhere",
        span: 3,
        year: "2025",
        client: "FEU Institute of Technology",
        role: "Concept and design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Pride Month post. A desaturated classroom photo has its students painted back in as flat rainbow silhouettes, with a ribbon sweeping through the frame — colour used as the entire argument.",
        images: [{ src: "/work/pride-month.webp", w: 1600, h: 1600 }],
      },
      {
        id: "spooktechular",
        title: "Spooktechular",
        span: 3,
        year: "2024",
        client: "Student Coordinating Council — FEU Tech",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Halloween event graphic — a candy-filled jack-o-lantern lit from below by a wedge of orange, framed by skeleton and monster hands reaching in from the edges.",
        images: [{ src: "/work/spooktechular.webp", w: 960, h: 960 }],
      },
      {
        id: "acm-kickoff",
        title: "Kick-Off Celebration",
        span: 3,
        year: "2024",
        client: "ACM — FEU Tech Student Chapter",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Academic-year opener. Chrome and script lettering over a soft violet gradient, with a full contact footer kept quiet at the base so it never competes with the date.",
        images: [{ src: "/work/acm-kickoff.webp", w: 1440, h: 1440 }],
      },
      {
        id: "project-horizon",
        title: "Project Horizon",
        span: 3,
        year: "2024",
        role: "Visuals and illustration",
        tools: ["Illustrator", "Photoshop"],
        description:
          "Vector illustration of hikers cresting a ridge at sunrise, layered into depth planes with a radiating sky behind the title. Flat-colour work throughout — no photography.",
        href: "https://www.facebook.com/share/v/1EMNjY5vLf/",
        hrefLabel: "Watch the reel",
        images: [{ src: "/work/project-horizon.webp", w: 1131, h: 1600 }],
      },
      {
        id: "startup-qc-winners",
        title: "StartUp QC — 2nd Runner Up",
        span: 3,
        year: "2025",
        client: "ACM — FEU Tech Student Chapter",
        role: "Design and retouching",
        tools: ["Photoshop"],
        description:
          "Congratulations post for a chapter team placing third at a startup competition. The awarding photo is graded into the chapter palette and framed with sparkle accents, so a phone-shot documentation image sits comfortably beside polished key art.",
        images: [{ src: "/work/startup-qc-winners.webp", w: 1600, h: 1600 }],
      },
      {
        id: "certified-organization",
        title: "Certified Organization",
        span: 3,
        year: "2025",
        client: "Student Coordinating Council — FEU Tech",
        role: "Design and retouching",
        tools: ["Photoshop"],
        description:
          "Recognition post for a student-adviser accreditation. Condensed green display type knocked back behind a cut-out portrait, with a script signature line carrying the honouree name.",
        images: [{ src: "/work/certified-organization.webp", w: 1600, h: 1600 }],
      },
    ],
  },
  {
    id: "systems",
    label: "brand systems",
    heading: "Brand Systems",
    blurb:
      "Apparel, print, and template systems built for handoff — production-ready artwork and files a client can keep using without coming back to me.",
    accent: "fawn",
    projects: [
      {
        id: "technorun-kit",
        title: "TechnoRun Race Kit",
        span: 6,
        year: "2025",
        client: "Student Coordinating Council — FEU Tech",
        role: "Apparel and print design",
        tools: ["Illustrator", "Photoshop"],
        description:
          "Production artwork for a campus fun run, in four colourways keyed to the four race distances.\n\nThe wave that splits each singlet is the same curve across all four, so the set reads as one system while staying instantly sortable by colour at a start line. The bibs carry the same colourways, with the number block sized to stay readable in motion and a rotated repeat along the edge for side-on photography.",
        images: [
          { src: "/work/technorun-jerseys.webp", w: 1500, h: 1500, caption: "Race singlets — front and back, four colourways" },
          { src: "/work/technorun-race-bibs.webp", w: 1500, h: 1500, caption: "Race bibs — matching colourways" },
        ],
      },
      {
        id: "pacsa-kit",
        title: "PACSA Convention Kit",
        span: 6,
        year: "2025",
        client: "Philippine Association of Campus Student Advisers",
        role: "Template design",
        tools: ["Illustrator", "Photoshop"],
        description:
          "Two reusable pieces for a national convention, sharing one border drawn from Filipino woven textile motifs.\n\nThe certificate centres on a fixed text well with a set type scale, so hundreds could be filled in without the layout drifting. The delegate frame clears that same centre for a profile photo and shipped as a transparent PNG, so attendees could drop their own image in behind it.",
        images: [
          { src: "/work/pacsa-certificate.webp", w: 1500, h: 1500, caption: "Certificate template" },
          { src: "/work/pacsa-photo-frame.webp", w: 1500, h: 1500, caption: "Delegate photo frame" },
        ],
      },
      {
        id: "tabitayo-app",
        title: "Tabitayo — Seat Finder",
        span: 6,
        year: "2026",
        client: "Tabitayo",
        role: "Branding and product marketing",
        tools: ["Photoshop", "Illustrator"],
        description:
          "Branding and launch material for an event seat-finding platform.\n\nThe announcement is built as an annotated device mockup: four callouts point at real interface regions rather than floating as generic bullets, so the feature list and the screenshot explain each other.",
        href: "https://www.facebook.com/tabitayo.ph",
        hrefLabel: "See Tabitayo",
        images: [{ src: "/work/tabitayo-app.webp", w: 1297, h: 1600 }],
      },
      {
        id: "artist-connection-sizes",
        title: "Merch Size Chart",
        span: 6,
        year: "2025",
        client: "Artist Connection",
        role: "Template design",
        tools: ["Photoshop"],
        description:
          "Apparel size chart for a merchandise drop. Measurements sit in a dark table with a gold header rule over an ember-lit background — built so future drops reuse the frame and swap only the numbers.",
        images: [{ src: "/work/artist-connection-sizes.webp", w: 1600, h: 1600 }],
      },
    ],
  },
  {
    id: "videos",
    label: "videos",
    heading: "Videos",
    blurb:
      "Documentary essays, instructional series, retrospectives, and narrative shorts — cut in Premiere Pro, finished in After Effects.",
    accent: "iris",
    projects: [
      {
        id: "breaking-barriers",
        title: "Breaking Barriers",
        span: 6,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/1Uf6OpcmOi88lwccACAbSsDI10lYm0tti/view",
        duration: "4:04",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
        description:
          "Documentary video essay on Geraldine Roman, the first transgender woman elected to the Philippine Congress. Cuts between interview footage, mapped geography, and Pride march coverage, with torn-paper title cards holding the chapter breaks. The longest-form edit here and the one with the most archival sourcing behind it.",
        images: [{ src: "/work/breaking-barriers.webp", w: 1280, h: 720 }],
      },
      {
        id: "basick-math",
        title: "BaSICK Math",
        span: 6,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/1W1_06W9hxR0YlpwbsLLq_edMt-J_zRw3/view",
        duration: "4:25",
        year: "2023",
        role: "Editor and brand design",
        tools: ["Premiere Pro", "After Effects", "Illustrator"],
        description:
          "Branded instructional series — identity, animated logo sting, and lesson edit. The presenter is keyed onto a blackboard field of live equations, and the mark itself is built from a puzzle piece to carry the math-made-easy line.",
        images: [{ src: "/work/basick-math.webp", w: 1280, h: 720 }],
      },
      {
        id: "solar-system-song",
        title: "Solar System Song",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/11ojn7ZGWzAQJqwrf7Qs3LfLyLuP_0h0Y/view",
        duration: "3:00",
        year: "2022",
        role: "Editor, animator, and music production",
        tools: ["Premiere Pro", "After Effects"],
        description:
          "Educational music video with original music production alongside the edit. Animated planets perform the lyrics against a nebula field, with karaoke-style highlighting timed to the vocal. Scoring and cutting happened together rather than one after the other.",
        images: [{ src: "/work/solar-system-song.webp", w: 1280, h: 720 }],
      },
      {
        id: "horror-trailer",
        title: "Horror Short Trailer",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/1QsmGU899Nkgd7DPVl0gJvWd8X0JtNuFm/view",
        duration: "2:05",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
        description:
          "Trailer for a narrative horror short, opening on a production title card in rolling fog. Cold interior grade, held wides on a corridor of framed portraits, and cuts timed to the sound design rather than the dialogue.",
        images: [{ src: "/work/horror-trailer.webp", w: 1280, h: 720 }],
      },
      {
        id: "workout-series",
        title: "Exercise Series",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/1ZW_RcnV9YZwzMzNyjFAPE6tsqYBgBOaN/view",
        duration: "5:51",
        year: "2024",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
        description:
          "Instructional fitness series shot in a spin studio. Each exercise gets a named lower-third listing its benefits, and the script title uses a soft glow so it stays readable over a moving frame.",
        images: [{ src: "/work/workout-series.webp", w: 1280, h: 720 }],
      },
      {
        id: "self-portrait",
        title: "All My Life, I've Known Women As",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/16ZQBZLzCTPYQgVGsKQctXjavnC5h0hVO/view",
        duration: "0:27",
        year: "2022",
        role: "Editor",
        tools: ["Premiere Pro"],
        description:
          "Short video essay on how women are talked about, and how that language gets internalised. Collected posts and comments are stacked as layered cards until the frame is almost unreadable — then the pile clears for a single italic line, and the piece closes on a montage of real women in the maker's own life.\n\nThe edit argues by density: the noise is built up visually before it is answered.",
        images: [{ src: "/work/self-portrait.webp", w: 1280, h: 960 }],
      },
      {
        id: "brenia-18",
        title: "Brenia — 18 Years",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/11T91mbcSR2Xb8SOcLmDlqPTwXRfgCUZr/view",
        duration: "2:14",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
        description:
          "Debut retrospective spanning childhood photographs to the present, opening on a hand-lettered title card. Stills are threaded through a scrolling film-strip treatment and set inside rounded vintage-television frames with chromatic fringing and year stamps, so the montage carries its own timeline without narration.",
        images: [{ src: "/work/brenia-18.webp", w: 1280, h: 720 }],
      },
      {
        id: "nobody-mitski",
        title: "Nobody — Song Interpretation",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/1bZXS4_VYl8BDJN7_ud81vgB6O-h8VlOV/view",
        duration: "3:24",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
        description:
          "Visual interpretation of a Mitski track, built as a letterboxed sequence of wide landscape shots with a single figure held small in frame. Typography enters slowly and off-centre, letting the isolation in the composition do the reading.",
        images: [{ src: "/work/nobody-mitski.webp", w: 640, h: 360 }],
      },
      {
        id: "vb-hand-signals",
        title: "Volleyball Hand Signals",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/1Ko5pG07lEegkafQt9V6EU_lomBsmXsCz/view",
        duration: "0:50",
        year: "2023",
        role: "Editor and motion graphics",
        tools: ["Premiere Pro", "After Effects"],
        description:
          "Officiating reference video styled as a sports-game parody — rounded frame, clean white staging, and bubble callouts on each correct signal. A dry rulebook exercise given a format people would actually finish.",
        images: [{ src: "/work/vb-hand-signals.webp", w: 1280, h: 721 }],
      },
      {
        id: "arduino-trailer",
        title: "Arduino Trailer",
        span: 3,
        isVideo: true,
        videoUrl: "https://drive.google.com/file/d/1no0N0emjfwYu9fGQoNWQ8yhKgClWqHZH/view",
        duration: "0:22",
        year: "2024",
        role: "Editor and motion graphics",
        tools: ["After Effects", "Premiere Pro"],
        description:
          "Short explainer trailer opening on an animated circuit-trace field. Copy is built as kinetic type with key terms colour-lifted out of the sentence — twenty-two seconds, structured as a question and its answer.",
        images: [{ src: "/work/arduino-trailer.webp", w: 1280, h: 720 }],
      },
    ],
  },
];

/*
 * Ordered by what someone hiring reaches for: mail her, check her history,
 * read her code.
 *
 * The Canva site is the previous portfolio and is labelled as such — calling it
 * "portfolio" on a portfolio site sent readers in a circle. Remove it once this
 * site has replaced it outright.
 */
export const socials = [
  { label: "email", href: "mailto:lanadenisehuertas@gmail.com" },
  { label: "linkedin", href: "https://www.linkedin.com/in/lana-denise-huertas/" },
  { label: "github", href: "https://github.com/lanadenisehuertas/" },
  { label: "canva site", href: "https://lanadenisehuertas.my.canva.site" },
];
