import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

// Placeholder gradients for episodes without thumbnail images
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #1a0a2e, #2d1b69, #0d0d0d)',
  'linear-gradient(135deg, #16213e, #0f3460, #533483)',
  'linear-gradient(135deg, #0d0d0d, #1a0a2e, #6d1b7b)',
  'linear-gradient(135deg, #200122, #6f0000, #200122)',
  'linear-gradient(135deg, #0f0c29, #1a0a2e, #302b63)',
  'linear-gradient(135deg, #141e30, #243b55, #0d0d0d)',
  'linear-gradient(135deg, #1a0a2e, #0d0d0d, #2d1b69)',
];

function EpisodeCard({ episode, index }) {
  const [hovered, setHovered] = useState(false);

  const hasThumbnail = !!episode.thumbnail;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 220,
        height: 130,
        flexShrink: 0,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)'
          : '0 4px 12px rgba(0,0,0,0.4)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* LAYER 0 — Thumbnail or gradient placeholder */}
      {hasThumbnail ? (
        <img
          src={episode.thumbnail}
          alt={episode.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.4s ease',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: gradient,
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
      )}

      {/* LAYER 1 — Bottom gradient for text readability */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '65%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 2 — Platform badge (top-left) */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#6d28d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          color: '#fff',
          boxShadow: '0 0 8px rgba(109,40,217,0.6)',
          zIndex: 3,
        }}
      >
        S
      </div>

      {/* LAYER 2b — Duration badge (top-right) */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: 10,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.8)',
          zIndex: 3,
        }}
      >
        {episode.duration}
      </div>

      {/* LAYER 3 — Episode title (always visible) */}
      <p
        style={{
          position: 'absolute',
          bottom: 12,
          left: 10,
          right: 10,
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          color: '#ffffff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          zIndex: 3,
        }}
      >
        {episode.title}
      </p>

      {/* LAYER 4 — Hover overlay with play button */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 4,
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 1 : 0.75, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          <Play size={14} fill="#111" color="#111" style={{ marginLeft: 2 }} />
        </motion.div>
      </div>

      {/* LAYER 5 — Progress bar (bottom edge) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 3,
          background: 'rgba(255,255,255,0.12)',
          zIndex: 5,
        }}
      >
        {episode.progress > 0 && (
          <div
            style={{
              height: '100%',
              width: `${episode.progress}%`,
              background: '#7c3aed',
              borderRadius: '0 2px 2px 0',
              transition: 'width 0.3s ease',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default EpisodeCard;
