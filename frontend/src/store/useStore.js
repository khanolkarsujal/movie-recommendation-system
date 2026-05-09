import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // ─── Watchlist ──────────────────────────────────────────────────────────
      watchlist: [],
      addToWatchlist: (movie) => {
        if (get().isInWatchlist(movie.id)) return;
        set((state) => ({ watchlist: [...state.watchlist, movie] }));
      },
      removeFromWatchlist: (id) =>
        set((state) => ({ watchlist: state.watchlist.filter((m) => m.id !== id) })),
      isInWatchlist: (id) => get().watchlist.some((m) => m.id === id),

      // ─── Currently Playing ──────────────────────────────────────────────────
      playingMovie: null,
      setPlayingMovie: (movie) => set({ playingMovie: movie }),

      // ─── Search ─────────────────────────────────────────────────────────────
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // ─── AI Drawer ──────────────────────────────────────────────────────────
      aiDrawerOpen: false,
      toggleAiDrawer: () => set((state) => ({ aiDrawerOpen: !state.aiDrawerOpen })),
      closeAiDrawer: () => set({ aiDrawerOpen: false }),
    }),
    {
      name: 'streaming-platform-store',
      partialize: (state) => ({ watchlist: state.watchlist }),
    }
  )
);

export default useStore;
