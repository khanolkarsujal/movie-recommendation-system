import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Plus, Info, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useStore } from '../store';
import type { Movie } from './types';

const heroBg = 'https://images.unsplash.com/photo-1574267432644-f610cda3f9e7?w=1920&q=90&fit=crop';

const PREMIUM_EASING = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_INTERVAL = 8000;
const VIDEO_DELAY = 2000;

const FEATURED_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Demonic Slash",
    badge: "SLOTHUI ORIGINAL",
    year: "2022",
    duration: "4 Seasons",
    match: "98% Match",
    rating: "16+",
    genre: "Anime",
    quality: "4K",
    audio: "Dolby Atmos",
    description: "When a small, unsuspecting town becomes the hunting ground for a malevolent entity, a group of unlikely heroes must rise — The Demonic Slash Group.",
    image: heroBg,
    accent: "#6d28d9",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    title: "Shadow Realm",
    badge: "NEW RELEASE",
    year: "2024",
    duration: "2h 15m",
    match: "95% Match",
    rating: "R",
    genre: "Fantasy",
    quality: "4K HDR",
    audio: "Vision",
    description: "A rogue assassin must navigate a deadly underworld where shadows come to life and ancient magic dictates the rules of survival.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
    accent: "#ef4444",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 3,
    title: "Eclipse Hunters",
    badge: "TRENDING NOW",
    year: "2023",
    duration: "1h 50m",
    match: "88% Match",
    rating: "PG-13",
    genre: "Sci-Fi",
    quality: "1080p",
    audio: "5.1",
    description: "In a future where the sun has gone permanently dark, a team of scavengers discovers a device that could reignite the dying star.",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
    accent: "#3b82f6",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 4,
    title: "Blood Covenant",
    badge: "CRITICALLY ACCLAIMED",
    year: "2023",
    duration: "3 Seasons",
    match: "92% Match",
    rating: "TV-MA",
    genre: "Action",
    quality: "4K",
    audio: "Dolby Atmos",
    description: "Betrayed by his own order, a templar knight forms a dark pact with a vampire to exact revenge on the king who wronged them both.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2574&auto=format&fit=crop",
    accent: "#b91c1c",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 5,
    title: "Neon Genesis",
    badge: "GLOBAL HIT",
    year: "2024",
    duration: "1h 38m",
    match: "85% Match",
    rating: "13+",
    genre: "Cyberpunk",
    quality: "4K HDR",
    audio: "Atmos",
    description: "When the city's central AI goes rogue, a hacker must infiltrate the heavily guarded Nexus tower to reboot the system before it wipes all data.",
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2670&auto=format&fit=crop",
    accent: "#10b981",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.6, ease: PREMIUM_EASING }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: PREMIUM_EASING } }
};

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number | string>>(new Set());
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, heroMovie } = useStore();

  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const prefersReducedMotion = useMemo(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
    []
  );

  const movie = heroMovie || FEATURED_MOVIES[current];
  const isLoaded = imagesLoaded.has(movie.id) || movie.isCustom;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2;
    const y = (clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FEATURED_MOVIES.length);
      setShowVideo(false);
    }, AUTO_ADVANCE_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, prefersReducedMotion]);

  useEffect(() => {
    let hoverTimer: NodeJS.Timeout;
    if (paused && !prefersReducedMotion && !heroMovie) {
      hoverTimer = setTimeout(() => setShowVideo(true), VIDEO_DELAY);
    } else {
      setShowVideo(false);
    }
    return () => clearTimeout(hoverTimer);
  }, [paused, current, prefersReducedMotion, heroMovie]);

  useEffect(() => {
    const nextIdx = (current + 1) % FEATURED_MOVIES.length;
    const img = new Image();
    img.src = FEATURED_MOVIES[nextIdx].image || '';
  }, [current]);

  const handleImageLoad = useCallback((id: number | string) => {
    setImagesLoaded((prev) => new Set(prev).add(id));
  }, []);

  const bgScale = prefersReducedMotion ? 1 : 1.05 + (scrollY * 0.0003);
  const bgTranslateY = prefersReducedMotion ? 0 : scrollY * 0.2;
  const panX = prefersReducedMotion ? 0 : mousePos.x * 12;
  const panY = prefersReducedMotion ? 0 : mousePos.y * 6;

  const handlePlayClick = useCallback(() => {
    navigate(`/watch?title=${encodeURIComponent(movie.title)}`);
  }, [navigate, movie.title]);

  const handleWatchlistClick = useCallback(() => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      toast.success('Removed from watchlist');
    } else {
      addToWatchlist(movie);
      toast.success('Added to watchlist');
    }
  }, [isInWatchlist, movie, addToWatchlist, removeFromWatchlist]);

  const handleIndicatorClick = useCallback((idx: number) => {
    setCurrent(idx);
    setShowVideo(false);
  }, []);

  return (
    <section
      className="relative w-full h-screen min-h-screen overflow-hidden bg-[#050508]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={handleMouseMove}
      aria-label="Featured Movies"
    >
      {/* Decorative gradient background effect */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 md:left-[64px] w-[80%] md:w-[60%] h-[100%] md:h-[80%] z-[5] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom left, ${movie.accent}25 0%, transparent 60%)`,
          transition: 'background 1.5s ease',
          willChange: 'background'
        }}
      />

      <motion.div
        className="absolute inset-0 z-10 pointer-events-none origin-center"
        style={{
          scale: bgScale,
          y: bgTranslateY,
          x: -panX,
          transform: `translateY(${bgTranslateY}px) scale(${bgScale}) translate(${-panX}px, ${-panY}px)`,
          willChange: 'transform'
        }}
      >
        {FEATURED_MOVIES.map((m, index) => (
          <img
            key={m.id}
            src={m.image}
            alt={m.title}
            onLoad={() => handleImageLoad(m.id)}
            className="absolute right-0 top-0 h-full w-[100%] lg:w-[80%] object-cover object-[center_20%]"
            style={{
              opacity: index === current ? (showVideo ? 0 : 0.85) : 0,
              transition: `opacity ${prefersReducedMotion ? '0s' : '1.2s'} cubic-bezier(0.22, 1, 0.36, 1)`,
              filter: "contrast(1.05) saturate(1.1) brightness(0.9)",
              maskImage: "linear-gradient(to left, black 30%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 100%)",
              willChange: 'opacity'
            }}
          />
        ))}

        {!prefersReducedMotion && (
          <video
            autoPlay
            muted={muted}
            loop
            playsInline
            src={movie.trailerUrl}
            className="absolute right-0 top-0 h-full w-[100%] lg:w-[80%] object-cover object-[center_20%]"
            style={{
              opacity: showVideo ? 0.85 : 0,
              transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
              maskImage: "linear-gradient(to left, black 30%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 100%)",
              willChange: 'opacity'
            }}
          />
        )}
      </motion.div>

      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom,
              transparent 50%,
              rgba(20,20,20,0.8) 80%,
              #141414 100%
            ),
            linear-gradient(to right,
              rgba(0,0,0,0.95) 0%,
              rgba(0,0,0,0.6) 30%,
              rgba(0,0,0,0.2) 60%,
              transparent 85%
            )
          `
        }}
      />
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)" }} />

      {showVideo && (
        <button
          onClick={() => setMuted(!muted)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-[240px] right-6 md:right-12 z-[30] w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all outline-none"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-[24px] md:left-[80px] bottom-[160px] z-20 w-full max-w-[640px] flex flex-col gap-5"
          >
            <div className="w-32 h-6 bg-white/10 rounded animate-pulse" />
            <div className="w-[80%] h-16 bg-white/10 rounded animate-pulse" />
            <div className="w-[90%] h-20 bg-white/10 rounded animate-pulse" />
          </motion.div>
        ) : (
          <motion.div
            key={current}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-[24px] md:left-[80px] bottom-[280px] md:bottom-[320px] z-20 w-full md:max-w-[640px] flex flex-col items-start pr-[24px] md:pr-0"
            style={{ y: -scrollY * 0.1, willChange: 'transform, opacity' }}
          >
            {movie.badge && (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 mb-2"
              >
                <div className="w-5 h-5 bg-[#8b5cf6] rounded-sm flex items-center justify-center text-[10px] font-black text-white">S</div>
                <span className="text-[11px] font-bold tracking-[2.5px] text-[#8b5cf6] uppercase">{movie.badge}</span>
              </motion.div>
            )}

            <motion.h1
              variants={itemVariants}
              className="text-white tracking-[-0.04em] mb-3 leading-[1.05] font-[800]"
              style={{
                fontSize: 'clamp(36px, 4vw, 64px)',
                fontFamily: movie.id === 1 ? "'UnifrakturMaguntia', cursive" : "inherit",
                textShadow: '0 4px 32px rgba(0,0,0,0.9)',
                textWrap: 'balance'
              }}
            >
              {movie.title}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 text-[15px] font-medium text-white/90 mb-6">
              <span className="text-[#46d369] font-bold">{movie.match || '98% Match'}</span>
              <span className="text-white/50">•</span>
              <span>{movie.year || '2024'}</span>
              <span className="text-white/50">•</span>
              <span>{movie.duration || '4 Seasons'}</span>
              <span className="text-white/50">•</span>
              <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-[4px] text-[12px] font-bold border border-white/20">{movie.rating || '16+'}</span>
              <span className="text-white/50">•</span>
              <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-[4px] text-[11px] font-black tracking-widest border border-white/20">4K</span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-[15px] text-white/75 leading-[1.6] max-w-[480px] mb-[24px]"
            >
              {movie.description}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-row items-center gap-3 mt-1">
              <button
                onClick={handlePlayClick}
                className="flex items-center justify-center gap-2.5 bg-white text-black px-7 py-2.5 rounded-[5px] font-bold text-[15px] transition-all hover:bg-white/90 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.15)] min-width-[140px]"
                aria-label={`Play ${movie.title}`}
              >
                <Play size={20} fill="black" /> Play
              </button>

              <button
                onClick={handleWatchlistClick}
                className="flex items-center justify-center gap-2.5 bg-[#6d6d6e]/70 text-white px-6 py-2.5 rounded-[5px] font-semibold text-[15px] transition-all hover:bg-[#6d6d6e]/90 active:scale-95"
                aria-label={isInWatchlist(movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Plus size={20} /> My List
              </button>

              <button className="hidden lg:flex items-center justify-center gap-2.5 bg-transparent border-[1.5px] border-white/30 text-white px-6 py-2.5 rounded-[5px] font-semibold text-[15px] transition-all hover:bg-white/10 active:scale-95">
                <Info size={20} /> More Info
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-[250px] left-[24px] md:left-[80px] z-30 flex items-center gap-3">
        {FEATURED_MOVIES.map((_, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={idx}
              onClick={() => handleIndicatorClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`relative cursor-pointer transition-all duration-400 outline-none ${
                isActive ? 'w-7 h-1' : 'w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/50'
              }`}
            >
              {isActive && (
                <div className="w-full h-full bg-white rounded-full overflow-hidden">
                  {!prefersReducedMotion && !paused && (
                    <div
                      className="h-full bg-[#8b5cf6] origin-left"
                      style={{ animation: 'fillBar 8s linear forwards' }}
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes fillBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default Hero;