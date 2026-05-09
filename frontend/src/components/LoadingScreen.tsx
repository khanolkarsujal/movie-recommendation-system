/**
 * LoadingScreen Component
 * Cinematic loading experience with brand animation
 */

import React from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  fullscreen = true,
}) => {
  return (
    <div
      className={`
        ${fullscreen ? 'fixed inset-0' : 'absolute inset-0'}
        z-[9999] bg-[var(--bg-page)] flex flex-col items-center justify-center
      `}
    >
      {/* Animated brand logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.1, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.5, 1],
        }}
        className="mb-12"
      >
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 blur-3xl bg-[var(--brand-purple)] rounded-full"
          />

          {/* Logo */}
          <motion.div
            className="relative w-24 h-24 rounded-2xl bg-[var(--brand-purple)] flex items-center justify-center
                     shadow-[0_0_60px_rgba(139,92,246,0.6)]"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
              <motion.path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
              <motion.path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading bar */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--brand-purple)] via-white to-[var(--brand-purple)]
                   rounded-full"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/60 text-[15px] font-medium"
      >
        {message}
      </motion.p>

      {/* Pulse dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 mt-4"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-[var(--brand-purple)]"
          />
        ))}
      </motion.div>
    </div>
  );
};

/**
 * Skeleton Loading Component
 * For inline content loading
 */
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="skeleton w-full h-full" />
    </div>
  );
};

/**
 * Spinner Component
 * Simple circular spinner
 */
export const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = '',
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={className}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export default LoadingScreen;
