/**
 * LoadingScreen Component
 * Premium OTT Cinematic loading experience
 */

import React from 'react';
import { motion } from 'framer-motion';
// Note: If using 'motion/react', change the import back: import { motion } from 'motion/react';

interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  fullscreen = true,
}) => {
  return (
    <div
      className={`
        ${fullscreen ? 'fixed inset-0' : 'absolute inset-0'}
        z-[9999] bg-[#050508] flex flex-col items-center justify-center overflow-hidden
      `}
    >
      {/* Deep cinematic background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,transparent_50%)] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main Emblem - Cinematic Play/S Logo Reveal */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Pulsing outer rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 2] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border border-[var(--brand-purple)]/30"
            />
          ))}

          {/* Core glowing orb */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute w-16 h-16 rounded-full bg-[var(--brand-purple)] blur-xl opacity-40"
          />

          {/* Logo Mark - sleek glowing 'S' / Stream symbol */}
          <motion.svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            className="relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]"
          >
            <motion.path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z"
              fill="url(#premium-glow)"
              initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
              animate={{ pathLength: 1, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="premium-glow" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#e2e8f0" />
                <stop offset="1" stopColor="var(--brand-purple, #8b5cf6)" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>

        {/* Cinematic Text Reveal */}
        <div className="overflow-hidden mb-8 h-8 flex items-center justify-center">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-2xl font-black tracking-[0.2em] uppercase"
            style={{ textShadow: '0 4px 20px rgba(139,92,246,0.5)' }}
          >
            StreamVault
          </motion.h1>
        </div>

        {/* Premium Progress Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{
              duration: 2,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 0.5
            }}
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-[var(--brand-purple)] to-white rounded-full"
          />
        </div>

        {/* Optional Sub-message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-6 text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase"
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton Loading Component
 * OTT Upgrade: Dark glassmorphic shimmer
 */
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden bg-[#1c1c1c] rounded-xl border border-white/5 ${className}`}>
      {/* Framer motion shimmer sweep */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
          repeatDelay: 0.2
        }}
        className="absolute inset-0 w-[50%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
      />
    </div>
  );
};

/**
 * Spinner Component
 * OTT Upgrade: Cinematic dual-ring buffer spinner
 */
export const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = 'text-white',
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_8px_currentColor]"
      >
        {/* Faded track */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.15"
        />
        {/* Animated head */}
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export default LoadingScreen;