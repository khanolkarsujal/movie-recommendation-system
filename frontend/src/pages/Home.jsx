import React, { useState } from 'react';
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

  // Re-generate episodes whenever the active season changes.
  // The `key` prop on EpisodeRow re-mounts the component so
  // Framer Motion plays the staggered entrance animation on every tab switch.
  const currentEpisodes = generateEpisodes(activeTab + 1);

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
      <EpisodeRow
        key={`season-${activeTab}`}
        title={`${seasons[activeTab]} Episodes`}
        episodes={currentEpisodes}
      />

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
