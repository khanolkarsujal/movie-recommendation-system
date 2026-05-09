import React, { useRef, useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EpisodeCard from './EpisodeCard';

function EpisodeRow({ title, episodes, label, seeAll = true }) {
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

  const isContinueWatching = title.toLowerCase().includes('continue watching');

  return (
    <div
      className="movie-row relative mb-12"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      {/* High-Fidelity Header */}
      <div className="flex items-end justify-between px-8 md:px-[80px] mb-4">
        <div className="flex flex-col">
          {label && (
            <p className="text-[10px] font-bold text-[#8b5cf6] tracking-[2px] uppercase mb-1">
              {label}
            </p>
          )}
          <h2 className="text-[18px] md:text-[22px] font-bold text-[#e5e5e5] leading-none tracking-tight">
            {title}
          </h2>
        </div>
        
        {seeAll && (
          <motion.a 
            initial={{ opacity: 0 }}
            animate={{ opacity: rowHovered ? 1 : 0 }}
            className="text-[13px] font-semibold text-[#8b5cf6] flex items-center gap-1 cursor-pointer transition-colors hover:text-[#a78bfa]"
          >
            See All <ChevronRight size={14} />
          </motion.a>
        )}
      </div>

      {/* Row Wrapper for arrows positioning */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          style={{
            opacity: showLeft && rowHovered ? 1 : 0,
            pointerEvents: showLeft && rowHovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            position: 'absolute',
            left: '0px',
            top: '10px', // Start of card
            height: '158px',
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
          <ChevronLeft size={36} color="white" strokeWidth={2.5} />
        </button>

        {/* Cards container */}
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
            el.style.scrollBehavior = 'auto'; // Disable smooth scroll during drag
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
            const walk = (x - el.startX) * 1.5; // Drag speed factor
            el.scrollLeft = el.scrollLeftInitial - walk;
          }}
          style={{
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'visible',
            gap: '24px',
            padding: '20px 80px 40px 80px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: 'grab',
            scrollSnapType: 'x proximity'
          }}
          className="row-scroll no-scrollbar select-none relative z-10"
        >
          {episodes.map((ep, i) => (
            <div key={ep.id} className="scroll-snap-align-start">
              <EpisodeCard
                episode={ep}
                index={i}
                isContinueWatching={isContinueWatching}
              />
            </div>
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
            top: '10px',
            height: '158px',
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

export default memo(EpisodeRow);
