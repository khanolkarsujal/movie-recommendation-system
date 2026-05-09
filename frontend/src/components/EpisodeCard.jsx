import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium gradients for placeholder thumbnails
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #1a0a2e, #2d1b69, #0d0d0d)',
  'linear-gradient(135deg, #16213e, #0f3460, #533483)',
  'linear-gradient(135deg, #0d0d0d, #1a0a2e, #6d1b7b)',
  'linear-gradient(135deg, #200122, #6f0000, #200122)',
];

function EpisodeCard({ episode, index }) {
  const [hovered, setHovered] = useState(false);

  const hasThumbnail = !!episode.thumbnail;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl overflow-hidden cursor-pointer group flex-shrink-0"
      style={{
        width: 280,
        height: 158, // 16:9 aspect ratio
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.15)'
          : '0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      tabIndex={0}
      aria-label={`Play ${episode.title}`}
    >
      {/* ── LAYER 0: Thumbnail ── */}
      <div className="absolute inset-0 z-0">
        {hasThumbnail ? (
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1.0)' }}
          />
        ) : (
          <div
            className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ background: gradient, transform: hovered ? 'scale(1.08)' : 'scale(1.0)' }}
          />
        )}
      </div>

      {/* ── LAYER 1: Default Gradient Overlay ── */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
          opacity: hovered ? 0 : 1,
        }}
      />

      {/* ── LAYER 2: Hover Gradient Overlay ── */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.2) 100%)',
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* ── LAYER 3: Badges (Top Left/Right) ── */}
      <div className="absolute top-2.5 left-2.5 z-20 flex gap-1.5 opacity-100 transition-opacity duration-300">
        <div className="w-5 h-5 rounded-full bg-[#8b5cf6] flex items-center justify-center shadow-md">
          <span className="text-[10px] font-bold text-white">S</span>
        </div>
      </div>
      
      {!hovered && (
        <div className="absolute top-2.5 right-2.5 z-20 bg-black/60 backdrop-blur-md rounded px-1.5 py-0.5 shadow-sm">
          <span className="text-[11px] font-semibold text-white/90">{episode.duration}</span>
        </div>
      )}

      {/* ── LAYER 4: Content Base (Always visible, shifts on hover) ── */}
      <div
        className="absolute left-0 w-full px-3 z-30 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-end"
        style={{
          bottom: hovered ? 'auto' : '12px',
          top: hovered ? '12px' : 'auto',
          height: hovered ? '100%' : 'auto',
        }}
      >
        <h3 
          className="text-[14px] font-bold text-white leading-tight drop-shadow-md line-clamp-1 transition-all"
          style={{ transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
        >
          {episode.title}
        </h3>

        {/* ── LAYER 5: Expanded Hover Content ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex flex-col gap-2 mt-auto pb-3"
            >
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-1">
                <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/80 transition-colors shadow-lg hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]">
                  <Play size={14} fill="black" className="ml-0.5" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#2a2a2a]/80 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]">
                  <Plus size={16} />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#2a2a2a]/80 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]">
                  <ThumbsUp size={14} />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#2a2a2a]/80 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] ml-auto">
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 text-[11px] font-semibold">
                <span className="text-[#22c55e] drop-shadow-sm">98% Match</span>
                <span className="border border-white/30 px-1 rounded-[3px] text-white/80 leading-tight">TV-MA</span>
                <span className="text-white/80">{episode.duration}</span>
                <span className="border border-white/30 px-1 rounded-[3px] text-white/80 leading-tight">HD</span>
              </div>
              
              {/* Categories */}
              <div className="flex items-center gap-1.5 text-[11px] text-white/60 font-medium">
                <span>Action</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Fantasy</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Dark</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── LAYER 6: Progress Bar (Always at bottom edge) ── */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10 z-20">
        {(episode.progress > 0 || hovered) && (
          <div
            className="h-full bg-[#8b5cf6] rounded-r-full transition-all duration-300"
            style={{ width: hovered ? '100%' : `${episode.progress || 0}%` }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default EpisodeCard;
