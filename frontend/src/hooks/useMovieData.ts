/**
 * Movie Data Hooks
 * React Query hooks for fetching movie data with caching
 *
 * Install: pnpm add @tanstack/react-query
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  getFeaturedMovies,
  getTrendingMovies,
  getNewReleases,
  getMoviesByGenre,
  searchMovies,
  getMovieDetails,
  getGenres,
} from '../services/movies';
import type { Movie } from '../imports/types';
import { GENRE_IDS } from '../services/tmdb';

// Query keys
export const movieKeys = {
  all: ['movies'] as const,
  featured: () => [...movieKeys.all, 'featured'] as const,
  trending: (timeWindow: 'day' | 'week') => [...movieKeys.all, 'trending', timeWindow] as const,
  newReleases: () => [...movieKeys.all, 'new-releases'] as const,
  byGenre: (genre: string) => [...movieKeys.all, 'genre', genre] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  details: (id: number) => [...movieKeys.all, 'details', id] as const,
  genres: () => [...movieKeys.all, 'genres'] as const,
};

/**
 * Fetch featured movies for hero carousel
 */
export function useFeaturedMovies(options?: UseQueryOptions<Movie[]>) {
  return useQuery({
    queryKey: movieKeys.featured(),
    queryFn: getFeaturedMovies,
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

/**
 * Fetch trending movies
 */
export function useTrendingMovies(
  timeWindow: 'day' | 'week' = 'day',
  options?: UseQueryOptions<Movie[]>
) {
  return useQuery({
    queryKey: movieKeys.trending(timeWindow),
    queryFn: () => getTrendingMovies(timeWindow),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Fetch new releases
 */
export function useNewReleases(options?: UseQueryOptions<Movie[]>) {
  return useQuery({
    queryKey: movieKeys.newReleases(),
    queryFn: getNewReleases,
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}

/**
 * Fetch movies by genre
 */
export function useMoviesByGenre(
  genre: keyof typeof GENRE_IDS,
  options?: UseQueryOptions<Movie[]>
) {
  return useQuery({
    queryKey: movieKeys.byGenre(genre),
    queryFn: () => getMoviesByGenre(genre),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!genre,
    ...options,
  });
}

/**
 * Search movies with debouncing
 */
export function useSearchMovies(
  query: string,
  options?: UseQueryOptions<Movie[]>
) {
  return useQuery({
    queryKey: movieKeys.search(query),
    queryFn: () => searchMovies(query),
    enabled: query.trim().length >= 2, // Only search if 2+ characters
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Fetch movie details
 */
export function useMovieDetails(
  movieId: number | null,
  options?: UseQueryOptions<any>
) {
  return useQuery({
    queryKey: movieKeys.details(movieId!),
    queryFn: () => getMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
}

/**
 * Fetch all genres
 */
export function useGenres(options?: UseQueryOptions<any>) {
  return useQuery({
    queryKey: movieKeys.genres(),
    queryFn: getGenres,
    staleTime: Infinity, // Genres rarely change
    ...options,
  });
}

/**
 * Example: Multiple genres at once
 */
export function useMultipleGenres(
  genres: (keyof typeof GENRE_IDS)[],
  options?: UseQueryOptions<Movie[]>
) {
  const queries = genres.map((genre) => ({
    queryKey: movieKeys.byGenre(genre),
    queryFn: () => getMoviesByGenre(genre),
    staleTime: 1000 * 60 * 10,
    ...options,
  }));

  // This would need useQueries from React Query
  // Just showing the pattern here
  return queries;
}
