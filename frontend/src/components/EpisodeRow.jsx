import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EpisodeCard from './EpisodeCard';

function EpisodeRow({ title, episodes }) {
  const scrollRef = useRef(null);
  const [sectionHovered, setSectionHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'right' ? 480 : -480;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  return (
    <div
      className="relative mb-10"
      onMouseEnter={() => setSectionHovered(true)}
      onMouseLeave={() => setSectionHovered(false)}
    >
      {/* Section header */}
      <div className="flex items-center justify-between px-[80px] mb-3">
        <h2 className="text-[16px] font-semibold text-white tracking-tight">
          {title}
        </h2>
        <button className="flex items-center gap-1 text-[13px] text-white/40 hover:text-white/80 transition-colors duration-200">
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Scroll wrapper with fade edges */}
      <div className="relative">
        {/* Left fade edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0d0d0d, transparent)',
            opacity: canScrollLeft ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />
        {/* Right fade edge */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #0d0d0d, transparent)',
            opacity: canScrollRight ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Left arrow button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-[60px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 hover:border-white/40 transition-all duration-200"
            style={{
              opacity: sectionHovered ? 1 : 0,
              transform: `translateY(-50%) scale(${sectionHovered ? 1 : 0.8})`,
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: sectionHovered ? 'auto' : 'none',
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Right arrow button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center border border-white/20 bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 hover:border-white/40 transition-all duration-200"
            style={{
              opacity: sectionHovered ? 1 : 0,
              transform: `translateY(-50%) scale(${sectionHovered ? 1 : 0.8})`,
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: sectionHovered ? 'auto' : 'none',
            }}
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-row gap-3 overflow-x-auto overflow-y-visible pb-6 px-[80px]"
          style={{ scrollbarWidth: 'none' }}
        >
          {episodes.map((episode, index) => (
            <EpisodeCard key={episode.id} episode={episode} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EpisodeRow;
