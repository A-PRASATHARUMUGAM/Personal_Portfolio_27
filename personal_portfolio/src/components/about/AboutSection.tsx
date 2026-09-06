// src/components/about/AboutSection.tsx
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Layers,
  GraduationCap as GradIcon,
  Mail as MailIcon,
  Code,
  Film,
  Palette,
  BarChart3,
} from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import {
  TECH_STACK,
  DESIGN_TOOLS,
  CREATIVE_GROUPS,
  MARKETING_GROUPS,
  EDUCATION,
  CONTACT_LINKS,
} from "../../data/aboutData";
import { TechBadge } from "./TechBadge";

const AboutBackground = lazy(() => import("./AboutBackground"));

// Custom GitHub icon — same convention already established in
// ProjectDetailModal.tsx / DigitalArtifacts.tsx (a hand-rolled mark kept
// consistent with this project's other brand-icon overrides).
const Github = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const NAV_SECTIONS = [
  { id: "about-me", title: "About", icon: User },
  { id: "about-skills", title: "Skills", icon: Layers },
  { id: "about-education", title: "Education", icon: GradIcon },
  { id: "about-contact", title: "Contact", icon: MailIcon },
];

const SKILL_TABS = [
  { id: "tech", label: "Technology", icon: Code },
  { id: "creative", label: "Creative & Content", icon: Film },
  { id: "design", label: "Design Tools", icon: Palette },
  { id: "marketing", label: "Digital Marketing", icon: BarChart3 },
] as const;

type SkillTabId = (typeof SKILL_TABS)[number]["id"];

const ROLE_TAGS = [
  "AI Software Developer",
  "AI Integration",
  "Creative Design",
  "Video & Content Creation",
  "Digital Marketing",
];

/** Matches the "CHAPTER 0X" header pattern used in DigitalArtifacts.tsx. */
function SubHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-2 border-l-2 border-cyan-500/40 pl-4 sm:pl-6">
      <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">
        {eyebrow}
      </span>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight"
      >
        {title}
      </motion.h2>
      <p className="text-slate-400 text-sm max-w-xl font-light">{subtitle}</p>
    </div>
  );
}

function StatCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function SkillPillGroup({
  groups,
  accent,
}: {
  groups: typeof CREATIVE_GROUPS;
  accent: "cyan" | "emerald";
}) {
  const ring =
    accent === "cyan"
      ? "hover:border-cyan-500/30"
      : "hover:border-emerald-500/30";
  const iconColor = accent === "cyan" ? "text-cyan-400" : "text-emerald-400";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {groups.map((group, gi) => {
        const GroupIcon = group.icon;
        return (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: gi * 0.06 }}
            className={`rounded-xl border border-white/5 bg-slate-900/30 p-5 transition-colors ${ring}`}
          >
            <div className="mb-3 flex items-center gap-2">
              <GroupIcon className={`h-4 w-4 ${iconColor}`} />
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400">
                {group.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-neutral-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function AboutSection() {
  const [activeNav, setActiveNav] = useState("about-me");
  const [activeSkillTab, setActiveSkillTab] = useState<SkillTabId>("tech");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { threshold: 0.3 },
    );
    NAV_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const totalSkillCount =
    TECH_STACK.length +
    DESIGN_TOOLS.length +
    CREATIVE_GROUPS.reduce((sum, g) => sum + g.items.length, 0) +
    MARKETING_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <section className="relative bg-[#08090a] text-slate-100 min-h-screen py-20 px-4 sm:px-8 lg:px-16 overflow-hidden selection:bg-cyan-500 selection:text-black">
      <Suspense fallback={<div className="absolute inset-0 bg-[#08090a]" />}>
        <AboutBackground />
      </Suspense>

      {/* Sticky sub-nav — same pill-nav pattern as DigitalArtifacts */}
      <header className="sticky top-6 z-40 flex justify-center mb-16">
        <nav className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl">
          {NAV_SECTIONS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full font-mono text-xs transition-colors duration-300 ${
                  isActive
                    ? "text-cyan-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="aboutActivePill"
                    className="absolute inset-0 rounded-full bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10 hidden md:inline">
                  {tab.title}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      <div className="max-w-7xl mx-auto space-y-32 relative z-10">
        {/* ABOUT ME */}
        <section id="about-me" className="scroll-mt-28 space-y-8">
          <SubHeader
            eyebrow="PROFILE"
            title="About Me"
            subtitle="Who I am and how I work across code, design, and content."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-6 sm:p-8"
            >
              <p className="text-sm sm:text-base font-light leading-relaxed text-neutral-300">
                I'm a Full Stack Developer with hands-on experience across
                modern web development, AI-assisted tooling, creative design,
                video and content creation, and digital marketing. I like
                building things end-to-end — from a database schema to the pixel
                that ships in production — and pairing that engineering
                discipline with a creative eye for visual and content work.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {ROLE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1.5 font-mono text-xs text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-6"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tabular-nums">
                  <StatCounter target={totalSkillCount} suffix="+" />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Skills tracked
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tabular-nums">
                  <StatCounter target={TECH_STACK.length} />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Core technologies
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tabular-nums">
                  <StatCounter target={4} />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Disciplines
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tabular-nums">
                  <StatCounter target={EDUCATION.length} />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Qualifications
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="about-skills" className="scroll-mt-28 space-y-8">
          <SubHeader
            eyebrow="EXPERTISE"
            title="Core Skills & Expertise"
            subtitle="A tabbed breakdown of the technology, creative, design, and marketing stacks I work in."
          />

          <div className="flex flex-wrap items-center gap-2 pb-2">
            {SKILL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSkillTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSkillTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs border transition-all ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                      : "bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/20"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkillTab}
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }
              }
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeSkillTab === "tech" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {TECH_STACK.map((item, idx) => (
                    <TechBadge key={item.name} item={item} index={idx} />
                  ))}
                </div>
              )}

              {activeSkillTab === "design" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {DESIGN_TOOLS.map((item, idx) => (
                    <TechBadge key={item.name} item={item} index={idx} />
                  ))}
                </div>
              )}

              {activeSkillTab === "creative" && (
                <SkillPillGroup groups={CREATIVE_GROUPS} accent="emerald" />
              )}

              {activeSkillTab === "marketing" && (
                <SkillPillGroup groups={MARKETING_GROUPS} accent="cyan" />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* EDUCATION */}
        <section id="about-education" className="scroll-mt-28 space-y-8">
          <SubHeader
            eyebrow="BACKGROUND"
            title="Education"
            subtitle="Academic foundation behind the technical and creative work."
          />

          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-2.5 sm:left-3.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-400 via-emerald-400 to-transparent rounded-full" />
            <div className="space-y-6">
              {EDUCATION.map((edu, idx) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-6"
                >
                  <span className="absolute -left-[calc(2rem+3px)] sm:-left-[calc(2.5rem+3px)] top-7 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] ring-4 ring-[#08090a]" />
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                      <GradIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-base sm:text-lg font-bold text-white">
                        {edu.degree}
                      </h3>
                      <p className="mt-1 text-sm font-light text-neutral-300">
                        {edu.field}
                      </p>
                      <span className="mt-2 inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        {edu.level}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="about-contact" className="scroll-mt-28 space-y-8">
          <SubHeader
            eyebrow="GET IN TOUCH"
            title="Contact"
            subtitle="The fastest ways to reach me — pick whichever fits."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTACT_LINKS.map((contact, idx) => {
              const isExternal = contact.href.startsWith("http");
              const Icon = contact.icon === "github" ? Github : contact.icon;
              return (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(160px circle at 20% 50%, rgba(34,211,238,0.08), transparent 70%)",
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="relative min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {contact.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-neutral-200 group-hover:text-white transition-colors">
                      {contact.value}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
