/**
 * SearchExperience Component
 * Advanced search with live suggestions, keyboard navigation, and premium UX
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, TrendingUp, Clock, Film, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../imports/types';

interface SearchExperienceProps {
  movies: Movie[];
  onClose?: () => void;
  autoFocus?: boolean;
}

interface SearchSuggestion {
  type: 'movie' | 'genre' | 'trending' | 'recent';
  label: string;
  movie?: Movie;
}

export const SearchExperience: React.FC<SearchExperienceProps> = ({
  movies,
  onClose,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {}
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    try {
      const updated = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (e) {}
  }, [recentSearches]);

  // Generate suggestions
  const suggestions: SearchSuggestion[] = React.useMemo(() => {
    if (!query || query.length < 2) {
      // Show trending/recent when no query
      const trending: SearchSuggestion[] = [
        { type: 'trending', label: 'Action' },
        { type: 'trending', label: 'Sci-Fi' },
        { type: 'trending', label: 'Horror' },
      ];

      const recent: SearchSuggestion[] = recentSearches.map(s => ({
        type: 'recent' as const,
        label: s,
      }));

      return [...recent, ...trending];
    }

    const q = query.toLowerCase();

    // Search movies
    const matchingMovies = movies
      .filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genres?.some(g => g.toLowerCase().includes(q)) ||
        m.description?.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map(m => ({
        type: 'movie' as const,
        label: m.title,
        movie: m,
      }));

    // Extract genres
    const allGenres = new Set<string>();
    movies.forEach(m => m.genres?.forEach(g => allGenres.add(g)));
    const matchingGenres = Array.from(allGenres)
      .filter(g => g.toLowerCase().includes(q))
      .slice(0, 3)
      .map(g => ({
        type: 'genre' as const,
        label: g,
      }));

    return [...matchingMovies, ...matchingGenres];
  }, [query, movies, recentSearches]);

  const handleSelect = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'movie' && suggestion.movie) {
      saveRecentSearch(suggestion.movie.title);
      navigate(`/watch?title=${encodeURIComponent(suggestion.movie.title)}`);
      onClose?.();
    } else {
      setQuery(suggestion.label);
      saveRecentSearch(suggestion.label);
    }
  }, [navigate, onClose, saveRecentSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(suggestions.length - 1, prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose?.();
        break;
    }
  }, [suggestions, selectedIndex, handleSelect, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film size={16} className="text-white/40" />;
      case 'trending':
        return <TrendingUp size={16} className="text-[var(--brand-purple)]" />;
      case 'recent':
        return <Clock size={16} className="text-white/30" />;
      default:
        return <Search size={16} className="text-white/40" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
          <Search size={24} className="text-white/40" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search titles, people, genres..."
          className="w-full h-16 pl-16 pr-14 bg-[var(--bg-elevated)] border-2 border-white/10
                   focus:border-[var(--brand-purple)] rounded-2xl text-white text-[18px]
                   placeholder-white/30 outline-none transition-all duration-300
                   shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                     bg-white/10 hover:bg-white/20 flex items-center justify-center
                     transition-all outline-none"
            aria-label="Clear search"
          >
            <X size={16} className="text-white/60" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="mt-4 bg-[var(--bg-elevated)] border border-white/10 rounded-2xl
                     overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
          >
            {/* Header */}
            {!query && (
              <div className="px-6 py-4 border-b border-white/5">
                <p className="text-[12px] font-bold uppercase tracking-[2px] text-white/40">
                  {recentSearches.length > 0 ? 'Recent Searches' : 'Trending'}
                </p>
              </div>
            )}

            {/* Results */}
            <div className="max-h-[480px] overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.type}-${suggestion.label}-${index}`}
                  onClick={() => handleSelect(suggestion)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`
                    w-full flex items-center gap-4 px-6 py-4 text-left
                    transition-all outline-none
                    ${index === selectedIndex
                      ? 'bg-[var(--brand-purple)]/20 border-l-4 border-[var(--brand-purple)]'
                      : 'hover:bg-white/5 border-l-4 border-transparent'
                    }
                    ${index < suggestions.length - 1 ? 'border-b border-white/5' : ''}
                  `}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getSuggestionIcon(suggestion.type)}
                  </div>

                  {/* Thumbnail for movies */}
                  {suggestion.movie?.thumbnail && (
                    <div className="w-16 h-9 rounded overflow-hidden flex-shrink-0 bg-white/5">
                      <img
                        src={suggestion.movie.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex-grow min-w-0">
                    <p className="text-white font-medium text-[15px] truncate">
                      {suggestion.label}
                    </p>
                    {suggestion.movie && (
                      <div className="flex items-center gap-2 text-[12px] text-white/40 mt-0.5">
                        {suggestion.movie.year && <span>{suggestion.movie.year}</span>}
                        {suggestion.movie.genres && suggestion.movie.genres[0] && (
                          <>
                            <span>•</span>
                            <span>{suggestion.movie.genres[0]}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  {suggestion.type === 'trending' && (
                    <div className="flex-shrink-0 px-2 py-1 bg-[var(--brand-purple)]/20
                                  border border-[var(--brand-purple)]/40 rounded-full">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-purple)]">
                        Trending
                      </p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/5">
              <p className="text-[11px] text-white/30">
                Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">↑</kbd>{' '}
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">↓</kbd> to navigate,{' '}
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">Enter</kbd> to select
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      {query.length >= 2 && suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-12 text-center bg-[var(--bg-elevated)] border border-white/10 rounded-2xl"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Search size={32} className="text-white/20" />
          </div>
          <h3 className="text-white font-semibold text-[16px] mb-2">
            No results for "{query}"
          </h3>
          <p className="text-white/40 text-[14px]">
            Try different keywords or browse our categories
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchExperience;
