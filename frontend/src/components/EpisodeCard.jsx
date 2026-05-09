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

// Variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
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
    hoverTimerRef.current = setTimeout(() => setShowVideo(true), 800);
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
      {/* ── Outer Glow (The "Brain" touch) ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-[#8b5cf6] blur-[60px] rounded-full pointer-events-none z-[-1]"
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute left-1/2 overflow-hidden bg-[#141414] origin-center cursor-pointer shadow-[0_24px_80px_rgba(0,0,0,0.8)] border border-white/5"
        initial={{ width: 280, height: 158, x: '-50%', y: 0, scale: 1, borderRadius: 12 }}
        animate={{
          width: hovered ? 350 : 280,
          height: hovered ? 460 : 158,
          y: hovered ? -100 : 0, // Slightly less move up for safety
          scale: hovered ? 1.1 : 1,
          borderRadius: 12
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {/* ── Top Section: Media ── */}
        <motion.div 
          className="relative w-full overflow-hidden"
          animate={{ height: hovered ? 200 : 158 }}
        >
          <motion.img
            src={getImg(episode)}
            alt={episode.title}
            loading="lazy"
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover"
          />
          
          {/* Progress bar always visible on the image bottom */}
          {(isContinueWatching || hovered) && (
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/10 z-20">
              <motion.div 
                className="h-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" 
                initial={{ width: 0 }}
                animate={{ width: `${episode.progress || 75}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
              />
            </div>
          )}

          <AnimatePresence>
            {!hovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" 
              />
            )}
          </AnimatePresence>

          {!hovered && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <h3 className="text-[14px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate tracking-wide uppercase">
                {episode.title}
              </h3>
            </div>
          )}

          {/* Play Icon Overlay on Hover (Visual intent) */}
          {hovered && !showVideo && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute inset-0 flex items-center justify-center z-10 bg-black/20"
             >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                   <Play size={24} fill="white" className="ml-1" />
                </div>
             </motion.div>
          )}

          {/* Video Overlay */}
          {showVideo && (
            <Suspense fallback={null}>
              <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            </Suspense>
          )}
        </motion.div>

        {/* ── Hover Details Section (Mind-blowing staggered entrance) ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6 flex flex-col gap-4 bg-gradient-to-b from-[#181818] to-[#0f0f0f] border-t border-white/5"
            >
              <motion.h3 variants={itemVariants} className="text-[20px] font-black text-white leading-tight tracking-tight">
                {episode.title}
              </motion.h3>

              {/* Meta Row: Match Score, Year, Duration, Quality */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 text-[14px] font-semibold">
                <span className="text-white/80">{episode.year || 2026}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/80">{episode.duration || '26 min'}</span>
                <span className="border border-white/20 px-1.5 py-0.5 rounded-[4px] text-[10px] font-black text-white/50 ml-auto tracking-widest bg-white/5">HD</span>
              </motion.div>

              {/* Genre Dots */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 text-[12px] text-white/50 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  {episode.genres?.[0] || 'Animation'}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  {episode.genres?.[1] || 'Fantasy'}
                </span>
              </motion.div>

              {/* Description */}
              <motion.p variants={itemVariants} className="text-[13px] text-white/40 leading-[1.6] line-clamp-3 italic">
                "{episode.description || 'A lost civilization resurfaces in modern day, bringing ancient magic with it.'}"
              </motion.p>

              {/* Action Buttons Row */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 mt-2">
                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#8b5cf6] hover:text-white transition-all active:scale-90 group shadow-lg">
                  <Play size={24} fill="currentColor" stroke="none" className="ml-1 group-hover:fill-white" />
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    inWatchlist ? removeFromWatchlist(episode.id) : addToWatchlist(episode); 
                  }}
                  className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all active:scale-90"
                >
                  {inWatchlist ? <Plus size={24} className="rotate-45 text-[#8b5cf6]" /> : <Heart size={22} className="text-white/70" />}
                </button>
                <button className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all active:scale-90">
                  <ThumbsUp size={22} className="text-white/70" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all active:scale-90 ml-auto">
                  <ChevronDown size={24} className="text-white/70" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default memo(EpisodeCard);
