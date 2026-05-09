import React, { useState, useMemo } from 'react';
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

// Helper to shuffle arrays for variety
const shuffle = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const Home: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const watchlist = useStore((state) => state.watchlist);

  // Combine all movies for random sampling
  const allMovies = useMemo(() => [
    ...trendingNow,
    ...newReleases,
    ...actionHorrorPicks,
    ...sciFiFantasyPicks,
    ...criticallyAcclaimed,
  ], []);

  // Define 30 sections with their titles and data
  const sections = useMemo(() => [
    { title: "Continue Watching", data: continueWatching, props: { showProgress: true } },
    { title: "Trending Now", data: trendingNow, props: { badge: 'trending' } },
    { title: "Top 10 in Your Country Today", type: 'top10', data: trendingNow },
    { title: "Popular Shows", data: shuffle(allMovies).slice(0, 8) },
    { title: "Popular in Reality", data: shuffle(allMovies).slice(0, 8) },
    { title: "The Great Indian Cinema", data: shuffle(allMovies).slice(0, 8) },
    { title: "New This Week", data: newReleases, props: { badge: 'new' } },
    { title: "Critically Acclaimed Dramas", data: criticallyAcclaimed, props: { badge: 'award' } },
    { title: "Popular Sci-Fi & Fantasy", data: sciFiFantasyPicks },
    { title: "Action & Horror Picks", data: actionHorrorPicks },
    { title: "Binge-Worthy Series", data: shuffle(allMovies).slice(0, 8) },
    { title: "Award-Winning Documentaries", data: shuffle(allMovies).slice(0, 8), props: { badge: 'award' } },
    { title: "Global Hits", data: shuffle(allMovies).slice(0, 8) },
    { title: "Hidden Gems", data: shuffle(allMovies).slice(0, 8) },
    { title: "Throwback Favorites", data: shuffle(allMovies).slice(0, 8) },
    { title: "Family Movie Night", data: shuffle(allMovies).slice(0, 8) },
    { title: "Romantic Comedies", data: shuffle(allMovies).slice(0, 8) },
    { title: "Edge-of-Your-Seat Thrillers", data: shuffle(allMovies).slice(0, 8) },
    { title: "Animation for Everyone", data: shuffle(allMovies).slice(0, 8) },
    { title: "Sports Documentaries", data: shuffle(allMovies).slice(0, 8) },
    { title: "Musical Masterpieces", data: shuffle(allMovies).slice(0, 8) },
    { title: "Mystery & Suspense", data: shuffle(allMovies).slice(0, 8) },
    { title: "Historical Sagas", data: shuffle(allMovies).slice(0, 8) },
    { title: "Superhero Adventures", data: shuffle(allMovies).slice(0, 8) },
    { title: "Nature & Wildlife", data: shuffle(allMovies).slice(0, 8) },
    { title: "True Crime Stories", data: shuffle(allMovies).slice(0, 8) },
    { title: "Epic Journeys", data: shuffle(allMovies).slice(0, 8) },
    { title: "Comedy Specials", data: shuffle(allMovies).slice(0, 8) },
    { title: "Independent Cinema", data: shuffle(allMovies).slice(0, 8) },
    { title: "Coming of Age Stories", data: shuffle(allMovies).slice(0, 8) },
  ], [allMovies]);

  return (
    <div className="bg-[var(--bg-page)] min-h-screen">
      <Hero />

      {/* Discover Title + Genre Filters - Overlaying bottom of Hero */}
      <GenreFilterBar activeGenre={activeGenre} setActiveGenre={setActiveGenre} />

      <div className="relative z-20 space-y-4 pt-4">
        {sections.map((section, idx) => (
          <React.Fragment key={idx}>
            {/* Insert FeaturedBanner after a few sections */}
            {idx === 4 && <FeaturedBanner />}
            
            {/* My List - Only show if user has items in watchlist, insert before Trending */}
            {idx === 1 && watchlist.length > 0 && (
              <MovieRow
                title="My List"
                movies={watchlist}
              />
            )}

            {section.type === 'top10' ? (
              <Top10RowNew
                title={section.title}
                movies={section.data as any}
              />
            ) : (
              <MovieRow
                title={section.title}
                movies={section.data as any}
                {...(section.props as any)}
              />
            )}
            
            {/* Insert another banner later in the list */}
            {idx === 15 && (
                <div className="py-12 opacity-80 hover:opacity-100 transition-opacity">
                    <FeaturedBanner />
                </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;