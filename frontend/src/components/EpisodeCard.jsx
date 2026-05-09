import React, { useState, useCallback, useRef, memo, Suspense } from 'react';
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
    <motion.div
      className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/5 transition-all duration-300 group/card"
      style={{
        width: 280,
        height: 158,
        zIndex: hovered ? 10 : 1,
      }}
      whileHover={{ scale: 1.05, borderColor: 'rgba(139,92,246,0.5)', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
    >
      {/* ── BG Image / Video ── */}
      <img
        src={getImg(episode)}
        alt={episode.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Bottom Gradient for Text Readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />


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

      {/* Progress bar for continue watching */}
      {isContinueWatching && episode.progress > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 z-20">
          <div 
            className="h-full bg-[#8b5cf6]" 
            style={{ width: `${episode.progress}%` }} 
          />
        </div>
      )}

      {/* Title Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-20">
        <h3 className="text-[13px] font-bold text-white leading-tight line-clamp-1 drop-shadow-md">
          {episode.title}
        </h3>
      </div>
    </motion.div>
  );
}

export default memo(EpisodeCard);
