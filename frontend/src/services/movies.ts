/**
 * Movie Service
 * High-level API for fetching movie data from TMDB
 */

import { tmdbClient, GENRE_IDS } from './tmdb';
import { transformTMDBToMovie, transformTMDBMovies } from '../utils/transformers';
import type { Movie } from '../imports/types';

/**
 * Get featured movies for hero carousel
 * Returns top 5 popular movies
 */
export async function getFeaturedMovies(): Promise<Movie[]> {
  try {
    const data = await tmdbClient.getPopularMovies(1);
    return transformTMDBMovies(data.results.slice(0, 5));
  } catch (error) {
    console.error('Error fetching featured movies:', error);
    throw error;
  }
}

/**
 * Get trending movies/shows
 * @param timeWindow 'day' or 'week'
 * @param limit Number of results to return
 */
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'day',
  limit = 10
): Promise<Movie[]> {
  try {
    const data = await tmdbClient.getTrending('all', timeWindow);
    return transformTMDBMovies(data.results.slice(0, limit));
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
}

/**
 * Get new releases from the last 30 days
 */
export async function getNewReleases(): Promise<Movie[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await tmdbClient.discoverMovies({
      'primary_release_date.gte': oneMonthAgo,
      'primary_release_date.lte': today,
      sort_by: 'release_date.desc',
    });

    return transformTMDBMovies(data.results);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    throw error;
  }
}

/**
 * Get movies by genre
 * @param genre Genre name (e.g., 'Action', 'Horror')
 */
export async function getMoviesByGenre(genre: keyof typeof GENRE_IDS): Promise<Movie[]> {
  try {
    const genreId = GENRE_IDS[genre];
    if (!genreId) {
      throw new Error(`Unknown genre: ${genre}`);
    }

    const data = await tmdbClient.discoverMovies({
      with_genres: genreId,
      sort_by: 'popularity.desc',
    });

    return transformTMDBMovies(data.results);
  } catch (error) {
    console.error(`Error fetching ${genre} movies:`, error);
    throw error;
  }
}

/**
 * Search for movies and TV shows
 * @param query Search query
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    if (!query || !query.trim()) {
      return [];
    }

    const data = await tmdbClient.searchMulti(query);

    // Filter to only movies and TV shows
    const filtered = data.results.filter(
      (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
    );

    return transformTMDBMovies(filtered);
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific movie
 * Includes cast, crew, similar movies, and trailers
 */
export async function getMovieDetails(movieId: number) {
  try {
    const data = await tmdbClient.getMovieDetails(movieId);

    return {
      ...transformTMDBToMovie(data),
      cast: data.credits?.cast?.slice(0, 5).map((actor: any) => actor.name) || [],
      director: data.credits?.crew?.find((p: any) => p.job === 'Director')?.name || 'Unknown',
      similar: transformTMDBMovies(data.similar?.results?.slice(0, 6) || []),
      trailer: getTrailerUrl(data.videos?.results || []),
      certification: data.adult ? 'R' : 'PG-13',
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
}

/**
 * Extract YouTube trailer URL from videos array
 */
function getTrailerUrl(videos: any[]): string | null {
  if (!videos || videos.length === 0) return null;

  const trailer = videos.find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

/**
 * Get all available genres
 */
export async function getGenres() {
  try {
    const data = await tmdbClient.getGenres();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}

/**
 * Get popular movies by multiple genres
 */
export async function getMoviesByMultipleGenres(genres: (keyof typeof GENRE_IDS)[]): Promise<Record<string, Movie[]>> {
  try {
    const results = await Promise.all(
      genres.map(async (genre) => ({
        genre,
        movies: await getMoviesByGenre(genre),
      }))
    );

    return results.reduce((acc, { genre, movies }) => {
      acc[genre] = movies;
      return acc;
    }, {} as Record<string, Movie[]>);
  } catch (error) {
    console.error('Error fetching movies by multiple genres:', error);
    throw error;
  }
}
