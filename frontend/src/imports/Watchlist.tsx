import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Play, Trash2, Info, Plus, Check, Filter, SortAsc, Film, Bookmark, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useStore } from '../store';
import { MovieRow } from '../components/MovieRow';
import { trendingNow } from '../data/movies';
import type { Movie } from './types';

interface WatchlistCardProps {
  movie: Movie;
  onRemove: (id: number | string) => void;
  index: number;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({ movie, onRemove, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const src = movie.thumbnail?.startsWith('http')
    ? movie.thumbnail
    : `https://image.tmdb.org/t/p/w500${movie.thumbnail}`;

  const handlePlayClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
    },
    [navigate, movie.title]
  );

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(movie.id);
    },
    [onRemove, movie.id]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{
        delay: index * 0.04,
        duration: 0.4,
        layout: { duration: 0.3 },
        exit: { duration: 0.2 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-[8px] overflow-hidden bg-[var(--bg-card)] border border-[var(--border-default)]
                 hover:border-[var(--border-brand)] transition-all duration-300 hover:-translate-y-2
                 hover:shadow-[0_24px_64px_rgba(0,0,0,0.8)] cursor-pointer"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={src}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{
            opacity: isHovered ? 0.3 : 0.6,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/${movie.id}/400/225`;
          }}
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/60 to-transparent" />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${movie.accent || 'var(--brand-purple)'}20 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Remove button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        onClick={handleRemoveClick}
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/80 backdrop-blur-md
                   flex items-center justify-center border border-white/10
                   text-white/70 hover:text-[#ef4444] hover:bg-[#ef4444]/20 hover:border-[#ef4444]/40
                   transition-all outline-none"
        aria-label="Remove from watchlist"
      >
        <Trash2 size={16} />
      </motion.button>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
        <motion.div
          initial={false}
          animate={{ y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-white font-bold text-[17px] leading-tight mb-2 line-clamp-2">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 text-[13px] text-white/60 mb-4">
            <span>{movie.year}</span>
            {movie.duration && (
              <>
                <span>•</span>
                <span>{movie.duration}</span>
              </>
            )}
            {typeof movie.rating === 'string' && (
              <>
                <span>•</span>
                <span className="text-[var(--status-match-green)] font-semibold">
                  {movie.rating}
                </span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={handlePlayClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-[5px]
                       text-[14px] font-bold hover:bg-white/90 active:scale-95
                       transition-all outline-none shadow-lg"
            >
              <Play size={14} fill="black" /> Play
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20
                       flex items-center justify-center text-white/80 hover:bg-black/80 hover:border-white/40
                       transition-all outline-none"
              aria-label="More info"
            >
              <Info size={16} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress bar */}
      {movie.progress !== undefined && movie.progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/10 z-20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${movie.progress}%` }}
            transition={{ duration: 0.8, delay: index * 0.04 + 0.2 }}
            className="h-full bg-[var(--brand-purple)] rounded-r-full"
          />
        </div>
      )}
    </motion.div>
  );
};

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const { watchlist, removeFromWatchlist } = useStore();
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'year'>('recent');
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const handleRemove = useCallback(
    (id: number | string) => {
      removeFromWatchlist(id);
      toast.success('Removed from Watchlist', {
        description: 'Item has been removed from your watchlist',
        duration: 3000,
      });
    },
    [removeFromWatchlist]
  );

  // Sort and filter logic
  const sortedWatchlist = React.useMemo(() => {
    let filtered = [...watchlist];

    if (filterGenre !== 'all') {
      filtered = filtered.filter(m => m.genres?.includes(filterGenre));
    }

    switch (sortBy) {
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'year':
        return filtered.sort((a, b) => (b.year || '').localeCompare(a.year || ''));
      default:
        return filtered;
    }
  }, [watchlist, sortBy, filterGenre]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-[60px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex items-start justify-between"
      >
        <div>
          <h1 className="text-[40px] font-medium text-white tracking-tight mb-3">My Watchlist</h1>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--brand-purple)]/20 text-[var(--brand-purple)] text-[14px] font-medium tracking-wide">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-[8px] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors bg-transparent outline-none">
            <Grid size={18} />
          </button>
          <button className="w-10 h-10 rounded-[8px] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors bg-transparent outline-none">
            <List size={18} />
          </button>
        </div>
      </motion.div>

      {/* Filters and Sort */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex items-center justify-between mb-8 pb-8 border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          {['All', 'Movies', 'TV Shows', 'Documentaries'].map(tab => {
            const isActive = (filterGenre === 'all' && tab === 'All') || filterGenre === tab;
            return (
              <button 
                key={tab}
                onClick={() => setFilterGenre(tab === 'All' ? 'all' : tab)}
                className={`px-5 py-2.5 rounded-[8px] text-[14px] font-medium transition-all outline-none ${
                  isActive
                  ? 'border border-white/30 text-white bg-white/5'
                  : 'border border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-all text-[14px] font-medium outline-none">
          <SortAsc size={16} /> Sort
        </button>
      </motion.div>

      {/* Content */}
      {watchlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          {/* Bookmark Icon Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-8
                     border border-[var(--brand-purple)]/30 bg-[var(--brand-purple)]/10 relative"
          >
            <Bookmark size={32} className="text-[var(--brand-purple)]" strokeWidth={1.5} />
          </motion.div>

          <h2 className="text-[28px] font-medium text-white mb-3 tracking-tight">
            Your watchlist is empty
          </h2>
          <p className="text-white/50 mb-10 max-w-sm text-[15px] leading-relaxed">
            Browse content and tap the bookmark icon to save movies and shows for later.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="px-6 py-3 bg-transparent text-white rounded-[8px] font-medium text-[15px]
                       border border-white/20 hover:bg-white/5 transition-all
                       flex items-center gap-2 outline-none"
            >
              <Bookmark size={16} />
              Browse Content
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-transparent text-white/80 rounded-[8px] font-medium text-[15px]
                       hover:text-white border border-white/20 hover:bg-white/5
                       transition-all outline-none"
            >
              Go Home
            </button>
          </div>
          
          {/* Recommended section to prevent "dead end" empty states */}
          <div className="mt-24 w-full max-w-[1400px] text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <MovieRow
                title="Recommended for you"
                label="YOU MIGHT LIKE"
                movies={trendingNow.slice(0, 8)}
                className="!px-0"
              />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}
        >
          <AnimatePresence mode="popLayout">
            {sortedWatchlist.map((movie, index) => (
              <WatchlistCard
                key={movie.id}
                movie={movie}
                onRemove={handleRemove}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Watchlist;
