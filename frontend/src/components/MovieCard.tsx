/**
 * MovieCard Component
 * Enhanced landscape 16:9 card with trailer preview, glassmorphism, and spring physics
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Note: If using 'motion/react', change import to: import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Info, Check, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Assuming you still want to keep these imports. 
// I've styled natively around them to guarantee the cinematic look, 
// but left them imported so your file doesn't break!
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

  // Timeout refs
  const hoverTimeoutRef = useRef<any>(null);
  const trailerTimeoutRef = useRef<any>(null);

  const inWatchlist = isInWatchlist(movie.id);

  // Proper cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (trailerTimeoutRef.current) clearTimeout(trailerTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.();

    // Show quick actions after 300ms (prevents flashing when scrolling quickly)
    hoverTimeoutRef.current = setTimeout(() => setShowQuickActions(true), 300);

    // Start trailer preview after 1.5s - 2s of hover
    if (enableTrailerPreview && movie.trailerUrl) {
      trailerTimeoutRef.current = setTimeout(() => setShowTrailer(true), 1500);
    }
  }, [onHover, enableTrailerPreview, movie.trailerUrl]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowQuickActions(false);
    setShowTrailer(false);
    onLeave?.();

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (trailerTimeoutRef.current) clearTimeout(trailerTimeoutRef.current);
  }, [onLeave]);

  // Play/pause trailer video smoothly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (showTrailer) {
      video.play().catch(() => { /* Handle autoplay restrictions silently */ });
    } else {
      // Small fade out delay logic could go here, but pausing immediately is safer
      video.pause();
      video.currentTime = 0;
    }
  }, [showTrailer]);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) onPlay();
    else navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
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
    console.log('Show info for:', movie.title);
  }, [movie.title]);

  return (
    <motion.div
      className="relative cursor-pointer group aspect-video flex-shrink-0 z-0 hover:z-50 outline-none"
      style={{ width: 'var(--card-width, 260px)', borderRadius: 8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayClick}
      whileHover={{ y: -6, scale: 1.05, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.8 }}
      role="button"
      tabIndex={0}
    >
      {/* Ambient Glow (on hover) */}
      <div
        className={`absolute inset-0 -z-10 blur-3xl transition-opacity duration-700 ${isHovered ? 'opacity-50' : 'opacity-0'}`}
        style={{
          background: movie.accent
            ? `radial-gradient(circle at 50% 120%, ${movie.accent} 0%, transparent 65%)`
            : 'radial-gradient(circle at 50% 120%, #8b5cf6 0%, transparent 65%)'
        }}
      />

      {/* Main Card Container */}
      <div className="w-full h-full overflow-hidden relative bg-[#1c1c1e]" style={{ borderRadius: 8 }}>

        {/* Thumbnail Image */}
        <motion.img
          src={movie.thumbnail || 'https://via.placeholder.com/260x146/181818/666?text=No+Image'}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-1000 ease-out group-hover:scale-105"
          loading="lazy"
          animate={{ opacity: showTrailer ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Trailer Video */}
        {enableTrailerPreview && movie.trailerUrl && (
          <motion.video
            ref={videoRef}
            src={movie.trailerUrl}
            muted={trailerMuted}
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: showTrailer ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Deep Cinematic Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.7) 25%, transparent 50%)',
        }} />

        {/* Top Badges (Left) */}
        {badge && (
          <div className="absolute top-2.5 left-2.5 z-10 drop-shadow-md">
            {badge === 'new' && <Badge variant="new">NEW</Badge>}
            {badge === 'top10' && rank && (
              <div className="flex items-center gap-1.5 bg-[#E50914] text-white px-2 py-0.5 rounded text-[11px] font-black tracking-wider uppercase shadow-lg">
                TOP 10 <span className="opacity-80">#{rank}</span>
              </div>
            )}
            {badge === 'trending' && <Badge variant="trending">TRENDING</Badge>}
            {badge === 'award' && <Badge variant="award">AWARD</Badge>}
          </div>
        )}

        {/* Top Metadata (Right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {movie.duration && (
            <div className="bg-white/10 backdrop-blur-md border border-white/30 px-2.5 py-[3px] rounded-full text-[10px] text-white/95 font-semibold tracking-wider shadow-sm flex items-center justify-center">
              {movie.duration}
            </div>
          )}
          {movie.quality && (
            <Badge variant="4k">{movie.quality}</Badge>
          )}
        </div>

        {/* Trailer Mute Button */}
        <AnimatePresence>
          {showTrailer && movie.trailerUrl && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                setTrailerMuted(!trailerMuted);
              }}
              className="absolute top-10 right-2.5 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all"
              aria-label={trailerMuted ? 'Unmute' : 'Mute'}
            >
              {trailerMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Bottom Content Area */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8 z-10 flex flex-col justify-end"
          animate={{ y: showQuickActions ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          {/* Title */}
          <h3 className="text-white text-[13px] font-semibold line-clamp-1 leading-tight tracking-[0.01em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            {movie.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-medium text-white/55">
            <span>{movie.year || '2024'}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-white/30" />
            <span className="truncate">{movie.genres?.[0] || movie.genre || 'Sci-Fi'}</span>
          </div>
        </motion.div>

        {/* Floating Quick Actions */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-1.5"
            >
              {/* Play Button */}
              <button
                onClick={handlePlayClick}
                className="flex-1 h-7 rounded-full bg-white flex items-center justify-center gap-1.5 transition-all duration-150 hover:bg-white/90 active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              >
                <Play size={12} fill="black" className="text-black" />
                <span className="text-black text-[11px] font-bold tracking-[0.02em]">Play</span>
              </button>

              {/* Watchlist Button */}
              <button
                onClick={handleWatchlistClick}
                className={`w-7 h-7 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-150 active:scale-95 ${
                  inWatchlist
                    ? 'bg-[#8b5cf6]/25 border-[#8b5cf6]/60 text-[#c4b5fd]'
                    : 'bg-black/50 border-white/20 text-white hover:bg-white/15 hover:border-white/35'
                }`}
                aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {inWatchlist ? <Check size={13} /> : <Plus size={13} />}
              </button>

              {/* Info Button */}
              <button
                onClick={handleInfoClick}
                className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/15 hover:border-white/35 transition-all duration-150 active:scale-95"
                aria-label="More info"
              >
                <Info size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glowing Progress Bar (Replaces default to match EpisodeCard) */}
        {showProgress && movie.progress !== undefined && movie.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/60 z-30">
            <div
              className="h-full relative rounded-r-full"
              style={{
                width: `${movie.progress}%`,
                background: 'linear-gradient(90deg, #00d2ff 0%, #8b5cf6 100%)',
                boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)'
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white rounded-full blur-[1px]" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;