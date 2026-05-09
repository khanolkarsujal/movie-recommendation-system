import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Movie {
  id: number | string;
  title: string;
  badge?: string;
  year?: string | number;
  duration?: string;
  rating?: string | number;
  genres?: string[];
  description?: string;
  thumbnail?: string;
  accent?: string;
  progress?: number;
}

interface StoreState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number | string) => void;
  isInWatchlist: (id: number | string) => boolean;

  heroMovie: Movie | null;
  setHeroMovie: (movie: Movie | null) => void;

  playingMovie: Movie | null;
  setPlayingMovie: (movie: Movie | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  toggleAiDrawer: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => ({
          watchlist: state.watchlist.some((m) => m.id === movie.id)
            ? state.watchlist
            : [...state.watchlist, movie],
        })),
      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== id),
        })),
      isInWatchlist: (id) => get().watchlist.some((m) => m.id === id),

      heroMovie: null,
      setHeroMovie: (movie) => set({ heroMovie: movie }),

      playingMovie: null,
      setPlayingMovie: (movie) => set({ playingMovie: movie }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      aiDrawerOpen: false,
      setAiDrawerOpen: (open) => set({ aiDrawerOpen: open }),
      toggleAiDrawer: () => set((state) => ({ aiDrawerOpen: !state.aiDrawerOpen })),
    }),
    {
      name: 'ott-storage',
      partialize: (state) => ({ watchlist: state.watchlist }),
    }
  )
);
