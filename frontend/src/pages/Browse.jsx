import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GenreFilterBar from '../components/GenreFilterBar';
import BrowseHero from '../components/BrowseHero';
import Top10Row from '../components/Top10Row';
import EpisodeRow from '../components/EpisodeRow';
import { trendingNow, newReleases, continueWatching } from '../data/movies';

const ALL_CONTENT = [...trendingNow, ...newReleases, ...continueWatching].filter(
  (item, idx, self) => self.findIndex((t) => t.id === item.id) === idx
);

export default function Browse() {
  const [activeGenre, setActiveGenre] = useState('All');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredMovie = trendingNow[0];

  // Group by genres
  const actionMovies = useMemo(() => ALL_CONTENT.filter(m => m.genres?.includes('Action')), []);
  const horrorMovies = useMemo(() => ALL_CONTENT.filter(m => m.genres?.includes('Horror') || m.genres?.includes('Dark')), []);
  const sciFiMovies  = useMemo(() => ALL_CONTENT.filter(m => m.genres?.includes('Sci-Fi')), []);
  const animeMovies  = useMemo(() => ALL_CONTENT.filter(m => m.genres?.includes('Anime')), []);

  const isFiltering = activeGenre !== 'All';
  const filteredResults = useMemo(() => {
    if (!isFiltering) return [];
    return ALL_CONTENT.filter(m => m.genres?.includes(activeGenre));
  }, [activeGenre, isFiltering]);

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* 1. Genre Filter Bar (Sticky) */}
      <GenreFilterBar activeGenre={activeGenre} setActiveGenre={setActiveGenre} />

      {!isFiltering ? (
        <>
          {/* 2. Featured Hero (Full Bleed) */}
          <BrowseHero movie={featuredMovie} />

          <div className="relative z-20 -mt-20 space-y-12 pb-24">
            {/* 3. Top 10 Row */}
            <Top10Row title="Top 10 in Your Country Today" episodes={trendingNow} />

            {/* 4. Genre Rows */}
            <EpisodeRow title="Action & Adventure" label="THRRILLING" episodes={actionMovies} />
            <EpisodeRow title="Horror & Dark Fantasy" label="EERIE" episodes={horrorMovies} />
            <EpisodeRow title="Sci-Fi Highlights" label="FUTURE" episodes={sciFiMovies} />
            <EpisodeRow title="Top Rated Anime" label="ANIMATION" episodes={animeMovies} />

            {/* 5. Recently Added */}
            <EpisodeRow title="Recently Added" label="NEW" episodes={newReleases} />
          </div>
        </>
      ) : (
        <div className="pt-24 px-8 md:px-16 pb-24">
          <header className="mb-12">
            <p className="text-[#8b5cf6] font-bold text-xs tracking-widest uppercase mb-2">Category</p>
            <h1 className="text-4xl font-black text-white">{activeGenre} Titles</h1>
            <p className="text-white/40 mt-2">{filteredResults.length} matches found</p>
          </header>

          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
              {filteredResults.map((item, i) => (
                <EpisodeCard key={item.id} episode={item} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <h2 className="text-2xl font-bold text-white/20">No titles in this category yet.</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
