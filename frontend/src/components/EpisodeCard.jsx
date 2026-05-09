import React, { useState, useCallback, useRef, memo } from 'react';
import { Play, Heart, ThumbsUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GENRE_COLORS } from '../data/movies';
import useStore from '../store/useStore';

const getImg = (path) => path?.startsWith('http') ? path : `https://image.tmdb.org/t/p/w500${path}`;

function matchColor(score) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#eab308';
  return '#ef4444';
}

function EpisodeCard({ episode, index }) {
  const [hovered, setHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const hoverTimerRef = useRef(null);
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, setHeroMovie } = useStore();
  const inWatchlist = isInWatchlist(episode.id);

  const matchScore = Math.round((episode.rating || 8) * 10);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    hoverTimerRef.current = setTimeout(() => setShowVideo(true), 700);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setShowVideo(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  const handleCardClick = useCallback((e) => {
    // 1. Animate card
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);

    // 2. Set Hero Movie for swap
    const normalizedHero = {
      id: episode.id,
      title: episode.title,
      genre: episode.genres?.[0] || 'Drama',
      duration: episode.duration || '2h 10m',
      year: episode.year || '2026',
      match: `${matchScore}% Match`,
      rating: '16+',
      quality: ['HD'],
      description: episode.description || 'Experience this incredible title now streaming.',
      image: getImg(episode.thumbnail),
      logo: episode.title,
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isCustom: true
    };
    
    setTimeout(() => {
      setHeroMovie(normalizedHero);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }, [episode, matchScore, setHeroMovie]);

  return (
    <div
      className={`relative rounded-md flex-shrink-0 transition-transform duration-100 ${animating ? 'scale-95' : ''}`}
      style={{
        width: 220,
        height: 130,
        zIndex: hovered ? 100 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
    >
      <motion.div
        className="absolute left-1/2 rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden bg-[#141414] origin-bottom cursor-pointer"
        initial={{ width: 220, height: 130, x: '-50%', y: 0, scale: 1, borderRadius: 8 }}
        animate={{
          width: hovered ? 280 : 220,
          height: hovered ? 'auto' : 130,
          scale: hovered ? 1.05 : 1,
          y: hovered ? -30 : 0, // Moves upward from bottom edge
          borderRadius: hovered ? 12 : 8
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ minHeight: hovered ? 320 : 130 }}
      >
        {/* ── BG Image / Video ── */}
        <div className="relative w-full overflow-hidden" style={{ height: 157 }}>
          <img
            src={getImg(episode.thumbnail)}
            alt={episode.title}
            loading="lazy"
            onError={(e) => e.target.src = `https://picsum.photos/seed/${episode.id || 'movie'}/400/225`}
            className="w-full h-full object-cover"
          />
          


          {!hovered && (
            <div className="absolute bottom-2 right-2 z-20 bg-black/60 backdrop-blur-sm rounded-[4px] px-1.5 py-0.5">
              <span className="text-[11px] font-semibold text-white/90">{episode.duration || '22m'}</span>
            </div>
          )}

          {/* Center play overlay */}
          <AnimatePresence>
            {hovered && !showVideo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              >
                <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-md">
                  <Play size={20} fill="white" className="ml-1 opacity-80" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video */}
          <AnimatePresence>
            {showVideo && (
              <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover z-10"
                style={{ filter: 'brightness(0.85) saturate(1.1)' }}
              />
            )}
          </AnimatePresence>
          
          {/* Gradient for title if no video */}
          {!showVideo && !hovered && <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 to-transparent" />}
        </div>

        {/* ── Base Title if not hovered ── */}
        {!hovered && (
          <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pointer-events-none">
            <h3 className="text-[13px] font-bold text-white leading-tight line-clamp-1 drop-shadow-md">
              {episode.title}
            </h3>
          </div>
        )}

        {/* ── Hover Expansion Panel ── */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="px-4 py-3 bg-[#141414] w-full"
          >
            <h3 className="text-[15px] font-bold text-white leading-tight line-clamp-1">
              {episode.title}
            </h3>

            {/* Match score bar */}
            <div className="w-full h-[3px] bg-white/15 rounded-[2px] mt-2 mb-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchScore}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-[2px]"
                style={{ backgroundColor: matchColor(matchScore) }}
              />
            </div>
            
            {/* Metadata row */}
            <div className="flex items-center gap-2 mb-2 text-[12px]">
              <span className="font-bold" style={{ color: matchColor(matchScore) }}>{matchScore}% Match</span>
              <span className="text-white/60">· {episode.year || 2026} · {episode.duration || '22m'} · <span className="border border-white/30 px-1 rounded-[3px] text-[10px]">HD</span></span>
            </div>

            {/* Genres */}
            {episode.genres?.length > 0 && (
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {episode.genres.slice(0, 2).map(g => (
                  <span key={g} className="text-[11px] text-white/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GENRE_COLORS[g] || '#fff' }} />
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {episode.description && (
              <p className="text-[11px] text-white/55 leading-[1.4] mb-3 line-clamp-2">
                {episode.description}
              </p>
            )}

            {/* ACTION BUTTONS ROW */}
            <div className="flex items-center justify-start gap-2 pt-1 pb-1">
              {/* Play Button */}
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/watch?title=${encodeURIComponent(episode.title)}`) }}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-white/85 hover:scale-[1.08] active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                title="Play"
              >
                <Play size={14} fill="black" className="ml-0.5 text-black" />
              </button>
              
              {/* Watchlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (inWatchlist) {
                    removeFromWatchlist(episode.id);
                    toast('Removed from Watchlist', { icon: '🗑️', style: { background: '#1a1a22', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', borderRadius: '10px' } });
                  } else {
                    addToWatchlist(episode);
                    toast.success(`Added to Watchlist ✓`, { style: { background: '#1a1a22', color: '#fff', border: '1px solid rgba(139,92,246,0.4)', fontSize: '14px', borderRadius: '10px' }, iconTheme: { primary: '#8b5cf6', secondary: '#fff' } });
                  }
                }}
                className="w-[34px] h-[34px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 hover:scale-[1.2] active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderColor: inWatchlist ? '#8b5cf6' : 'rgba(255,255,255,0.4)',
                }}
                title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                <motion.div animate={{ scale: inWatchlist ? [1, 1.2, 1] : 1 }}>
                  <Heart size={14} fill={inWatchlist ? '#8b5cf6' : 'none'} color={inWatchlist ? '#8b5cf6' : 'white'} />
                </motion.div>
              </button>

              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                  if (!liked) toast('Marked as Liked ✓', { style: { background: '#1a1a22', color: '#fff', border: '1px solid rgba(34,197,94,0.4)', fontSize: '14px', borderRadius: '10px' }, iconTheme: { primary: '#22c55e', secondary: '#fff' } });
                }}
                className="w-[34px] h-[34px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 hover:scale-[1.2] active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderColor: liked ? '#22c55e' : 'rgba(255,255,255,0.4)',
                }}
                title="Like"
              >
                <motion.div animate={{ scale: liked ? [1, 1.2, 1] : 1 }}>
                  <ThumbsUp size={14} fill={liked ? '#22c55e' : 'none'} color={liked ? '#22c55e' : 'white'} />
                </motion.div>
              </button>

              {/* More Info Button - pushes to right */}
              <button
                className="w-[34px] h-[34px] rounded-full border-[1.5px] border-white/40 bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-[1.1] active:scale-95 ml-auto text-white"
                title="More Info"
                onClick={(e) => {
                  e.stopPropagation();
                  // More info logic could go here
                }}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default memo(EpisodeCard);
