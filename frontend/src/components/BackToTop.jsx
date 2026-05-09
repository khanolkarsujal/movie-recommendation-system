import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-8 right-28 z-[500] w-10 h-10 rounded-full bg-white/8 border border-white/12 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
