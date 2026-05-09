import React, { useState } from 'react';
import Hero from './Hero';
import { MovieRow } from '../components/MovieRow';
import { Top10Row as Top10RowNew } from '../components/Top10Row';
import GenreFilterBar from './GenreFilterBar';
import FeaturedBanner from './FeaturedBanner';
import { Footer } from '../components/Footer';
import { useStore } from '../store';
import {
  trendingNow,
  newReleases,
  continueWatching,
  actionHorrorPicks,
  sciFiFantasyPicks,
  criticallyAcclaimed,
} from '../data/movies';

const Home: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const watchlist = useStore((state) => state.watchlist);

  return (
    <div className="bg-[var(--bg-page)] min-h-screen">
      <Hero />

      {/* Discover Title + Genre Filters - Overlaying bottom of Hero */}
      <GenreFilterBar activeGenre={activeGenre} setActiveGenre={setActiveGenre} />

      <div className="relative z-20 space-y-8 pt-4">
        <MovieRow
          title="Continue Watching"
          movies={continueWatching}
          showProgress={true}
        />

        <FeaturedBanner />

        {/* My List - Only show if user has items in watchlist */}
        {watchlist.length > 0 && (
          <MovieRow
            title="My List"
            movies={watchlist}
          />
        )}

        <MovieRow
          title="Trending Now"
          movies={trendingNow}
          badge="trending"
        />

        <Top10RowNew
          title="Top 10 in Your Country Today"
          movies={trendingNow}
        />

        <MovieRow
          title="New This Week"
          movies={newReleases}
          badge="new"
        />

        <MovieRow
          title="Because You Watched Demonic Slash"
          movies={actionHorrorPicks}
        />

        <MovieRow
          title="Critically Acclaimed Dramas"
          movies={criticallyAcclaimed}
          badge="award"
        />

        <MovieRow
          title="Popular Sci-Fi & Fantasy"
          movies={sciFiFantasyPicks}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Home;