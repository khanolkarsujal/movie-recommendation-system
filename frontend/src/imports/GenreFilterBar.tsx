import React from 'react';

const GENRES = ['All', 'Action', 'Drama', 'Horror', 'Sci-Fi', 'Comedy', 'Thriller', 'Fantasy', 'Animation'] as const;

type Genre = typeof GENRES[number];

interface GenreFilterBarProps {
  activeGenre: Genre | string;
  setActiveGenre: (genre: Genre | string) => void;
}

const GenreFilterBar: React.FC<GenreFilterBarProps> = ({ activeGenre, setActiveGenre }) => {
  return (
    <div className="relative z-[35] px-8 md:px-16 pt-8 pb-6" style={{ marginTop: '-160px' }}>
      {/* Discover Title */}
      <h1 className="text-white text-[32px] font-bold tracking-tight mb-6">
        Discover
      </h1>

      {/* Genre Filters */}
      <div
        className="flex items-center gap-3 overflow-x-auto no-scrollbar"
        role="tablist"
        aria-label="Genre filters"
      >
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            role="tab"
            aria-selected={activeGenre === g}
            aria-label={`Filter by ${g}`}
            className={`px-[16px] py-[7px] text-[13px] font-medium whitespace-nowrap rounded-[20px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeGenre === g
                ? 'bg-[#8b5cf6] text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
                : 'bg-transparent text-white/70 border border-white/20 hover:border-white/40 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilterBar;