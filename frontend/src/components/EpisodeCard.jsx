import React, { useState, useCallback, useRef, memo, Suspense } from 'react';
import { Play, Heart, ChevronDown, ThumbsUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const getImg = (episode) => {
  if (episode.poster_path) return `https://image.tmdb.org/t/p/w500${episode.poster_path}`;
  if (episode.backdrop_path) return `https://image.tmdb.org/t/p/w780${episode.backdrop_path}`;
  
  const path = episode.thumbnail || episode.thumb;
  if (path?.startsWith('http')) return path;
  if (path) return `https://image.tmdb.org/t/p/w500${path}`;
  
  return `https://picsum.photos/seed/${episode.id || 'movie'}/400/225`;
};

function EpisodeCard({ episode, index, isContinueWatching = false }) {
  const [hovered, setHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [animating, setAnimating] = useState(false);
  const hoverTimerRef = useRef(null);
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

  const handleCardClick = useCallback(() => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);

    const normalizedHero = {
      id: episode.id,
      title: episode.title,
      genre: episode.genres?.[0] || 'Drama',
      duration: episode.duration || '2h 10m',
      year: episode.year || '2026',
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
  }, [episode, setHeroMovie]);

  return (
    <div
      className={`relative flex-shrink-0 transition-transform duration-100 ${animating ? 'scale-95' : ''}`}
      style={{
        width: 280,
        height: 158,
        zIndex: hovered ? 100 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
    >
      <motion.div
        className="absolute left-1/2 overflow-hidden bg-[#181818] origin-center cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        initial={{ width: 280, height: 158, x: '-50%', y: 0, scale: 1, borderRadius: 12 }}
        animate={{
          width: hovered ? 330 : 280,
          height: hovered ? 410 : 158, // Increased height to see full card content
          y: hovered ? -100 : 0,
          scale: hovered ? 1.1 : 1,
          borderRadius: 12
        }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* ── Top Section: Media ── */}
        <div className="relative w-full h-[180px] overflow-hidden">
          <img
            src={getImg(episode)}
            alt={episode.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          
          {/* Progress bar always visible on the image bottom */}
          {(isContinueWatching || hovered) && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 z-20">
              <motion.div 
                className="h-full bg-[#22c55e]" 
                initial={{ width: 0 }}
                animate={{ width: `${episode.progress || 75}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          )}

          {!hovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          )}

          {!hovered && (
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <h3 className="text-[13px] font-bold text-white drop-shadow-md truncate">
                {episode.title}
              </h3>
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

        {/* ── Hover Details Section (Matching Image Ref) ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 flex flex-col gap-3 bg-[#181818]"
            >
              <h3 className="text-[18px] font-bold text-white leading-tight">
                {episode.title}
              </h3>

              {/* Meta Row: Match Score, Year, Duration, Quality */}
              <div className="flex items-center gap-2 text-[13px] font-medium">
                <span className="text-[#22c55e] font-bold">{matchScore}% Match</span>
                <span className="text-white/50">·</span>
                <span className="text-white/90">{episode.year || 2026}</span>
                <span className="text-white/50">·</span>
                <span className="text-white/90">{episode.duration || '26 min'}</span>
                <span className="border border-white/40 px-1.5 rounded-[3px] text-[10px] font-bold text-white/70 ml-1">HD</span>
              </div>

              {/* Genre Dots */}
              <div className="flex items-center gap-3 text-[12px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  {episode.genres?.[0] || 'Animation'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  {episode.genres?.[1] || 'Fantasy'}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-white/50 leading-[1.4] line-clamp-2">
                {episode.description || 'A lost civilization resurfaces in modern day, bringing ancient magic with it.'}
              </p>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 mt-2">
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-all active:scale-90">
                  <Play size={20} fill="black" stroke="black" className="ml-1" />
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    inWatchlist ? removeFromWatchlist(episode.id) : addToWatchlist(episode); 
                  }}
                  className="w-10 h-10 rounded-full bg-transparent border-2 border-white/30 flex items-center justify-center hover:border-white transition-all active:scale-90"
                >
                  {inWatchlist ? <Plus size={20} className="rotate-45" /> : <Heart size={18} />}
                </button>
                <button className="w-10 h-10 rounded-full bg-transparent border-2 border-white/30 flex items-center justify-center hover:border-white transition-all active:scale-90">
                  <ThumbsUp size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-transparent border-2 border-white/30 flex items-center justify-center hover:border-white transition-all active:scale-90 ml-auto">
                  <ChevronDown size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default memo(EpisodeCard);
