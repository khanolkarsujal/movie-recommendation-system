import React, { useRef, useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EpisodeCard from './EpisodeCard';

function EpisodeRow({ title, episodes, label }) {
  const rowRef        = useRef(null);
  const [rowHovered,  setRowHovered]  = useState(false);
  const [showLeft,    setShowLeft]    = useState(false);
  const [showRight,   setShowRight]   = useState(true);

  const scroll = (dir) => {
    rowRef.current?.scrollBy({
      left: dir === 'right' ? 700 : -700,
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
      className="movie-row"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
      style={{ position: 'relative', marginBottom: '32px' }}
    >
      {/* Row Header */}
      <div style={{ padding: '0 80px', marginBottom: '12px' }}>
        {label && (
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--accent)] block mb-1">
            {label}
          </span>
        )}
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }} className="group/title hover:text-white transition-colors">
          {title}
          <span className="opacity-0 group-hover/title:opacity-100 -translate-x-3 group-hover/title:translate-x-0 transition-all duration-300 text-[12px] font-bold text-[var(--accent)] flex items-center">
            Explore All <ChevronRight size={13} className="ml-0.5" />
          </span>
        </h2>
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        style={{
          opacity: showLeft && rowHovered ? 1 : 0,
          pointerEvents: showLeft && rowHovered ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          position: 'absolute',
          left: '64px',
          top: '50%',
          transform: 'translateY(-30%)',
          zIndex: 50,
          width: '48px',
          height: '100px',
          background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronLeft size={24} color="white" strokeWidth={2.5} />
      </button>

      {/* Cards container */}
      <div
        ref={rowRef}
        onScroll={onScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'visible',
          gap: '12px',
          padding: '8px 80px 200px 80px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none', /* IE and Edge */
        }}
        className="row-scroll"
      >
        <style dangerouslySetInnerHTML={{__html: `
          .row-scroll::-webkit-scrollbar {
            display: none;
          }
        `}} />
        {episodes.map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} index={i} />
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        style={{
          opacity: showRight && rowHovered ? 1 : 0,
          pointerEvents: showRight && rowHovered ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          position: 'absolute',
          right: '0px',
          top: '50%',
          transform: 'translateY(-30%)',
          zIndex: 50,
          width: '48px',
          height: '100px',
          background: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronRight size={24} color="white" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default memo(EpisodeRow);
