import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import SeasonTabBar from '../components/SeasonTabBar';
import EpisodeRow from '../components/EpisodeRow';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { seasons, generateEpisodes, trendingNow, newReleases, continueWatching } from '../data/movies';

function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const prevTabRef = useRef(activeTab);
  const direction  = activeTab > prevTabRef.current ? 1 : -1;

  useEffect(() => { prevTabRef.current = activeTab; }, [activeTab]);

  const currentEpisodes   = useMemo(() => generateEpisodes(activeTab + 1), [activeTab]);
  const recommendedEps    = useMemo(() => generateEpisodes(2), []);
  const handleTabChange   = useCallback((idx) => setActiveTab(idx), []);

  return (
    <div className="bg-[#050508] min-h-screen">
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Season Tab Bar (Bug 1 Fix: Home only) ── */}
      <SeasonTabBar seasons={seasons} activeTab={activeTab} setActiveTab={handleTabChange} />

      <div className="relative z-20 space-y-4">
        {/* ── Season Episodes ── */}
        <div className="relative overflow-hidden w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <EpisodeRow 
                title={`${seasons[activeTab]} Episodes`} 
                label="CURRENT SEASON"
                episodes={currentEpisodes} 
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Continue Watching ── */}
        <EpisodeRow title="Continue Watching for John" label="RESUME" episodes={continueWatching} />

        {/* ── Featured Carousel ── */}
        <div className="py-8">
          <FeaturedCarousel />
        </div>

        {/* ── Trending Now ── */}
        <EpisodeRow title="Trending Now" label="TOP 10" episodes={trendingNow} />

        {/* ── New This Week ── */}
        <EpisodeRow title="New This Week" label="JUST ADDED" episodes={newReleases} />

        {/* ── Recommended For You ── */}
        <EpisodeRow title="Because You Watched Demonic Slash" label="RECOMMENDED" episodes={recommendedEps} />
      </div>

      <div className="h-20" />
    </div>
  );
}

export default Home;
