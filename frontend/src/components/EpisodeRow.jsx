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
    const amount = dir === 'right' ? el.clientWidth - 80 : -(el.clientWidth - 80);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [episodes, checkScroll]);

  return (
    <section
      className="relative mb-10"
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row Header */}
      <div className="flex items-center justify-between px-5 md:px-[var(--row-padding)] mb-4">
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
        {/* Fade Edges */}
        <div
          className="absolute left-0 top-0 bottom-6 w-20 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, var(--bg-base), transparent)',
            opacity: canLeft ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-6 w-20 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, var(--bg-base), transparent)',
            opacity: canRight ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-[calc(var(--card-h)-8px)] rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all duration-300 hover:bg-black/80 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            opacity: canLeft && hovered ? 1 : 0,
            transform: `translateY(-50%) translateX(${canLeft && hovered ? '0px' : '-8px'})`,
            pointerEvents: canLeft && hovered ? 'auto' : 'none',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-[calc(var(--card-h)-8px)] rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all duration-300 hover:bg-black/80 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            opacity: canRight && hovered ? 1 : 0,
            transform: `translateY(-50%) translateX(${canRight && hovered ? '0px' : '8px'})`,
            pointerEvents: canRight && hovered ? 'auto' : 'none',
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Scrollable Strip */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="row-scroll flex flex-row gap-3 overflow-x-auto overflow-y-visible pb-6 pt-2 px-5 md:px-[var(--row-padding)]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {episodes.map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(EpisodeRow);
