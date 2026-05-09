import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Trash2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

function WatchlistCard({ movie, onRemove }) {
  const navigate = useNavigate();
  const src = movie.thumbnail?.startsWith('http')
    ? movie.thumbnail
    : `https://image.tmdb.org/t/p/w500${movie.thumbnail}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Thumbnail */}
      <img
        src={src}
        alt={movie.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
        onError={(e) => { e.target.src = `https://picsum.photos/seed/${movie.id}/400/225`; }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

      {/* Remove button */}
      <button
        onClick={() => onRemove(movie.id)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Remove from watchlist"
      >
        <Trash2 size={14} />
      </button>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-white font-bold text-[15px] leading-tight mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center gap-2 text-[12px] text-white/50 mb-3">
          <span>{movie.year}</span>
          <span>·</span>
          <span>{movie.duration}</span>
          {movie.rating && <><span>·</span><span>⭐ {movie.rating.toFixed(1)}</span></>}
        </div>

        <button
          onClick={() => navigate(`/watch?title=${encodeURIComponent(movie.title)}`)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md text-[13px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/90 hover:scale-105 active:scale-95"
        >
          <Play size={13} fill="black" /> Play
        </button>
      </div>

      {/* Progress bar */}
      {movie.progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20">
          <div className="h-full bg-[var(--accent)] rounded-r-full" style={{ width: `${movie.progress}%` }} />
        </div>
      )}
    </motion.div>
  );
}

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useStore();

  const handleRemove = (id) => {
    removeFromWatchlist(id);
    toast('Removed from Watchlist', {
      icon: '🗑️',
      style: { background: '#1a1a22', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-[var(--row-padding)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-1">
          <Heart size={24} className="text-[var(--accent)]" fill="currentColor" />
          <h1 className="text-4xl font-black text-white">My Watchlist</h1>
        </div>
        <p className="text-white/40 text-[15px]">
          {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved
        </p>
      </motion.div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-40 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
            <span className="text-[60px] opacity-30 grayscale">🎬</span>
          </div>
          <h2 className="text-[28px] font-bold text-[#e5e5e5] mb-2 tracking-tight">Your watchlist is empty</h2>
          <p className="text-white/45 mb-10 max-w-sm text-[15px] leading-relaxed">
            Movies and shows you save will appear here for you to watch whenever you're ready.
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="px-8 py-3.5 bg-[#8b5cf6] text-white rounded-[5px] font-bold text-[15px] hover:bg-[#a78bfa] transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)] active:scale-95"
          >
            Browse Movies
          </button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          <AnimatePresence>
            {watchlist.map((movie) => (
              <WatchlistCard key={movie.id} movie={movie} onRemove={handleRemove} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
