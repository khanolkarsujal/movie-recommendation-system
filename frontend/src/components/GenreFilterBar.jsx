import React from 'react';
import { motion } from 'framer-motion';

const GENRES = ['All', 'Action', 'Drama', 'Horror', 'Sci-Fi', 'Comedy', 'Thriller', 'Fantasy', 'Animation'];

const GenreFilterBar = ({ activeGenre, setActiveGenre }) => {
  return (
    <div className="sticky top-[64px] z-[40] w-full bg-[#141414]/90 backdrop-blur-xl border-b border-white/5">
      <div 
        className="flex items-center gap-3 px-8 md:px-16 overflow-x-auto no-scrollbar relative h-16"
      >
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            className={`px-[16px] py-[7px] text-[13px] font-medium whitespace-nowrap rounded-[20px] transition-all duration-200 outline-none ${
              activeGenre === g 
                ? 'bg-[#8b5cf6] text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]' 
                : 'bg-transparent text-white/70 border border-white/20 hover:border-white/40 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilterBar;
