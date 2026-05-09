import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  Check,
  Heart,
  Info,
  X,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Episode } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EpisodeRowProps {
  title: string;
  label?: string;
  episodes: Episode[];
  isContinueWatching?: boolean;
  onSeeAll?: () => void;
}

interface PopupState {
  episode: Episode;
  top: number;
  left: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const POPUP_W = 300;
const POPUP_H = 260;
const HOVER_DELAY = 450;
const LEAVE_DELAY = 120;

function matchColor(score: number) {
  if (score >= 75) return '#46d369';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function calcPosition(cardEl: HTMLElement): { top: number; left: number } {
  const rect = cardEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = rect.left + rect.width / 2 - POPUP_W / 2;
  left = Math.max(8, Math.min(left, vw - POPUP_W - 8));

  const spaceBelow = vh - rect.bottom;
  let top =
    spaceBelow >= POPUP_H + 8
      ? rect.bottom + 6
      : rect.top - POPUP_H - 6;

  top = Math.max(8, Math.min(top, vh - POPUP_H - 8));
  return { top, left };
}

function formatProgress(progress: number) {
  const remaining = Math.round((100 - progress) / 100 * 90);
  return `${remaining} min left`;
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="flex-shrink-0 w-[260px]">
    <div
      className="w-full aspect-video rounded-[4px] mb-2"
      style={{
        background:
          'linear-gradient(90deg,#1a1a1a 25%,#252525 50%,#1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s linear infinite',
      }}
    />
    <div
      className="h-3 w-3/4 rounded mb-1.5"
      style={{ background: '#1f1f1f' }}
    />
    <div
      className="h-2.5 w-1/2 rounded"
      style={{ background: '#1a1a1a' }}
    />
  </div>
);

// ─── Hover Popup (portal) ─────────────────────────────────────────────────────

interface HoverPopupProps {
  episode: Episode;
  top: number;
  left: number;
  onClose: () => void;
  onPlay: (ep: Episode) => void;
  isContinueWatching: boolean;
}

const HoverPopup: React.FC<HoverPopupProps> = ({
  episode,
  top,
  left,
  onClose,
  onPlay,
  isContinueWatching,
}) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [liked, setLiked] = useState(false);
  const matchScore = Math.round((episode.rating ?? 7) * 10);
  const color = matchColor(matchScore);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: 6 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={onClose.bind(null)} // keep open while inside
      onMouseLeave={onClose}
      style={{
        position: 'fixed',
        top,
        left,
        width: POPUP_W,
        zIndex: 99999,
        borderRadius: 10,
        overflow: 'hidden',
        background: '#1c1c1c',
        boxShadow: '0 12px 48px rgba(0,0,0,0.85)',
        border: '1px solid rgba(255,255,255,0.06)',
        pointerEvents: 'auto',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 168, overflow: 'hidden' }}>
        <img
          src={episode.thumbnail}
          alt={episode.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(28,28,28,0.9) 0%, transparent 55%)',
          }}
        />

        {/* Continue watching bar */}
        {isContinueWatching && episode.progress !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${episode.progress}%`,
                background: '#8b5cf6',
                borderRadius: 2,
              }}
            />
          </div>
        )}

        {/* Title overlay */}
        <p
          style={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          {episode.title}
        </p>
      </div>

      {/* Info section */}
      <div style={{ padding: '10px 12px 12px' }}>
        {/* Match row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
            fontSize: 12,
          }}
        >
          <span style={{ color, fontWeight: 700 }}>{matchScore}% Match</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
          {episode.episodeNumber && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>
                S{episode.seasonNumber} E{episode.episodeNumber}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            </>
          )}
          {episode.duration && (
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>
              {episode.duration}
            </span>
          )}
          <span
            style={{
              marginLeft: 'auto',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 3,
              padding: '1px 5px',
              fontSize: 10,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            HD
          </span>
        </div>

        {/* Match bar */}
        <div
          style={{
            height: 2,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 1,
            marginBottom: 10,
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchScore}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', background: color, borderRadius: 1 }}
          />
        </div>

        {/* Continue watching info */}
        {isContinueWatching && episode.progress !== undefined && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: 8,
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <Clock size={11} />
            <span>{formatProgress(episode.progress)}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {/* Play */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(episode);
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = '#fff')
            }
            aria-label="Play"
          >
            <Play size={13} fill="#000" color="#000" />
          </button>

          {/* Watchlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setInWatchlist((v) => !v);
            }}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: inWatchlist
                ? 'rgba(139,92,246,0.2)'
                : 'transparent',
              border: `1.5px solid ${inWatchlist ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.35)'
                }`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
            aria-label={inWatchlist ? 'Remove from list' : 'Add to list'}
          >
            {inWatchlist ? (
              <Check size={13} color="#8b5cf6" />
            ) : (
              <Plus size={13} color="rgba(255,255,255,0.8)" />
            )}
          </button>

          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: liked ? 'rgba(239,68,68,0.15)' : 'transparent',
              border: `1.5px solid ${liked ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.35)'
                }`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart
              size={13}
              color={liked ? '#ef4444' : 'rgba(255,255,255,0.8)'}
              fill={liked ? '#ef4444' : 'none'}
            />
          </button>

          {/* More info — pushed right */}
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 'auto',
            }}
            aria-label="More info"
          >
            <Info size={13} color="rgba(255,255,255,0.8)" />
          </button>
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

// ─── Episode Card ─────────────────────────────────────────────────────────────

interface EpisodeCardProps {
  episode: Episode;
  index: number;
  isContinueWatching: boolean;
  onPlay: (ep: Episode) => void;
  onShowPopup: (ep: Episode, el: HTMLElement) => void;
  onHidePopup: () => void;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  index,
  isContinueWatching,
  onPlay,
  onShowPopup,
  onHidePopup,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = useCallback(() => {
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => {
      if (cardRef.current) onShowPopup(episode, cardRef.current);
    }, HOVER_DELAY);
  }, [episode, onShowPopup]);

  const handleLeave = useCallback(() => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(onHidePopup, LEAVE_DELAY);
  }, [onHidePopup]);

  useEffect(() => () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => onPlay(episode)}
      className="flex-shrink-0 w-[260px] cursor-pointer group/card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPlay(episode)}
      aria-label={`Play ${episode.title}`}
    >
      {/* Thumbnail container */}
      <div
        style={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          aspectRatio: '16/9',
          background: '#1c1c1c',
          marginBottom: 8,
        }}
        className="group-hover/card:brightness-110 transition-[filter] duration-300"
      >
        <img
          src={episode.thumbnail}
          alt={episode.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.35s ease',
          }}
          className="group-hover/card:scale-[1.06]"
          loading={index < 4 ? 'eager' : 'lazy'}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hover play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'scale(0.85)',
              transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            className="group-hover/card:scale-100"
          >
            <Play size={16} fill="white" color="white" />
          </div>
        </div>

        {/* Watch progress bar */}
        {isContinueWatching && episode.progress !== undefined && (
          <>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'rgba(255,255,255,0.15)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 3,
                width: `${episode.progress}%`,
                background: '#8b5cf6',
                borderRadius: '0 2px 2px 0',
              }}
            />
          </>
        )}

        {/* Continue watching time badge */}
        {isContinueWatching && episode.progress !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 10,
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Clock size={9} />
            {formatProgress(episode.progress)}
          </div>
        )}
      </div>

      {/* Card text — minimal, just title + meta */}
      <div>
        <p
          style={{
            margin: '0 0 3px',
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}
        >
          {episode.title}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: 'rgba(255,255,255,0.38)',
          }}
        >
          {episode.episodeNumber && (
            <span>
              S{episode.seasonNumber}·E{episode.episodeNumber}
            </span>
          )}
          {episode.duration && (
            <>
              {episode.episodeNumber && (
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              )}
              <span>{episode.duration}</span>
            </>
          )}
          {episode.rating && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span style={{ color: '#46d369' }}>
                ★ {episode.rating}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main EpisodeRow ──────────────────────────────────────────────────────────

const EpisodeRow: React.FC<EpisodeRowProps> = ({
  title,
  label,
  episodes,
  isContinueWatching = false,
  onSeeAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [rowHovered, setRowHovered] = useState(false);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const popupLeaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const rowId = useId();

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 10
    );
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -(el.clientWidth * 0.75) : el.clientWidth * 0.75,
      behavior: 'smooth',
    });
  }, []);

  const handlePlay = useCallback(
    (episode: Episode) => {
      navigate(`/watch?title=${encodeURIComponent(episode.title)}`);
    },
    [navigate]
  );

  const handleShowPopup = useCallback(
    (episode: Episode, el: HTMLElement) => {
      clearTimeout(popupLeaveTimer.current);
      setPopup({ episode, ...calcPosition(el) });
    },
    []
  );

  const handleHidePopup = useCallback(() => {
    popupLeaveTimer.current = setTimeout(
      () => setPopup(null),
      LEAVE_DELAY
    );
  }, []);

  const keepPopupOpen = useCallback(() => {
    clearTimeout(popupLeaveTimer.current);
  }, []);

  // Inject shimmer keyframes once
  useEffect(() => {
    const id = 'episode-row-shimmer';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const isEmpty = episodes.length === 0;

  return (
    <section
      className="relative"
      style={{ marginBottom: 36, paddingBottom: 4 }}
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
      aria-label={title}
    >
      {/* ── Section header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 60px',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {label && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#8b5cf6',
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          )}
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: '#e5e5e5',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
        </div>

        {onSeeAll && (
          <button
            onClick={onSeeAll}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: '#8b5cf6',
              opacity: rowHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 0',
              whiteSpace: 'nowrap',
            }}
            tabIndex={rowHovered ? 0 : -1}
          >
            See All
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* ── Cards + scroll ── */}
      <div style={{ position: 'relative' }}>
        {/* Left arrow */}
        <AnimatePresence>
          {canScrollLeft && rowHovered && (
            <motion.button
              key="left-arrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 32,
                width: 60,
                zIndex: 20,
                background:
                  'linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.6) 60%, transparent 100%)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: 8,
              }}
            >
              <ChevronLeft size={28} color="white" strokeWidth={2} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            overflowY: 'visible',
            scrollbarWidth: 'none',
            padding: '4px 60px 28px',
          }}
          className="scrollbar-hide"
          role="list"
          aria-label={`${title} episodes`}
        >
          {isEmpty
            ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
            : episodes.map((episode, i) => (
              <div key={episode.id} role="listitem">
                <EpisodeCard
                  episode={episode}
                  index={i}
                  isContinueWatching={isContinueWatching}
                  onPlay={handlePlay}
                  onShowPopup={handleShowPopup}
                  onHidePopup={handleHidePopup}
                />
              </div>
            ))}
        </div>

        {/* Right arrow */}
        <AnimatePresence>
          {canScrollRight && rowHovered && (
            <motion.button
              key="right-arrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 32,
                width: 60,
                zIndex: 20,
                background:
                  'linear-gradient(to left, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.6) 60%, transparent 100%)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 8,
              }}
            >
              <ChevronRight size={28} color="white" strokeWidth={2} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Portal hover popup ── */}
      <AnimatePresence>
        {popup && (
          <div
            onMouseEnter={keepPopupOpen}
            onMouseLeave={handleHidePopup}
            style={{ position: 'fixed', zIndex: 99999 }}
          >
            <HoverPopup
              episode={popup.episode}
              top={popup.top}
              left={popup.left}
              onClose={handleHidePopup}
              onPlay={handlePlay}
              isContinueWatching={isContinueWatching}
            />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EpisodeRow;