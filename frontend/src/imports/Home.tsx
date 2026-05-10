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

  // Define all 30 sections with their titles and data
  const baseSections = useMemo(() => [
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

  // OTT UX FEATURE: Filter the rows based on the active genre.
  const filteredSections = useMemo(() => {
    if (activeGenre === 'All') return baseSections;

    return baseSections.map(section => {
      const filteredData = section.data.filter((movie: any) => {
        const matchSingle = movie.genre?.toLowerCase() === activeGenre.toLowerCase();
        const matchArray = movie.genres?.some((g: string) => g.toLowerCase() === activeGenre.toLowerCase());
        return matchSingle || matchArray;
      });
      return { ...section, data: filteredData };
    }).filter(section => section.data.length > 0);
  }, [baseSections, activeGenre]);

  return (
    <div style={{ background: '#111113', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
      {/* ─── HERO ─── */}
      <Hero />

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="-mt-[120px]" style={{ position: 'relative', zIndex: 20 }}>

        {/* Genre Filter Bar — sticky Netflix-style tab row */}
        <div
          style={{
            position: 'sticky',
            top: 72,
            zIndex: 50,
            padding: '24px 60px',
            background: 'linear-gradient(to bottom, rgba(17,17,19,0.97) 0%, rgba(17,17,19,0.9) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            marginBottom: 24,
          }}
        >
          <GenreFilterBar activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
        </div>

        {/* Movie Rows */}
        <div style={{ paddingBottom: 40 }}>
          {filteredSections.map((section, idx) => (
            <React.Fragment key={`${section.title}-${idx}`}>

              {/* Inject My List early in the page */}
              {idx === 1 && watchlist.length > 0 && (
                <MovieRow
                  title="My List"
                  movies={watchlist}
                />
              )}

              {/* Render Top 10 or Standard Movie Row */}
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

              {/* Inject Featured Banner 1 */}
              {idx === 4 && (
                <div style={{ padding: '8px 60px 24px' }}>
                  <FeaturedBanner />
                </div>
              )}

              {/* Inject Featured Banner 2 */}
              {idx === 15 && (
                <div style={{ padding: '8px 60px 24px', opacity: 0.95 }}>
                  <FeaturedBanner />
                </div>
              )}

            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;