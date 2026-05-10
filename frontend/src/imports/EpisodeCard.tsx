import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group cursor-pointer flex flex-col gap-3 outline-none focus-visible:ring-4 focus-visible:ring-[#8b5cf6]/50 rounded-xl"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Thumbnail Container */}
      <div className="relative rounded-xl overflow-hidden bg-[#141414] shadow-lg border border-white/5 group-hover:border-white/10 transition-colors duration-300">

        {/* Image with smooth hover scale */}
        <img
          src={episode.thumbnail}
          alt={episode.title}
          className="w-full aspect-video object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/${episode.id}/400/225`;
          }}
        />

        {/* Premium Dark Glass Badge */}
        {episode.badge && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-black tracking-wider uppercase rounded-md shadow-lg z-10">
            {episode.badge}
          </div>
        )}

        {/* Cinematic Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">

          {/* Frosted Glass Play Button */}
          <motion.div
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white/20 hover:border-white/40"
          >
            <Play size={24} className="text-white ml-1 drop-shadow-md" fill="white" />
          </motion.div>
        </div>

        {/* Glowing Neon Progress Bar */}
        {episode.progress !== undefined && episode.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-black/60 backdrop-blur-sm z-20 overflow-hidden">
            <div
              className="h-full relative rounded-r-full"
              style={{
                width: `${episode.progress}%`,
                background: 'linear-gradient(90deg, #00d2ff 0%, #8b5cf6 100%)',
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)'
              }}
            >
              {/* Little bright tip at the end of the progress bar */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[2px]" />
            </div>
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <div className="px-1">
        <h3 className="text-white font-bold text-[15px] leading-tight mb-1.5 line-clamp-1 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400">
          {episode.title}
        </h3>

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-white/50 text-[12px] font-medium">
          {episode.episodeNumber && (
            <span className="text-white/80 bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-bold tracking-wide">
              S{episode.seasonNumber} E{episode.episodeNumber}
            </span>
          )}

          {episode.duration && (
            <span className="flex items-center">
              {episode.duration}
            </span>
          )}

          {episode.rating && (
            <span className="flex items-center gap-1 text-yellow-400/90 font-bold">
              <Star size={12} fill="currentColor" />
              {episode.rating}
            </span>
          )}
        </div>

        {episode.description && (
          <p className="text-white/40 text-[12px] leading-relaxed mt-2 line-clamp-2 group-hover:text-white/60 transition-colors duration-300">
            {episode.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EpisodeCard;