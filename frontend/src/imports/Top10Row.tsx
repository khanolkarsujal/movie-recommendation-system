import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Episode } from './types';

interface Top10RowProps {
  title: string;
  episodes: Episode[];
}

const Top10Row: React.FC<Top10RowProps> = ({ title, episodes }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowHovered, setRowHovered] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = useCallback((dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({
      left: dir === 'right' ? 800 : -800,
      behavior: 'smooth'
    });
  }, []);

  const onScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 10
    );
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    el?.addEventListener('scroll', onScroll, { passive: true });
    return () => el?.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <div
      className="movie-row relative mb-12"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      <div className="flex items-end justify-between px-8 md:px-[80px] mb-4">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-[#8b5cf6] tracking-[2px] uppercase mb-1">
            GLOBAL TRENDING
          </p>
          <h2 className="text-[18px] md:text-[22px] font-bold text-[#e5e5e5] leading-none tracking-tight">
            {title}
          </h2>
        </div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: rowHovered ? 1 : 0 }}
          className="text-[13px] font-semibold text-[#8b5cf6] flex items-center gap-1 cursor-pointer transition-colors hover:text-[#a78bfa]"
        >
          See All <ChevronRight size={14} />
        </motion.a>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          style={{
            opacity: showLeft && rowHovered ? 1 : 0,
            pointerEvents: showLeft && rowHovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            position: 'absolute',
            left: '0px',
            top: '0px',
            height: '240px',
            zIndex: 60,
            width: '60px',
            background: 'linear-gradient(to right, rgba(20,20,20,0.95), transparent)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={36} color="white" strokeWidth={2.5} />
        </button>

        <div
          ref={rowRef}
          onScroll={onScroll}
          className="flex overflow-x-auto overflow-y-visible gap-14 px-8 md:px-[80px] pt-4 pb-8 no-scrollbar select-none"
          style={{ cursor: 'grab', scrollSnapType: 'x proximity' }}
        >
          {episodes.slice(0, 10).map((ep, i) => (
            <div
              key={ep.id}
              className="relative flex-shrink-0 flex items-center group/card scroll-snap-align-start"
              style={{ width: 180, height: 240 }}
            >
              <span
                className="absolute left-[-20px] bottom-[-20px] text-[180px] font-black leading-none select-none z-0"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px rgba(255,255,255,0.25)',
                  textShadow: '0 0 40px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }}
              >
                {i + 1}
              </span>

              <div className="relative z-10 w-full h-full rounded-[4px] overflow-hidden shadow-2xl transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-[0_0_30px_rgba(139,92,246,0.4)] cursor-pointer">
                <img
                  src={ep.thumbnail?.startsWith('http') ? ep.thumbnail : `https://image.tmdb.org/t/p/w500${ep.thumbnail}`}
                  alt={ep.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          style={{
            opacity: showRight && rowHovered ? 1 : 0,
            pointerEvents: showRight && rowHovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            position: 'absolute',
            right: '0px',
            top: '0px',
            height: '240px',
            zIndex: 60,
            width: '60px',
            background: 'linear-gradient(to left, rgba(20,20,20,0.95), transparent)',
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
};

export default memo(Top10Row);
