import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Plus, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import MovieModal from './MovieModal';
import { GENRE_COLORS } from '../data/movies';

// ─── Featured Carousel Items ────────────────────────────────────────────────
const CAROUSEL_ITEMS = [
  {
    id: 'c1',
    title: 'Eclipse Hunters',
    badge: 'EDITOR\'S CHOICE',
    year: 2025,
    duration: '1h 50m',
    rating: 8.6,
    match: '96% Match',
    genres: ['Sci-Fi', 'Drama'],
    description: 'In a future where the sun has gone permanently dark, a team of scavengers discovers a device that could reignite the dying star — and the enemies who want it destroyed.',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1400&auto=format&fit=crop',
    accent: '#3b82f6',
    progress: 0,
  },
  {
    id: 'c2',
    title: 'Blood Covenant',
    badge: 'CRITICALLY ACCLAIMED',
    year: 2027,
    duration: '3 Seasons',
    rating: 8.7,
    match: '92% Match',
    genres: ['Action', 'Horror'],
    description: 'Betrayed by his own order, a templar knight forms a dark pact with a vampire queen to exact revenge on the king who destroyed everything he loved.',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1400&auto=format&fit=crop',
    accent: '#b91c1c',
    progress: 35,
  },
  {
    id: 'c3',
    title: 'Neon Genesis',
    badge: 'GLOBAL HIT',
    year: 2024,
    duration: '1h 38m',
    rating: 8.5,
    match: '89% Match',
    genres: ['Cyberpunk', 'Thriller'],
    description: 'When the city\'s central AI goes rogue, a lone hacker must infiltrate the heavily guarded Nexus tower before midnight to prevent a digital apocalypse.',
    thumbnail: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1400&auto=format&fit=crop',
    accent: '#10b981',
    progress: 0,
  },
  {
    id: 'c4',
    title: 'Shadow Realm',
    badge: 'NEW RELEASE',
    year: 2026,
    duration: '2h 15m',
    rating: 8.3,
    match: '94% Match',
    genres: ['Fantasy', 'Dark'],
    description: 'A rogue assassin must navigate a deadly underworld where shadows come to life and ancient magic dictates the rules of survival and death.',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1400&auto=format&fit=crop',
    accent: '#6d28d9',
    progress: 0,
  },
  {
    id: 'c5',
    title: 'The Last Rune',
    badge: 'AWARD WINNER',
    year: 2027,
    duration: '2h 01m',
    rating: 9.0,
    match: '98% Match',
    genres: ['Fantasy', 'Adventure'],
    description: 'The final rune holds the power to unmake all of reality. One guardian stands between its keeper and an ancient god who wants it — at any cost.',
    thumbnail: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?q=80&w=1400&auto=format&fit=crop',
    accent: '#f59e0b',
    progress: 80,
  },
];

function ratingColor(r) {
  if (r >= 8.0) return '#22c55e';
  if (r >= 6.5) return '#eab308';
  return '#ef4444';
}

// ─── Dot Indicators ──────────────────────────────────────────────────────────
const Indicators = memo(({ count, current, paused, onSelect }) => (
  <div className="flex items-center justify-center gap-2">
    {Array.from({ length: count }, (_, i) => {
      const active = i === current;
      return (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          className="relative overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-white/25 hover:bg-white/40 outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ width: active ? 32 : 8, height: 8 }}
        >
          {active && !paused && (
            <div
              className="absolute top-0 left-0 bottom-0 bg-white"
              style={{ animation: 'fillBar 6s linear forwards' }}
            />
          )}
          {active && paused && (
            <div className="absolute inset-0 bg-white" />
          )}
        </button>
      );
    })}
  </div>
));

const getImg = (path) => path?.startsWith('http') ? path : `https://image.tmdb.org/t/p/w500${path}`;

// ─── Single Carousel Card ────────────────────────────────────────────────────
const CarouselCard = memo(({ item, position, onClick }) => {
  const isCenter = position === 0;
  const isLeft   = position === -1;
  const isRight  = position === 1;
  const isHidden = Math.abs(position) > 1;

  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();
  const inWatchlist = isInWatchlist(item.id);

  if (isHidden) return null;

  const scale   = isCenter ? 1 : 0.82;
  const opacity = isCenter ? 1 : 0.45;
  const zIndex  = isCenter ? 10 : 5;
  const x       = isCenter ? '0%' : isLeft ? '-72%' : '72%';

  return (
    <motion.div
      layout
      animate={{ scale, opacity, x }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={isCenter ? onClick : undefined}
      className="absolute inset-0 rounded-2xl overflow-hidden cursor-pointer"
      style={{ zIndex, transformOrigin: 'center center' }}
    >
      {/* Thumbnail */}
      <img
        src={getImg(item.thumbnail)}
        alt={item.title}
        className="w-full h-full object-cover"
        style={{
          filter: isCenter ? 'brightness(0.75) saturate(1.1)' : 'brightness(0.4) saturate(0.7)',
          transition: 'filter 0.6s ease',
        }}
        loading="lazy"
        onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id || 'carousel'}/1200/600` }}
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.6) 35%, rgba(5,5,8,0.15) 65%, transparent 100%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.9) 0%, transparent 40%)' }}
      />

      {/* Ambient glow */}
      {isCenter && (
        <div
          className="absolute bottom-0 left-0 w-[50%] h-[60%] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at bottom left, ${item.accent}25, transparent 70%)`, transition: 'background 1s ease' }}
        />
      )}

      {/* Content — only visible on center card */}
      {isCenter && (
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: item.accent }}>S</div>
            <span className="text-[12px] font-bold text-white/80 tracking-[1.5px] uppercase">{item.badge}</span>
          </div>

          {/* Title */}
          <h3 className="text-[2.5rem] md:text-[3.5rem] font-black text-white leading-[1] tracking-[-0.03em] mb-4 max-w-[500px]" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>
            {item.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-[13px] font-medium mb-4 flex-wrap">
            <span className="font-bold px-2 py-0.5 rounded-[4px] text-white text-[13px]" style={{ backgroundColor: 'var(--green-match)' }}>{item.match}</span>
            <span className="text-white/70">{item.year}</span>
            <span className="text-white/50">·</span>
            <span className="text-white/70">{item.duration}</span>
            <span className="text-white/50">·</span>
            <div className="flex items-center gap-1">
              <Star size={12} style={{ color: ratingColor(item.rating), fill: ratingColor(item.rating) }} />
              <span className="font-bold" style={{ color: ratingColor(item.rating) }}>{item.rating.toFixed(1)}</span>
            </div>
            <div className="flex gap-1.5 ml-1">
              {item.genres.map(g => (
                <span key={g} className="text-[11px] px-2 py-0.5 rounded-full border" style={{ color: GENRE_COLORS[g] || '#fff', borderColor: `${GENRE_COLORS[g] || '#fff'}40`, backgroundColor: `${GENRE_COLORS[g] || '#fff'}12` }}>{g}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-[14px] md:text-[15px] text-white/65 leading-[1.65] max-w-[480px] mb-6 hidden md:block">
            {item.description}
          </p>

          {/* Progress */}
          {item.progress > 0 && (
            <div className="max-w-[480px] mb-5">
              <div className="flex justify-between text-[11px] text-white/40 mb-1.5">
                <span>Continue Watching</span>
                <span>{item.progress}%</span>
              </div>
              <div className="h-1 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.progress}%`, backgroundColor: 'var(--accent)' }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2.5 bg-white text-black px-6 py-3 rounded-lg font-bold text-[15px] transition-all hover:bg-white/90 hover:scale-[1.03] active:scale-[0.97] shadow-[0_8px_24px_rgba(255,255,255,0.15)] outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={(e) => { e.stopPropagation(); navigate(`/watch?title=${encodeURIComponent(item.title)}`) }}
              aria-label={`Play ${item.title}`}
            >
              <Play size={16} fill="black" />
              {item.progress > 0 ? 'Continue' : 'Play Now'}
            </button>
            <button
              className={`flex items-center justify-center gap-2 border text-white px-5 py-3 rounded-lg font-semibold text-[14px] transition-all hover:-translate-y-[2px] outline-none focus-visible:ring-4 focus-visible:ring-white/50 backdrop-blur-md ${
                inWatchlist
                  ? 'bg-[var(--accent)]/20 border-[var(--accent)]/50 text-[var(--accent)]'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (inWatchlist) {
                  removeFromWatchlist(item.id);
                  toast('Removed from Watchlist', { icon: '🗑️', style: { background: '#1a1a22', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', borderRadius: '10px' } });
                } else {
                  addToWatchlist({ id: item.id, title: item.title, year: item.year, thumbnail: item.thumbnail, duration: item.duration, genres: item.genres });
                  toast.success('Added to Watchlist ✓', { style: { background: '#1a1a22', color: '#fff', border: '1px solid rgba(139,92,246,0.4)', fontSize: '14px', borderRadius: '10px' }, iconTheme: { primary: '#8b5cf6', secondary: '#fff' } });
                }
              }}
              aria-label="Add to watchlist"
            >
              <Heart size={16} fill={inWatchlist ? 'currentColor' : 'none'} />
              {inWatchlist ? 'Saved' : 'Watchlist'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
});

// ─── Main Carousel Component ──────────────────────────────────────────────────
function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [modal,   setModal]   = useState(null);
  const N                     = CAROUSEL_ITEMS.length;

  // Auto-advance every 6s
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % N), 6000);
    return () => clearInterval(t);
  }, [paused, N]);

  const prev = useCallback(() => setCurrent(p => (p - 1 + N) % N), [N]);
  const next = useCallback(() => setCurrent(p => (p + 1) % N), [N]);

  // Drag to swipe
  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  }, [next, prev]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  return (
    <section
      className="relative w-full px-5 md:px-[80px] mb-12"
      aria-label="Featured content carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] block mb-1" style={{ color: 'var(--accent)' }}>HANDPICKED FOR YOU</span>
          <h2 className="text-[20px] font-bold text-white">Featured Picks</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} aria-label="Previous" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Next" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel Stage */}
      <motion.div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ height: 'clamp(320px, 45vw, 520px)', cursor: 'grab' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {CAROUSEL_ITEMS.map((item, i) => {
          const pos = ((i - current + N) % N > N / 2)
            ? ((i - current + N) % N) - N
            : (i - current + N) % N;
          return (
            <CarouselCard
              key={item.id}
              item={item}
              position={pos}
              onClick={() => setModal(item)}
            />
          );
        })}
      </motion.div>

      {/* Dot Indicators */}
      <div className="mt-5">
        <Indicators count={N} current={current} paused={paused} onSelect={setCurrent} />
      </div>

      {/* Modal */}
      {modal && <MovieModal movie={modal} onClose={() => setModal(null)} />}
    </section>
  );
}

export default memo(FeaturedCarousel);
