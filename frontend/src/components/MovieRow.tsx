/**
 * MovieRow Component
 * Ultra-Premium carousel with smooth scrolling, edge-fading, drag physics, and dynamic z-indexing
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
// Note: If using 'motion/react', change import to: import { motion, AnimatePresence, PanInfo } from 'motion/react';
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

  // Smart z-indexing to prevent clipping when cards scale up
  const [rowZIndex, setRowZIndex] = useState(10);

  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverDirection, setHoverDirection] = useState<'above' | 'below' | 'left-edge' | 'right-edge'>('below');
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const cardRefs = useRef<Map<number | string, HTMLDivElement>>(new Map());

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Added slight buffer (2px) to prevent sub-pixel rendering bugs
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(el);

    // Also listen to native scroll to update fading masks in real time
    el.addEventListener('scroll', updateScrollButtons, { passive: true });

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener('scroll', updateScrollButtons);
    };
  }, [movies, updateScrollButtons]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8; // Scroll 80% of view for context retention
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

    // Adjusted velocity/offset thresholds for a snappier, more native mobile feel
    if (Math.abs(velocity) > 400 || Math.abs(offset) > 80) {
      const scrollAmount = el.clientWidth * 0.6;
      el.scrollBy({
        left: offset < 0 ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleCardHover = useCallback((movie: Movie, cardElement: HTMLDivElement) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      const rect = cardElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let direction: 'above' | 'below' | 'left-edge' | 'right-edge' = 'below';

      if (rect.bottom > viewportHeight * 0.6) direction = 'above';
      else direction = 'below';

      if (rect.left < 300) direction = 'left-edge';
      else if (rect.right > viewportWidth - 300) direction = 'right-edge';

      setHoverDirection(direction);
      setHoverPosition({ x: rect.left, y: rect.top });
      setHoveredMovie(movie);
    }, 600); // Slightly increased delay so casual scrolling doesn't trigger massive popups
  }, []);

  const handleCardLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMovie(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const paddingClass = variant === 'mobile' ? 'px-5' : 'px-[60px]';

  // Cinematic edge-mask logic. Fades out the cards at the edges if there's more content.
  const maskImageStyle = {
    WebkitMaskImage: `linear-gradient(to right, 
      ${canScrollLeft ? 'transparent, black 4%' : 'black 0%, black 0%'}, 
      ${canScrollRight ? 'black 96%, transparent' : 'black 100%, black 100%'}
    )`,
    maskImage: `linear-gradient(to right, 
      ${canScrollLeft ? 'transparent, black 4%' : 'black 0%, black 0%'}, 
      ${canScrollRight ? 'black 96%, transparent' : 'black 100%, black 100%'}
    )`
  };

  if (loading) {
    return (
      <div className={`${paddingClass} py-6`}>
        <div className="mb-6">
          <div className="w-48 h-6 bg-white/5 rounded animate-pulse mb-2" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} variant="landscape" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div
      className="group/row relative py-6 outline-none"
      style={{ zIndex: rowZIndex }}
      onMouseEnter={() => setRowZIndex(50)} // Bring row to front when interacting
      onMouseLeave={() => setRowZIndex(10)} // Reset when leaving
    >
      <div className={paddingClass}>
        <SectionHeader
          label={label}
          title={title}
          onSeeAll={onSeeAll}
          showSeeAll={showSeeAll}
          variant={variant}
          className="!px-0 mb-3"
        />
      </div>

      <div className="relative">
        {/* Left Scroll Button - Full Height Cinematic Gradient */}
        <AnimatePresence>
          {canScrollLeft && variant !== 'mobile' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-0 bottom-0 z-[40] w-[80px] bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent
                         flex items-center justify-start pl-4 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 outline-none"
              aria-label="Scroll left"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:border-white/40 transition-all"
              >
                <ChevronLeft size={28} className="text-white drop-shadow-md" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable Container */}
        {/* Note the `py-8 -my-8` trick: This gives cards room to scale UP on hover without being cut off by overflow-x-auto! */}
        <motion.div
          ref={scrollRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className={`flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing py-8 -my-8 ${paddingClass}`}
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            ...maskImageStyle,
            transition: 'mask-image 0.3s ease, -webkit-mask-image 0.3s ease'
          }}
        >
          {movies.map((movie) => (
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
                  onRemove={(id) => console.log('Remove movie:', id)}
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

          {/* Spacer to ensure the last card isn't completely flush with the edge */}
          <div className="w-[20px] flex-shrink-0" />
        </motion.div>

        {/* Right Scroll Button - Full Height Cinematic Gradient */}
        <AnimatePresence>
          {canScrollRight && variant !== 'mobile' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 z-[40] w-[80px] bg-gradient-to-l from-[#0B0F19] via-[#0B0F19]/80 to-transparent
                         flex items-center justify-end pr-4 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 outline-none"
              aria-label="Scroll right"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:border-white/40 transition-all"
              >
                <ChevronRight size={28} className="text-white drop-shadow-md" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Extreme Hover Portal Popup (Retained from your code) */}
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