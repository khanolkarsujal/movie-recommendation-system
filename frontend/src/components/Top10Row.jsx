import React, { useRef, useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EpisodeCard from './EpisodeCard';

function Top10Row({ title, episodes }) {
  const rowRef        = useRef(null);
  const [rowHovered,  setRowHovered]  = useState(false);
  const [showLeft,    setShowLeft]    = useState(false);
  const [showRight,   setShowRight]   = useState(true);

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
      <div className="px-8 md:px-16 mb-6">
        <p className="text-[11px] font-bold text-[#8b5cf6] tracking-[1.5px] uppercase mb-1">
          GLOBAL TRENDING
        </p>
        <h2 className="text-[20px] font-bold text-white/90">
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
            top: '120px', // Center of 240px card
            transform: 'translateY(-50%)',
            zIndex: 50,
            width: '48px',
            height: '140px',
            background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)',
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
          className="flex overflow-x-auto overflow-y-visible gap-16 px-8 md:px-16 pb-4 no-scrollbar"
          style={{ scrollPaddingLeft: '80px' }}
        >
          {episodes.slice(0, 10).map((ep, i) => (
            <div key={ep.id} className="top10-card relative flex-shrink-0 group/card" style={{ width: 220, height: 240 }}>
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
            top: '120px',
            transform: 'translateY(-50%)',
            zIndex: 50,
            width: '48px',
            height: '140px',
            background: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={28} color="white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default memo(Top10Row);
