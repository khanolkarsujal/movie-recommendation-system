import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

export default function AiButton() {
  const { toggleAiDrawer, aiDrawerOpen } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          {/* Pulsing ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', animationDuration: '2s' }}
          />

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-[68px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1a1a22] border border-white/10 rounded-lg px-3 py-2 text-[12px] font-semibold text-white shadow-xl backdrop-blur-md pointer-events-none"
              >
                ✨ Get AI Recommendations
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-[#1a1a22]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <button
            onClick={toggleAiDrawer}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="Open AI Movie Assistant"
            className="relative w-14 h-14 rounded-full flex items-center justify-center text-white outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 transition-transform hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <Sparkles size={22} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
