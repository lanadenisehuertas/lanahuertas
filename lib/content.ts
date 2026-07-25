// Single source of truth for all portfolio content.
// Adding a work category = adding an entry to `workTabs`. Nothing else changes.

export type Project = {
  id: string;
  title: string;
  image: string;
  /**
   * Intrinsic pixel size of `image`. Cards render at this exact ratio rather
   * than a fixed crop, so a 16:9 banner and a 3:4 poster keep their own shape.
   * Also reserves layout space, which keeps CLS at zero while images load.
   */
  w: number;
  h: number;

  // --- Detail view -------------------------------------------------------
  /** Full write-up shown in the lightbox. */
  description?: string;
  client?: string;
  year?: string;
  role?: string;
  /** Software/techniques used, e.g. ["Photoshop", "Illustrator"]. */
  tools?: string[];
  /** External link — live site, repo, or case study. */
  href?: string;
  hrefLabel?: string;

  // --- Video only --------------------------------------------------------
  /** Marks the card as a video and shows a play affordance. */
  isVideo?: boolean;
  /** Runtime, e.g. "2:14". */
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
      "Event posters, campaign graphics, and announcement sets for student organizations and campus offices — built in Photoshop and Illustrator, sized for every platform they had to run on.",
    accent: "eminence",
    projects: [
      {
        id: "techibig",
        title: "TechIbig",
        image: "/work/techibig.webp",
        w: 1382,
        h: 1600,
        description:
          "Valentine's event key art built around a Las Vegas-style marquee sign standing in a dusk landscape, with heart-shaped bulbs and arrow signage. The chrome-and-blush palette and dimensional lettering carry the season-of-love line without spelling it out twice.",
        client: "FEU Institute of Technology",
        year: "2024",
        role: "Key art and layout",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "acm-dystopia",
        title: "Dystopia",
        image: "/work/acm-dystopia.webp",
        w: 1600,
        h: 1582,
        description:
          "Flagship poster for a week-long tech celebration. Distressed chrome lettering sits over a magenta-lit skyline, with the title echoed as a ghosted reflection underneath — a cyberpunk read that stayed legible when scaled down to a feed thumbnail.",
        client: "ACM — FEU Tech Student Chapter",
        year: "2024",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "acm-ignition",
        title: "ACM Ignition",
        image: "/work/acm-ignition.webp",
        w: 1276,
        h: 1600,
        description:
          "Officer engagement series poster. A lone silhouette stands at the end of a perspective corridor blowing open into a white burst, with inflatable-style title lettering on top. The vanishing point does the work of pointing at the headline.",
        client: "ACM — FEU Tech Student Chapter",
        year: "2024",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "acm-revival",
        title: "ACM Revival",
        image: "/work/acm-revival.webp",
        w: 1347,
        h: 1600,
        description:
          "Three-day event announcement using reaching chrome hands and light-trail ribbons against deep blue. The liquid-metal title treatment ties the series to the chapter's other chrome-led key art.",
        client: "ACM — FEU Tech Student Chapter",
        year: "2025",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "women-in-cs",
        title: "Women in Computer Science",
        image: "/work/women-in-cs.webp",
        w: 1445,
        h: 1600,
        description:
          "Women's History Month feature honouring seven computing pioneers — Grace Hopper, Ada Lovelace, Annie Easley, Margaret Hamilton, Gladys West, Dorothy Vaughan, and Sister Mary Keller. Archival portraits were cut out and unified under a single violet grade, so a century of source photography reads as one piece.",
        client: "ACM — FEU Tech Student Chapter",
        year: "2025",
        role: "Design and retouching",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "battle-of-the-bands",
        title: "Battle of the Bands",
        image: "/work/battle-of-the-bands.webp",
        w: 1200,
        h: 1600,
        description:
          "Poster assembled as a print-and-tape collage — halftone amps, cassette decks, and vintage microphones layered under torn-paper title lettering. Deliberately rough where the rest of the campus material was clean.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2024",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "rock-of-sales",
        title: "Rock of Sales",
        image: "/work/rock-of-sales.webp",
        w: 1600,
        h: 900,
        description:
          "Landscape banner for a Battle of the Bands merchandise drive. Instruments burst out of a halftone starburst in hot pink and orange, with the title set as stacked, outlined lettering.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2024",
        role: "Banner design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "techno-week",
        title: "Techno Week",
        image: "/work/techno-week.webp",
        w: 1208,
        h: 1600,
        description:
          "Week-long festival poster in a pastel Memphis style — overlapping colour blocks, floating app icons, and a ribbon banner carrying the dates. Built to anchor a full set of matching sub-event graphics.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2025",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "technorun-poster",
        title: "TechnoRun",
        image: "/work/technorun-poster.webp",
        w: 1176,
        h: 1600,
        description:
          "Fun-run announcement carrying real logistics — four race distances with pricing, venue, call time, a six-step registration list, and a QR code — without losing the rainbow-track motion of the artwork. The hardest layout in the set, because everything on it had to be readable at a glance.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2025",
        role: "Poster and information design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "spooktechular",
        title: "Spooktechular",
        image: "/work/spooktechular.webp",
        w: 960,
        h: 960,
        description:
          "Halloween event graphic — a candy-filled jack-o-lantern lit from below by a wedge of orange, framed by skeleton and monster hands reaching in from the edges.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2024",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "student-orgs-fair",
        title: "Student Organizations Fair",
        image: "/work/student-orgs-fair.webp",
        w: 1600,
        h: 900,
        description:
          "Landscape header for a week-long org fair. An illustrated skyline of oversized objects — chess piece, molecule, telescope, guitar — stands in for the range of organizations, with the title held in a clean centre panel so it survives being cropped by social platforms.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2024",
        role: "Banner design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "cs-night",
        title: "CS Night",
        image: "/work/cs-night.webp",
        w: 1280,
        h: 1600,
        description:
          "Masquerade-themed performer lineup. Each act sits in its own gilded frame arranged up a staircase, with hosts anchored at the base — a hierarchy that reads instantly without labels for billing order.",
        client: "FEU Institute of Technology",
        year: "2025",
        role: "Design and compositing",
        tools: ["Photoshop"],
      },
      {
        id: "acm-kickoff",
        title: "Kick-Off Celebration",
        image: "/work/acm-kickoff.webp",
        w: 1440,
        h: 1440,
        description:
          "Academic-year opener. Chrome and script lettering over a soft violet gradient, with a full contact footer — email, socials, site, and QR — kept quiet at the base so it never competes with the date.",
        client: "ACM — FEU Tech Student Chapter",
        year: "2024",
        role: "Poster design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "junior-officer-perks",
        title: "Perks of Being a Junior Officer",
        image: "/work/junior-officer-perks.webp",
        w: 1600,
        h: 1599,
        description:
          "Recruitment infographic breaking four benefits into translucent glass panels over a violet event photo. Body copy is justified and evenly ragged so the four blocks read as a set rather than a list.",
        client: "ACM — FEU Tech Student Chapter",
        year: "2024",
        role: "Infographic design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "startup-qc-winners",
        title: "StartUp QC — 2nd Runner Up",
        image: "/work/startup-qc-winners.webp",
        w: 1600,
        h: 1600,
        description:
          "Congratulations post for a chapter team placing third at a startup competition. The awarding photo is graded into the chapter violet palette and framed with sparkle accents, so a phone-shot documentation image sits comfortably beside polished key art.",
        client: "ACM — FEU Tech Student Chapter",
        year: "2025",
        role: "Design and retouching",
        tools: ["Photoshop"],
      },
      {
        id: "project-horizon",
        title: "Project Horizon",
        image: "/work/project-horizon.webp",
        w: 1131,
        h: 1600,
        description:
          "Vector illustration of hikers cresting a ridge at sunrise, layered into depth planes with a radiating sky behind the title. Flat-colour work throughout — no photography.",
        year: "2024",
        role: "Illustration and layout",
        tools: ["Illustrator", "Photoshop"],
      },
      {
        id: "pacsa-speakers",
        title: "PACSA Guest Speakers",
        image: "/work/pacsa-speakers.webp",
        w: 1600,
        h: 900,
        description:
          "Speaker lineup for a national convention. Five portraits sit in alternating colour panels inside a woven, festival-inspired border, each with name and role — an established layout that could absorb late additions without a redesign.",
        client: "Philippine Association of Campus Student Advisers",
        year: "2025",
        role: "Layout and compositing",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "back-to-school",
        title: "Back to School Essentials",
        image: "/work/back-to-school.webp",
        w: 1080,
        h: 1321,
        description:
          "Semester-opening post built as an annotated flat-lay. Each item gets a hand-drawn callout with a joke attached — headphones that cancel noise, not responsibilities — which turned a routine announcement into something students actually shared.",
        client: "FEU Institute of Technology",
        year: "2025",
        role: "Concept, copy, and design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "ebsco-office365",
        title: "EBSCO in Office 365",
        image: "/work/ebsco-office365.webp",
        w: 1080,
        h: 1080,
        description:
          "Library service announcement. A dry integration notice is restructured into a what-this-means-for-you list of three plain-language benefits, in institutional green with the Tamaraw mascot as the friendly note.",
        client: "FEU Tech Library",
        year: "2025",
        role: "Infographic design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "biblioboo",
        title: "Bibliobooo Haunted Book Nook",
        image: "/work/biblioboo.webp",
        w: 1600,
        h: 1600,
        description:
          "Library Halloween activity laid out as a detective corkboard — pinned index cards connected by red string, a spotlight from the corner, and a ghost mascot reading in the centre. The mechanics of the game are the layout.",
        client: "FEU Tech Library",
        year: "2025",
        role: "Concept and design",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "finals-motivation",
        title: "You Can Do It, iTamaraw",
        image: "/work/finals-motivation.webp",
        w: 1600,
        h: 1600,
        description:
          "Finals-week library hours disguised as a multiple-choice question, answers running from Of course! to Whatever happens, happens. Set over a blurred exam page with a red-pen circle — the schedule arrives after the joke has landed.",
        client: "FEU Tech Library",
        year: "2025",
        role: "Concept, copy, and design",
        tools: ["Photoshop"],
      },
      {
        id: "never-again",
        title: "Never Again, Never Forget",
        image: "/work/never-again.webp",
        w: 1440,
        h: 1440,
        description:
          "Martial Law commemoration. Archival protest photography and headline clippings are collaged under a hard red wash, with the title reversed out of a black block at centre — restrained on purpose, given the subject.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2024",
        role: "Design and compositing",
        tools: ["Photoshop"],
      },
      {
        id: "certified-organization",
        title: "Certified Organization",
        image: "/work/certified-organization.webp",
        w: 1600,
        h: 1600,
        description:
          "Recognition post for a student-adviser accreditation. Condensed green display type is knocked back behind a cut-out portrait, with a script signature line carrying the honouree name.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2025",
        role: "Design and retouching",
        tools: ["Photoshop"],
      },
      {
        id: "pride-month",
        title: "Pride is Everywhere",
        image: "/work/pride-month.webp",
        w: 1600,
        h: 1600,
        description:
          "Pride Month post. A desaturated classroom photo has its students painted back in as flat rainbow silhouettes, with a ribbon sweeping through the frame — colour used as the entire argument.",
        client: "FEU Institute of Technology",
        year: "2025",
        role: "Concept and design",
        tools: ["Photoshop", "Illustrator"],
      },
    ],
  },
  {
    id: "mockups",
    label: "mockups",
    heading: "Mockups",
    blurb:
      "Apparel, print, and interface mockups — built so a client can see the thing existing in the world before committing to production.",
    accent: "fawn",
    projects: [
      {
        id: "technorun-jerseys",
        title: "TechnoRun Race Singlets",
        image: "/work/technorun-jerseys.webp",
        w: 1500,
        h: 1500,
        description:
          "Four race-singlet colourways shown front and back, each keyed to a distance category. The wave that splits each garment is the same curve across all four, so the set reads as one system while staying instantly sortable by colour at a start line.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2025",
        role: "Apparel design and mockup",
        tools: ["Photoshop", "Illustrator"],
      },
      {
        id: "technorun-race-bibs",
        title: "TechnoRun Race Bibs",
        image: "/work/technorun-race-bibs.webp",
        w: 1500,
        h: 1500,
        description:
          "Matching race bibs in the same four colourways, with the number block sized to stay readable in motion and a rotated repeat along the edge for side-on photography. Designed as production artwork, not just a visual.",
        client: "Student Coordinating Council — FEU Tech",
        year: "2025",
        role: "Print design",
        tools: ["Illustrator", "Photoshop"],
      },
      {
        id: "tabitayo-app",
        title: "Tabitayo — Seat Finder",
        image: "/work/tabitayo-app.webp",
        w: 1297,
        h: 1600,
        description:
          "Product announcement for an event seat-finding platform, presented as an annotated device mockup. Four callouts point at real interface regions rather than floating as generic bullet points, so the feature list and the screenshot explain each other.",
        client: "Tabitayo",
        year: "2026",
        role: "Product marketing design",
        tools: ["Photoshop", "Illustrator"],
      },
    ],
  },
  {
    id: "templates",
    label: "templates",
    heading: "Templates",
    blurb:
      "Reusable systems designed for handoff — built in Photoshop and Illustrator, delivered so the client can update them without coming back to me.",
    accent: "maize",
    projects: [
      {
        id: "pacsa-certificate",
        title: "PACSA Certificate Template",
        image: "/work/pacsa-certificate.webp",
        w: 1500,
        h: 1500,
        description:
          "Certificate template for a national convention, bordered in woven geometric patterning drawn from Filipino textile motifs. The centre is a fixed text well with a set type scale, so hundreds of certificates could be filled in without the layout drifting.",
        client: "Philippine Association of Campus Student Advisers",
        year: "2025",
        role: "Template design",
        tools: ["Illustrator", "Photoshop"],
      },
      {
        id: "pacsa-photo-frame",
        title: "PACSA Photo Frame",
        image: "/work/pacsa-photo-frame.webp",
        w: 1500,
        h: 1500,
        description:
          "Social media photo frame for convention delegates — the same patterned border with a cleared centre for a profile photo. Handed over as a transparent PNG so attendees could drop their own image behind it.",
        client: "Philippine Association of Campus Student Advisers",
        year: "2025",
        role: "Template design",
        tools: ["Illustrator", "Photoshop"],
      },
      {
        id: "artist-connection-sizes",
        title: "Merch Size Chart",
        image: "/work/artist-connection-sizes.webp",
        w: 1600,
        h: 1600,
        description:
          "Apparel size chart for a merchandise drop. Measurements sit in a dark table with a gold header rule over an ember-lit background — built so future drops could reuse the frame and swap only the numbers.",
        client: "Artist Connection",
        year: "2025",
        role: "Template design",
        tools: ["Photoshop"],
      },
    ],
  },
  {
    id: "videos",
    label: "videos",
    heading: "Videos",
    blurb:
      "Motion, pacing, and impact — cut in Premiere Pro and finished in After Effects. Documentary essays, instructional series, retrospectives, and narrative shorts.",
    accent: "iris",
    projects: [
      {
        id: "breaking-barriers",
        title: "Breaking Barriers",
        image: "/work/breaking-barriers.webp",
        w: 1280,
        h: 720,
        isVideo: true,
        duration: "4:04",
        description:
          "Documentary video essay on Geraldine Roman, the first transgender woman elected to the Philippine Congress. Cuts between interview footage, mapped geography, and Pride march coverage, with torn-paper title cards holding the chapter breaks. The longest-form edit in this set and the one with the most archival sourcing behind it.",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        id: "basick-math",
        title: "BaSICK Math",
        image: "/work/basick-math.webp",
        w: 1280,
        h: 720,
        isVideo: true,
        duration: "4:25",
        description:
          "Branded instructional series — identity, animated logo sting, and lesson edit. The presenter is keyed onto a blackboard field of live equations, and the mark itself is built from a puzzle piece to carry the math-made-easy line.",
        year: "2023",
        role: "Editor and brand design",
        tools: ["Premiere Pro", "After Effects", "Illustrator"],
      },
      {
        id: "solar-system-song",
        title: "Solar System Song",
        image: "/work/solar-system-song.webp",
        w: 1280,
        h: 720,
        isVideo: true,
        duration: "3:00",
        description:
          "Educational music video with original music production alongside the edit. Animated planets perform the lyrics against a nebula field, with karaoke-style highlighting timed to the vocal. Scoring and cutting were done together rather than one after the other.",
        year: "2022",
        role: "Editor, animator, and music production",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        id: "horror-trailer",
        title: "Horror Short Trailer",
        image: "/work/horror-trailer.webp",
        w: 1280,
        h: 720,
        isVideo: true,
        duration: "2:05",
        description:
          "Trailer for a narrative horror short, opening on a production title card in rolling fog. Cold interior grade, held wides on a corridor of framed portraits, and cuts timed to the sound design rather than the dialogue.",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        id: "workout-series",
        title: "Exercise Series",
        image: "/work/workout-series.webp",
        w: 1280,
        h: 720,
        isVideo: true,
        duration: "5:51",
        description:
          "Instructional fitness series shot in a spin studio. Each exercise gets a named lower-third listing its benefits, and the script title uses a soft glow so it stays readable over a moving frame. Long-form, with every movement demonstrated end to end.",
        year: "2024",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        id: "brenia-18",
        title: "Brenia — 18 Years",
        image: "/work/brenia-18.webp",
        w: 1280,
        h: 720,
        isVideo: true,
        duration: "2:14",
        description:
          "Debut retrospective spanning childhood photographs to the present, opening on a hand-lettered title card. Stills are threaded through a scrolling film-strip treatment and set inside rounded vintage-television frames with chromatic fringing and year stamps, so the montage carries its own timeline without narration.",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        id: "nobody-mitski",
        title: "Nobody — Song Interpretation",
        image: "/work/nobody-mitski.webp",
        w: 640,
        h: 360,
        isVideo: true,
        duration: "3:24",
        description:
          "Visual interpretation of a Mitski track, built as a letterboxed sequence of wide landscape shots with a single figure held small in frame. Typography enters slowly and off-centre, letting the isolation in the composition do the reading.",
        year: "2023",
        role: "Editor",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        id: "arduino-trailer",
        title: "Arduino Trailer",
        image: "/work/arduino-trailer.webp",
        w: 1280,
        h: 720,
        isVideo: true,
        duration: "0:22",
        description:
          "Short explainer trailer opening on an animated circuit-trace field. Copy is built as kinetic type with key terms colour-lifted out of the sentence — twenty-two seconds, structured as a question and its answer.",
        year: "2024",
        role: "Editor and motion graphics",
        tools: ["After Effects", "Premiere Pro"],
      },
      {
        id: "vb-hand-signals",
        title: "Volleyball Hand Signals",
        image: "/work/vb-hand-signals.webp",
        w: 1280,
        h: 721,
        isVideo: true,
        duration: "0:50",
        description:
          "Officiating reference video styled as a sports-game parody — rounded frame, clean white staging, and bubble callouts on each correct signal. A dry rulebook exercise given a format people would actually finish.",
        year: "2023",
        role: "Editor and motion graphics",
        tools: ["Premiere Pro", "After Effects"],
      },
      {
        id: "self-portrait",
        title: "All My Life, I've Known Women As",
        image: "/work/self-portrait.webp",
        w: 1280,
        h: 960,
        isVideo: true,
        duration: "0:27",
        description:
          "Short video essay on how women are talked about and how that language gets internalised. Collected posts and comments are stacked and overlapped as layered cards, crowding the frame until they are almost unreadable — then the pile clears for a single italic line, and the piece closes on a montage of real women in the maker's own life.\n\nThe edit argues by density: the noise is built up visually before it is answered.",
        year: "2022",
        role: "Editor",
        tools: ["Premiere Pro"],
      },
    ],
  },
  {
    id: "engineering",
    label: "engineering",
    heading: "Software Engineering",
    blurb:
      "Computer Science at FEU Tech, specialising in Software Engineering. Python and JavaScript, with an interest in the point where clinical rigour meets interface design.",
    accent: "deep",
    projects: [
      {
        id: "psyclick",
        title: "PsyClick",
        image: "/work/psyclick.webp",
        w: 1600,
        h: 1317,
        description:
          "A clinician-guided screening companion that combines questionnaires, typing rhythm, mouse dynamics, and emotional response tasks into clear decision-support reports.\n\nPsyClick captures millisecond-level keystroke and cursor telemetry during a clinical intake session and turns it into an objective map of where a client hesitated — so the psychologist can open the interview on the topics that actually registered, instead of working through generic questions.\n\nEight behavioural biomarkers — flight time, dwell time, typing velocity, error rate, cursor velocity, jerk, path entropy, and pause frequency — are evaluated together using Hotelling T-squared with Ledoit-Wolf shrinkage. That single statistic is then decomposed into a Psychomotor Slowing Index and an Agitation Index, and a fuzzy classifier resolves the pair into GREEN, AMBER, or RED decision-support flags. A 100-person normative baseline, screened for stable wellbeing, provides the population reference. The system reports and flags; it does not diagnose.\n\nPrivacy is architectural rather than promised: the behavioural baseline lives in session memory under 600 bytes and is discarded when the session ends.",
        client: "Undergraduate thesis — adopted by a practising clinical psychologist",
        year: "2025–2026",
        role: "Full-stack developer",
        tools: [
          "React",
          "Vite",
          "Electron",
          "Python",
          "NumPy",
          "SciPy",
          "Supabase",
          "SQLite",
        ],
        href: "https://psyclick-app.vercel.app/",
        hrefLabel: "Visit psyclick-app.vercel.app",
      },
    ],
  },
];

export const socials = [
  { label: "email", href: "mailto:lanadenisehuertas@gmail.com" },
  { label: "portfolio", href: "https://lanadenisehuertas.my.canva.site" },
];
