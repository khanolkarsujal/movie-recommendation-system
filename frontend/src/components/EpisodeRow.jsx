import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EpisodeCard from './EpisodeCard';

function EpisodeRow({ title, episodes, label }) {
  const scrollRef    = useRef(null);
  const [hovered,    setHovered]    = useState(false);
  const [canLeft,    setCanLeft]    = useState(false);
  const [canRight,   setCanRight]   = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  const scroll = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === 'right' ? 800 : -800;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [episodes, checkScroll]);

  return (
    <section
      className="relative mb-4"
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row Header */}
      <div className="flex items-center justify-between px-5 md:px-[var(--row-padding)] mb-3">
        <div>
          {label && (
            <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--accent)] block mb-1">
              {label}
            </span>
          )}
          <h2 className="text-[18px] md:text-[20px] font-bold text-white/90 flex items-center gap-3 group/title cursor-pointer hover:text-white transition-colors">
            {title}
            <span className="opacity-0 group-hover/title:opacity-100 -translate-x-3 group-hover/title:translate-x-0 transition-all duration-300 text-[12px] font-bold text-[var(--accent)] flex items-center">
              Explore All <ChevronRight size={13} className="ml-0.5" />
            </span>
          </h2>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Scrollable Strip - overflow visible to allow cards to expand upward/downward, padding-bottom 200px for expanded space */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="row-scroll flex flex-row gap-3 pt-2 px-5 md:px-[var(--row-padding)]"
          style={{ 
            overflow: 'visible',
            paddingBottom: '160px', /* space for hover popup to expand upward/downward */
            scrollBehavior: 'smooth'
          }}
        >
          {episodes.map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} />
          ))}
        </div>

        {/* Floating Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-[var(--sidebar-width)] top-[65px] -translate-y-1/2 z-[150] w-10 h-[80px] text-white flex items-center justify-center transition-all duration-300 outline-none"
          style={{
            background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.8))',
            opacity: canLeft && hovered ? 1 : 0,
            pointerEvents: canLeft && hovered ? 'auto' : 'none',
          }}
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-[65px] -translate-y-1/2 z-[150] w-10 h-[80px] text-white flex items-center justify-center transition-all duration-300 outline-none"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.8))',
            opacity: canRight && hovered ? 1 : 0,
            pointerEvents: canRight && hovered ? 'auto' : 'none',
          }}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}

export default memo(EpisodeRow);
