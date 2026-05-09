import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import GenreFilterBar from './GenreFilterBar';
import BrowseHero from './BrowseHero';
import { Top10Row } from '../components/Top10Row';
import { MovieRow } from '../components/MovieRow';
import { MovieCard } from '../components/MovieCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { trendingNow, newReleases, continueWatching } from '../data/movies';
import type { Movie } from './types';

const ALL_CONTENT = [...trendingNow, ...newReleases, ...continueWatching].filter(
  (item, idx, self) => self.findIndex((t) => t.id === item.id) === idx
);

const Browse: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const actionMovies = useMemo(
    () => ALL_CONTENT.filter((m) => m.genres?.includes('Action')),
    []
  );
  const horrorMovies = useMemo(
    () =>
      ALL_CONTENT.filter(
        (m) => m.genres?.includes('Horror') || m.genres?.includes('Dark')
      ),
    []
  );
  const sciFiMovies = useMemo(
    () => ALL_CONTENT.filter((m) => m.genres?.includes('Sci-Fi')),
    []
  );
  const animeMovies = useMemo(
    () => ALL_CONTENT.filter((m) => m.genres?.includes('Anime')),
    []
  );

  const isFiltering = activeGenre !== 'All' || searchQuery.length > 0;

  const filteredResults = useMemo(() => {
    let results = ALL_CONTENT;

    if (activeGenre !== 'All') {
      results = results.filter((m) => m.genres?.includes(activeGenre));
    }

    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.genres?.some((g) => g.toLowerCase().includes(query))
      );
    }

    return results;
  }, [activeGenre, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <GenreFilterBar activeGenre={activeGenre} setActiveGenre={setActiveGenre} />

      {!isFiltering ? (
        <>
          <BrowseHero onSearch={handleSearch} />

          <div className="relative z-20 -mt-20 space-y-8 pb-24">
            <Top10Row
              title="Top 10 in Your Country Today"
              label="TOP 10"
              movies={trendingNow}
            />
            <MovieRow
              title="Action & Adventure"
              label="THRILLING"
              movies={actionMovies}
            />
            <MovieRow
              title="Horror & Dark Fantasy"
              label="EERIE"
              movies={horrorMovies}
            />
            <MovieRow
              title="Sci-Fi Highlights"
              label="FUTURE"
              movies={sciFiMovies}
            />
            <MovieRow
              title="Top Rated Anime"
              label="ANIMATION"
              movies={animeMovies}
            />
            <MovieRow
              title="Recently Added"
              label="NEW"
              movies={newReleases}
              badge="new"
            />
          </div>
        </>
      ) : (
        <div className="pt-32 px-8 md:px-16 pb-24">
          {/* Enhanced filter header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-2">
              {searchQuery ? (
                <Search size={16} className="text-[var(--brand-purple)]" />
              ) : (
                <Filter size={16} className="text-[var(--brand-purple)]" />
              )}
              <p className="text-[var(--brand-purple)] font-bold text-xs tracking-[2px] uppercase">
                {searchQuery ? 'Search Results' : 'Category'}
              </p>
            </div>
            <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
              {searchQuery || `${activeGenre} Titles`}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-white/40 text-[15px]">
                {filteredResults.length} {filteredResults.length === 1 ? 'title' : 'titles'} found
              </p>
              {filteredResults.length > 0 && (
                <span className="text-white/20">•</span>
              )}
              {filteredResults.length > 0 && (
                <p className="text-white/30 text-[13px]">
                  Sorted by relevance
                </p>
              )}
            </div>
          </motion.header>

          {/* Results grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} variant="landscape" />
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredResults.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                <Search size={48} className="text-white/10" />
              </div>
              <h2 className="text-[32px] font-bold text-white/90 mb-3 tracking-tight">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : `No ${activeGenre} titles yet`}
              </h2>
              <p className="text-white/40 mb-10 max-w-md text-[15px] leading-relaxed">
                {searchQuery
                  ? 'Try different keywords or browse our recommended categories'
                  : 'Check back soon for new additions to this category'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Action', 'Sci-Fi', 'Drama', 'Horror', 'Anime'].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      setActiveGenre(genre);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[13px] font-medium text-white/70
                             hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Browse;
