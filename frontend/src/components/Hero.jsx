import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Play, Plus, Heart, Info, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import heroBg from '../assets/hero_bg.png';
import useStore from '../store/useStore';

const MoltenGlassHero = lazy(() => import('./ui/MoltenGlassHero'));

// ─── Constants & Easing ────────────────────────────────────────────────────
const PREMIUM_EASING = [0.22, 1, 0.36, 1];

const FEATURED_MOVIES = [
  {
    id: 1,
    title: "Demonic Slash",
    badge: "SLOTHUI ORIGINAL",
    year: "2028",
    duration: "82 Seasons",
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
    year: "2026",
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
    year: "2025",
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
    year: "2027",
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

// ─── Framer Motion Variants ────────────────────────────────────────────────
const containerVariants = {
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

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: PREMIUM_EASING } }
};

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, heroMovie } = useStore();
  
  // Parallax & Mouse Pan
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const movie = heroMovie || FEATURED_MOVIES[current];
  const isLoaded = imagesLoaded.has(movie.id) || movie.isCustom;

  // ─── Scroll & Mouse Listeners ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // ─── Auto-Advance & Video Timing ───────────────────────────────────────
  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FEATURED_MOVIES.length);
      setShowVideo(false);
    }, 8000);
    return () => clearInterval(timer);
  }, [paused, prefersReducedMotion]);

  useEffect(() => {
    let hoverTimer;
    if (paused && !prefersReducedMotion && !heroMovie) {
      hoverTimer = setTimeout(() => setShowVideo(true), 2000);
    } else {
      setShowVideo(false);
    }
    return () => clearTimeout(hoverTimer);
  }, [paused, current, prefersReducedMotion, heroMovie]);

  // ─── Preload Next Image ────────────────────────────────────────────────
  useEffect(() => {
    const nextIdx = (current + 1) % FEATURED_MOVIES.length;
    const img = new Image();
    img.src = FEATURED_MOVIES[nextIdx].image;
  }, [current]);

  const handleImageLoad = (id) => {
    setImagesLoaded((prev) => new Set(prev).add(id));
  };

  // ─── Transform Calculations ────────────────────────────────────────────
  const bgScale = prefersReducedMotion ? 1 : 1.05 + (scrollY * 0.0003);
  const bgTranslateY = prefersReducedMotion ? 0 : scrollY * 0.2;
  const panX = prefersReducedMotion ? 0 : mousePos.x * 12;
  const panY = prefersReducedMotion ? 0 : mousePos.y * 6;

  return (
    <section 
      className="relative w-full h-screen min-h-screen overflow-hidden bg-[#050508]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={handleMouseMove}
      aria-label="Featured Movies"
    >
      {/* ── LAYER 0: WebGL Background (Base) ── */}
      <Suspense fallback={null}>
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <MoltenGlassHero />
        </div>
      </Suspense>

      {/* ── LAYER 1: Ambient Color Glow ── */}
      <div 
        className="absolute bottom-0 left-0 md:left-[64px] w-[80%] md:w-[60%] h-[100%] md:h-[80%] z-[5] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom left, ${movie.accent}25 0%, transparent 60%)`,
          transition: 'background 1.5s ease',
          willChange: 'background'
        }}
      />

      {/* ── LAYER 2: Parallax Image Container ── */}
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

        {/* Video Trailer */}
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

      {/* ── LAYER 3: Cinematic Depth Overlays ── */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(5,5,8,1) 0%, rgba(5,5,8,0.85) 30%, rgba(5,5,8,0.3) 60%, transparent 100%)" }} />
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
      <div className="absolute bottom-0 left-0 w-full h-[220px] z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(5,5,8,0.75) 55%, #050508 100%)" }} />

      {/* Volume Toggle */}
      {showVideo && (
        <button 
          onClick={() => setMuted(!muted)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-[160px] md:bottom-[220px] right-6 md:right-12 z-[30] w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* ── LAYER 4: Content Block ── */}
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          /* SKELETON LOADER */
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-[24px] md:left-[80px] bottom-[120px] md:bottom-[160px] z-20 w-full max-w-[640px] flex flex-col gap-5"
          >
            <div className="w-32 h-6 bg-white/10 rounded animate-pulse" />
            <div className="w-[80%] h-16 bg-white/10 rounded animate-pulse" />
            <div className="flex gap-3"><div className="w-16 h-5 bg-white/10 rounded animate-pulse" /><div className="w-16 h-5 bg-white/10 rounded animate-pulse" /></div>
            <div className="w-[90%] h-20 bg-white/10 rounded animate-pulse" />
            <div className="flex gap-4 mt-2"><div className="w-32 h-12 bg-white/10 rounded animate-pulse" /><div className="w-32 h-12 bg-white/10 rounded animate-pulse" /></div>
          </motion.div>
        ) : (
          /* ACTUAL CONTENT */
          <motion.div
            key={current}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-[24px] md:left-[80px] bottom-[300px] md:bottom-[340px] z-20 w-full md:max-w-[640px] flex flex-col gap-4 md:gap-5 pr-[24px] md:pr-0"
            style={{ y: -scrollY * 0.1, willChange: 'transform, opacity' }} // Subtle content scroll parallax
          >

            {/* Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-[3rem] md:text-[4.8rem] leading-[0.95] font-[900] text-white tracking-[-0.04em]"
              style={{ 
                fontFamily: movie.id === 1 ? "'UnifrakturMaguntia', cursive" : "inherit",
                textShadow: '0 4px 32px rgba(0,0,0,0.9)',
                textWrap: 'balance'
              }}
            >
              {movie.title}
            </motion.h1>

            {/* Enhanced Metadata */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 text-[13px] md:text-[14px] font-bold text-white">
              <span>{movie.year || '2028'}</span>
              <span>82 Seasons</span>
              <span className="border border-white/50 px-3 py-0.5 rounded-full text-[12px] font-medium">
                {movie.genre || 'Cartoon'}
              </span>
              <div className="flex items-center gap-1 text-[#f59e0b]">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                <span className="text-white font-bold ml-1">4.8</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-[14px] md:text-[16px] text-white/75 leading-[1.7] max-w-[560px]">
              {movie.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-row items-center gap-4 mt-4">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/watch?title=${encodeURIComponent(movie.title)}`)}>
                <button 
                  aria-label={`Play ${movie.title}`}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-105"
                >
                  <Play size={20} fill="white" stroke="white" className="ml-1" />
                </button>
                <span className="font-bold text-[15px] text-white tracking-wide">Play S1 E1</span>
              </div>
              
              <button
                aria-label={isInWatchlist(movie.id) ? `Remove ${movie.title} from Watchlist` : `Add ${movie.title} to Watchlist`}
                onClick={() => {
                  if (isInWatchlist(movie.id)) {
                    removeFromWatchlist(movie.id);
                  } else {
                    addToWatchlist({ id: movie.id, title: movie.title, year: movie.year, thumbnail: movie.image, duration: movie.duration, genres: [movie.genre] });
                  }
                }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-105 ml-4"
              >
                <span className="text-[20px] leading-none mb-1">+</span>
              </button>

              <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-105">
                <Info size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LAYER 5: Progress Indicators ── */}
      <div className="absolute bottom-6 md:bottom-8 left-[24px] md:left-[80px] z-30 flex items-center gap-2">
        {FEATURED_MOVIES.map((_, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx);
                setShowVideo(false);
              }}
              aria-label={`Jump to movie ${idx + 1}`}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden bg-white/30 outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isActive ? 'w-8 md:w-10' : 'w-1.5 hover:bg-white/50 hover:scale-125'
              }`}
            >
              {isActive && !prefersReducedMotion && (
                <div
                  className="absolute top-0 left-0 bottom-0 bg-white"
                  style={{
                    animation: paused ? 'none' : 'fillBar 8s linear forwards',
                    width: paused ? '100%' : '0%'
                  }}
                />
              )}
              {isActive && prefersReducedMotion && (
                <div className="absolute inset-0 bg-white" />
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
