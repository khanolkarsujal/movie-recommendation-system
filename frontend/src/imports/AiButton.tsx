import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../store';

const AiButton: React.FC = () => {
  const { toggleAiDrawer, aiDrawerOpen } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseEnter = useCallback(() => setShowTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTooltip(false), []);

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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 right-8 z-[500]"
        >
          <div className="ai-pulse-ring" />

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-[68px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1a1a22] border border-white/10 rounded-lg px-3 py-2 text-[12px] font-semibold text-white shadow-xl backdrop-blur-md pointer-events-none"
                role="tooltip"
              >
                ✨ AI Movie Assistant
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-[#1a1a22]" />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleAiDrawer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            aria-label="Open AI Movie Assistant"
            aria-expanded={aiDrawerOpen}
            className="relative w-14 h-14 rounded-full flex items-center justify-center text-white outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 transition-transform hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <Sparkles size={22} />

            <div
              className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#050508] shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              role="status"
              aria-label="AI assistant online"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiButton;
