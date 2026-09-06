// src/data/aboutData.ts
import React from "react";
import {
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiBootstrap,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiMongodb,
  SiThreedotjs,
  SiFigma,
  SiDavinciresolve,
} from "react-icons/si";
import {
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobeIndesign,
  TbBrandAdobePremiere,
} from "react-icons/tb";
import { FaLinkedin } from "react-icons/fa";
import {
  Database,
  Scissors,
  Video,
  Palette,
  Wand2,
  Share2,
  Search,
  MapPin,
  Newspaper,
  LineChart,
  Mail,
  Phone,
} from "lucide-react";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

// Custom Canva icon component since react-icons doesn't include a Canva mark
const CanvaIcon: IconType = (props) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      width: "1em",
      height: "1em",
      ...props,
    },
    React.createElement("path", {
      d: "M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.627 0 12 0zm5.114 14.887c-.636 1.488-1.748 2.217-3.141 2.217-1.897 0-3.328-1.393-3.328-3.793 0-3.385 2.454-6.31 5.385-6.31.868 0 1.542.274 1.942.753l-1.026 1.34c-.23-.274-.633-.42-1.036-.42-1.637 0-3.048 2.012-3.048 4.298 0 1.484.777 2.14 1.637 2.14.775 0 1.383-.45 1.76-1.326l.855 1.101z",
    })
  );

export interface TechItem {
  name: string;
  // Real brand icon component from react-icons, when a stable one exists.
  icon?: IconType;
  // Fallback for logos with no stable/verified export (see notes below) —
  // a generic lucide icon stands in rather than risk a broken import.
  fallbackIcon?: LucideIcon;
  // The icon's rendered color. For brand marks that are near-black or
  // otherwise low-contrast on our #08090a background, this is an
  // accessible override rather than the literal brand hex.
  color: string;
  // Soft ambient glow tint behind the icon (usually the same family as
  // `color`, sometimes a complementary accent for visual variety).
  glow: string;
  // Small badge for tools that get an "AI" callout (e.g. Canva AI).
  badge?: string;
}

export interface SkillGroup {
  title: string;
  icon: LucideIcon;
  items: string[];
}

export const TECH_STACK: TechItem[] = [
  { name: "HTML5", icon: SiHtml5, color: "#E34F26", glow: "#E34F26" },
  { name: "CSS3", icon: SiCss, color: "#1572B6", glow: "#1572B6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8", glow: "#38BDF8" },
  { name: "Bootstrap 5.3", icon: SiBootstrap, color: "#9772E8", glow: "#7952B3" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", glow: "#F7DF1E" },
  { name: "React.js", icon: SiReact, color: "#61DAFB", glow: "#61DAFB" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA84E", glow: "#339933" },
  // Express's brand mark is near-black — overridden to a light neutral so
  // it stays visible on the dark card background.
  { name: "Express.js", icon: SiExpress, color: "#E5E7EB", glow: "#64748B" },
  // Prisma's default mark is a very dark navy — overridden to a light
  // tone, glow kept in Prisma's indigo family for brand recognition.
  { name: "Prisma", icon: SiPrisma, color: "#F1F5F9", glow: "#6366F1" },
  { name: "PHP", icon: SiPhp, color: "#8892BF", glow: "#787CB5" },
  { name: "Laravel", icon: SiLaravel, color: "#FF2D20", glow: "#FF2D20" },
  { name: "MySQL", icon: SiMysql, color: "#4DA5C4", glow: "#00758F" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", glow: "#47A248" },
  // Mongoose has no stable brand glyph in the icon set — a schema/DB-style
  // fallback stands in rather than risking an import that may not exist.
  { name: "Mongoose", fallbackIcon: Database, color: "#B33636", glow: "#DC2626" },
  // Three.js's mark is monochrome black by default — overridden to white.
  { name: "Three.js", icon: SiThreedotjs, color: "#F8FAFC", glow: "#22D3EE" },
];

export const DESIGN_TOOLS: TechItem[] = [
  { name: "Photoshop", icon: TbBrandAdobePhotoshop, color: "#31A8FF", glow: "#31A8FF" },
  { name: "Illustrator", icon: TbBrandAdobeIllustrator, color: "#FF9A00", glow: "#FF9A00" },
  { name: "InDesign", icon: TbBrandAdobeIndesign, color: "#FF3366", glow: "#FF3366" },
  { name: "Figma", icon: SiFigma, color: "#A259FF", glow: "#A259FF" },
  { name: "Canva", icon: CanvaIcon, color: "#00C4CC", glow: "#00C4CC" },
  { name: "Premiere Pro", icon: TbBrandAdobePremiere, color: "#9999FF", glow: "#9999FF" },
  // DaVinci Resolve's default mark reads too dark on our background —
  // overridden to a light neutral, glow kept in its signature magenta.
  { name: "DaVinci Resolve", icon: SiDavinciresolve, color: "#E2E8F0", glow: "#EC4899" },
  // CapCut has no verified stable export in the icon set — a video-cut
  // icon substitutes rather than an unverified brand import.
  { name: "CapCut", fallbackIcon: Scissors, color: "#00F5D4", glow: "#00F5D4" },
  { name: "Canva AI", icon: CanvaIcon, color: "#00C4CC", glow: "#A855F7", badge: "AI" },
];

export const CREATIVE_GROUPS: SkillGroup[] = [
  {
    title: "Video & Content",
    icon: Video,
    items: [
      "Video Editing",
      "YouTube Content Creation",
      "YouTube Shorts",
      "Story Development",
      "Script Writing",
      "Content Creation",
    ],
  },
  {
    title: "Design",
    icon: Palette,
    items: [
      "Thumbnail Design",
      "Poster Design",
      "Advertisement Design",
      "Social Media Creatives",
      "Digital Artwork",
      "Illustration",
    ],
  },
  {
    title: "AI & Creative Tools",
    icon: Wand2,
    items: [
      "AI Image Generation",
      "AI Video Generation",
      "AI Content Creation",
      "AI-Assisted Storytelling",
      "DTP (Desktop Publishing)",
    ],
  },
  {
    title: "Publishing",
    icon: Share2,
    items: ["YouTube", "Instagram", "Social Media Content Publishing"],
  },
];

export const MARKETING_GROUPS: SkillGroup[] = [
  {
    title: "SEO",
    icon: Search,
    items: [
      "SEO Auditing",
      "On-Page SEO",
      "Technical SEO",
      "Keyword Research",
      "Competitor Keyword Analysis",
      "Website SEO Analysis",
    ],
  },
  {
    title: "Local SEO",
    icon: MapPin,
    items: [
      "Google Business Profile (GMB)",
      "Google Maps",
      "Local SEO",
      "Business Listing Analysis",
    ],
  },
  {
    title: "Content Marketing",
    icon: Newspaper,
    items: [
      "Blog Topic Research",
      "Blog Content Audit",
      "Content Planning",
      "LinkedIn Content",
      "Social Media Content",
    ],
  },
  {
    title: "Analysis & Reporting",
    icon: LineChart,
    items: [
      "Competitor Analysis",
      "SEO Comparison Tables",
      "Website Audit Reports",
      "SEO Reports",
      "Content Audit Reports",
      "Schema Markup Planning",
    ],
  },
];

export interface EducationItem {
  degree: string;
  field: string;
  level: string;
}

export const EDUCATION: EducationItem[] = [
  {
    degree: "Bachelor of Science (B.Sc)",
    field: "Computer Science",
    level: "Undergraduate Degree",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    field: "Computer Science",
    level: "Higher Secondary Education",
  },
  
];

export interface ContactItem {
  label: string;
  value: string;
  href: string;
  // "github" is resolved to the project's existing custom SVG mark inside
  // AboutSection.tsx (same convention as ProjectDetailModal/DigitalArtifacts)
  // rather than imported here, since it isn't a react-icons/lucide export.
  icon: IconType | LucideIcon | "github";
}

// GitHub URL reused from the existing DigitalArtifacts section so the
// whole site points at one canonical profile link.
export const GITHUB_URL = "https://github.com/A-PRASATHARUMUGAM";

export const CONTACT_LINKS: ContactItem[] = [
  {
    label: "LinkedIn",
    value: "prasath-arumugam-94842a276",
    href: "https://www.linkedin.com/in/prasath-arumugam-94842a276",
    icon: FaLinkedin,
  },
  {
    label: "Gmail",
    value: "prasatharumugam040@gmail.com",
    href: "mailto:prasatharumugam040@gmail.com",
    icon: Mail,
  },
  {
    label: "Contact",
    value: "+91 98946 29002",
    href: "tel:+919894629002",
    icon: Phone,
  },
  {
    label: "GitHub",
    value: "A-PRASATHARUMUGAM",
    href: GITHUB_URL,
    icon: "github",
  },
];
