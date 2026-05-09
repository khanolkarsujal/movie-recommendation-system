import React, { useRef, useState, useEffect } from 'react';
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
    // Scroll by roughly the visible container width minus one card to keep context
    const scrollAmount = Math.max(el.clientWidth - 280, 500); 
    const amount = direction === 'right' ? scrollAmount : -scrollAmount;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  // Initial check in case window size changes
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [episodes]);

  return (
    <div
      className="relative mb-12 group/row"
      onMouseEnter={() => setSectionHovered(true)}
      onMouseLeave={() => setSectionHovered(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-[24px] md:px-[80px] mb-3 md:mb-4">
        <h2 className="text-[18px] md:text-[20px] font-bold text-white/90 tracking-tight flex items-center gap-3 hover:text-white transition-colors cursor-pointer group/title">
          {title}
          <div className="opacity-0 group-hover/title:opacity-100 -translate-x-4 group-hover/title:translate-x-0 transition-all duration-300 flex items-center text-[12px] font-bold text-[#8b5cf6]">
            Explore All <ChevronRight size={14} className="ml-0.5" />
          </div>
        </h2>
      </div>

      {/* Scroll Wrapper */}
      <div className="relative">
        {/* Left Fade Edge */}
        <div
          className="absolute left-0 top-0 bottom-[24px] w-[24px] md:w-[80px] z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #050508, transparent)',
            opacity: canScrollLeft ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        {/* Right Fade Edge */}
        <div
          className="absolute right-0 top-0 bottom-[24px] w-[24px] md:w-[80px] z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #050508, transparent)',
            opacity: canScrollRight ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-[8px] md:left-[24px] top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-full max-h-[158px] rounded-r-lg flex items-center justify-center bg-black/40 hover:bg-black/80 text-white transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              opacity: sectionHovered ? 1 : 0,
              transform: `translateY(-50%) translateX(${sectionHovered ? '0' : '-10px'})`,
              pointerEvents: sectionHovered ? 'auto' : 'none',
              backdropFilter: 'blur(4px)'
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={32} className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:scale-125" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-[8px] md:right-[24px] top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-full max-h-[158px] rounded-l-lg flex items-center justify-center bg-black/40 hover:bg-black/80 text-white transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              opacity: sectionHovered ? 1 : 0,
              transform: `translateY(-50%) translateX(${sectionHovered ? '0' : '10px'})`,
              pointerEvents: sectionHovered ? 'auto' : 'none',
              backdropFilter: 'blur(4px)'
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={32} className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:scale-125" />
          </button>
        )}

        {/* Horizontal Card Strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-row gap-3 overflow-x-auto overflow-y-visible pb-6 pt-2 px-[24px] md:px-[80px]"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
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
