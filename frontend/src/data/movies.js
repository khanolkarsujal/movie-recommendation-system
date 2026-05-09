import ep1 from '../assets/ep1.png';
import ep2 from '../assets/ep2.png';

// ─── Seasons ───────────────────────────────────────────────────────────────
export const seasons = [
  'Season 1',
  'Season 2',
  'Season 3',
  'Season 4',
  'Season 5',
];

// ─── Episode generator ─────────────────────────────────────────────────────
const EPISODE_TITLES = [
  'Demon Arrives',
  'Demon Dies',
  'Demon Resurrected',
  'Demon Dies Again',
  'Demon Returns',
  'The Final Stand',
  'Shadow Falls',
  'Crimson Moon',
];

const EPISODE_DURATIONS = [
  '24 min', '22 min', '26 min', '23 min',
  '25 min', '28 min', '24 min', '27 min',
];

/**
 * Generates an array of episode objects for a given season.
 * Season 1 episodes 1-2 use real AI-generated thumbnails.
 */
export function generateEpisodes(seasonNum) {
  return EPISODE_TITLES.map((suffix, i) => ({
    id: `s${seasonNum}e${i + 1}`,
    title: `Episode ${i + 1}: ${suffix}`,
    thumbnail:
      seasonNum === 1 && i === 0 ? ep1
      : seasonNum === 1 && i === 1 ? ep2
      : null,
    progress:
      seasonNum === 1 && i === 0 ? 100
      : seasonNum === 1 && i === 1 ? 60
      : 0,
    duration: EPISODE_DURATIONS[i],
  }));
}

// ─── Trending Now ───────────────────────────────────────────────────────────
export const trendingNow = [
  { id: 't1', title: 'Shadow Realm',       thumbnail: null, progress: 0,  duration: '1h 42m' },
  { id: 't2', title: 'Blood Covenant',     thumbnail: null, progress: 35, duration: '1h 18m' },
  { id: 't3', title: 'Veil of Darkness',   thumbnail: null, progress: 0,  duration: '1h 55m' },
  { id: 't4', title: 'Phantom Gate',       thumbnail: null, progress: 0,  duration: '1h 30m' },
  { id: 't5', title: 'Obsidian Sky',       thumbnail: null, progress: 80, duration: '1h 24m' },
  { id: 't6', title: 'The Last Rune',      thumbnail: null, progress: 0,  duration: '2h 01m' },
  { id: 't7', title: 'Nightfall Protocol', thumbnail: null, progress: 0,  duration: '1h 38m' },
];

// ─── New Releases ───────────────────────────────────────────────────────────
export const newReleases = [
  { id: 'n1', title: 'Abyss Walkers',     thumbnail: null, progress: 0, duration: '1h 50m' },
  { id: 'n2', title: 'Demon Codex',       thumbnail: null, progress: 0, duration: '24 min' },
  { id: 'n3', title: 'Eclipse Hunters',   thumbnail: null, progress: 0, duration: '1h 12m' },
  { id: 'n4', title: 'The Forgotten Arc', thumbnail: null, progress: 0, duration: '26 min' },
  { id: 'n5', title: 'Rift Keepers',      thumbnail: null, progress: 0, duration: '1h 45m' },
  { id: 'n6', title: 'Void Born',         thumbnail: null, progress: 0, duration: '22 min' },
];
