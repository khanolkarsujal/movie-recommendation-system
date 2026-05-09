# Migration Example: Mock Data → TMDB API

Step-by-step example of migrating a component from mock data to real TMDB API.

---

## Example: Hero Component Migration

### ❌ BEFORE (Mock Data)

```typescript
// src/imports/Hero.tsx
import React, { useState } from 'react';

const FEATURED_MOVIES = [
  {
    id: 1,
    title: "Demonic Slash",
    year: "2028",
    duration: "82 Seasons",
    rating: "98%",
    description: "When a small town...",
    image: "https://picsum.photos/1920/1080",
  },
  // ... more hardcoded movies
];

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const movie = FEATURED_MOVIES[activeIndex];

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
    </div>
  );
};
```

---

### ✅ AFTER (TMDB API with React Query)

```typescript
// src/imports/Hero.tsx
import React, { useState } from 'react';
import { useFeaturedMovies } from '../hooks/useMovieData';
import { Skeleton } from './Skeleton';
import { ErrorState } from './ErrorState';

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Fetch featured movies with automatic caching & refetching
  const { data: movies, isLoading, error, refetch } = useFeaturedMovies();

  // Loading state
  if (isLoading) {
    return <HeroSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        message="Failed to load featured movies"
        onRetry={() => refetch()}
      />
    );
  }

  // No data state
  if (!movies || movies.length === 0) {
    return <EmptyState />;
  }

  const movie = movies[activeIndex];

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      {/* Everything else stays the same! */}
    </div>
  );
};
```

---

## Example Components for States

### Loading Skeleton

```typescript
// src/components/HeroSkeleton.tsx
export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative h-screen bg-[var(--bg-page)]">
      <div className="absolute bottom-[20%] left-[60px] max-w-[520px]">
        {/* Badge skeleton */}
        <div className="h-5 w-40 bg-white/10 rounded animate-pulse mb-3" />
        
        {/* Title skeleton */}
        <div className="h-16 w-full bg-white/10 rounded animate-pulse mb-4" />
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <div className="h-12 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-12 w-32 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};
```

### Error State

```typescript
// src/components/ErrorState.tsx
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
      <p className="text-white/60 mb-6 max-w-md">
        We couldn't load the content. Please check your connection and try again.
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          ↻ Try Again
        </button>
      )}
    </div>
  );
};
```

---

## Browse Page Migration

### ❌ BEFORE

```typescript
// src/imports/Browse.tsx
import { trendingNow, newReleases } from '../data/movies';

const Browse: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState('All');
  
  const movies = activeGenre === 'All' ? trendingNow : newReleases;

  return (
    <div>
      <GenreFilterBar active={activeGenre} onChange={setActiveGenre} />
      <div className="grid">
        {movies.map(movie => <Card key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
};
```

### ✅ AFTER

```typescript
// src/imports/Browse.tsx
import { useTrendingMovies, useMoviesByGenre } from '../hooks/useMovieData';

const Browse: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<'All' | keyof typeof GENRE_IDS>('All');
  
  // Fetch based on active genre
  const { data: trendingMovies } = useTrendingMovies('day', {
    enabled: activeGenre === 'All',
  });
  
  const { data: genreMovies } = useMoviesByGenre(activeGenre as any, {
    enabled: activeGenre !== 'All',
  });
  
  const movies = activeGenre === 'All' ? trendingMovies : genreMovies;

  return (
    <div>
      <GenreFilterBar active={activeGenre} onChange={setActiveGenre} />
      
      {!movies ? (
        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid">
          {movies.map(movie => <Card key={movie.id} movie={movie} />)}
        </div>
      )}
    </div>
  );
};
```

---

## Search with Debouncing

```typescript
// src/imports/Search.tsx
import { useState, useEffect } from 'react';
import { useSearchMovies } from '../hooks/useMovieData';
import { useDebounce } from '../hooks/useDebounce';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500); // Wait 500ms after typing stops
  
  const { data: results, isLoading } = useSearchMovies(debouncedQuery);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="w-full px-4 py-3 bg-[var(--bg-input)] rounded-lg"
      />
      
      {isLoading && <p>Searching...</p>}
      
      {results && results.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-6">
          {results.map(movie => <Card key={movie.id} movie={movie} />)}
        </div>
      )}
      
      {results && results.length === 0 && query && (
        <p className="text-white/60 text-center mt-12">
          No results for "{query}"
        </p>
      )}
    </div>
  );
};

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## App Setup with React Query Provider

```typescript
// src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../imports/Home';
import Browse from '../imports/Browse';

// Create query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2, // Retry failed requests 2 times
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          {/* ... other routes */}
        </Routes>
      </BrowserRouter>
      
      {/* DevTools (only in development) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## Installation

```bash
# Install React Query
pnpm add @tanstack/react-query @tanstack/react-query-devtools

# Optional: Install Axios for better HTTP client
pnpm add axios
```

---

## Environment Setup

```bash
# .env.local
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

Get your API key:
1. Sign up at https://www.themoviedb.org/
2. Go to Settings → API
3. Request an API key (it's free!)
4. Copy the "API Read Access Token" or "API Key (v3 auth)"

---

## Testing the Integration

### 1. Test TMDB Connection
```typescript
// Test in browser console
import { tmdbClient } from './services/tmdb';

tmdbClient.getPopularMovies(1).then(console.log);
// Should log: { page: 1, results: [...], total_pages: ... }
```

### 2. Test Transformers
```typescript
import { transformTMDBToMovie } from './utils/transformers';

const tmdbMovie = { id: 1, title: "Test", vote_average: 8.5, ... };
const movie = transformTMDBToMovie(tmdbMovie);
console.log(movie);
// Should log: { id: 1, title: "Test", rating: "85%", ... }
```

### 3. Test in Component
```typescript
// Add to Home.tsx temporarily
useEffect(() => {
  getFeaturedMovies()
    .then(movies => console.log('Featured:', movies))
    .catch(err => console.error('Error:', err));
}, []);
```

---

## Common Errors & Solutions

### Error: "TMDB API Error: 401"
**Solution:** Check your API key in `.env.local`

### Error: "Cannot find module '@tanstack/react-query'"
**Solution:** Run `pnpm add @tanstack/react-query`

### Error: Images not loading
**Solution:** Check `tmdbClient.getImageUrl()` is being called correctly

### Error: "Too many requests"
**Solution:** TMDB has rate limits. Add caching with React Query to reduce API calls.

---

## Next Steps

1. ✅ Replace Hero featured movies
2. ✅ Replace Browse trending movies  
3. ✅ Add genre filtering
4. ✅ Implement search
5. ✅ Add loading states
6. ✅ Add error handling
7. 🔄 Backend: Watchlist API
8. 🔄 Backend: Watch history API
9. 🔄 Backend: User preferences

---

**You're ready to migrate!** 🚀

Start with one component, test it works, then move to the next. The mock data will stay as fallback during development.
