import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollWidth(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9990] h-[2px] bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-white transition-all duration-150 ease-out shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        style={{ width: `${scrollWidth}%` }}
      />
    </div>
  );
};