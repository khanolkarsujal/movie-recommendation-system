import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, Plus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const FeaturedBanner: React.FC = () => {
  const navigate = useNavigate();
  const { addToWatchlist, isInWatchlist } = useStore();

  const featuredMovie = {
    id: 'featured-1',
    title: 'Eternal Horizon',
    description:
      'In a world where time itself is currency, one rebel must break the cycle to save humanity from eternal servitude. An epic tale of sacrifice, rebellion, and the true meaning of freedom.',
    genres: ['Sci-Fi', 'Thriller', 'Action'],
    rating: '9.4',
    year: 2024,
    duration: '2h 18m',
    thumbnail: 'https://picsum.photos/seed/featured1/1920/600',
  };

  const handlePlay = useCallback(() => {
    navigate(`/watch?title=${encodeURIComponent(featuredMovie.title)}`);
  }, [navigate, featuredMovie.title]);

  const handleAddToList = useCallback(() => {
    addToWatchlist(featuredMovie);
  }, [addToWatchlist, featuredMovie]);

  const inWatchlist = isInWatchlist(featuredMovie.id);

  return (
    <div className="relative px-8 md:px-[80px] mb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden group cursor-pointer"
        style={{ aspectRatio: '21/9' }}
      >
        <img
          src={featuredMovie.thumbnail}
          alt={featuredMovie.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.7) 40%, transparent 100%)',
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-[var(--accent)] text-white text-xs font-bold tracking-[1.5px] rounded mb-4">
              FEATURED
            </span>

            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              {featuredMovie.title}
            </h2>

            <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-lg line-clamp-3">
              {featuredMovie.description}
            </p>

            <div className="flex items-center gap-3 text-white/60 text-sm mb-6">
              <span className="text-[var(--accent)] font-bold">★ {featuredMovie.rating}</span>
              <span>•</span>
              <span>{featuredMovie.year}</span>
              <span>•</span>
              <span>{featuredMovie.duration}</span>
              <span>•</span>
              <div className="flex gap-2">
                {featuredMovie.genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-white/90 text-black font-bold rounded-lg transition-all hover:scale-105 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Play size={20} fill="currentColor" />
                Play
              </button>

              <button
                onClick={handleAddToList}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg border border-white/30 transition-all hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {inWatchlist ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    </svg>
                    In My List
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    My List
                  </>
                )}
              </button>

              <button
                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 transition-all hover:scale-110 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="More info"
              >
                <Info size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedBanner;
