/**
 * ContinueWatchingCard Component
 * Specialized card for "Continue Watching" with centered text and more options menu
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, MoreVertical, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from './ui/ProgressBar';
import { toast } from 'sonner';
import type { Movie } from '../imports/types';

interface ContinueWatchingCardProps {
  movie: Movie;
  onPlay?: () => void;
  onRemove?: (movieId: number | string) => void;
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({
  movie,
  onPlay,
  onRemove,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    } else {
      navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
    }
  }, [onPlay, navigate, movie.title]);

  const handleRemoveClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onRemove) {
      onRemove(movie.id);
    }
    toast.success('Removed from Continue Watching');
  }, [onRemove, movie.id]);

  const handleMenuToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }, [showMenu]);

  return (
    <motion.div
      className="relative flex-shrink-0 group cursor-pointer aspect-video"
      style={{ width: 'var(--card-width, 260px)', borderRadius: 8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      onClick={handlePlayClick}
      whileHover={{ scale: 1.05, y: -6, zIndex: 50 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.8 }}
    >
      {/* Ambient glow on hover */}
      <div
        className={`absolute inset-0 -z-10 blur-3xl transition-opacity duration-700 ${isHovered ? 'opacity-40' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(circle at 50% 120%, rgba(139,92,246,0.6) 0%, transparent 65%)' }}
      />

      {/* Thumbnail Container */}
      <div className="relative w-full h-full overflow-hidden bg-[var(--bg-card)]" style={{ borderRadius: 8 }}>
        {/* Thumbnail Image */}
        <img
          src={movie.thumbnail || 'https://via.placeholder.com/230x130/181818/666?text=No+Image'}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Base gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 40%, transparent 65%)',
          }}
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 pointer-events-none"
        />

        {/* Play button (appears on hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handlePlayClick}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
                       w-12 h-12 rounded-full bg-white/90 hover:bg-white
                       flex items-center justify-center transition-all active:scale-95 shadow-xl"
              aria-label="Play"
            >
              <Play size={20} fill="black" className="text-black ml-0.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* More options button (top-right) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2 z-30"
              ref={menuRef}
            >
              <button
                onClick={handleMenuToggle}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/20
                         flex items-center justify-center text-white hover:bg-black/80 hover:border-white/40
                         transition-all"
                aria-label="More options"
              >
                <MoreVertical size={14} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-9 right-0 w-48 bg-[#0f0f0f]/98 border border-white/10 rounded-lg
                             backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
                    style={{ transformOrigin: 'top right' }}
                  >
                    <button
                      onClick={handleRemoveClick}
                      className="w-full px-4 py-2.5 text-left text-[13px] text-white/80 hover:bg-white/10
                               transition-colors flex items-center gap-2"
                    >
                      <X size={14} />
                      Remove from row
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[13px] text-white/80 hover:bg-white/10
                               transition-colors flex items-center gap-2"
                    >
                      <Play size={14} />
                      View details
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        {movie.progress !== undefined && movie.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 h-[3px] bg-white/10">
            <div
              style={{
                width: `${Math.min(movie.progress, 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
                borderRadius: '0 2px 2px 0',
              }}
            />
          </div>
        )}

        {/* Title overlay - shows at bottom on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-2 pb-2 pt-8"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            transition: 'opacity 0.2s',
            opacity: isHovered ? 0 : 1,
          }}
        >
          <h3 style={{ fontSize: 12, fontWeight: 600, color: '#e5e5e5', margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {movie.title}
          </h3>
        </div>

        {/* Hover shadow */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 8,
                boxShadow: '0 8px 32px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.5)',
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContinueWatchingCard;
