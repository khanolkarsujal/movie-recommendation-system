/**
 * Top10Card Component
 * Netflix-style design: Large rank number on left, full standard poster on right
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { toast } from 'sonner';
import type { Movie } from '../imports/types';

interface Top10CardProps {
  rank: number;
  movie: Movie;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}

export const Top10Card: React.FC<Top10CardProps> = ({
  rank,
  movie,
  onClick,
  onHover,
  onLeave,
}) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const inWatchlist = isInWatchlist(movie.id);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onLeave?.();
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast.success('Removed from Watchlist');
    } else {
      addToWatchlist(movie);
      toast.success('Added to Watchlist');
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer group flex items-end gap-0"
      style={{ width: '280px', height: '158px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.8 }}
    >
      {/* Large rank number */}
      <div
        className="flex-shrink-0 select-none pointer-events-none flex items-end justify-center pb-2 transition-all duration-300"
        style={{
          width: '50px',
          height: '100%',
          fontSize: rank < 10 ? '72px' : '56px',
          fontWeight: 900,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          lineHeight: 0.85,
          color: isHovered ? 'rgba(139, 92, 246, 0.9)' : 'transparent',
          WebkitTextStroke: isHovered ? '1.5px rgba(139, 92, 246, 1)' : '1.5px rgba(255, 255, 255, 0.38)',
          textShadow: isHovered ? '0 0 20px rgba(139,92,246,0.5)' : 'none',
        }}
      >
        {rank}
      </div>

      {/* Movie poster card */}
      <div className="relative flex-shrink-0 h-full overflow-hidden bg-[var(--bg-card)]" style={{ width: '200px', borderRadius: 8 }}>
        {/* Poster image */}
        <img
          src={movie.thumbnail || movie.image || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&h=158&auto=format&fit=crop'}
          alt={`#${rank} ${movie.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&h=158&auto=format&fit=crop') {
              target.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&h=158&auto=format&fit=crop';
            }
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.7) 25%, transparent 50%)',
          }}
        />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 pointer-events-none"
        />

        {/* Title - Always visible */}
        <div className="absolute bottom-2 left-2 right-2 z-10">
          <h3 className="text-white text-[13px] font-semibold line-clamp-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
            {movie.title}
          </h3>
        </div>

        {/* Quick Actions on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-2 right-2 z-20 flex items-center gap-1.5"
            >
              <button
                onClick={handlePlayClick}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white hover:bg-white/90
                         flex items-center justify-center transition-all active:scale-95 shadow-lg"
                aria-label="Play"
              >
                <Play size={16} fill="black" className="text-black ml-0.5" />
              </button>

              <button
                onClick={handleWatchlistClick}
                className={`flex-shrink-0 w-8 h-8 rounded-full backdrop-blur-sm border
                         flex items-center justify-center transition-all active:scale-95 ${
                  inWatchlist
                    ? 'bg-[var(--brand-purple)]/20 border-[var(--brand-purple)] text-[var(--brand-purple)]'
                    : 'bg-black/60 border-white/20 text-white hover:border-white/40'
                }`}
                aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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

export default Top10Card;