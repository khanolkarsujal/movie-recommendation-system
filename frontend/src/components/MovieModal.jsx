import React, { useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, ThumbsUp, Share2, Star, Clock, Calendar, Tv, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GENRE_COLORS } from '../data/movies';

const GenreDot = memo(({ genre }) => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border"
    style={{
      backgroundColor: `${GENRE_COLORS[genre] || '#8b5cf6'}18`,
      borderColor: `${GENRE_COLORS[genre] || '#8b5cf6'}40`,
      color: GENRE_COLORS[genre] || '#a78bfa',
    }}
  >
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GENRE_COLORS[genre] || '#8b5cf6' }} />
    {genre}
  </span>
));

function ratingColor(r) {
  if (r >= 8) return '#22c55e';
  if (r >= 6.5) return '#eab308';
  return '#ef4444';
}

function MovieModal({ movie, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!movie) return null;
  const rColor = ratingColor(movie.rating || 7.5);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label={`${movie.title} details`}
      >
        <motion.div
          className="relative w-full max-w-[900px] max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)' }}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Hero Backdrop */}
          <div className="relative w-full h-[280px] md:h-[360px] flex-shrink-0 overflow-hidden">
            {movie.thumbnail ? (
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.7) saturate(1.1)' }}
              />
            ) : (
              <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }} />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-surface) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.15) 100%)' }} />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
              <Volume2 size={12} className="text-white/60" />
              <span className="text-[11px] text-white/60">Preview</span>
            </div>

            <div className="absolute bottom-5 left-6 right-6">
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-3" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
                {movie.title}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/watch?title=${encodeURIComponent(movie.title)}`)}
                  className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-md font-bold text-[15px] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                  aria-label={`Play ${movie.title}`}
                >
                  <Play size={16} fill="black" /> Play
                </button>
                <button className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all" aria-label="Add to watchlist"><Plus size={18} /></button>
                <button className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all" aria-label="Like"><ThumbsUp size={16} /></button>
                <button className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all" aria-label="Share"><Share2 size={16} /></button>
              </div>
            </div>
          </div>

          {/* Detail Body */}
          <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
            <div className="flex flex-wrap items-center gap-3 mb-5 text-[13px]">
              <span className="font-bold" style={{ color: 'var(--green-match)' }}>98% Match</span>
              <span className="text-white/60">{movie.year || 2025}</span>
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-white/70 text-[11px]">{movie.rating >= 8.5 ? 'TV-MA' : 'PG-13'}</span>
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-white/70 text-[11px]">HD</span>
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-white/70 text-[11px]">4K</span>
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-white/70 text-[11px]">Dolby</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <Star size={13} style={{ color: rColor, fill: rColor }} />
                <span className="font-bold text-white">{(movie.rating || 7.5).toFixed(1)}</span>
                <span className="text-white/40">/10</span>
              </div>
            </div>

            <p className="text-[15px] text-white/75 leading-[1.7] mb-6 max-w-[700px]">
              {movie.description || 'No description available.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-[13px]">
                <Clock size={14} className="text-white/40 flex-shrink-0" /><span className="text-white/40">Runtime</span><span className="text-white/90 font-semibold ml-auto">{movie.duration}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <Calendar size={14} className="text-white/40 flex-shrink-0" /><span className="text-white/40">Year</span><span className="text-white/90 font-semibold ml-auto">{movie.year || 2025}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <Tv size={14} className="text-white/40 flex-shrink-0" /><span className="text-white/40">Platform</span><span className="font-semibold ml-auto" style={{ color: 'var(--accent)' }}>SLOTHUI ORIGINAL</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <Star size={14} className="text-white/40 flex-shrink-0" /><span className="text-white/40">Rating</span><span className="font-bold ml-auto" style={{ color: rColor }}>{(movie.rating || 7.5).toFixed(1)} / 10</span>
              </div>
            </div>

            {movie.genres?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white/40 mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(g => <GenreDot key={g} genre={g} />)}
                </div>
              </div>
            )}

            {movie.progress > 0 && movie.progress < 100 && (
              <div className="mb-6">
                <div className="flex justify-between text-[12px] text-white/50 mb-2">
                  <span>Continue Watching</span><span>{movie.progress}% complete</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${movie.progress}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
            )}

            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white/40 mb-4">More Like This</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3].map(i => <div key={i} className="skeleton rounded-lg" style={{ height: 100 }} />)}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(MovieModal);
