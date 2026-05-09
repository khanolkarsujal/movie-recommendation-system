import ep1 from '../assets/ep1.png';
import ep2 from '../assets/ep2.png';

// ─── Design Tokens ──────────────────────────────────────────────────────────
export const GENRE_COLORS = {
  Action:      '#ef4444',
  Adventure:   '#f59e0b',
  Animation:   '#10b981',
  Comedy:      '#eab308',
  Crime:       '#6366f1',
  Documentary: '#14b8a6',
  Drama:       '#f8fafc',
  Fantasy:     '#22c55e',
  Horror:      '#a855f7',
  'Sci-Fi':    '#3b82f6',
  Anime:       '#ec4899',
  Cyberpunk:   '#06b6d4',
  Thriller:    '#f97316',
  Dark:        '#8b5cf6',
};

// ─── Seasons ─────────────────────────────────────────────────────────────────
export const seasons = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5'];

export const SEASON_EPISODE_COUNTS = [12, 10, 14, 8, 16];

// ─── Episode Metadata ────────────────────────────────────────────────────────
const EPISODES_META = [
  {
    suffix: 'Demon Arrives',
    duration: '24 min',
    rating: 8.9,
    genres: ['Action', 'Dark'],
    description: 'The demon lord makes his grand entrance, sending shockwaves through the realm.',
    thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop',
  },
  {
    suffix: 'Demon Dies',
    duration: '22 min',
    rating: 9.1,
    genres: ['Action', 'Fantasy'],
    description: 'An unexpected confrontation leads to a shocking sacrifice no one saw coming.',
    thumb: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop',
  },
  {
    suffix: 'Demon Resurrected',
    duration: '26 min',
    rating: 8.6,
    genres: ['Horror', 'Dark'],
    description: 'Dark forces converge as the demon rises again — more powerful than before.',
    thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2574&auto=format&fit=crop',
  },
  {
    suffix: 'Demon Dies Again',
    duration: '23 min',
    rating: 8.4,
    genres: ['Action', 'Dark'],
    description: 'The group devises a risky plan, hoping to end the threat once and for all.',
    thumb: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2637&auto=format&fit=crop',
  },
  {
    suffix: 'Demon Returns',
    duration: '25 min',
    rating: 8.8,
    genres: ['Horror', 'Fantasy'],
    description: 'Just when peace seemed possible, the demon lord reveals his true form.',
    thumb: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2564&auto=format&fit=crop',
  },
];

export function generateEpisodes(seasonNum) {
  const count = SEASON_EPISODE_COUNTS[(seasonNum - 1) % SEASON_EPISODE_COUNTS.length];
  return Array.from({ length: count }, (_, i) => {
    const meta = EPISODES_META[i % EPISODES_META.length];
    return {
      id: `s${seasonNum}e${i + 1}`,
      title: `Episode ${i + 1}: ${meta.suffix}`,
      thumbnail: meta.thumb,
      progress: seasonNum === 1 && i === 0 ? 100
               : seasonNum === 1 && i === 1 ? 60
               : 0,
      duration: meta.duration,
      rating: meta.rating,
      genres: meta.genres,
      description: meta.description,
      year: 2024 + (seasonNum - 1),
    };
  });
}

// ─── Trending Now ─────────────────────────────────────────────────────────────
export const trendingNow = [
  {
    id: 't1', title: 'Shadow Realm', duration: '1h 42m', progress: 0, rating: 8.3, year: 2026,
    genres: ['Fantasy', 'Dark'], description: 'A rogue assassin navigates a deadly underworld where shadows come to life.',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop',
  },
  {
    id: 't2', title: 'Blood Covenant', duration: '1h 18m', progress: 35, rating: 8.7, year: 2027,
    genres: ['Action', 'Horror'], description: 'A templar knight forms a dark pact to exact revenge on a corrupt king.',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 't3', title: 'Veil of Darkness', duration: '1h 55m', progress: 0, rating: 7.9, year: 2025,
    genres: ['Horror', 'Thriller'], description: 'Ancient darkness spreads across a sleeping city, and only one can stop it.',
    thumbnail: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2670&auto=format&fit=crop',
  },
];

export const newReleases = [
  {
    id: 'n1', title: 'Abyss Walkers', duration: '1h 50m', progress: 0, rating: 7.8, year: 2026,
    genres: ['Sci-Fi', 'Adventure'], description: 'Deep-sea explorers encounter something that was never meant to be found.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 'n2', title: 'Demon Codex', duration: '24 min', progress: 0, rating: 8.2, year: 2026,
    genres: ['Anime', 'Action'], description: 'A forbidden text transforms its reader into something inhuman.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop',
  },
];

export const continueWatching = [
  {
    id: 'cw1', title: 'Blood Covenant', duration: 'S2:E4', progress: 65, rating: 8.7, year: 2027,
    genres: ['Action', 'Horror'], description: 'The templar knight faces his ultimate test against the vampire queen.',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 'cw2', title: 'The Last Rune', duration: '2h 01m', progress: 15, rating: 9.0, year: 2027,
    genres: ['Fantasy', 'Adventure'], description: 'The final rune holds the power to unmake all of reality.',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop',
  },
];
