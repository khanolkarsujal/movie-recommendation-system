import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
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
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop', // Placeholder for fantasy landscape
    progress: 80,
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

  const currentItem = FEATURED_ITEMS[currentIndex];
  const inWatchlist = isInWatchlist(currentItem.id);

  return (
    <div className="px-8 md:px-[80px] mb-16 relative">
      {/* Header section outside the banner */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-[#8b5cf6] tracking-[2px] uppercase mb-1">
            HANDPICKED FOR YOU
          </p>
          <h2 className="text-[20px] md:text-[24px] font-bold text-white tracking-tight">
            Featured Picks
          </h2>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={18} color="white" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronRight size={18} color="white" />
          </button>
        </div>
      </div>

      {/* The Banner Container */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <img 
              src={currentItem.image} 
              alt={currentItem.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-10 flex flex-col justify-center max-w-[600px] z-10">
              <p className="text-[11px] font-bold text-white/70 tracking-[2px] uppercase mb-2">
                {currentItem.label}
              </p>
              
              <h3 className="text-[3rem] font-black text-white leading-none tracking-tight mb-4 drop-shadow-lg">
                {currentItem.title}
              </h3>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold mb-4">
                <span className="bg-[#22c55e] text-white px-2 py-0.5 rounded-[4px]">
                  {currentItem.match}
                </span>
                <span className="text-white/80">{currentItem.year}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">{currentItem.duration}</span>
                <span className="text-white/40">•</span>
                <span className="text-[#22c55e] flex items-center gap-1">
                  ★ {currentItem.rating}
                </span>
                <span className="text-white/40">•</span>
                {currentItem.genres.map((g, i) => (
                  <span key={i} className="border border-[#f59e0b]/50 text-[#f59e0b] px-2 py-0.5 rounded-[4px] text-[10px] uppercase">
                    {g}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-[14px] text-white/70 leading-relaxed mb-6 line-clamp-3">
                {currentItem.description}
              </p>

              {/* Progress Bar (if continuing) */}
              {currentItem.progress > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-[11px] text-white/50 font-bold mb-2">
                    <span>Continue Watching</span>
                    <span>{currentItem.progress}%</span>
                  </div>
                  <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8b5cf6]" 
                      style={{ width: `${currentItem.progress}%` }} 
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold text-[14px] hover:bg-white/90 transition-all">
                  <Play size={16} fill="black" />
                  {currentItem.progress > 0 ? 'Continue' : 'Play'}
                </button>
                <button 
                  onClick={() => {
                    if (inWatchlist) removeFromWatchlist(currentItem.id);
                    else addToWatchlist(currentItem);
                  }}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-lg font-bold text-[14px] hover:bg-white/20 transition-all backdrop-blur-md"
                >
                  <Heart size={16} fill={inWatchlist ? 'white' : 'none'} color="white" />
                  Watchlist
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators inside banner */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {FEATURED_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-[4px] rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-white' : 'w-[4px] bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedBanner;
