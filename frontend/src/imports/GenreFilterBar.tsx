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
              padding: '5px 16px',
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 400,
              whiteSpace: 'nowrap',
              borderRadius: 999,
              border: isActive
                ? '1px solid rgba(139,92,246,0.5)'
                : '1px solid rgba(255,255,255,0.1)',
              background: isActive
                ? 'rgba(139,92,246,0.18)'
                : 'rgba(255,255,255,0.03)',
              color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.55)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.18s ease',
              letterSpacing: isActive ? '0.01em' : '0',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
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