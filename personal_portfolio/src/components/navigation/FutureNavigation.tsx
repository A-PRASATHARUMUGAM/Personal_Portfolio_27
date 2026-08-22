// src/components/navigation/FutureNavigation.tsx
import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: '01', label: 'WORK', href: '#work' },
  { id: '02', label: 'SYSTEMS', href: '#systems' },
  { id: '03', label: 'ABOUT', href: '#about' },
  { id: '04', label: 'CONTACT', href: '#contact' },
];

export const FutureNavigation: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 font-mono">
      {NAV_ITEMS.map((item, index) => {
        const isHovered = hoveredIndex === index;
        return (
          <a
            key={item.id}
            href={item.href}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group flex items-center justify-end gap-3 py-1 cursor-pointer"
          >
            <span
              className={`text-[11px] transition-all duration-300 ${
                isHovered ? 'text-white translate-x-0 opacity-100' : 'text-neutral-600 -translate-x-2 opacity-0'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`text-[10px] transition-colors duration-300 ${
                isHovered ? 'text-white font-bold' : 'text-neutral-500'
              }`}
            >
              {item.id}
            </span>
            <div
              className={`h-[1px] transition-all duration-300 bg-white ${
                isHovered ? 'w-8 opacity-100' : 'w-3 opacity-20'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
};