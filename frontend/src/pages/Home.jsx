import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import TabBar from '../components/TabBar';
import EpisodeRow from '../components/EpisodeRow';
import { seasons, generateEpisodes, trendingNow, newReleases } from '../data/movies';

function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const prevTabRef = useRef(activeTab);
  const direction  = activeTab > prevTabRef.current ? 1 : -1;

  useEffect(() => {
    prevTabRef.current = activeTab;
  }, [activeTab]);

  // Memoize expensive episode generation — only regenerates when season changes
  const currentEpisodes = useMemo(() => generateEpisodes(activeTab + 1), [activeTab]);

  const handleTabChange = useCallback((idx) => setActiveTab(idx), []);

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Season Tab Bar ── */}
      <TabBar
        seasons={seasons}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* ── Season Episodes — direction-aware transition ── */}
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
              episodes={currentEpisodes}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Trending Now ── */}
      <EpisodeRow
        title="Trending Now"
        label="Top 10 in Your Country"
        episodes={trendingNow}
      />

      {/* ── New Releases ── */}
      <EpisodeRow
        title="New This Week"
        label="Just Added"
        episodes={newReleases}
      />

      {/* ── Because you watched… (reuse season 2 episodes as placeholder) ── */}
      <EpisodeRow
        title="Because You Watched Demonic Slash"
        label="Recommended For You"
        episodes={useMemo(() => generateEpisodes(2), [])}
      />

      {/* Bottom spacing */}
      <div className="h-20" />
    </>
  );
}

export default Home;
