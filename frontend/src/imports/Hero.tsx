import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Play,
  Plus,
  Check,
  Info,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useStore } from '../store';
import type { Movie } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE_CINEMA = [0.22, 1, 0.36, 1] as const;
const ADVANCE_MS = 8000;
const VIDEO_DELAY = 2200;

const FEATURED: Movie[] = [
  {
    id: 1,
    title: 'Demonic Slash',
    badge: 'PLATFORM ORIGINAL',
    year: '2022',
    duration: '4 Seasons',
    match: '98',
    rating: '16+',
    genre: 'Anime',
    quality: '4K',
    audio: 'Dolby Atmos',
    description:
      'When a small, unsuspecting town becomes the hunting ground for a malevolent entity, a group of unlikely heroes must rise — The Demonic Slash Group.',
    image:
      'https://images.unsplash.com/photo-1574267432644-f610cda3f9e7?w=1920&q=90&fit=crop',
    accent: '#7c3aed',
    trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    title: 'Shadow Realm',
    badge: 'NEW RELEASE',
    year: '2024',
    duration: '2h 15m',
    match: '95',
    rating: 'R',
    genre: 'Fantasy',
    quality: '4K HDR',
    audio: 'Dolby Vision',
    description:
      'A rogue assassin must navigate a deadly underworld where shadows come to life and ancient magic dictates the rules of survival.',
    image:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop',
    accent: '#dc2626',
    trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    title: 'Eclipse Hunters',
    badge: 'TRENDING NOW',
    year: '2023',
    duration: '1h 50m',
    match: '88',
    rating: 'PG-13',
    genre: 'Sci-Fi',
    quality: '1080p',
    audio: '5.1 Surround',
    description:
      'In a future where the sun has gone permanently dark, a team of scavengers discovers a device that could reignite the dying star.',
    image:
      'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop',
    accent: '#2563eb',
    trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 4,
    title: 'Blood Covenant',
    badge: 'CRITICALLY ACCLAIMED',
    year: '2023',
    duration: '3 Seasons',
    match: '92',
    rating: 'TV-MA',
    genre: 'Action',
    quality: '4K',
    audio: 'Dolby Atmos',
    description:
      'Betrayed by his own order, a templar knight forms a dark pact with a vampire to exact revenge on the king who wronged them both.',
    image:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2574&auto=format&fit=crop',
    accent: '#991b1b',
    trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 5,
    title: 'Neon Genesis',
    badge: 'GLOBAL HIT',
    year: '2024',
    duration: '1h 38m',
    match: '85',
    rating: '13+',
    genre: 'Cyberpunk',
    quality: '4K HDR',
    audio: 'Atmos',
    description:
      "When the city's central AI goes rogue, a hacker must infiltrate the heavily guarded Nexus tower before it wipes all human memory.",
    image:
      'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2670&auto=format&fit=crop',
    accent: '#059669',
    trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const matchColor = (n: number) =>
  n >= 75 ? '#46d369' : n >= 50 ? '#f59e0b' : '#ef4444';

const hex2rgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated quality/rating badge */
const MetaBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 7px',
      borderRadius: 3,
      border: '1px solid rgba(255,255,255,0.25)',
      fontSize: 11,
      fontWeight: 700,
      color: 'rgba(255,255,255,0.75)',
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(4px)',
      letterSpacing: '0.5px',
    }}
  >
    {children}
  </span>
);

/** Thin shimmer bar for skeleton */
const ShimmerBar: React.FC<{ w: string; h: number; delay?: number }> = ({
  w, h, delay = 0,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 4,
      background:
        'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)',
      backgroundSize: '200% 100%',
      animation: `shimmer 1.8s linear ${delay}s infinite`,
    }}
  />
);

// ─── Main Hero ────────────────────────────────────────────────────────────────

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, heroMovie } =
    useStore();

  // State
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);      // 1=forward, -1=back
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [scrollY, setScrollY] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const videoTRef = useRef<ReturnType<typeof setTimeout>>();
  const barKeyRef = useRef(0);

  // Reduced motion
  const reducedMotion = useMemo(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
    []);

  // Smooth mouse parallax via springs
  const rawX = useSpring(0, { stiffness: 60, damping: 20 });
  const rawY = useSpring(0, { stiffness: 60, damping: 20 });
  const panX = useTransform(rawX, [-1, 1], reducedMotion ? [0, 0] : [-18, 18]);
  const panY = useTransform(rawY, [-1, 1], reducedMotion ? [0, 0] : [-8, 8]);

  const movie = heroMovie ?? FEATURED[current];
  const isReady = loaded.has(movie.id) || !!(movie as any).isCustom;
  const matchN = parseInt(movie.match ?? '90', 10);
  const mColor = matchColor(matchN);
  const accentRgb = hex2rgb(movie.accent ?? '#8b5cf6');

  // ── Navigation helpers ────────────────────────────────────────────────────

  const goTo = useCallback((idx: number, dir: number) => {
    setPrev(current);
    setDirection(dir);
    setCurrent(idx);
    setShowVideo(false);
    barKeyRef.current += 1;
  }, [current]);

  const goNext = useCallback(() =>
    goTo((current + 1) % FEATURED.length, 1), [current, goTo]);

  const goPrev = useCallback(() =>
    goTo((current - 1 + FEATURED.length) % FEATURED.length, -1), [current, goTo]);

  // ── Auto-advance ─────────────────────────────────────────────────────────

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (!paused && !reducedMotion) {
      timerRef.current = setInterval(goNext, ADVANCE_MS);
    }
  }, [paused, reducedMotion, goNext]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  // ── Video delay ───────────────────────────────────────────────────────────

  useEffect(() => {
    clearTimeout(videoTRef.current);
    if (paused && !reducedMotion && !heroMovie) {
      videoTRef.current = setTimeout(() => setShowVideo(true), VIDEO_DELAY);
    } else {
      setShowVideo(false);
    }
    return () => clearTimeout(videoTRef.current);
  }, [paused, current, reducedMotion, heroMovie]);

  // ── Scroll parallax ───────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Keyboard navigation ───────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // ── Touch / swipe ─────────────────────────────────────────────────────────

  const touchX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) =>
    (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? goNext() : goPrev();
  };

  // ── Preload next image ────────────────────────────────────────────────────

  useEffect(() => {
    const next = FEATURED[(current + 1) % FEATURED.length];
    const img = new Image();
    img.src = next.image ?? '';
  }, [current]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
    rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
  }, [rawX, rawY]);

  const handlePlay = useCallback(() => {
    navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
  }, [navigate, movie.title]);

  const handleWatchlist = useCallback(() => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      toast.success('Removed from My List');
    } else {
      addToWatchlist(movie);
      toast.success('Added to My List ✓', {
        style: {
          background: '#1c1c1c',
          color: '#fff',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 10,
        },
      });
    }
  }, [isInWatchlist, movie, addToWatchlist, removeFromWatchlist]);

  const inList = isInWatchlist(movie.id);

  // ── Slide variants ────────────────────────────────────────────────────────

  const contentVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reducedMotion ? 0 : dir * 40,
      y: reducedMotion ? 0 : 10,
    }),
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        ease: EASE_CINEMA,
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reducedMotion ? 0 : dir * -30,
      transition: { duration: 0.45, ease: EASE_CINEMA },
    }),
  };

  const childVariants = {
    enter: { opacity: 0, y: 18 },
    center: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_CINEMA } },
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fillBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes badgePulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
      `}</style>

      <section
        role="region"
        aria-label="Featured content"
        aria-roledescription="carousel"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: 600,
          overflow: 'hidden',
          background: '#050508',
          userSelect: 'none',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); rawX.set(0); rawY.set(0); }}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >

        {/* ═══ LAYER 1 — Backdrop images (crossfade) ═══ */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            x: panX,
            y: panY,
            scale: 1.06,
            translateY: scrollY * 0.18,
            willChange: 'transform',
          }}
        >
          {FEATURED.map((m, i) => (
            <img
              key={m.id}
              src={m.image}
              alt=""
              aria-hidden="true"
              onLoad={() => setLoaded(s => new Set(s).add(m.id))}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                opacity: i === current && !showVideo ? 1 : 0,
                transition: reducedMotion
                  ? 'none'
                  : 'opacity 1.4s cubic-bezier(0.22,1,0.36,1)',
                filter: 'contrast(1.08) saturate(1.12) brightness(0.88)',
                maskImage:
                  'linear-gradient(to left, black 25%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to left, black 25%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                willChange: 'opacity',
              }}
            />
          ))}

          {/* Video trailer */}
          {!reducedMotion && (
            <video
              ref={videoRef}
              autoPlay
              muted={muted}
              loop
              playsInline
              src={movie.trailerUrl}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                opacity: showVideo ? 1 : 0,
                transition: 'opacity 1.6s cubic-bezier(0.22,1,0.36,1)',
                maskImage:
                  'linear-gradient(to left, black 25%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to left, black 25%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              }}
            />
          )}
        </motion.div>

        {/* ═══ LAYER 2 — Dynamic accent ambient glow ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 60% 70% at 0% 100%,
                rgba(${accentRgb},0.22) 0%,
                transparent 65%
              )
            `,
            transition: 'background 1.8s ease',
          }}
        />

        {/* ═══ LAYER 3 — Cinematic gradients ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            background: `
              linear-gradient(
                to bottom,
                rgba(5,5,8,0.15) 0%,
                transparent 30%,
                transparent 50%,
                rgba(20,20,20,0.7) 75%,
                #141414 100%
              ),
              linear-gradient(
                to right,
                rgba(5,5,8,0.97) 0%,
                rgba(5,5,8,0.82) 20%,
                rgba(5,5,8,0.55) 40%,
                rgba(5,5,8,0.18) 60%,
                transparent 78%
              )
            `,
          }}
        />

        {/* ═══ LAYER 4 — Film grain ═══ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none',
            opacity: 0.028,
            mixBlendMode: 'screen',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }}
        />

        {/* ═══ LAYER 5 — Vignette ═══ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* ═══ LAYER 6 — HERO CONTENT ═══ */}
        <div
          style={{
            position: 'absolute',
            zIndex: 20,
            left: 60,
            bottom: 140,
            maxWidth: 580,
            transform: `translateY(${-scrollY * 0.12}px)`,
            transition: reducedMotion ? 'none' : undefined,
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {!isReady ? (
              /* ── Skeleton ── */
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <ShimmerBar w="130px" h={14} />
                <ShimmerBar w="72%" h={52} delay={0.05} />
                <ShimmerBar w="55%" h={18} delay={0.1} />
                <ShimmerBar w="90%" h={64} delay={0.15} />
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <ShimmerBar w="130px" h={44} delay={0.2} />
                  <ShimmerBar w="120px" h={44} delay={0.25} />
                </div>
              </motion.div>
            ) : (
              /* ── Real content ── */
              <motion.div
                key={`hero-${current}`}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              >

                {/* Badge */}
                {movie.badge && (
                  <motion.div
                    variants={childVariants}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: '#8b5cf6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 900,
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      S
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '2.5px',
                        color: '#a78bfa',
                        textTransform: 'uppercase',
                      }}
                    >
                      {movie.badge}
                    </span>
                  </motion.div>
                )}

                {/* Title */}
                <motion.h1
                  variants={childVariants}
                  style={{
                    margin: '0 0 14px',
                    fontSize: 'clamp(38px,4.2vw,68px)',
                    fontWeight: 800,
                    lineHeight: 1.03,
                    letterSpacing: '-0.03em',
                    color: '#fff',
                    textShadow: '0 4px 40px rgba(0,0,0,0.9)',
                    fontFamily:
                      movie.id === 1
                        ? "'UnifrakturMaguntia', cursive"
                        : 'inherit',
                  }}
                >
                  {movie.title}
                </motion.h1>

                {/* Metadata row */}
                <motion.div
                  variants={childVariants}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 14,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {/* Match score */}
                  <span
                    style={{
                      color: mColor,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {matchN}% Match
                  </span>

                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{movie.year}</span>

                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{movie.duration}</span>

                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <MetaBadge>{movie.rating}</MetaBadge>
                  <MetaBadge>{movie.quality}</MetaBadge>

                  {movie.audio && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.38)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {movie.audio}
                    </span>
                  )}
                </motion.div>

                {/* Match bar */}
                <motion.div
                  variants={childVariants}
                  style={{ marginBottom: 16 }}
                >
                  <div
                    style={{
                      height: 2,
                      width: '100%',
                      maxWidth: 340,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, ease: EASE_CINEMA, delay: 0.4 }}
                      style={{
                        height: '100%',
                        width: `${matchN}%`,
                        background: mColor,
                        transformOrigin: 'left',
                        borderRadius: 1,
                      }}
                    />
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={childVariants}
                  style={{
                    margin: '0 0 24px',
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.72)',
                    maxWidth: 460,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {movie.description}
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  variants={childVariants}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  {/* Play — primary */}
                  <motion.button
                    onClick={handlePlay}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label={`Play ${movie.title}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      background: '#ffffff',
                      color: '#000',
                      border: 'none',
                      borderRadius: 5,
                      padding: '11px 26px',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 24px rgba(255,255,255,0.15)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Play size={19} fill="black" strokeWidth={0} />
                    Play
                  </motion.button>

                  {/* My List — secondary */}
                  <motion.button
                    onClick={handleWatchlist}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: inList
                        ? 'rgba(139,92,246,0.25)'
                        : 'rgba(109,109,110,0.65)',
                      border: inList
                        ? '1.5px solid rgba(139,92,246,0.5)'
                        : '1.5px solid transparent',
                      color: '#fff',
                      borderRadius: 5,
                      padding: '11px 22px',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background 0.25s, border 0.25s',
                    }}
                  >
                    {inList ? (
                      <Check size={18} color="#a78bfa" />
                    ) : (
                      <Plus size={18} />
                    )}
                    My List
                  </motion.button>

                  {/* More Info — ghost */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label="More information"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'transparent',
                      border: '1.5px solid rgba(255,255,255,0.28)',
                      color: 'rgba(255,255,255,0.85)',
                      borderRadius: 5,
                      padding: '11px 20px',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Info size={18} />
                    More Info
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ LAYER 7 — Progress indicators ═══ */}
        <div
          style={{
            position: 'absolute',
            bottom: 88,
            left: 60,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          {FEATURED.map((_, i) => {
            const active = i === current;
            return (
              <button
                key={i}
                onClick={() => {
                  const dir = i > current ? 1 : -1;
                  goTo(i, dir);
                  resetTimer();
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active ? 'true' : undefined}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  width: active ? 32 : 6,
                  height: active ? 4 : 6,
                  borderRadius: active ? 2 : '50%',
                  background: active
                    ? 'transparent'
                    : 'rgba(255,255,255,0.28)',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: 2,
                    }}
                  />
                )}
                {active && !paused && !reducedMotion && (
                  <div
                    key={barKeyRef.current}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#fff',
                      borderRadius: 2,
                      transformOrigin: 'left center',
                      animation: `fillBar ${ADVANCE_MS}ms linear forwards`,
                    }}
                  />
                )}
                {active && paused && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#fff',
                      borderRadius: 2,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ═══ LAYER 8 — Prev / Next arrows ═══ */}
        <AnimatePresence>
          {paused && (
            <>
              <motion.button
                key="prev"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                onClick={() => { goPrev(); resetTimer(); }}
                aria-label="Previous"
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 30,
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <ChevronLeft size={22} strokeWidth={2} />
              </motion.button>

              <motion.button
                key="next"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                onClick={() => { goNext(); resetTimer(); }}
                aria-label="Next"
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 30,
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <ChevronRight size={22} strokeWidth={2} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* ═══ LAYER 9 — Mute / unmute ═══ */}
        <AnimatePresence>
          {showVideo && (
            <motion.button
              key="mute"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Unmute preview' : 'Mute preview'}
              style={{
                position: 'absolute',
                bottom: 86,
                right: 40,
                zIndex: 30,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </motion.button>
          )}
        </AnimatePresence>

        {/* ═══ LAYER 10 — Bottom accent line ═══ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            zIndex: 25,
            background: `linear-gradient(
              to right,
              rgba(${accentRgb},0.6) 0%,
              rgba(${accentRgb},0.15) 40%,
              transparent 70%
            )`,
            transition: 'background 1.8s ease',
          }}
        />

      </section>
    </>
  );
};

export default Hero;