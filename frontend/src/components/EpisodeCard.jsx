import React, { useState, useCallback, useRef, memo } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GENRE_COLORS } from '../data/movies';

// ─── Constants ────────────────────────────────────────────────────────────────
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #1a0a2e, #2d1b69, #0d0d0d)',
  'linear-gradient(135deg, #16213e, #0f3460, #533483)',
  'linear-gradient(135deg, #200122, #6f0000, #200122)',
  'linear-gradient(135deg, #141e30, #243b55, #1a0a2e)',
];

function ratingColor(r) {
  if (r >= 8.0) return '#22c55e';
  if (r >= 6.5) return '#eab308';
  return '#ef4444';
}

// ─── Genre Dot Badge ─────────────────────────────────────────────────────────
const GenreBadge = memo(({ genre }) => (
  <span className="genre-badge" style={{ borderColor: `${GENRE_COLORS[genre] || '#fff'}30` }}>
    <span
      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: GENRE_COLORS[genre] || '#fff' }}
    />
    {genre}
  </span>
));

// ─── Star Rating (half-star precision) ───────────────────────────────────────
const StarRating = memo(({ rating }) => {
  const MAX = 5;
  const normalized = (rating / 10) * MAX;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} out of 10`}>
      {Array.from({ length: MAX }, (_, i) => {
        const fill = Math.max(0, Math.min(1, normalized - i));
        return (
          <div key={i} className="relative w-3 h-3">
            <span className="absolute inset-0 text-white/20 text-[12px] leading-none">★</span>
            <span
              className="absolute inset-0 text-[12px] leading-none overflow-hidden"
              style={{ width: `${fill * 100}%`, color: ratingColor(rating) }}
            >★</span>
          </div>
        );
      })}
      <span className="text-[11px] text-white/60 ml-1 font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
});

// ─── Image & Video with lazy load + fallback ────────────────────────────────
const CardImage = memo(({ src, alt, gradient, hovered, showVideo }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const showGradient = errored || (!src);
  const MOCK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {!showGradient && (
        <>
          {/* Skeleton while loading */}
          {!loaded && <div className="skeleton absolute inset-0" style={{ borderRadius: 0 }} />}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: loaded ? 1 : 0,
              transform: hovered ? 'scale(1.08)' : 'scale(1.0)',
              transition: 'opacity 0.3s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </>
      )}
      {/* Auto-playing Hover Video */}
      <AnimatePresence>
        {showVideo && (
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            src={MOCK_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ filter: 'brightness(0.85) saturate(1.1)' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

// ─── Main Card ────────────────────────────────────────────────────────────────
function EpisodeCard({ episode, index }) {
  const [hovered, setHovered]     = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hoverTimerRef = useRef(null);

  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const rColor = ratingColor(episode.rating || 7);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    // Start hover timer for video preview
    hoverTimerRef.current = setTimeout(() => {
      setShowVideo(true);
    }, 700);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setShowVideo(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="card-root"
      style={{ height: 'var(--card-h)' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={`${episode.title}, ${episode.duration}`}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {/* ── BG Image / Video / Gradient ── */}
      <CardImage
        src={episode.thumbnail}
        alt={episode.title}
        gradient={gradient}
        hovered={hovered}
        showVideo={showVideo}
      />

      {/* ── Dark Gradient Overlays ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: hovered
            ? 'linear-gradient(to top, rgba(5,5,8,0.98) 0%, rgba(5,5,8,0.80) 50%, rgba(5,5,8,0.2) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* ── Top Badges ── */}
      <div className="absolute top-2.5 left-2.5 z-20 flex gap-1.5">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}
          aria-hidden="true"
        >
          <span className="text-[10px] font-bold text-white">S</span>
        </div>
      </div>

      {!hovered && (
        <div className="absolute top-2.5 right-2.5 z-20 bg-black/60 backdrop-blur-sm rounded-[4px] px-1.5 py-0.5">
          <span className="text-[11px] font-semibold text-white/90">{episode.duration}</span>
        </div>
      )}

      {/* ── Base Content: Title always visible ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3">
        <h3 className="text-[13px] font-bold text-white leading-tight line-clamp-1 drop-shadow-md">
          {episode.title}
        </h3>

        {/* Hover Expansion */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              {/* Rating bar + stars */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-[3px] bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((episode.rating || 7) / 10) * 100}%`,
                      backgroundColor: rColor,
                    }}
                  />
                </div>
                <StarRating rating={episode.rating || 7} />
              </div>

              {/* Metadata row */}
              <div className="flex items-center gap-2 mt-2 text-[11px] text-white/70 font-medium flex-wrap">
                <span className="font-bold" style={{ color: 'var(--green-match)' }}>98% Match</span>
                <span>·</span>
                <span>{episode.year || 2025}</span>
                <span>·</span>
                <span>{episode.duration}</span>
                <span className="border border-white/30 px-1 rounded-[3px] text-white/80 text-[10px]">HD</span>
              </div>

              {/* Genres */}
              {episode.genres?.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {episode.genres.slice(0, 2).map(g => <GenreBadge key={g} genre={g} />)}
                </div>
              )}

              {/* Description */}
              {episode.description && (
                <p className="text-[11px] text-white/55 leading-[1.5] mt-2 line-clamp-2">
                  {episode.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label={`Play ${episode.title}`}
                >
                  <Play size={13} fill="black" className="ml-0.5" />
                </button>
                <button
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0 transition-all hover:bg-white/20 hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="Add to watchlist"
                >
                  <Plus size={14} />
                </button>
                <button
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0 transition-all hover:bg-white/20 hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="Like"
                >
                  <ThumbsUp size={13} />
                </button>
                <button
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0 ml-auto transition-all hover:bg-white/20 hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="More info"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Progress Bar (bottom edge) ── */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10 z-30">
        {episode.progress > 0 && (
          <div
            className="h-full rounded-r-full"
            style={{ width: `${episode.progress}%`, backgroundColor: 'var(--accent)' }}
          />
        )}
      </div>
    </motion.article>
  );
}

export default memo(EpisodeCard);
