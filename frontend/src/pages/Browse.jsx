import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import EpisodeCard from '../components/EpisodeCard';
import { trendingNow, newReleases, continueWatching } from '../data/movies';

const ALL_CONTENT = [...trendingNow, ...newReleases, ...continueWatching].filter(
  (item, idx, self) => self.findIndex((t) => t.id === item.id) === idx
);

const GENRES = ['All', 'Action', 'Sci-Fi', 'Fantasy', 'Horror', 'Anime', 'Thriller', 'Adventure', 'Cyberpunk', 'Dark'];
const YEARS  = ['All', '2028', '2027', '2026', '2025', '2024'];
const SORTS  = ['Popularity', 'Rating ↑', 'Newest', 'Oldest'];

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all duration-200 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
        active
          ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_12px_var(--accent-glow)]'
          : 'border-white/15 text-white/60 hover:text-white hover:border-white/30 bg-transparent'
      }`}
    >
      {label}
    </button>
  );
}

export default function Browse() {
  const [genre, setGenre]   = useState('All');
  const [year, setYear]     = useState('All');
  const [sort, setSort]     = useState('Popularity');
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = ALL_CONTENT;
    if (genre !== 'All') list = list.filter((m) => m.genres?.includes(genre));
    if (year  !== 'All') list = list.filter((m) => String(m.year) === year);
    switch (sort) {
      case 'Rating ↑': list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'Newest':   list = [...list].sort((a, b) => (b.year || 0) - (a.year || 0)); break;
      case 'Oldest':   list = [...list].sort((a, b) => (a.year || 0) - (b.year || 0)); break;
      default: break; // Popularity = default order
    }
    return list;
  }, [genre, year, sort]);

  const hasFilters = genre !== 'All' || year !== 'All';

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-[var(--row-padding)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-white mb-1">Browse</h1>
        <p className="text-white/40 text-[15px]">{filtered.length} titles available</p>
      </motion.div>

      {/* Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Genre chips */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/30 font-bold mb-3 flex items-center gap-2">
            <Filter size={12} /> Genre
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <FilterChip key={g} label={g} active={genre === g} onClick={() => setGenre(g)} />
            ))}
          </div>
        </div>

        {/* Year + Sort row */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/30 font-bold mb-3">Year</p>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <FilterChip key={y} label={y} active={year === y} onClick={() => setYear(y)} />
              ))}
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="relative ml-auto self-end">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-[13px] font-semibold transition-all outline-none"
            >
              <SlidersHorizontal size={13} />
              {sort}
              <ChevronDown size={13} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] bg-[#111116] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl min-w-[160px]">
                {SORTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSort(s); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                      sort === s ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active filters clear */}
        {hasFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => { setGenre('All'); setYear('All'); }}
            className="flex items-center gap-1.5 text-[12px] text-white/50 hover:text-white transition-colors"
          >
            <X size={12} /> Clear filters
          </motion.button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 mb-8" />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2">No titles found</h2>
          <p className="text-white/40">Try adjusting your filters</p>
        </div>
      ) : (
        <motion.div
          key={`${genre}-${year}-${sort}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, var(--card-w))' }}
        >
          {filtered.map((item, i) => (
            <EpisodeCard key={item.id} episode={item} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
