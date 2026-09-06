import React, { useEffect, useRef } from "react";

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const winScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      if (barRef.current) {
        barRef.current.style.width = `${scrolled}%`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9990] h-[2px] bg-white/5">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-white transition-all duration-150 ease-out shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        style={{ width: "0%" }}
      />
    </div>
  );
};
