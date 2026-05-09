import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative rounded-lg overflow-hidden mb-3 bg-white/5">
        <img
          src={episode.thumbnail}
          alt={episode.title}
          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/${episode.id}/400/225`;
          }}
        />
        {episode.badge && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-[var(--accent)] text-white text-xs font-bold rounded">
            {episode.badge}
          </div>
        )}
        {episode.progress !== undefined && episode.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-[var(--accent)]"
              style={{ width: `${episode.progress}%` }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="scale-0 group-hover:scale-100 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
              <Play size={24} className="text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold text-[15px] mb-1 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
          {episode.title}
        </h3>
        <div className="flex items-center gap-2 text-white/40 text-[13px]">
          {episode.episodeNumber && (
            <span>
              S{episode.seasonNumber} E{episode.episodeNumber}
            </span>
          )}
          {episode.duration && <span>{episode.duration}</span>}
          {episode.rating && (
            <span className="text-[var(--accent)]">★ {episode.rating}</span>
          )}
        </div>
        {episode.description && (
          <p className="text-white/30 text-xs mt-1.5 line-clamp-2">
            {episode.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EpisodeCard;
