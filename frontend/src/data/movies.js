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
    thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=75',
  },
  {
    suffix: 'Demon Dies',
    duration: '22 min',
    rating: 9.1,
    genres: ['Action', 'Fantasy'],
    description: 'An unexpected confrontation leads to a shocking sacrifice no one saw coming.',
    thumb: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=75',
  },
  {
    suffix: 'Demon Resurrected',
    duration: '26 min',
    rating: 8.6,
    genres: ['Horror', 'Dark'],
    description: 'Dark forces converge as the demon rises again — more powerful than before.',
    thumb: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=500&q=75',
  },
  {
    suffix: 'Demon Dies Again',
    duration: '23 min',
    rating: 8.4,
    genres: ['Action', 'Dark'],
    description: 'The group devises a risky plan, hoping to end the threat once and for all.',
    thumb: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&q=75',
  },
  {
    suffix: 'Demon Returns',
    duration: '25 min',
    rating: 8.8,
    genres: ['Horror', 'Fantasy'],
    description: 'Just when peace seemed possible, the demon lord reveals his true form.',
    thumb: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&q=75',
  },
  {
    suffix: 'The Final Stand',
    duration: '28 min',
    rating: 9.4,
    genres: ['Action', 'Drama'],
    description: 'Heroes make their last stand in a battle that will define destiny itself.',
    thumb: 'https://images.unsplash.com/photo-1531501410720-c8d437636169?w=500&q=75',
  },
  {
    suffix: 'Shadow Falls',
    duration: '24 min',
    rating: 8.2,
    genres: ['Dark', 'Drama'],
    description: 'In the aftermath, a lone survivor uncovers a conspiracy older than time.',
    thumb: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&q=75',
  },
  {
    suffix: 'Crimson Moon',
    duration: '27 min',
    rating: 8.7,
    genres: ['Fantasy', 'Action'],
    description: 'Under the crimson moon, ancient prophecies begin to unfold at last.',
    thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=75',
  },
];

/**
 * Generates episode objects for a given season number.
 * Seasons 1–5 cycle through the same titles with unique stable IDs.
 */
export function generateEpisodes(seasonNum) {
  const count = SEASON_EPISODE_COUNTS[(seasonNum - 1) % SEASON_EPISODE_COUNTS.length];
  return Array.from({ length: count }, (_, i) => {
    const meta = EPISODES_META[i % EPISODES_META.length];
    const hasRealThumb = seasonNum === 1 && i === 0 ? ep1
                       : seasonNum === 1 && i === 1 ? ep2
                       : meta.thumb;
    return {
      id: `s${seasonNum}e${i + 1}`,
      title: `Episode ${i + 1}: ${meta.suffix}`,
      thumbnail: hasRealThumb,
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
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=75',
  },
  {
    id: 't2', title: 'Blood Covenant', duration: '1h 18m', progress: 35, rating: 8.7, year: 2027,
    genres: ['Action', 'Horror'], description: 'A templar knight forms a dark pact to exact revenge on a corrupt king.',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=75',
  },
  {
    id: 't3', title: 'Veil of Darkness', duration: '1h 55m', progress: 0, rating: 7.9, year: 2025,
    genres: ['Horror', 'Thriller'], description: 'Ancient darkness spreads across a sleeping city, and only one can stop it.',
    thumbnail: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=500&q=75',
  },
  {
    id: 't4', title: 'Phantom Gate', duration: '1h 30m', progress: 0, rating: 7.6, year: 2025,
    genres: ['Sci-Fi', 'Dark'], description: 'A portal opens to a dimension where time flows in reverse.',
    thumbnail: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=500&q=75',
  },
  {
    id: 't5', title: 'Obsidian Sky', duration: '1h 24m', progress: 80, rating: 8.1, year: 2026,
    genres: ['Action', 'Sci-Fi'], description: 'Fighter pilots battle an alien armada hiding inside a black hole.',
    thumbnail: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=500&q=75',
  },
  {
    id: 't6', title: 'The Last Rune', duration: '2h 01m', progress: 0, rating: 9.0, year: 2027,
    genres: ['Fantasy', 'Adventure'], description: 'The final rune holds the power to unmake all of reality.',
    thumbnail: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=500&q=75',
  },
  {
    id: 't7', title: 'Nightfall Protocol', duration: '1h 38m', progress: 0, rating: 8.5, year: 2026,
    genres: ['Thriller', 'Action'], description: 'An elite operative must stop a global conspiracy before midnight.',
    thumbnail: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500&q=75',
  },
];

// ─── New Releases ─────────────────────────────────────────────────────────────
export const newReleases = [
  {
    id: 'n1', title: 'Abyss Walkers', duration: '1h 50m', progress: 0, rating: 7.8, year: 2026,
    genres: ['Sci-Fi', 'Adventure'], description: 'Deep-sea explorers encounter something that was never meant to be found.',
    thumbnail: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500&q=75',
  },
  {
    id: 'n2', title: 'Demon Codex', duration: '24 min', progress: 0, rating: 8.2, year: 2026,
    genres: ['Anime', 'Action'], description: 'A forbidden text transforms its reader into something inhuman.',
    thumbnail: 'https://images.unsplash.com/photo-1519638399935-1cc2bfd1b1e1?w=500&q=75',
  },
  {
    id: 'n3', title: 'Eclipse Hunters', duration: '1h 12m', progress: 0, rating: 8.6, year: 2025,
    genres: ['Sci-Fi', 'Drama'], description: 'In a perpetually darkened world, a team searches for the last light.',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=75',
  },
  {
    id: 'n4', title: 'The Forgotten Arc', duration: '26 min', progress: 0, rating: 7.5, year: 2026,
    genres: ['Animation', 'Fantasy'], description: 'A lost civilization resurfaces in modern day, bringing ancient magic with it.',
    thumbnail: 'https://images.unsplash.com/photo-1520525003249-2b9cdda513bc?w=500&q=75',
  },
  {
    id: 'n5', title: 'Rift Keepers', duration: '1h 45m', progress: 0, rating: 8.9, year: 2026,
    genres: ['Action', 'Sci-Fi'], description: 'Guardians of the dimensional rifts face their greatest threat yet.',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=75',
  },
  {
    id: 'n6', title: 'Void Born', duration: '22 min', progress: 0, rating: 8.0, year: 2026,
    genres: ['Horror', 'Dark'], description: 'Children born in darkness carry within them the end of all things.',
    thumbnail: 'https://images.unsplash.com/photo-1515888012938-a6d7e06c0fc0?w=500&q=75',
  },
];

export const continueWatching = [
  {
    id: 'cw1', title: 'Blood Covenant', duration: 'S2:E4', progress: 65, rating: 8.7, year: 2027,
    genres: ['Action', 'Horror'], description: 'The templar knight faces his ultimate test against the vampire queen.',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=75',
  },
  {
    id: 'cw2', title: 'The Last Rune', duration: '2h 01m', progress: 15, rating: 9.0, year: 2027,
    genres: ['Fantasy', 'Adventure'], description: 'The final rune holds the power to unmake all of reality.',
    thumbnail: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=500&q=75',
  },
  {
    id: 'cw3', title: 'Cyber Drift', duration: 'S1:E8', progress: 85, rating: 8.2, year: 2024,
    genres: ['Cyberpunk', 'Action'], description: 'Racing through the neon underground, the final drift decides everything.',
    thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=75',
  },
  {
    id: 'cw4', title: 'Abyssal Deep', duration: '1h 45m', progress: 40, rating: 7.8, year: 2025,
    genres: ['Sci-Fi', 'Horror'], description: 'Deep sea explorers find something that has been waiting for millions of years.',
    thumbnail: 'https://images.unsplash.com/photo-1682687982501-1e58f8147c08?w=500&q=75',
  }
];
