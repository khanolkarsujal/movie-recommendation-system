import React, { useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Episode } from './types';

interface EpisodeRowProps {
  title: string;
  label?: string;
  episodes: Episode[];
  isContinueWatching?: boolean;
}

const EpisodeRow: React.FC<EpisodeRowProps> = ({
  title,
  label,
  episodes,
  isContinueWatching = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  const handleCardClick = useCallback(
    (episode: Episode) => {
      navigate(`/watch?title=${encodeURIComponent(episode.title)}`);
    },
    [navigate]
  );

  return (
    <div className="group relative px-8 md:px-[80px]">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-[22px] font-bold text-white">{title}</h2>
        {label && (
          <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[10px] font-bold tracking-[1.5px] rounded">
            {label}
          </span>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Scroll left"
          >
            <ChevronLeft size={40} className="text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {episodes.map((episode, i) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group/card flex-shrink-0 w-[280px] cursor-pointer"
              onClick={() => handleCardClick(episode)}
            >
              <div className="relative rounded-lg overflow-hidden mb-3 bg-white/5">
                <img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full aspect-video object-cover group-hover/card:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {isContinueWatching && episode.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-[var(--accent)]"
                      style={{ width: `${episode.progress}%` }}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="scale-0 group-hover/card:scale-100 transition-transform">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold text-[15px] mb-1 line-clamp-1">
                  {episode.title}
                </h3>
                <div className="flex items-center gap-2 text-white/40 text-[13px]">
                  {episode.episodeNumber && (
                    <span>S{episode.seasonNumber} E{episode.episodeNumber}</span>
                  )}
                  {episode.duration && <span>{episode.duration}</span>}
                  {episode.rating && (
                    <span className="text-[var(--accent)]">★ {episode.rating}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-l from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Scroll right"
          >
            <ChevronRight size={40} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EpisodeRow;
