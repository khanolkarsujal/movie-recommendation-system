import React, { useState, useCallback, useRef, memo } from 'react';
import { Play, Heart, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

const getImg = (episode) => {
  // Use TMDB paths if they exist (though mock data might not have them yet, we prepare the logic)
  if (episode.poster_path) return `https://image.tmdb.org/t/p/w500${episode.poster_path}`;
  if (episode.backdrop_path) return `https://image.tmdb.org/t/p/w780${episode.backdrop_path}`;
  
  // Fallback for current mock data which uses thumbnail or thumb
  const path = episode.thumbnail || episode.thumb;
  if (path?.startsWith('http')) return path;
  if (path) return `https://image.tmdb.org/t/p/w500${path}`;
  
  // Last resort
  return `https://picsum.photos/seed/${episode.id || 'movie'}/400/225`;
};

function matchColor(score) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#eab308';
  return '#ef4444';
}

function EpisodeCard({ episode, index, isContinueWatching = false }) {
  const [hovered, setHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
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
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);

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
      image: getImg(episode),
      logo: episode.title,
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isCustom: true
    };
    
    setHeroMovie(normalizedHero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          width: hovered ? 260 : 220,
          height: hovered ? 180 : 130, // Max 200px tall per audit
          y: hovered ? -40 : 0,
          scale: hovered ? 1.1 : 1,
          borderRadius: hovered ? 12 : 8
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ minHeight: hovered ? 180 : 130 }}
      >
        {/* ── BG Image / Video ── */}
        <div className="relative w-full overflow-hidden" style={{ height: 110 }}>
          <img
            src={getImg(episode)}
            alt={episode.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          
          {/* Progress bar for continue watching (always visible) */}
          {isContinueWatching && episode.progress > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20">
              <div 
                className="h-full bg-[#8b5cf6]" 
                style={{ width: `${episode.progress}%` }} 
              />
            </div>
          )}

          {!hovered && (
            <div className="absolute bottom-2 right-2 z-20 bg-black/60 backdrop-blur-sm rounded-[4px] px-1.5 py-0.5">
              <span className="text-[10px] font-semibold text-white/90">{episode.duration || '22m'}</span>
            </div>
          )}

          {/* Video Overlay */}
          {showVideo && (
            <Suspense fallback={null}>
              <video
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            </Suspense>
          )}
        </div>

        {/* ── Content ── */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-[13px] font-bold text-white leading-tight line-clamp-1">
              {episode.title}
            </h3>
            {hovered && (
              <span className="text-[10px] text-white/50 whitespace-nowrap">
                {isContinueWatching ? `${Math.round(24 * (1 - episode.progress/100))} min left` : ''}
              </span>
            )}
          </div>

          {hovered ? (
            <div className="space-y-2">
              {/* Match bar */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${matchScore}%` }}
                  className="h-full"
                  style={{ backgroundColor: matchColor(matchScore) }}
                />
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-2 text-[10px] text-white/60">
                <span className="font-bold text-[#22c55e]">{matchScore}% Match</span>
                <span>{episode.year || 2026}</span>
                <span>{episode.duration || '22m'}</span>
                <span className="border border-white/30 px-1 rounded-[2px] text-[8px] font-bold">HD</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-white/80 transition-colors">
                  <Play size={12} fill="black" stroke="black" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); inWatchlist ? removeFromWatchlist(episode.id) : addToWatchlist(episode); }}
                  className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Heart size={12} fill={inWatchlist ? '#8b5cf6' : 'none'} color={inWatchlist ? '#8b5cf6' : 'white'} />
                </button>
                <button className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors ml-auto">
                  <ChevronDown size={12} />
                </button>
                {isContinueWatching && (
                  <button className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-4" /> // Spacer
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default memo(EpisodeCard);
