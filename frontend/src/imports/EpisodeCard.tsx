import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
// Note: If using 'motion/react', change the import back: import { motion } from 'motion/react';
import { Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Episode } from './types';

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/watch?title=${encodeURIComponent(episode.title)}`);
  }, [navigate, episode.title]);

  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (isHovered && episode.trailerUrl) {
      videoTimeoutRef.current = setTimeout(() => setShowVideo(true), 1200);
    } else {
      setShowVideo(false);
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    }
    return () => {
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    };
  }, [isHovered, episode.trailerUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (showVideo) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [showVideo]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      // OTT UI: Clean white focus ring for TV-style D-pad navigation
      className="group cursor-pointer flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#141414] rounded-xl w-full"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      {/* OTT UI: Deep dark background skeleton before image loads */}
      <div className="relative rounded-xl overflow-hidden bg-[#1c1c1c] shadow-lg border border-white/5 group-hover:border-white/20 transition-all duration-300">

        {/* Image with smooth cinematic zoom */}
        <img
          src={episode.thumbnail}
          alt={episode.title}
          className={`w-full aspect-video object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80'; }}
        />

        {/* Video Preview */}
        {episode.trailerUrl && (
          <video
            ref={videoRef}
            src={episode.trailerUrl}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full aspect-video object-cover transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Premium Dark Glass Badge */}
        {episode.badge && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-md shadow-lg z-10">
            {episode.badge}
          </div>
        )}

        {/* OTT UI: Deep vignette at the bottom anchors the progress bar and ensures readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />

        {/* Cinematic Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          {/* Frosted Glass Play Button */}
          <motion.div
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:bg-white/20 group-hover:border-white/40"
          >
            <Play size={24} className="text-white ml-1 drop-shadow-md" fill="white" />
          </motion.div>
        </div>

        {/* Glowing Neon Progress Bar */}
        {episode.progress !== undefined && episode.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/20 backdrop-blur-sm z-20 overflow-hidden">
            <div
              className="h-full relative rounded-r-full transition-all duration-500"
              style={{
                width: `${episode.progress}%`,
                // OTT UI: Solid brand color with heavy neon glow instead of multi-color gradients
                backgroundColor: 'var(--brand-purple, #8b5cf6)',
                boxShadow: '0 0 12px var(--brand-purple, #8b5cf6)'
              }}
            >
              {/* Little bright tip at the end of the progress bar */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px]" />
            </div>
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <div className="px-1 flex flex-col gap-1.5">
        {/* OTT UI: Clean white text with drop shadow instead of crypto-style gradient text */}
        <h3 className="text-white/90 font-bold text-[15px] leading-tight line-clamp-1 transition-colors duration-300 group-hover:text-white drop-shadow-sm">
          {episode.title}
        </h3>

        {/* OTT UI: Standardized Metadata Row with Dot Separators (•) */}
        <div className="flex items-center flex-wrap gap-2 text-white/50 text-[12px] font-medium tracking-wide">
          {episode.episodeNumber && (
            <span className="text-white/90 bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-bold">
              S{episode.seasonNumber} E{episode.episodeNumber}
            </span>
          )}

          {episode.episodeNumber && (episode.duration || episode.rating) && (
            <span className="w-1 h-1 rounded-full bg-white/30" />
          )}

          {episode.duration && (
            <span>{episode.duration}</span>
          )}

          {episode.duration && episode.rating && (
            <span className="w-1 h-1 rounded-full bg-white/30" />
          )}

          {episode.rating && (
            <span className="flex items-center gap-1 text-white/80">
              <Star size={12} className="text-yellow-500" fill="currentColor" />
              {episode.rating}
            </span>
          )}
        </div>

        {episode.description && (
          <p className="text-white/40 text-[12px] leading-relaxed line-clamp-2 mt-0.5 group-hover:text-white/60 transition-colors duration-300">
            {episode.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EpisodeCard;