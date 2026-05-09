import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Play, Plus, Info, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroBg from '../assets/hero_bg.png';

const MoltenGlassHero = lazy(() => import('./ui/MoltenGlassHero'));

// ─── Mock Featured Movies Data ─────────────────────────────────────────────
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
    description: "When a small, unsuspecting town becomes the hunting ground for a malevolent entity, a group of unlikely heroes must rise — The Demonic Slash Group.",
    image: heroBg,
    accent: "#6d28d9", // Purple
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
    description: "A rogue assassin must navigate a deadly underworld where shadows come to life and ancient magic dictates the rules of survival.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
    accent: "#ef4444", // Red
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
    description: "In a future where the sun has gone permanently dark, a team of scavengers discovers a device that could reignite the dying star.",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
    accent: "#3b82f6", // Blue
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
    description: "Betrayed by his own order, a templar knight forms a dark pact with a vampire to exact revenge on the king who wronged them both.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2574&auto=format&fit=crop",
    accent: "#b91c1c", // Dark Red
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
    description: "When the city's central AI goes rogue, a hacker must infiltrate the heavily guarded Nexus tower to reboot the system before it wipes all data.",
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2670&auto=format&fit=crop",
    accent: "#10b981", // Emerald
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
    y: -20,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);

  const movie = FEATURED_MOVIES[current];

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FEATURED_MOVIES.length);
      setShowVideo(false);
    }, 8000);
    return () => clearInterval(timer);
  }, [paused]);

  // Video hover timer
  useEffect(() => {
    let hoverTimer;
    if (paused) {
      hoverTimer = setTimeout(() => setShowVideo(true), 2000);
    } else {
      setShowVideo(false);
    }
    return () => clearTimeout(hoverTimer);
  }, [paused, current]);

  return (
    <section 
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── LAYER 0: WebGL Background (Base) ── */}
      <Suspense fallback={null}>
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
          <MoltenGlassHero />
        </div>
      </Suspense>

      {/* ── LAYER 1: Ambient Color Glow ── */}
      <div 
        className="absolute bottom-0 left-[64px] w-[60%] h-[80%] z-[5] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom left, ${movie.accent}30 0%, transparent 60%)`,
          transition: 'background 1.5s ease'
        }}
      />

      {/* ── LAYER 2: Movie Posters Crossfade ── */}
      {FEATURED_MOVIES.map((m, index) => (
        <img 
          key={m.id}
          src={m.image} 
          alt={m.title}
          className="absolute right-0 top-0 h-full w-[85%] lg:w-[70%] z-10 object-cover object-[center_20%]"
          style={{ 
            opacity: index === current ? (showVideo ? 0 : 0.85) : 0, 
            transition: 'opacity 1s ease-in-out',
            filter: "contrast(1.05) saturate(1.1) brightness(0.9)",
            maskImage: "linear-gradient(to left, black 30%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 100%)"
          }}
        />
      ))}

      {/* ── LAYER 3: Video Trailer ── */}
      <video
        autoPlay
        muted={muted}
        loop
        playsInline
        src={movie.trailerUrl}
        className="absolute right-0 top-0 h-full w-[85%] lg:w-[70%] z-10 object-cover object-[center_20%]"
        style={{
          opacity: showVideo ? 0.85 : 0,
          transition: 'opacity 1.5s ease-in-out',
          maskImage: "linear-gradient(to left, black 30%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 100%)"
        }}
      />

      {/* Volume Toggle */}
      {showVideo && (
        <button 
          onClick={() => setMuted(!muted)}
          className="absolute bottom-[160px] right-12 z-[30] w-10 h-10 rounded-full border border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* ── LAYER 4: Dark Overlays ── */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(13,13,13,1) 0%, rgba(13,13,13,0.85) 30%, rgba(13,13,13,0.3) 60%, transparent 100%)" }}
      />
      <div 
        className="absolute bottom-0 left-0 w-full h-[160px] z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0d0d0d)' }}
      />

      {/* ── LAYER 5: Content Block ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute left-[80px] bottom-[140px] z-20 max-w-[560px] flex flex-col gap-4"
        >
          {/* Platform Badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: movie.accent }}>
              <span className="text-[11px] font-bold text-white leading-none">S</span>
            </div>
            <span className="text-[13px] font-bold text-white/90 tracking-[1px]">{movie.badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-[4.5rem] leading-[1.05] font-bold text-white tracking-tight"
            style={{ 
              fontFamily: movie.id === 1 ? "'UnifrakturMaguntia', cursive" : "inherit",
              textShadow: '0 4px 32px rgba(0,0,0,0.8)'
            }}
          >
            {movie.title}
          </motion.h1>

          {/* Enhanced Metadata */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 text-[14px] font-medium">
            <span className="bg-[#22c55e] text-white px-2 py-0.5 rounded-[4px] font-bold text-[13px] shadow-sm">
              {movie.match}
            </span>
            <span className="text-white/90">{movie.year}</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="border border-white/40 text-white/90 px-1.5 rounded-[3px] text-[11px] leading-tight flex items-center h-[18px]">
              {movie.rating}
            </span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="border border-white/40 text-white/90 px-1.5 rounded-[3px] text-[11px] leading-tight flex items-center h-[18px]">
              HD
            </span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-white/90">{movie.duration}</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-white/90">{movie.genre}</span>
          </motion.div>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-[15px] text-white/80 leading-[1.6] max-w-[500px]">
            {movie.description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mt-2">
            {/* Primary Play */}
            <button className="flex items-center gap-2.5 bg-white text-black px-7 py-3 rounded-md font-bold text-[15px] transition-all duration-200 hover:bg-white/85 hover:scale-[1.03] active:scale-[0.97] shadow-[0_8px_24px_rgba(255,255,255,0.15)]">
              <Play size={18} fill="black" />
              Play
            </button>
            
            {/* Add to Watchlist */}
            <button className="flex items-center gap-2 bg-white/15 border border-white/30 text-white px-5 py-3 rounded-md font-semibold text-[15px] transition-all hover:bg-white/25">
              <Plus size={18} />
              Watchlist
            </button>

            {/* More Info */}
            <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-md font-medium text-[15px] transition-all hover:bg-white/20">
              <Info size={18} />
              More Info
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── LAYER 6: Progress Indicators ── */}
      <div className="absolute bottom-8 left-[80px] z-30 flex items-center gap-2">
        {FEATURED_MOVIES.map((_, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={idx}
              onClick={() => {
                setCurrent(idx);
                setShowVideo(false);
              }}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 relative overflow-hidden bg-white/30 ${
                isActive ? 'w-6' : 'w-1.5 hover:bg-white/50'
              }`}
            >
              {isActive && (
                <div
                  className="absolute top-0 left-0 bottom-0 bg-white"
                  style={{
                    animation: paused ? 'none' : 'fillBar 8s linear forwards',
                    width: paused ? '100%' : '0%'
                  }}
                />
              )}
            </div>
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
