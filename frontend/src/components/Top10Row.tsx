/**
 * Top10Row Component
 * Portrait cards with large rank numbers
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Top10Card } from './Top10Card';
import { SectionHeader } from './SectionHeader';
import { SkeletonCard } from './ui/SkeletonCard';
import type { Movie } from '../imports/types';

interface Top10RowProps {
  title: string;
  label?: string;
  movies: Movie[];
  onSeeAll?: () => void;
  showSeeAll?: boolean;
  loading?: boolean;
  variant?: 'default' | 'mobile';
}

export const Top10Row: React.FC<Top10RowProps> = ({
  title,
  label,
  movies,
  onSeeAll,
  showSeeAll = false,
  loading = false,
  variant = 'default',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [movies, updateScrollButtons]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const el = scrollRef.current;
    if (!el) return;

    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > 100) {
      const scrollAmount = el.clientWidth * 0.6;
      el.scrollBy({
        left: offset < 0 ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  const paddingClass = variant === 'mobile' ? 'px-5' : 'px-[60px]';

  // Only show top 10
  const top10Movies = movies.slice(0, 10);

  if (loading) {
    return (
      <div className={`${paddingClass} py-6`}>
        <div className="mb-6">
          <div className="w-48 h-6 bg-white/10 rounded animate-pulse mb-2" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} variant="portrait" />
          ))}
        </div>
      </div>
    );
  }

  if (top10Movies.length === 0) {
    return null;
  }

  return (
    <div className={`group/row relative ${paddingClass} py-6`}>
      <SectionHeader
        title={title}
        onSeeAll={onSeeAll}
        showSeeAll={showSeeAll}
        variant={variant}
        className="!px-0"
      />

      <div className="relative">
        {/* Left scroll button */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-0 bottom-0 z-[40] w-16 bg-gradient-to-r from-[var(--bg-page)] via-[var(--bg-page)]/95 to-transparent
                         flex items-center justify-start opacity-0 group-hover/row:opacity-100 transition-opacity duration-300
                         hover:scale-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]"
              aria-label="Scroll left"
            >
              <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center
                            hover:bg-black/80 hover:border-white/40 transition-all">
                <ChevronLeft size={24} className="text-white" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable container */}
        <motion.div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing py-4"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {top10Movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="flex-shrink-0"
            >
              <Top10Card
                rank={index + 1}
                movie={movie}
                onClick={() => {
                  // Navigation handled by card
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Right scroll button */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 z-[40] w-16 bg-gradient-to-l from-[var(--bg-page)] via-[var(--bg-page)]/95 to-transparent
                         flex items-center justify-end opacity-0 group-hover/row:opacity-100 transition-opacity duration-300
                         hover:scale-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]"
              aria-label="Scroll right"
            >
              <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center
                            hover:bg-black/80 hover:border-white/40 transition-all">
                <ChevronRight size={24} className="text-white" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Top10Row;