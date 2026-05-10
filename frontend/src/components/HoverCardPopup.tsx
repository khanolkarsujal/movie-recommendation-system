/**
 * HoverCardPopup Component
 * Detailed preview that appears on hover (280px width)
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Plus, Info } from 'lucide-react';
import { IconButton } from './ui/IconButton';
import { MatchScore } from './ui/MatchScore';
import type { Movie } from '../imports/types';

type Direction = 'above' | 'below' | 'left-edge' | 'right-edge';

interface HoverCardPopupProps {
  movie: Movie;
  direction?: Direction;
  onPlay?: () => void;
  onAdd?: () => void;
  onInfo?: () => void;
  isInWatchlist?: boolean;
}

const directionStyles = {
  above: 'bottom-full mb-2',
  below: 'top-full mt-2',
  'left-edge': 'left-0',
  'right-edge': 'right-0',
};

const animationVariants = {
  above: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
  below: { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } },
  'left-edge': { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } },
  'right-edge': { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } },
};

export const HoverCardPopup: React.FC<HoverCardPopupProps> = ({
  movie,
  direction = 'below',
  onPlay,
  onAdd,
  onInfo,
  isInWatchlist = false,
}) => {
  const animation = animationVariants[direction];
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (movie.trailerUrl) {
      videoTimeoutRef.current = setTimeout(() => setShowVideo(true), 800);
    }
    return () => {
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    };
  }, [movie.trailerUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && showVideo) {
      video.play().catch(() => {});
    }
  }, [showVideo]);

  // Parse match score
  const matchScore = typeof movie.rating === 'string'
    ? parseInt(movie.rating.replace('%', ''))
    : movie.rating || 0;

  return (
    <motion.div
      className={`
        absolute z-[100] w-[280px]
        ${directionStyles[direction]}
      `}
      initial={animation.initial}
      animate={animation.animate}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div
        className="
          bg-[var(--bg-elevated)]
          rounded-[8px]
          overflow-hidden
          shadow-[var(--shadow-card-hover)]
          border border-[var(--border-subtle)]
        "
      >
        {/* Thumbnail & Video */}
        <div className="relative w-full h-[158px] bg-black">
          <img
            src={movie.thumbnail || movie.image || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=280&h=158&auto=format&fit=crop'}
            alt={movie.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=280&h=158&auto=format&fit=crop') {
                target.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=280&h=158&auto=format&fit=crop';
              }
            }}
          />
          {movie.trailerUrl && (
            <video
              ref={videoRef}
              src={movie.trailerUrl}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(35,35,35,1) 0%, transparent 40%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="px-4 pb-4" style={{ marginTop: '-32px' }}>
          {/* Title */}
          <h3 className="text-white text-[16px] font-semibold mb-2 line-clamp-2">
            {movie.title}
          </h3>

          {/* Match score with metadata */}
          <div className="mb-3">
            <MatchScore
              score={matchScore}
              year={movie.year}
              duration={movie.duration}
              variant="full"
            />
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((genre, index) => (
                <React.Fragment key={genre}>
                  <span className="text-[var(--text-secondary)] text-[12px]">
                    {genre}
                  </span>
                  {index < Math.min(movie.genres!.length, 3) - 1 && (
                    <span className="text-[var(--text-muted)] text-[12px]">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Description */}
          {movie.description && (
            <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed line-clamp-3 mb-4">
              {movie.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <IconButton
              variant="play"
              size="md"
              onClick={onPlay}
              aria-label="Play"
            />
            <IconButton
              variant={isInWatchlist ? 'heart-active' : 'heart'}
              size="md"
              onClick={onAdd}
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            />
            <IconButton
              variant="info"
              size="md"
              onClick={onInfo}
              aria-label="More info"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HoverCardPopup;
