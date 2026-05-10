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
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.75)_0%,transparent_80%)] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-black/40 z-10" />
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

          <div className="relative group w-[55vw] max-w-[720px] min-w-[300px] mx-auto mt-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies, shows, genres..."
              onChange={handleSearchChange}
              aria-label="Search content"
              className="w-full h-[60px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full px-8 pl-14 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 text-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            />
            <div
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white/90 transition-colors pointer-events-none"
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
