import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import useStore from '../store/useStore';

const FEATURED_ITEMS = [
  {
    id: 101,
    title: 'The Last Rune',
    label: 'AWARD WINNER',
    match: '98% Match',
    year: '2027',
    duration: '2h 01m',
    rating: '9.0',
    genres: ['Fantasy', 'Adventure'],
    description: 'The final rune holds the power to unmake all of reality. One guardian stands between its keeper and an ancient god who wants it — at any cost.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
    progress: 80,
    accent: '#8b5cf6'
  },
  {
    id: 102,
    title: 'Neon Nights',
    label: 'CRITICALLY ACCLAIMED',
    match: '95% Match',
    year: '2026',
    duration: '1h 45m',
    rating: '8.8',
    genres: ['Sci-Fi', 'Thriller'],
    description: 'In a city that never sleeps, a rogue detective uncovers a conspiracy that goes all the way to the top of the megacorporations controlling the neon sprawl.',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2000&auto=format&fit=crop',
    progress: 0,
    accent: '#3b82f6'
  }
];

function FeaturedBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_ITEMS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? FEATURED_ITEMS.length - 1 : prev - 1));
  };

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentItem = FEATURED_ITEMS[currentIndex];
  const inWatchlist = isInWatchlist(currentItem.id);

  return (
    <div className="px-8 md:px-[80px] mb-16 relative overflow-hidden">
      {/* Header section */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] font-black text-[#8b5cf6] tracking-[3px] uppercase mb-2">
            HANDPICKED FOR YOU
          </p>
          <h2 className="text-[28px] md:text-[32px] font-black text-white tracking-tighter leading-none">
            Featured Picks
          </h2>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight size={20} color="white" />
          </button>
        </div>
      </div>

      {/* The Banner Container */}
      <div className="relative w-full h-[460px] rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] group border border-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Cinematic Background Image with Ken Burns Effect */}
            <motion.div
              initial={{ scale: 1.1, x: 0 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0"
            >
              <img 
                src={currentItem.image} 
                alt={currentItem.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Layered Gradient Overlays for Depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/90 to-transparent z-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-1" />
            <div className="absolute inset-0 bg-black/10 z-1" />

            {/* Content with Staggered Entrance */}
            <div className="absolute inset-0 p-12 md:p-16 flex flex-col justify-center max-w-[700px] z-10">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[12px] font-black text-white/50 tracking-[4px] uppercase mb-4"
              >
                {currentItem.label}
              </motion.p>
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-[3.5rem] md:text-[4.5rem] font-black text-white leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl italic"
              >
                {currentItem.title}
              </motion.h3>

              {/* Meta Tags Row */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap items-center gap-4 text-[13px] font-black mb-6"
              >
                <span className="text-white/60">{currentItem.year}</span>
                <span className="text-white/20">•</span>
                <span className="text-white/60">{currentItem.duration}</span>
                <span className="text-white/20">•</span>
                <span className="text-[#f59e0b] flex items-center gap-1.5 bg-[#f59e0b]/10 px-2 py-1 rounded-md">
                  <Star size={14} fill="#f59e0b" /> {currentItem.rating}
                </span>
              </motion.div>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="text-[16px] text-white/40 leading-relaxed mb-8 line-clamp-3 max-w-[500px] font-medium"
              >
                {currentItem.description}
              </motion.p>

              {/* Interactive Progress Bar */}
              {currentItem.progress > 0 && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="mb-8 max-w-[400px]"
                >
                  <div className="flex justify-between text-[11px] text-[#8b5cf6] font-black mb-3 uppercase tracking-widest">
                    <span>Continue Watching</span>
                    <span>{currentItem.progress}%</span>
                  </div>
                  <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.6)]" 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentItem.progress}%` }}
                      transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Premium Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center gap-5"
              >
                <button className="flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-xl font-black text-[15px] hover:bg-[#8b5cf6] hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl group">
                  <Play size={20} fill="currentColor" stroke="none" className="group-hover:fill-white" />
                  {currentItem.progress > 0 ? 'RESUME PLAY' : 'WATCH NOW'}
                </button>
                <button 
                  onClick={() => {
                    if (inWatchlist) removeFromWatchlist(currentItem.id);
                    else addToWatchlist(currentItem);
                  }}
                  className="flex items-center gap-3 bg-white/5 border-2 border-white/10 text-white px-8 py-3.5 rounded-xl font-black text-[15px] hover:bg-white/10 hover:border-white transition-all transform hover:scale-105 active:scale-95 backdrop-blur-xl"
                >
                  <Heart size={20} fill={inWatchlist ? 'white' : 'none'} strokeWidth={2.5} />
                  WATCHLIST
                </button>
              </motion.div>
            </div>

            {/* Cinematic Overlay - Bottom Mask */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Carousel Indicators */}
        <div className="absolute bottom-10 right-16 flex flex-col gap-3 z-20">
          {FEATURED_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-[6px] transition-all duration-500 rounded-full ${
                i === currentIndex ? 'h-10 bg-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.8)]' : 'h-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedBanner;
