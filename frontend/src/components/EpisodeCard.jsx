import React, { useState, useCallback, useRef, memo, Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 340 });
  const [expandDirection, setExpandDirection] = useState('down');
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, setHeroMovie } = useStore();
  const inWatchlist = isInWatchlist(episode.id);

  const calculatePosition = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    const popupW = 340; // Our expanded width
    const popupH = 460; // Our expanded height

    // Horizontal: center on card, clamp to viewport edges
    let left = rect.left + rect.width / 2 - popupW / 2;
    left = Math.max(12, Math.min(left, vw - popupW - 12));

    // Vertical: check if space exists below
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;
    
    let top;
    if (spaceBelow >= popupH + 20) {
      // Enough space below
      top = rect.top - 20; // Slight overlap for smooth feel
      setExpandDirection('down');
    } else if (spaceAbove >= popupH + 20) {
      // Not enough below, but enough above
      top = rect.bottom - popupH + 20;
      setExpandDirection('up');
    } else {
      // Tight space, center it vertically on the card
      top = Math.max(12, Math.min(rect.top - 100, vh - popupH - 12));
      setExpandDirection('center');
    }

    setPopupPos({ top, left, width: popupW });
  }, []);

  const handleMouseEnter = () => {
    calculatePosition();
    timerRef.current = setTimeout(() => {
      setHovered(true);
      // Show video shortly after hover opens
      setTimeout(() => setShowVideo(true), 600);
    }, 400); // Netflix-style delay
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setHovered(false);
    setShowVideo(false);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCardClick = () => {
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
  };

  return (
    <>
      {/* THE BASE CARD */}
      <div
        ref={cardRef}
        className="relative flex-shrink-0 cursor-pointer"
        style={{ width: 280, height: 158 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <motion.div
          className="w-full h-full rounded-xl overflow-hidden bg-[#181818] border border-white/5"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={getImg(episode)}
            alt={episode.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
             <h3 className="text-[13px] font-bold text-white drop-shadow-md truncate uppercase tracking-wide">
                {episode.title}
             </h3>
          </div>
          {isContinueWatching && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10">
              <div className="h-full bg-[#8b5cf6]" style={{ width: `${episode.progress || 75}%` }} />
            </div>
          )}
        </motion.div>
      </div>

      {/* THE HOVER POPUP (PORTAL) */}
      {hovered && createPortal(
        <div
          style={{
            position: 'fixed',
            top: popupPos.top,
            left: popupPos.left,
            width: popupPos.width,
            zIndex: 99999,
            pointerEvents: 'auto',
          }}
          onMouseEnter={() => {
            clearTimeout(timerRef.current);
            setHovered(true);
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Outer Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.1 }}
            className="absolute inset-0 bg-[#8b5cf6] blur-[60px] rounded-full pointer-events-none z-[-1]"
          />

          <motion.div
            className="overflow-hidden bg-[#141414] rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.9)] border border-white/10"
            initial={{ opacity: 0, scale: 0.9, y: expandDirection === 'up' ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Section: Media */}
            <div className="relative w-full h-[190px] overflow-hidden">
              <img
                src={getImg(episode)}
                alt={episode.title}
                className="w-full h-full object-cover"
              />
              
              {/* Progress Bar */}
              {(isContinueWatching || hovered) && (
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/10 z-20">
                  <motion.div 
                    className="h-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${episode.progress || 75}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                  />
                </div>
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
            </div>

            {/* Content Details */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="p-6 flex flex-col gap-4 bg-gradient-to-b from-[#181818] to-[#0f0f0f]"
            >
              <motion.h3 variants={itemVariants} className="text-[20px] font-black text-white leading-tight tracking-tight">
                {episode.title}
              </motion.h3>

              <motion.div variants={itemVariants} className="flex items-center gap-3 text-[14px] font-semibold">
                <span className="text-white/80">{episode.year || 2026}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/80">{episode.duration || '26 min'}</span>
                <span className="border border-white/20 px-1.5 py-0.5 rounded-[4px] text-[10px] font-black text-white/50 ml-auto tracking-widest bg-white/5">HD</span>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-4 text-[12px] text-white/50 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  {episode.genres?.[0] || 'Animation'}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  {episode.genres?.[1] || 'Fantasy'}
                </span>
              </motion.div>

              <motion.p variants={itemVariants} className="text-[13px] text-white/40 leading-[1.6] line-clamp-3 italic">
                "{episode.description || 'A lost civilization resurfaces in modern day, bringing ancient magic with it.'}"
              </motion.p>

              <motion.div variants={itemVariants} className="flex items-center gap-4 mt-2">
                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#8b5cf6] transition-all active:scale-90 group shadow-lg">
                  <Play size={24} fill="black" stroke="black" className="ml-1 group-hover:fill-white group-hover:stroke-white transition-colors" />
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
                <button className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all active:scale-90 ml-auto">
                  <ChevronDown size={24} className="text-white/70" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}

export default memo(EpisodeCard);
