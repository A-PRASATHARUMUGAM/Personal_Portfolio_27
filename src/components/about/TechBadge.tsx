// src/components/about/TechBadge.tsx
import { motion } from "framer-motion";
import type { TechItem } from "../../data/aboutData";

interface TechBadgeProps {
  item: TechItem;
  index: number;
}

/**
 * A single skill icon: brand logo (or fallback icon) in a soft glowing
 * circle, with the name as a caption underneath. Hover lifts the card and
 * intensifies the glow — mirrors the tilt/glow language already used on
 * ProjectCard, just scoped down to icon-card size.
 */
export function TechBadge({ item, index }: TechBadgeProps) {
  const Icon = item.icon ?? item.fallbackIcon;
  if (!Icon) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.035 }}
      className="group relative flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-slate-900/30 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-slate-900/60"
    >
      <div className="relative flex h-12 w-12 items-center justify-center">
        {/* Ambient glow — blurred, low-opacity, brightens on hover */}
        <span
          className="absolute inset-0 rounded-full blur-lg opacity-25 transition-opacity duration-300 group-hover:opacity-60"
          style={{ backgroundColor: item.glow }}
          aria-hidden="true"
        />
        <Icon
          className="relative h-7 w-7 transition-transform duration-300 group-hover:scale-110"
          style={{ color: item.color }}
        />
        {item.badge && (
          <span className="absolute -top-1.5 -right-1.5 rounded-full border border-purple-400/40 bg-purple-950/80 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wide text-purple-300">
            {item.badge}
          </span>
        )}
      </div>
      <span className="font-mono text-[11px] leading-tight text-slate-300 transition-colors group-hover:text-white">
        {item.name}
      </span>
    </motion.div>
  );
}
