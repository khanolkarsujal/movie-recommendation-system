/**
 * MovieCard Component
 * Enhanced landscape 16:9 card with trailer preview and quick actions
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Info, Check, Volume2, VolumeX, MoreVertical, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { IconButton } from './ui/IconButton';
import { useStore } from '../store';
import { toast } from 'sonner';
import type { Movie } from '../imports/types';

type BadgeVariant = 'new' | 'top10' | 'trending' | 'award';

interface MovieCardProps {
  movie: Movie;
  badge?: BadgeVariant;
  showProgress?: boolean;
  rank?: number;
  onPlay?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  enableTrailerPreview?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  badge,
  showProgress = false,
  rank,
  onPlay,
  onHover,
  onLeave,
  enableTrailerPreview = true,
}) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerMuted, setTrailerMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const trailerTimeoutRef = useRef<NodeJS.Timeout>();

  const inWatchlist = isInWatchlist(movie.id);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.();

    // Show quick actions after 300ms
    hoverTimeoutRef.current = setTimeout(() => {
      setShowQuickActions(true);
    }, 300);

    // Start trailer preview after 2 seconds of hover
    if (enableTrailerPreview && movie.trailerUrl) {
      trailerTimeoutRef.current = setTimeout(() => {
        setShowTrailer(true);
      }, 2000);
    }
  }, [onHover, enableTrailerPreview, movie.trailerUrl]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowQuickActions(false);
    setShowTrailer(false);
    onLeave?.();

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (trailerTimeoutRef.current) {
      clearTimeout(trailerTimeoutRef.current);
    }
  }, [onLeave]);

  // Play/pause trailer video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (showTrailer) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [showTrailer]);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    } else {
      navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
    }
  }, [onPlay, navigate, movie.title]);

  const handleWatchlistClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast.success('Removed from Watchlist');
    } else {
      addToWatchlist(movie);
      toast.success('Added to Watchlist');
    }
  }, [inWatchlist, movie, addToWatchlist, removeFromWatchlist]);

  const handleInfoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Open detail modal or navigate to detail page
    console.log('Show info for:', movie.title);
  }, [movie.title]);

  return (
    <motion.div
      className="relative cursor-pointer group"
      style={{ width: '220px', height: '124px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Card Container */}
      <div className="w-full h-full rounded-[4px] overflow-hidden relative bg-[var(--bg-card)]">
        {/* Thumbnail Image */}
        <motion.img
          src={movie.thumbnail || 'https://via.placeholder.com/220x124/181818/666?text=No+Image'}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ opacity: showTrailer ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Trailer Video */}
        {enableTrailerPreview && movie.trailerUrl && (
          <video
            ref={videoRef}
            src={movie.trailerUrl}
            muted={trailerMuted}
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-0"
            style={{ opacity: showTrailer ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        )}

        {/* Gradient Overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 30%, transparent 60%)',
          }}
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 pointer-events-none"
        />

        {/* Top-left badge */}
        {badge && (
          <div className="absolute top-2 left-2 z-10">
            {badge === 'new' && <Badge variant="new">NEW</Badge>}
            {badge === 'top10' && rank && (
              <div className="flex items-center gap-1">
                <Badge variant="top10">TOP 10</Badge>
                <span className="text-white text-[11px] font-bold">#{rank}</span>
              </div>
            )}
            {badge === 'trending' && <Badge variant="trending">TRENDING</Badge>}
            {badge === 'award' && <Badge variant="award">AWARD</Badge>}
          </div>
        )}

        {/* Top-right duration/quality */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          {movie.duration && (
            <div className="bg-black/70 px-1.5 py-0.5 rounded-[3px]">
              <span className="text-white text-[11px] font-semibold">{movie.duration}</span>
            </div>
          )}
          {movie.quality && (
            <Badge variant="4k">{movie.quality}</Badge>
          )}
        </div>

        {/* Trailer mute button */}
        {showTrailer && movie.trailerUrl && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              setTrailerMuted(!trailerMuted);
            }}
            className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm
                     flex items-center justify-center text-white hover:bg-black/80 transition-all"
            aria-label={trailerMuted ? 'Unmute' : 'Mute'}
          >
            {trailerMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
        )}

        {/* Bottom-left title */}
        <div className="absolute bottom-2 left-2 right-2 z-10">
          <motion.h3
            className="text-white text-[14px] font-semibold line-clamp-1"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
            animate={{ y: showQuickActions ? -20 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {movie.title}
          </motion.h3>

          {/* Match score */}
          {movie.rating && (
            <motion.p
              className="text-[var(--status-match-green)] text-[11px] font-bold mt-0.5"
              animate={{ opacity: showQuickActions ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {movie.rating} Match
            </motion.p>
          )}
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 left-2 right-2 z-20 flex items-center gap-1.5"
            >
              <button
                onClick={handlePlayClick}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-white hover:bg-white/90
                         flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Play"
              >
                <Play size={14} fill="black" className="text-black ml-0.5" />
              </button>

              <button
                onClick={handleWatchlistClick}
                className={`flex-shrink-0 w-7 h-7 rounded-full backdrop-blur-sm border
                         flex items-center justify-center transition-all active:scale-95 ${
                  inWatchlist
                    ? 'bg-[var(--brand-purple)]/20 border-[var(--brand-purple)] text-[var(--brand-purple)]'
                    : 'bg-black/60 border-white/20 text-white hover:border-white/40'
                }`}
                aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
              </button>

              <button
                onClick={handleInfoClick}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/20
                         flex items-center justify-center text-white hover:border-white/40
                         transition-all active:scale-95"
                aria-label="More info"
              >
                <Info size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar (Continue Watching) */}
        {showProgress && movie.progress !== undefined && movie.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <ProgressBar progress={movie.progress} height={3} variant="watch" />
          </div>
        )}
      </div>

      {/* Hover shadow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-[4px] pointer-events-none"
            style={{
              boxShadow: 'var(--shadow-card-hover)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Glow effect */}
      {movie.accent && isHovered && (
        <div
          className="absolute inset-0 -z-10 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, ${movie.accent} 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
};

export default MovieCard;