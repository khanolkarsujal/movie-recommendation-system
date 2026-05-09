import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import TabBar from '../components/TabBar';
import EpisodeRow from '../components/EpisodeRow';
import { seasons, generateEpisodes, trendingNow, newReleases } from '../data/movies';

/**
 * Home page — the main landing view of the streaming platform.
 *
 * Layout (top → bottom):
 *   1. HeroSection   — full-screen cinematic hero with Molten Glass background
 *   2. TabBar        — horizontal season selector with sliding underline indicator
 *   3. Episode Row   — horizontally scrollable cards for selected season
 *   4. Trending Now  — second card row
 *   5. New Releases  — third card row
 */
function Home() {
  const [activeTab, setActiveTab] = useState(0);

  const prevTabRef = useRef(activeTab);
  const direction = activeTab > prevTabRef.current ? 1 : -1;

  // Re-generate episodes whenever the active season changes.
  const currentEpisodes = generateEpisodes(activeTab + 1);

  // Update prev tab after render
  useEffect(() => {
    prevTabRef.current = activeTab;
  }, [activeTab]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Season Tab Bar ──────────────────────────────────── */}
      <TabBar
        seasons={seasons}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── Season Episode Row ──────────────────────────────── */}
      <div className="relative overflow-hidden w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <EpisodeRow
              title={`${seasons[activeTab]} Episodes`}
              episodes={currentEpisodes}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Trending Now ────────────────────────────────────── */}
      <EpisodeRow title="Trending Now" episodes={trendingNow} />

      {/* ── New Releases ────────────────────────────────────── */}
      <EpisodeRow title="New Releases" episodes={newReleases} />

      {/* bottom breathing room */}
      <div className="h-16" />
    </>
  );
}

export default Home;
