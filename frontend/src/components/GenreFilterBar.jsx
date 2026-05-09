import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion } from 'framer-motion';

const GENRES = ['All', 'Action', 'Drama', 'Horror', 'Sci-Fi', 'Comedy', 'Thriller', 'Fantasy', 'Animation'];

const GenreFilterBar = ({ activeGenre, setActiveGenre }) => {
  const tabRefs = useRef([]);
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, ready: false });

  const measureIndicator = () => {
    const activeIdx = GENRES.indexOf(activeGenre);
    const activeEl = tabRefs.current[activeIdx];
    const container = containerRef.current;
    if (!activeEl || !container) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();

    setIndicatorStyle({
      left: tabRect.left - containerRect.left + container.scrollLeft,
      width: tabRect.width,
      ready: true,
    });
  };

  useLayoutEffect(() => {
    measureIndicator();
  }, [activeGenre]);

  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [activeGenre]);

  return (
    <div className="sticky top-[64px] z-[40] w-full bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      <div 
        ref={containerRef}
        className="flex items-center gap-8 px-8 md:px-16 overflow-x-auto scrollbar-none relative h-14"
      >
        {GENRES.map((g, i) => (
          <button
            key={g}
            ref={el => tabRefs.current[i] = el}
            onClick={() => setActiveGenre(g)}
            className={`text-sm font-bold whitespace-nowrap transition-all duration-300 outline-none ${
              activeGenre === g ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {g}
          </button>
        ))}

        {/* Animated Underline */}
        {indicatorStyle.ready && (
          <motion.div
            className="absolute bottom-0 h-[3px] bg-[#8b5cf6] rounded-t-full shadow-[0_-4px_12px_rgba(139,92,246,0.5)]"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </div>
    </div>
  );
};

export default GenreFilterBar;
