import React from 'react';

const GENRES = ['All', 'Action', 'Drama', 'Horror', 'Sci-Fi', 'Comedy', 'Thriller', 'Fantasy', 'Animation'] as const;

type Genre = typeof GENRES[number];

interface GenreFilterBarProps {
  activeGenre: Genre | string;
  setActiveGenre: (genre: Genre | string) => void;
}

const GenreFilterBar: React.FC<GenreFilterBarProps> = ({ activeGenre, setActiveGenre }) => {
  return (
    <div
      className="relative z-[35] flex items-center gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      role="tablist"
      aria-label="Genre filters"
    >
      {GENRES.map((g) => {
        const isActive = activeGenre === g;
        return (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            role="tab"
            aria-selected={isActive}
            aria-label={`Filter by ${g}`}
            style={{
              padding: '6px 20px',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              whiteSpace: 'nowrap',
              borderRadius: 999,
              border: isActive
                ? '1px solid rgba(139,92,246,0.8)'
                : '1px solid rgba(255,255,255,0.15)',
              background: isActive
                ? 'rgba(139,92,246,0.25)'
                : 'rgba(255,255,255,0.05)',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? '0 0 16px rgba(139,92,246,0.4)' : 'none',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              }
            }}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
};

export default GenreFilterBar;