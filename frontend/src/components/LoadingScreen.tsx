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
  message, // OTT Standard: Default to no message. Let the logo do the talking.
  fullscreen = true,
}) => {
  return (
    <div
      className={`
        ${fullscreen ? 'fixed inset-0' : 'absolute inset-0'}
        z-[9999] bg-[#141414] flex flex-col items-center justify-center overflow-hidden
      `}
    >
      {/* Cinematic Theater Spotlight Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_60%)] pointer-events-none" />

      {/* Animated brand logo */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1], // Cinematic smooth ease-out
        }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
          {/* Subtle Ambient Glow (Replaces the harsh blur) */}
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 blur-2xl bg-[var(--brand-purple)]/50 rounded-full"
          />

          {/* Logo Container - Clean, Glassmorphic, TV-App Style */}
          <motion.div
            className="relative w-28 h-28 rounded-[28px] bg-gradient-to-br from-[#2a2a2a] to-[#141414] flex items-center justify-center
                     shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/5"
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Logo Path Drawing Animation (Netflix/Max style reveal) */}
              <motion.path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="url(#logo-gradient)"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              />
              <motion.path
                d="M2 17L12 22L22 17"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
              />
              <motion.path
                d="M2 12L12 17L22 12"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
              />

              {/* Premium Gradient for the SVG */}
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="var(--brand-purple, #8b5cf6)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Elegant Progress/Buffer Ring (Replaces the horizontal bar and dots) */}
        <div className="relative flex flex-col items-center">
          <Spinner size={32} className="text-[var(--brand-purple)]" />

          {/* Optional Message: Styled like a TV setup screen (e.g. "Optimizing Video...") */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-6 text-white/50 text-[11px] font-bold tracking-[0.2em] uppercase"
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.div>
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