import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Note: If your project uses 'motion/react', change import to: 
// import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';

// Enhanced "Logo" Sparkles - Scaled up and perfectly centered
const SparkleLogo = ({ isHovered }: { isHovered: boolean }) => (
  <motion.svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{
      rotate: isHovered ? [0, 15, -5, 0] : 0,
      scale: isHovered ? 1.05 : 1
    }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="relative z-10"
  >
    {/* Main central star */}
    <path d="M12 4L13.8 9.8L19.5 11.5L13.8 13.2L12 19L10.2 13.2L4.5 11.5L10.2 9.8L12 4Z" fill="url(#logo-sparkle-main)" />
    {/* Top left accent star */}
    <motion.path
      d="M5.5 3L6.2 5.8L9 6.5L6.2 7.2L5.5 10L4.8 7.2L2 6.5L4.8 5.8L5.5 3Z"
      fill={isHovered ? "#A855F7" : "#0F172A"}
      animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
    {/* Bottom right accent star */}
    <motion.path
      d="M18.5 14L19 16L21 16.5L19 17L18.5 19L18 17L16 16.5L18 16L18.5 14Z"
      fill={isHovered ? "#06B6D4" : "#0F172A"}
      animate={{ scale: isHovered ? [1, 1.4, 1] : 1 }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    />
    <defs>
      <linearGradient id="logo-sparkle-main" x1="4.5" y1="4" x2="19.5" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor={isHovered ? "#06B6D4" : "#0F172A"} />
        <stop offset="1" stopColor={isHovered ? "#3B82F6" : "#0F172A"} />
      </linearGradient>
    </defs>
  </motion.svg>
);

const AiLogoButton: React.FC = () => {
  const { toggleAiDrawer, aiDrawerOpen } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
    setIsHovered(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAiDrawer();
    }
  }, [toggleAiDrawer]);

  return (
    <AnimatePresence>
      {!aiDrawerOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[999] flex items-center"
        >
          {/* Tooltip (Crucial now that text is removed) */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-[calc(100%+20px)] whitespace-nowrap bg-[#0B0F19]/90 border border-white/10 rounded-xl px-4 py-2.5 text-[14px] font-medium text-white shadow-2xl backdrop-blur-xl pointer-events-none flex items-center gap-2"
                role="tooltip"
              >
                Ask AI Assistant
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[7px] border-transparent border-l-[#0B0F19]/90" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact "Logo" Size: 52x52 (Smaller than previous 72x72) */}
          <div
            className="relative cursor-pointer w-[52px] h-[52px] flex items-center justify-center group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >

            {/* Ambient Background Glow */}
            <motion.div
              className="absolute inset-1 rounded-full blur-[14px] z-[-1]"
              animate={{
                opacity: isHovered ? 0.9 : 0.4,
                scale: isHovered ? 1.4 : 1.1,
              }}
              style={{
                background: "linear-gradient(135deg, #00F2FE, #A18CD1)"
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Rotating Gradient Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: isHovered ? 2 : 4, // Spins faster on hover
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-0 rounded-full z-0"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, #00F2FE 0%, #4FACFE 25%, #A18CD1 50%, #FBC2EB 75%, #00F2FE 100%)',
              }}
            />

            {/* Solid White Inner Button - Thinner inset [2px] for a sharper logo look */}
            <motion.button
              onClick={toggleAiDrawer}
              onKeyDown={handleKeyDown}
              aria-label="Open AI Movie Assistant"
              aria-expanded={aiDrawerOpen}
              whileTap={{ scale: 0.9 }}
              // Inner shadows for 3D depth
              className="absolute inset-[2.5px] z-10 flex items-center justify-center bg-[#FAFAFA] rounded-full outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/50 shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),_inset_0_4px_8px_rgba(255,255,255,1)] overflow-hidden"
            >
              {/* Glass top highlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-gradient-to-b from-white to-transparent rounded-full opacity-90 pointer-events-none" />

              {/* Just the Symbol */}
              <div className="relative z-20 flex items-center justify-center">
                <SparkleLogo isHovered={isHovered} />
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiLogoButton;