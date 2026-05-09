import React, { useRef, useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EpisodeCard from './EpisodeCard';

function Top10Row({ title, episodes }) {
  const rowRef = useRef(null);
  const [rowHovered, setRowHovered] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (dir) => {
    rowRef.current?.scrollBy({
      left: dir === 'right' ? 800 : -800,
      behavior: 'smooth'
    });
  };

  const onScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 10
    );
  };

  useEffect(() => {
    const el = rowRef.current;
    el?.addEventListener('scroll', onScroll, { passive: true });
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="movie-row relative mb-12"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      <div className="px-8 md:px-[80px] mb-3">
        <p className="text-[10px] font-bold text-[#8b5cf6] tracking-[2px] uppercase mb-0.5">
          GLOBAL TRENDING
        </p>
        <h2 className="text-[18px] md:text-[22px] font-bold text-white/95 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          style={{
            opacity: showLeft && rowHovered ? 1 : 0,
            pointerEvents: showLeft && rowHovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            position: 'absolute',
            left: '0px',
            top: '10px',
            height: '240px',
            zIndex: 60,
            width: '60px',
            background: 'linear-gradient(to right, rgba(5,5,8,0.95), transparent)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={28} color="white" strokeWidth={2.5} />
        </button>

        <div
          ref={rowRef}
          onScroll={onScroll}
          onMouseDown={(e) => {
            const el = rowRef.current;
            if (!el) return;
            el.isDown = true;
            el.startX = e.pageX - el.offsetLeft;
            el.scrollLeftInitial = el.scrollLeft;
            el.style.cursor = 'grabbing';
            el.style.scrollBehavior = 'auto';
          }}
          onMouseLeave={() => {
            const el = rowRef.current;
            if (!el) return;
            el.isDown = false;
            el.style.cursor = 'grab';
          }}
          onMouseUp={() => {
            const el = rowRef.current;
            if (!el) return;
            el.isDown = false;
            el.style.cursor = 'grab';
            el.style.scrollBehavior = 'smooth';
          }}
          onMouseMove={(e) => {
            const el = rowRef.current;
            if (!el || !el.isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - el.startX) * 1.5;
            el.scrollLeft = el.scrollLeftInitial - walk;
          }}
          className="flex overflow-x-auto overflow-y-visible gap-12 px-8 md:px-[80px] pt-[10px] pb-[20px] no-scrollbar select-none"
          style={{ cursor: 'grab', scrollSnapType: 'x proximity' }}
        >
          {episodes.slice(0, 10).map((ep, i) => (
            <div key={ep.id} className="top10-card relative flex-shrink-0 group/card pointer-events-auto scroll-snap-align-start" style={{ width: 220, height: 240 }}>
              <span className="rank-number">{i + 1}</span>
              <div className="relative z-10 ml-10 w-40 h-60 rounded-lg overflow-hidden shadow-2xl transition-transform duration-300 group-hover/card:scale-105 group-hover/card:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <img
                  src={ep.thumbnail?.startsWith('http') ? ep.thumbnail : `https://image.tmdb.org/t/p/w500${ep.thumbnail}`}
                  alt={ep.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          style={{
            opacity: showRight && rowHovered ? 1 : 0,
            pointerEvents: showRight && rowHovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            position: 'absolute',
            right: '0px',
            top: '10px',
            height: '240px', // Exact card height
            zIndex: 60,
            width: '60px',
            background: 'linear-gradient(to left, rgba(5,5,8,0.95), transparent)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={36} color="white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default memo(Top10Row);
