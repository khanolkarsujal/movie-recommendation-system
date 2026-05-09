/**
 * TMDB API Client
 * Complete integration with The Movie Database API
 */

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  poster_path: string;
  backdrop_path: string;
  adult: boolean;
  original_language: string;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

class TMDBClient {
  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Image URLs
  getImageUrl(path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'original'): string | null {
    if (!path) return null;
    return `${IMAGE_BASE}/${size}${path}`;
  }

  // Popular Movies
  async getPopularMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request('/movie/popular', { page });
  }

  // Trending
  async getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<TMDBMovie>> {
    return this.request(`/trending/${mediaType}/${timeWindow}`);
  }

  // Discover with filters
  async discoverMovies(params: {
    page?: number;
    with_genres?: number;
    'primary_release_date.gte'?: string;
    'primary_release_date.lte'?: string;
    sort_by?: string;
  }): Promise<TMDBResponse<TMDBMovie>> {
    return this.request('/discover/movie', params);
  }

  // Search
  async searchMulti(query: string, page = 1): Promise<TMDBResponse<any>> {
    return this.request('/search/multi', {
      query: query.trim(),
      page,
      include_adult: false,
    });
  }

  // Movie Details
  async getMovieDetails(movieId: number): Promise<any> {
    return this.request(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,similar',
    });
  }

  // Genre List
  async getGenres(): Promise<{ genres: Array<{ id: number; name: string }> }> {
    return this.request('/genre/movie/list');
  }
}

export const tmdbClient = new TMDBClient();

// Genre ID constants
export const GENRE_IDS = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIFI: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};
