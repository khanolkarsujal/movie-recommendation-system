import React from 'react';
import { Play, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const BrowseHero = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[70vh] overflow-hidden bg-black">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <img 
          src={movie.thumbnail?.startsWith('http') ? movie.thumbnail : `https://image.tmdb.org/t/p/original${movie.thumbnail}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-10" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 pt-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-black text-[#8b5cf6] tracking-[2px] uppercase mb-3">
            AWARD WINNER
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-3 text-[14px] font-bold text-white mb-6">
            <span className="text-white/60">{movie.year}</span>
            <span>{movie.duration}</span>
            <div className="flex gap-1.5">
              {movie.genres?.map(g => (
                <span key={g} className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] uppercase tracking-wider">{g}</span>
              ))}
            </div>
          </div>

          <p className="text-[15px] md:text-[17px] text-white/60 leading-relaxed mb-8 line-clamp-2 max-w-lg">
            {movie.description}
          </p>

          <div className="flex items-center gap-4">
            <button className="px-8 py-3 bg-white text-black rounded-lg font-bold flex items-center gap-2 hover:bg-white/90 transition-all scale-100 hover:scale-105 active:scale-95">
              <Play size={18} fill="black" /> Continue
            </button>
            <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-bold flex items-center gap-2 hover:bg-white/20 transition-all scale-100 hover:scale-105 active:scale-95">
              <Heart size={18} /> Watchlist
            </button>
          </div>

          {/* Continue Watching Progress Bar */}
          <div className="mt-8 w-64">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Continue Watching</p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#8b5cf6] w-[65%]" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseHero;
