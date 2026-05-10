import React, { useCallback, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface BrowseHeroProps {
  onSearch?: (query: string) => void;
}

const BrowseHero: React.FC<BrowseHeroProps> = ({ onSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.focusSearch) {
      // Small timeout to ensure animation/mounting is done
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  }, [onSearch]);

  return (
    <div className="relative w-full h-[55vh] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop"
          alt="Browse Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-black/20 z-10" />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-[800] text-white mb-3 tracking-tight">
            Browse All Content
          </h1>
          <p className="text-white/60 text-[16px] md:text-[18px] mb-8 font-medium">
            Find your next obsession among thousands of curated titles
          </p>

          <div className="relative group max-w-[540px] mx-auto w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies, shows, genres..."
              onChange={handleSearchChange}
              aria-label="Search content"
              className="w-full h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 transition-all text-[15px]"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white shadow-[0_0_15px_#8b5cf6] pointer-events-none"
              aria-hidden="true"
            >
              <Search size={16} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseHero;
