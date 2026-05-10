import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Play, 
  Trash2, 
  Info, 
  Plus, 
  Check, 
  Filter, 
  SortAsc, 
  Film, 
  Bookmark, 
  Grid, 
  List, 
  Shuffle, 
  Download, 
  MoreVertical, 
  GripVertical,
  ChevronDown
} from 'lucide-react';
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
    >
      {/* Drag Handle */}
      <div className="opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical size={20} />
      </div>

      <span className="text-white/40 text-[13px] w-6 text-center">{index + 1}</span>

      {/* Thumbnail */}
      <div className="relative w-40 h-24 shrink-0 rounded-lg overflow-hidden bg-white/5 shadow-lg" onClick={handlePlayClick}>
        <img 
          src={src} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80'; }}
        />
        {movie.duration && (
          <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[10px] font-bold">
            {movie.duration}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play size={20} fill="white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-center gap-1">
        <h4 className="text-[15px] font-bold text-white line-clamp-2 leading-tight group-hover:text-[var(--brand-purple)] transition-colors">
          {movie.title}
        </h4>
        <div className="flex flex-col text-[12px] text-white/50">
          <span>{movie.genre || 'Media Content'} • {movie.year}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[var(--status-match-green)] font-medium">98% Match</span>
            <span>•</span>
            <span>5.2M views</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(movie.id); }}
          className="p-2 text-white/60 hover:text-[#ef4444] transition-colors"
          title="Remove from watchlist"
        >
          <Trash2 size={18} />
        </button>
        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
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

  const sortedWatchlist = React.useMemo(() => {
    let filtered = [...watchlist];
    if (filterGenre !== 'all') {
      filtered = filtered.filter(m => m.genres?.includes(filterGenre));
    }
    switch (sortBy) {
      case 'title': return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'year': return filtered.sort((a, b) => (b.year || '').toString().localeCompare((a.year || '').toString()));
      default: return filtered;
    }
  }, [watchlist, sortBy, filterGenre]);

  const firstMovie = watchlist[0];
  const heroThumb = firstMovie?.thumbnail?.startsWith('http')
    ? firstMovie.thumbnail
    : firstMovie?.thumbnail 
      ? `https://image.tmdb.org/t/p/w1280${firstMovie.thumbnail}`
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80';

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-[60px] bg-[#0f0f0f]">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 relative">
        
        {/* Left Column: Playlist Hero (Sticky) */}
        <div className="lg:w-[400px] lg:sticky lg:top-32 h-fit">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col">
            {/* Blurred Background */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center scale-110 blur-3xl opacity-40"
              style={{ backgroundImage: `url(${heroThumb})` }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />

            <div className="relative z-10">
              {/* Large Image */}
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 shadow-xl border border-white/5">
                <img 
                  src={heroThumb} 
                  alt="Playlist Cover" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Watch later</h1>
              <p className="text-[15px] font-bold text-white mb-1">Sujal Khanolkar Discipline</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/60 mb-6">
                <span>{watchlist.length} videos</span>
                <span>•</span>
                <span>No views</span>
                <span>•</span>
                <span>Last updated on May 10, 2026</span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 mb-8">
                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                  <Download size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Play / Shuffle Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => navigate('/watch')}
                  className="flex-1 flex items-center justify-center gap-2 h-12 bg-white text-black rounded-full font-bold text-[14px] hover:bg-white/90 transition-all active:scale-95 whitespace-nowrap px-4"
                >
                  <Play size={18} fill="black" /> Play all
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-12 bg-white/10 text-white rounded-full font-bold text-[14px] hover:bg-white/20 transition-all border border-white/10 active:scale-95 whitespace-nowrap px-4 backdrop-blur-sm">
                  <Shuffle size={18} /> Shuffle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="flex-1 flex flex-col">
          {/* Header & Filters */}
          <div className="flex flex-col mb-6 gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/5 h-10">
                <button 
                  className="flex items-center gap-2 px-3 h-full text-[13px] font-bold text-white/90 hover:text-white"
                  onClick={() => setSortBy('recent')}
                >
                  Manual <ChevronDown size={14} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                {['All', 'Videos', 'Shorts'].map(type => (
                  <button 
                    key={type}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                      type === 'All' 
                        ? 'bg-white text-black' 
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="flex flex-col gap-1">
            <AnimatePresence mode="popLayout">
              {sortedWatchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Bookmark size={32} className="text-white/20" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h2>
                  <p className="text-white/40 text-[14px] max-w-xs mx-auto mb-8">
                    Items you add to your watchlist will appear here.
                  </p>
                  <button 
                    onClick={() => navigate('/browse')}
                    className="px-6 py-2.5 bg-[var(--brand-purple)] text-white rounded-full font-bold text-[14px] hover:bg-[var(--brand-purple)]/90 transition-all"
                  >
                    Browse Content
                  </button>
                </div>
              ) : (
                sortedWatchlist.map((movie, index) => (
                  <WatchlistCard
                    key={movie.id}
                    movie={movie}
                    onRemove={handleRemove}
                    index={index}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Recommended (at bottom if list is short) */}
          {watchlist.length > 0 && watchlist.length < 5 && (
            <div className="mt-16 pt-16 border-t border-white/5">
               <MovieRow
                title="Recommended for you"
                label="YOU MIGHT LIKE"
                movies={trendingNow.slice(0, 8)}
                className="!px-0"
                variant="mobile"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Watchlist;
