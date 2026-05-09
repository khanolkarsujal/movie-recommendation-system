/**
 * MovieRow Component
 * Production-ready carousel with smooth scrolling, drag, hover expansion
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { ContinueWatchingCard } from './ContinueWatchingCard';
import { HoverCardPopup } from './HoverCardPopup';
import { SectionHeader } from './SectionHeader';
import { SkeletonCard } from './ui/SkeletonCard';
import type { Movie } from '../imports/types';

interface MovieRowProps {
  title: string;
  label?: string;
  movies: Movie[];
  showProgress?: boolean;
  badge?: 'new' | 'top10' | 'trending' | 'award';
  onSeeAll?: () => void;
  showSeeAll?: boolean;
  loading?: boolean;
  variant?: 'default' | 'mobile';
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  label,
  movies,
  showProgress = false,
  badge,
  onSeeAll,
  showSeeAll = false,
  loading = false,
  variant = 'default',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverDirection, setHoverDirection] = useState<'above' | 'below' | 'left-edge' | 'right-edge'>('below');
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const cardRefs = useRef<Map<number | string, HTMLDivElement>>(new Map());

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

  const handleCardHover = useCallback((movie: Movie, cardElement: HTMLDivElement) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      const rect = cardElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Determine popup direction based on card position
      let direction: 'above' | 'below' | 'left-edge' | 'right-edge' = 'below';

      if (rect.bottom > viewportHeight * 0.6) {
        direction = 'above';
      } else {
        direction = 'below';
      }

      // Check horizontal edges
      if (rect.left < 300) {
        direction = 'left-edge';
      } else if (rect.right > viewportWidth - 300) {
        direction = 'right-edge';
      }

      setHoverDirection(direction);
      setHoverPosition({ x: rect.left, y: rect.top });
      setHoveredMovie(movie);
    }, 500); // 500ms hover delay for premium feel
  }, []);

  const handleCardLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredMovie(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const paddingClass = variant === 'mobile' ? 'px-5' : 'px-[60px]';

  if (loading) {
    return (
      <div className={`${paddingClass} py-6`}>
        <div className="mb-6">
          <div className="w-48 h-6 bg-white/10 rounded animate-pulse mb-2" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} variant="landscape" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className={`group/row relative ${paddingClass} py-6`}>
      <SectionHeader
        label={label}
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
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              ref={(el) => {
                if (el) cardRefs.current.set(movie.id, el);
                else cardRefs.current.delete(movie.id);
              }}
              className="flex-shrink-0 relative"
              style={{ transformOrigin: 'center center' }}
            >
              {showProgress ? (
                <ContinueWatchingCard
                  movie={movie}
                  onRemove={(id) => {
                    // Handle remove from Continue Watching
                    console.log('Remove movie:', id);
                  }}
                />
              ) : (
                <MovieCard
                  movie={movie}
                  badge={badge}
                  showProgress={showProgress}
                  onHover={() => {
                    const cardEl = cardRefs.current.get(movie.id);
                    if (cardEl) handleCardHover(movie, cardEl);
                  }}
                  onLeave={handleCardLeave}
                />
              )}
            </div>
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

      {/* Hover card popup */}
      <AnimatePresence>
        {hoveredMovie && (
          <div className="fixed z-[999]" style={{ pointerEvents: 'none' }}>
            <HoverCardPopup
              movie={hoveredMovie}
              direction={hoverDirection}
              onPlay={() => { }}
              onAdd={() => { }}
              onInfo={() => { }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieRow;