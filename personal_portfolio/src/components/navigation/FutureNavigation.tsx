// src/components/navigation/FutureNavigation.tsx
import React, { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "01", label: "WORK", href: "#work" },
  { id: "02", label: "SYSTEMS", href: "#systems" },
  { id: "03", label: "ABOUT", href: "#about" },
  { id: "04", label: "CONTACT", href: "#contact" },
];

const CYCLE_DURATION = 3000; // Duration each item stays active (in ms)

export const FutureNavigation: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    // Pause automatic sequencing if user is actively hovering
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NAV_ITEMS.length);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseEnter = (index: number) => {
    setIsHovered(true);
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <nav
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 font-mono select-none"
      aria-label="Future Navigation"
    >
      {NAV_ITEMS.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <a
            key={item.id}
            href={item.href}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className="group flex items-center justify-end gap-3 py-1 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/50"
          >
            {/* Label: Smooth horizontal slide and fade */}
            <span
              className={`text-[11px] tracking-widest transition-all duration-700 ease-out ${
                isActive
                  ? "text-white translate-x-0 opacity-100"
                  : "text-neutral-500 -translate-x-3 opacity-0 pointer-events-none"
              }`}
            >
              {item.label}
            </span>

            {/* Number: Smooth weight/brightness adjustment */}
            <span
              className={`text-[10px] tracking-wider transition-all duration-500 ease-out ${
                isActive
                  ? "text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  : "text-neutral-500 font-normal"
              }`}
            >
              {item.id}
            </span>

            {/* Indicator Line: Expand width and adjust opacity */}
            <div
              className={`h-[1px] bg-white transition-all duration-700 ease-out ${
                isActive
                  ? "w-8 opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  : "w-3 opacity-25"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
};
