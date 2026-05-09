import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import EpisodeRow from '../components/EpisodeRow';
import GenreFilterBar from '../components/GenreFilterBar';
import Top10Row from '../components/Top10Row';
import SeasonTabBar from '../components/SeasonTabBar';
import { seasons, generateEpisodes, trendingNow, newReleases, continueWatching } from '../data/movies';

function Home() {
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-[#050508] min-h-screen">
      {/* ── Genre Filter Bar ── */}
      <GenreFilterBar activeGenre={activeGenre} setActiveGenre={setActiveGenre} />

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Overlay Content (Tabs & First Row) ── */}
      <div className="relative z-30 -mt-[280px]">
        <SeasonTabBar seasons={seasons} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="relative z-20 space-y-8 pt-0 -mt-[20px]">
        {/* ── Season Episodes ── */}
        <EpisodeRow 
          title={`${seasons[activeTab]} Episodes`} 
          label="CURRENT SEASON"
          episodes={generateEpisodes(activeTab + 1)} 
        />

        {/* ── Continue Watching ── */}
        <EpisodeRow 
          title="Continue Watching" 
          label="RESUME" 
          episodes={continueWatching} 
          isContinueWatching={true}
        />

        {/* ── Trending Now (Top 10) ── */}
        <Top10Row 
          title="Top 10 in Your Country Today" 
          episodes={trendingNow} 
        />

        {/* ── New This Week ── */}
        <EpisodeRow title="New This Week" label="JUST ADDED" episodes={newReleases} />

        {/* ── Recommended For You ── */}
        <EpisodeRow title="Because You Watched Demonic Slash" label="RECOMMENDED" episodes={generateEpisodes(2)} />
      </div>

      <div className="h-20" />
    </div>
  );
}

export default Home;
