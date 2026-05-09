# 🔌 API Integration Guide - Mock → Real Data

Complete mapping from current mock data to TMDB API and backend services.

---

## 📋 Table of Contents

1. [TMDB API Setup](#tmdb-api-setup)
2. [Data Model Mappings](#data-model-mappings)
3. [API Endpoints](#api-endpoints)
4. [Component Integration](#component-integration)
5. [Backend Services](#backend-services)
6. [Migration Checklist](#migration-checklist)

---

## TMDB API Setup

### Get API Key
1. Sign up at https://www.themoviedb.org/
2. Go to Settings → API
3. Request API key (free)
4. Add to environment variables

### Environment Setup
```bash
# .env.local
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### API Client Setup
```typescript
// src/services/tmdb.ts
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

export const tmdbApi = {
  get: async (endpoint: string, params = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('TMDB API Error');
    return response.json();
  },
  
  getImageUrl: (path: string, size = 'original') => {
    if (!path) return null;
    return `${IMAGE_BASE}/${size}${path}`;
  },
};
```

---

## Data Model Mappings

### Movie Interface Mapping

**Current Mock Data:**
```typescript
interface Movie {
  id: number | string;
  title: string;
  year?: string | number;
  duration?: string;
  rating?: string | number;
  genres?: string[];
  description?: string;
  thumbnail?: string;
  accent?: string;
  progress?: number;
}
```

**TMDB API Response:**
```typescript
interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;        // "2024-03-15"
  runtime: number;              // 125 (minutes)
  vote_average: number;         // 8.5 (out of 10)
  genre_ids: number[];          // [28, 12, 878]
  overview: string;
  poster_path: string;          // "/abc123.jpg"
  backdrop_path: string;        // "/xyz789.jpg"
  adult: boolean;
  original_language: string;
}
```

**Transformation Function:**
```typescript
// src/utils/transformers.ts
import { tmdbApi } from '../services/tmdb';

export function transformTMDBToMovie(tmdb: TMDBMovie): Movie {
  return {
    id: tmdb.id,
    title: tmdb.title,
    year: tmdb.release_date?.slice(0, 4) || 'N/A',
    duration: formatRuntime(tmdb.runtime),
    rating: calculateMatchScore(tmdb.vote_average),
    genres: mapGenreIds(tmdb.genre_ids),
    description: tmdb.overview,
    thumbnail: tmdbApi.getImageUrl(tmdb.backdrop_path, 'w780'),
    accent: generateAccentColor(tmdb.genre_ids[0]),
    progress: 0, // From user watch history
  };
}

function formatRuntime(minutes: number): string {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function calculateMatchScore(voteAverage: number): string {
  // TMDB vote_average: 0-10
  // Our match score: 0-100%
  const percentage = Math.round((voteAverage / 10) * 100);
  return `${percentage}%`;
}

const GENRE_MAP: Record<number, string> = {
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

function mapGenreIds(ids: number[]): string[] {
  return ids.map(id => GENRE_MAP[id] || 'Unknown');
}

function generateAccentColor(genreId: number): string {
  const colors: Record<number, string> = {
    28: '#ef4444',   // Action - Red
    12: '#f59e0b',   // Adventure - Amber
    878: '#3b82f6',  // Sci-Fi - Blue
    27: '#8b5cf6',   // Horror - Purple
    35: '#10b981',   // Comedy - Green
    18: '#6366f1',   // Drama - Indigo
  };
  return colors[genreId] || '#8b5cf6';
}
```

---

## API Endpoints

### 1. Hero Section - Featured Movies

**Current:** `FEATURED_MOVIES` array in `Hero.tsx`

**Replace with:**
```typescript
// src/services/movies.ts
export async function getFeaturedMovies() {
  const data = await tmdbApi.get('/movie/popular', { page: 1 });
  return data.results.slice(0, 5).map(transformTMDBToMovie);
}
```

**API Call:** `GET /movie/popular`
- Returns: Array of popular movies
- Use: First 5 for hero carousel

---

### 2. Trending Now / Top 10

**Current:** `trendingNow` array in `src/data/movies.ts`

**Replace with:**
```typescript
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day') {
  const data = await tmdbApi.get(`/trending/all/${timeWindow}`);
  return data.results.slice(0, 10).map(transformTMDBToMovie);
}
```

**API Call:** `GET /trending/all/day`
- Returns: Top 10 trending today
- Use: "Top 10 in Your Country" row

---

### 3. New Releases

**Current:** `newReleases` array in `src/data/movies.ts`

**Replace with:**
```typescript
export async function getNewReleases() {
  const today = new Date().toISOString().split('T')[0];
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  const data = await tmdbApi.get('/discover/movie', {
    'primary_release_date.gte': oneMonthAgo,
    'primary_release_date.lte': today,
    sort_by: 'release_date.desc',
  });
  
  return data.results.map(transformTMDBToMovie);
}
```

**API Call:** `GET /discover/movie` with date filters
- Returns: Movies released in last 30 days
- Use: "New This Week" row

---

### 4. Genre-Based Rows

**Current:** `generateEpisodes()` function

**Replace with:**
```typescript
export async function getMoviesByGenre(genreId: number) {
  const data = await tmdbApi.get('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
  });
  
  return data.results.map(transformTMDBToMovie);
}

// Genre IDs
export const GENRES = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
  HORROR: 27,
  SCIFI: 878,
  THRILLER: 53,
};
```

**API Call:** `GET /discover/movie?with_genres=28`
- Returns: Movies filtered by genre
- Use: Action/Horror/Sci-Fi rows

---

### 5. Search

**Current:** Client-side filtering in `Browse.tsx`

**Replace with:**
```typescript
export async function searchMovies(query: string) {
  if (!query.trim()) return [];
  
  const data = await tmdbApi.get('/search/multi', {
    query: query.trim(),
    include_adult: false,
  });
  
  return data.results
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .map(transformTMDBToMovie);
}
```

**API Call:** `GET /search/multi?query=batman`
- Returns: Search results (movies + TV shows)
- Use: Search functionality

---

### 6. Movie Details

**Current:** Static data in modal

**Replace with:**
```typescript
export async function getMovieDetails(movieId: number) {
  const [movie, credits, similar] = await Promise.all([
    tmdbApi.get(`/movie/${movieId}`),
    tmdbApi.get(`/movie/${movieId}/credits`),
    tmdbApi.get(`/movie/${movieId}/similar`),
  ]);
  
  return {
    ...transformTMDBToMovie(movie),
    cast: credits.cast.slice(0, 5).map((actor: any) => actor.name),
    director: credits.crew.find((p: any) => p.job === 'Director')?.name,
    similar: similar.results.slice(0, 6).map(transformTMDBToMovie),
    trailer: await getTrailerUrl(movieId),
  };
}

async function getTrailerUrl(movieId: number): Promise<string | null> {
  const data = await tmdbApi.get(`/movie/${movieId}/videos`);
  const trailer = data.results.find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}
```

**API Calls:** 
- `GET /movie/{id}` - Full details
- `GET /movie/{id}/credits` - Cast & crew
- `GET /movie/{id}/similar` - Recommendations
- `GET /movie/{id}/videos` - Trailers

---

## Backend Services

### User Watchlist

**Current:** Zustand store with localStorage

**Backend Required:**
```typescript
// src/services/watchlist.ts
export async function getWatchlist(userId: string): Promise<Movie[]> {
  const response = await fetch(`/api/users/${userId}/watchlist`);
  const data = await response.json();
  return data.movies.map(transformTMDBToMovie);
}

export async function addToWatchlist(userId: string, movieId: number) {
  await fetch(`/api/users/${userId}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId }),
  });
}

export async function removeFromWatchlist(userId: string, movieId: number) {
  await fetch(`/api/users/${userId}/watchlist/${movieId}`, {
    method: 'DELETE',
  });
}
```

**Database Schema:**
```sql
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  movie_id INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);
```

---

### Continue Watching

**Current:** Mock `continueWatching` array

**Backend Required:**
```typescript
// src/services/watch-history.ts
export async function getWatchHistory(userId: string): Promise<Movie[]> {
  const response = await fetch(`/api/users/${userId}/watch-history`);
  const data = await response.json();
  
  return data.history.map((item: any) => ({
    ...transformTMDBToMovie(item.movie),
    progress: item.progress_percentage,
    watchedAt: item.watched_at,
  }));
}

export async function updateWatchProgress(
  userId: string,
  movieId: number,
  progressSeconds: number,
  totalSeconds: number
) {
  await fetch(`/api/users/${userId}/watch-progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      movieId,
      progressSeconds,
      totalSeconds,
      progressPercentage: (progressSeconds / totalSeconds) * 100,
    }),
  });
}
```

**Database Schema:**
```sql
CREATE TABLE watch_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  movie_id INTEGER NOT NULL,
  progress_seconds INTEGER NOT NULL,
  total_seconds INTEGER NOT NULL,
  progress_percentage DECIMAL(5,2) NOT NULL,
  watched_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);
```

---

### AI Recommendations

**Current:** Static recommendations

**Claude AI Integration:**
```typescript
// src/services/recommendations.ts
export async function getAIRecommendations(
  userId: string,
  watchHistory: Movie[],
  prompt?: string
): Promise<Movie[]> {
  const response = await fetch('/api/ai/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      watchHistory: watchHistory.map(m => ({
        title: m.title,
        genres: m.genres,
        rating: m.rating,
      })),
      prompt: prompt || 'Recommend movies based on my watch history',
    }),
  });
  
  const data = await response.json();
  
  // Claude returns movie titles/IDs
  // Fetch full details from TMDB
  const moviePromises = data.recommendations.map((rec: any) =>
    searchMovies(rec.title).then(results => results[0])
  );
  
  return Promise.all(moviePromises);
}
```

**Backend (Node.js):**
```typescript
// api/ai/recommendations.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const { userId, watchHistory, prompt } = await req.json();
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Based on this watch history, recommend 6 movies:
${watchHistory.map((m: any) => `- ${m.title} (${m.genres.join(', ')})`).join('\n')}

User request: ${prompt}

Return JSON: { "recommendations": [{ "title": "Movie Name", "reason": "why" }] }`
    }],
  });
  
  const content = message.content[0].text;
  const json = JSON.parse(content);
  
  return Response.json(json);
}
```

---

## Component Integration

### Hero.tsx

**Before:**
```typescript
const FEATURED_MOVIES: Movie[] = [
  { id: 1, title: "Demonic Slash", ... },
  // ...
];
```

**After:**
```typescript
import { getFeaturedMovies } from '../services/movies';

const Hero: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getFeaturedMovies()
      .then(setFeaturedMovies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <HeroSkeleton />;
  
  // ... rest of component
};
```

---

### Browse.tsx

**Before:**
```typescript
import { trendingNow, newReleases } from '../data/movies';
```

**After:**
```typescript
import { getTrendingMovies, getMoviesByGenre } from '../services/movies';

const Browse: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  
  useEffect(() => {
    if (activeGenre === 'All') {
      getTrendingMovies().then(setMovies);
    } else {
      const genreId = GENRE_IDS[activeGenre];
      getMoviesByGenre(genreId).then(setMovies);
    }
  }, [activeGenre]);
  
  // ... rest of component
};
```

---

### Watchlist.tsx

**Before:**
```typescript
const { watchlist, removeFromWatchlist } = useStore();
```

**After:**
```typescript
import { getWatchlist, removeFromWatchlist as removeAPI } from '../services/watchlist';

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const userId = useAuth().user.id; // Your auth hook
  
  useEffect(() => {
    getWatchlist(userId).then(setWatchlist);
  }, [userId]);
  
  const handleRemove = async (movieId: number) => {
    await removeAPI(userId, movieId);
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
    toast.success('Removed from watchlist');
  };
  
  // ... rest of component
};
```

---

## Migration Checklist

### Phase 1: Setup (Week 1)
- [ ] Get TMDB API key
- [ ] Set up environment variables
- [ ] Create `src/services/tmdb.ts` client
- [ ] Create `src/utils/transformers.ts`
- [ ] Test basic API calls

### Phase 2: Read-Only Data (Week 1-2)
- [ ] Replace Hero featured movies with TMDB
- [ ] Replace Browse trending with TMDB
- [ ] Replace genre rows with TMDB discover
- [ ] Implement search with TMDB
- [ ] Add loading skeletons
- [ ] Add error boundaries

### Phase 3: Backend Setup (Week 2-3)
- [ ] Set up database (PostgreSQL/Supabase)
- [ ] Create user authentication
- [ ] Build watchlist API endpoints
- [ ] Build watch history API endpoints
- [ ] Test endpoints with Postman

### Phase 4: User Features (Week 3-4)
- [ ] Connect Watchlist to backend
- [ ] Implement Continue Watching from DB
- [ ] Save watch progress on video pause
- [ ] Sync across devices

### Phase 5: AI Features (Week 4-5)
- [ ] Set up Claude API
- [ ] Build recommendations endpoint
- [ ] Create AI chat interface
- [ ] Implement "Because You Watched"

### Phase 6: Polish (Week 5-6)
- [ ] Add caching (React Query)
- [ ] Optimize images (lazy loading)
- [ ] Add offline support
- [ ] Performance testing
- [ ] Error handling refinement

---

## Quick Start Example

```typescript
// src/hooks/useMovies.ts
import { useQuery } from '@tanstack/react-query';
import { getFeaturedMovies, getTrendingMovies } from '../services/movies';

export function useFeaturedMovies() {
  return useQuery({
    queryKey: ['featured'],
    queryFn: getFeaturedMovies,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTrendingMovies() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingMovies,
    staleTime: 1000 * 60 * 5,
  });
}
```

**Usage in Component:**
```typescript
const Hero: React.FC = () => {
  const { data: movies, isLoading, error } = useFeaturedMovies();
  
  if (isLoading) return <HeroSkeleton />;
  if (error) return <ErrorState retry={() => window.location.reload()} />;
  
  return <HeroContent movies={movies} />;
};
```

---

## Environment Variables Summary

```bash
# .env.local

# TMDB (The Movie Database)
VITE_TMDB_API_KEY=your_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p

# Your Backend API
VITE_API_BASE_URL=https://your-api.com

# Claude AI (Backend only - never expose in frontend!)
ANTHROPIC_API_KEY=sk-ant-api03-...  # Server-side only!

# Auth (if using Supabase)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

**Ready to ship!** 🚀

Start with Phase 1, replace one component at a time, and gradually migrate from mock to real data.
