/**
 * Data Transformers
 * Transform TMDB API responses to our internal Movie interface
 */

import { tmdbClient, GENRE_MAP } from '../services/tmdb';
import type { Movie } from '../imports/types';

interface TMDBMovie {
  id: number;
  title: string;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
}

/**
 * Transform TMDB movie to our Movie interface
 */
export function transformTMDBToMovie(tmdb: TMDBMovie, progress = 0): Movie {
  return {
    id: tmdb.id,
    title: tmdb.title,
    year: tmdb.release_date?.slice(0, 4) || 'N/A',
    duration: formatRuntime(tmdb.runtime || 0),
    rating: calculateMatchScore(tmdb.vote_average || 0),
    genres: mapGenres(tmdb.genre_ids || [], tmdb.genres),
    description: tmdb.overview || 'No description available.',
    thumbnail: tmdbClient.getImageUrl(tmdb.backdrop_path || tmdb.poster_path || null, 'w780') || generatePlaceholder(),
    accent: generateAccentColor(tmdb.genre_ids?.[0] || 0),
    progress,
    quality: '4K',
  };
}

/**
 * Format runtime from minutes to "Xh Ym" format
 */
export function formatRuntime(minutes: number): string {
  if (!minutes || minutes === 0) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Calculate rating from TMDB vote average (0-10)
 */
export function calculateMatchScore(voteAverage: number): string {
  return voteAverage.toFixed(1);
}

/**
 * Get match score color based on percentage
 */
export function getMatchScoreColor(rating: string | number): string {
  const score = typeof rating === 'string'
    ? parseInt(rating.replace('%', ''))
    : rating;

  if (score >= 75) return '#46d369'; // High - Green
  if (score >= 40) return '#f59e0b'; // Mid - Yellow
  return '#ef4444'; // Low - Red
}

/**
 * Map genre IDs to genre names
 */
function mapGenres(
  genreIds: number[] = [],
  genreObjects?: Array<{ id: number; name: string }>
): string[] {
  // If we have full genre objects (from details endpoint)
  if (genreObjects && genreObjects.length > 0) {
    return genreObjects.map(g => g.name);
  }

  // Otherwise map IDs to names
  return genreIds
    .map(id => GENRE_MAP[id])
    .filter(Boolean);
}

/**
 * Generate accent color based on primary genre
 */
export function generateAccentColor(genreId: number): string {
  const colorMap: Record<number, string> = {
    28: '#ef4444',   // Action - Red
    12: '#f59e0b',   // Adventure - Amber
    878: '#3b82f6',  // Sci-Fi - Blue
    27: '#8b5cf6',   // Horror - Purple
    35: '#10b981',   // Comedy - Green
    18: '#6366f1',   // Drama - Indigo
    14: '#ec4899',   // Fantasy - Pink
    53: '#dc2626',   // Thriller - Dark Red
    16: '#f472b6',   // Animation - Pink
    80: '#78716c',   // Crime - Gray
  };

  return colorMap[genreId] || '#8b5cf6'; // Default purple
}

/**
 * Generate placeholder image URL
 */
function generatePlaceholder(): string {
  return `https://picsum.photos/seed/${Math.random()}/780/440`;
}

/**
 * Extract year from date string
 */
export function extractYear(dateString?: string): string {
  if (!dateString) return 'N/A';
  return dateString.slice(0, 4);
}

/**
 * Format release date to readable format
 */
export function formatReleaseDate(dateString?: string): string {
  if (!dateString) return 'Release date unknown';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get certification/rating from release data
 */
export function getCertification(adult: boolean): string {
  return adult ? 'R' : 'PG-13';
}

/**
 * Transform array of TMDB movies
 */
export function transformTMDBMovies(tmdbMovies: TMDBMovie[]): Movie[] {
  return tmdbMovies.map(movie => transformTMDBToMovie(movie));
}
