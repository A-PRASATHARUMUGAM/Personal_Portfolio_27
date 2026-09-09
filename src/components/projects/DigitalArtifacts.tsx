// DigitalArtifacts.tsx
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import {
  Code,
  ShieldCheck,
  Film,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Award,
  Terminal,
} from "lucide-react";
import { PROJECTS_DATA, Project } from "../../data/projectsData";
import { ProjectCover } from "./ProjectCover";

const ProjectDetailModal = lazy(() =>
  import("./ProjectDetailModal").then((m) => ({
    default: m.ProjectDetailModal,
  })),
);

// Custom GitHub icon component
const Github = ({ className = "w-4 h-4" }: { className?: string }) => (
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

const ArtifactsBackground = lazy(() => import("./ArtifactsBackground"));

const SECTIONS = [
  { id: "a1-dev", title: "01. Software Dev", icon: Code },
  { id: "a2-qa", title: "02. Testing & QA", icon: ShieldCheck },
  { id: "a3-creative", title: "03. Creative Media", icon: Film },
  { id: "a4-marketing", title: "04. Digital Marketing", icon: BarChart3 },
];

// Maps the data model's verbose type onto the short labels the filter
// pills and card badges display.
const TYPE_LABEL: Record<Project["type"], "Personal" | "Office"> = {
  "PERSONAL PROJECT": "Personal",
  "OFFICE PROJECT": "Office",
};

// A small rotating set of column spans so the dev grid reads as a bento
// layout (mixed large/small tiles) instead of a uniform card wall — cycles
// if there are ever more than six projects.
const BENTO_SIZES = [
  "col-span-12 md:col-span-8",
  "col-span-12 md:col-span-4",
  "col-span-12 md:col-span-4",
  "col-span-12 md:col-span-8",
  "col-span-12 md:col-span-6",
  "col-span-12 md:col-span-6",
];
const getBentoSize = (index: number) => BENTO_SIZES[index % BENTO_SIZES.length];

const QA_SKILLS = [
  "Manual & Functional Testing",
  "Test Case Design & Execution",
  "Ad-hoc & Exploratory Testing",
  "Regression & New-Build Testing",
  "API Testing",
  "Mobile & Responsive Testing",
  "Bug Reporting & Defect Tracking",
  "UI/UX & Usability Testing",
  "Test Documentation & Reporting",
  "Requirement & Workflow Validation",
];

const QA_STATS = [
  { value: 10, suffix: "+", label: "Applications" },
  { value: 2, isText: true, textValue: "Web + Mobile", label: "Platforms" },
  { value: 50, suffix: "+", label: "Testing Activities" },
  { value: 100, suffix: "+", label: "Test Case Sets" },
];

const CREATIVE_ITEMS = [
  {
    id: 1,
    title: "YouTube Videos",
    count: "6 Videos Uploaded",
    category: "Video Production",
  },
  {
    id: 2,
    title: "Cartoon Videos",
    count: "19 Videos Created",
    category: "Animation",
  },
  {
    id: 3,
    title: "AI-Generated Videos",
    count: "4 Videos Created",
    category: "Generative AI",
  },
  {
    id: 4,
    title: "Poster Designing",
    count: "Thumbnails & Ads",
    category: "Graphics",
  },
  {
    id: 5,
    title: "Artwork & Illustrations",
    count: "Hummingbird & More",
    category: "Fine Art",
  },
  // ,
  // {
  //   id: 6,
  //   title: "Murugan's Tree Book",
  //   count: "Desktop Publishing",
  //   category: "DTP / Editorial",
  // },
];

const MARKETING_CARDS = [
  {
    title: "SEO & Website Audit",
    desc: "Technical audits, on-page analysis, and actionable improvement roadmaps.",
  },
  {
    title: "Competitor Analysis",
    desc: "Keyword research, comparative SEO tables, content gap analysis.",
  },
  {
    title: "Google Business Profile & Maps",
    desc: "GMB optimization, Google Maps local ranking, and citations.",
  },
  {
    title: "Content & Blog Strategy",
    desc: "Topic discovery, content reviews, structural audits, conversion paths.",
  },
  {
    title: "Social Media Content",
    desc: "LinkedIn editorial strategies, promotional assets, campaign planning.",
  },
  {
    title: "SEO Reports & Documentation",
    desc: "Comprehensive analytics reports, performance audits, comparative logs.",
  },
];

// usePrefersReducedMotion imported from shared hook above

export default function DigitalArtifacts() {
  const [activeTab, setActiveTab] = useState("a1-dev");
  const [filterTag, setFilterTag] = useState<"All" | "Personal" | "Office">(
    "All",
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // IntersectionObserver to auto-update active navigation tab on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.35 },
    );

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative bg-[#08090a] text-slate-100 min-h-screen py-20 px-4 sm:px-8 lg:px-16 overflow-hidden selection:bg-cyan-500 selection:text-black scroll-mt-[72px]"
    >
      <Suspense fallback={<div className="absolute inset-0 bg-[#08090a]" />}>
        <ArtifactsBackground />
      </Suspense>

      {/* Floating Header Nav */}
      <header className="sticky top-6 z-40 flex justify-center mb-16">
        <nav className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl">
          {SECTIONS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToSection(tab.id);
                }}
                className={`relative flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full font-mono text-xs transition-colors duration-300 ${
                  isActive
                    ? "text-cyan-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
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
        {/* CHAPTER 01 */}
        <section id="a1-dev" className="scroll-mt-28 space-y-8">
          <SectionHeader
            chapter="CHAPTER 01"
            title="Software Development"
            subtitle="Architected applications built with precision, scalable logic, and responsive systems."
          />

          <div className="flex items-center gap-2 pb-2">
            {(["All", "Personal", "Office"] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full font-mono text-xs border transition-all ${
                  filterTag === tag
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                    : "bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/20"
                }`}
              >
                {tag} Projects
              </button>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {PROJECTS_DATA.filter(
              (p) => filterTag === "All" || TYPE_LABEL[p.type] === filterTag,
            ).map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                size={getBentoSize(idx)}
                prefersReducedMotion={prefersReducedMotion}
                onOpen={setSelectedProject}
              />
            ))}
          </div>
        </section>

        {/* CHAPTER 02 */}
        <section id="a2-qa" className="scroll-mt-28 space-y-12">
          <SectionHeader
            chapter="CHAPTER 02"
            title="Software Testing & QA"
            subtitle="Ensuring fault tolerance, validation loops, and seamless user experiences."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {QA_SKILLS.map((skill, idx) => (
              <SkillCard key={skill} title={skill} index={idx} />
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md">
            {QA_STATS.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-4 text-center"
              >
                <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tabular-nums">
                  {stat.isText ? (
                    stat.textValue
                  ) : (
                    <StatCounter target={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <p className="font-mono text-xs text-slate-400 mt-2 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <a
              href="https://github.com/A-PRASATHARUMUGAM"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 font-mono text-xs font-bold text-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 active:scale-95"
            >
              <Github className="w-4 h-4" />
              <span>Explore GitHub Repository</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>

        {/* CHAPTER 03 */}
        <section id="a3-creative" className="scroll-mt-28 space-y-8">
          <SectionHeader
            chapter="CHAPTER 03"
            title="Freelance Multimedia & Creative"
            subtitle="Blending visual storytelling, graphic design, animation, and AI-driven media."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREATIVE_ITEMS.map((item, idx) => (
              <MediaCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </section>

        {/* CHAPTER 04 */}
        <section id="a4-marketing" className="scroll-mt-28 space-y-8">
          <SectionHeader
            chapter="CHAPTER 04"
            title="Digital Marketing"
            subtitle="Data-backed strategies, search engine optimizations, and conversion design."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MARKETING_CARDS.map((card, idx) => (
              <FlipCard
                key={card.title}
                card={card}
                index={idx}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </section>
      </div>

      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </Suspense>
      )}
    </section>
  );
}

function SectionHeader({
  chapter,
  title,
  subtitle,
}: {
  chapter: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-2 border-l-2 border-cyan-500/40 pl-4 sm:pl-6">
      <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase">
        {chapter}
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

function ProjectCard({
  project,
  index,
  size,
  prefersReducedMotion,
  onOpen,
}: {
  project: Project;
  index: number;
  size: string;
  prefersReducedMotion: boolean;
  onOpen: (project: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(34, 211, 238, 0.12), transparent 40%)`;
      }
      if (cardRef.current) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (!cardRef.current || prefersReducedMotion) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      }}
      className={`group relative ${size} cursor-pointer rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden backdrop-blur-md transition-all duration-200 transform-gpu hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60`}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      />

      {/* Cover art */}
      <div className="relative h-40 sm:h-48 w-full overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
          <ProjectCover project={project} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/5 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px]">
          <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-slate-200 backdrop-blur-sm">
            {TYPE_LABEL[project.type]} Project
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-slate-200 backdrop-blur-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                project.status === "Currently Working"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-emerald-400"
              }`}
            />
            {project.status}
          </span>
        </div>
      </div>

      <div className="relative z-20 flex flex-col justify-between p-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>
          <p className="mt-2 text-xs font-light leading-relaxed text-slate-400 line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 font-mono text-xs">
          <span className="text-slate-500">{project.number}</span>
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Source <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-400 group-hover:text-cyan-400 transition-colors">
              View details <ExternalLink className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SkillCard({ title, index }: { title: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all flex items-center gap-3 group transform-gpu"
    >
      <Terminal className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
      <span className="font-mono text-xs text-slate-300 group-hover:text-white">
        {title}
      </span>
    </motion.div>
  );
}

function MediaCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative rounded-2xl bg-slate-900/40 border border-white/10 p-6 overflow-hidden backdrop-blur-md hover:border-emerald-500/40 transition-all transform-gpu hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-6">
        <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">
          {item.category}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 font-mono text-xs text-emerald-300">
          {item.count}
        </span>
      </div>
      <h3 className="text-xl font-mono font-bold text-white group-hover:text-emerald-300 transition-colors">
        {item.title}
      </h3>
    </motion.div>
  );
}

function FlipCard({
  card,
  index,
  prefersReducedMotion,
}: {
  card: any;
  index: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 transform-gpu hover:-translate-y-1"
    >
      <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
        <Award className="w-5 h-5" />
      </div>
      <h3 className="font-mono text-lg font-bold text-white mb-2">
        {card.title}
      </h3>
      <p className="text-xs text-slate-400 font-light leading-relaxed">
        {card.desc}
      </p>
    </motion.div>
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
    const duration = 1200;
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
