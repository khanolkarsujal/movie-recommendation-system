/**
 * KeyboardShortcuts Component
 * Modal showing all available keyboard shortcuts
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  category: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const SHORTCUTS: Shortcut[] = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['H'], description: 'Go to Home' },
      { keys: ['B'], description: 'Go to Browse' },
      { keys: ['W'], description: 'Go to Watchlist' },
      { keys: ['P'], description: 'Go to Profile' },
      { keys: ['Esc'], description: 'Go Back' },
    ],
  },
  {
    category: 'Search',
    shortcuts: [
      { keys: ['/'], description: 'Open Search' },
      { keys: ['↑', '↓'], description: 'Navigate Results' },
      { keys: ['Enter'], description: 'Select Result' },
      { keys: ['Esc'], description: 'Close Search' },
    ],
  },
  {
    category: 'Video Player',
    shortcuts: [
      { keys: ['Space', 'K'], description: 'Play / Pause' },
      { keys: ['M'], description: 'Mute / Unmute' },
      { keys: ['F'], description: 'Fullscreen' },
      { keys: ['←'], description: 'Rewind 10s' },
      { keys: ['→'], description: 'Forward 10s' },
      { keys: ['↑'], description: 'Volume Up' },
      { keys: ['↓'], description: 'Volume Down' },
      { keys: ['I'], description: 'Skip Intro' },
      { keys: ['N'], description: 'Next Episode' },
    ],
  },
  {
    category: 'Actions',
    shortcuts: [
      { keys: ['L'], description: 'Add to Watchlist' },
      { keys: ['S'], description: 'Share' },
      { keys: ['D'], description: 'Download' },
      { keys: ['?'], description: 'Show Shortcuts' },
    ],
  },
];

export const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with ? key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Esc
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201]
                     w-full max-w-4xl max-h-[90vh] overflow-y-auto
                     bg-[var(--bg-elevated)] border border-white/10 rounded-2xl
                     shadow-[0_24px_80px_rgba(0,0,0,0.9)] p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-purple)]/20
                             flex items-center justify-center">
                  <Keyboard size={24} className="text-[var(--brand-purple)]" />
                </div>
                <div>
                  <h2 className="text-white text-[28px] font-bold tracking-tight">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-white/40 text-[14px]">Master the platform with these shortcuts</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10
                         flex items-center justify-center text-white/60 hover:text-white
                         transition-all outline-none"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SHORTCUTS.map((category, catIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="space-y-4"
                >
                  {/* Category Header */}
                  <h3 className="text-[var(--brand-purple)] text-[14px] font-bold uppercase
                               tracking-wider flex items-center gap-2">
                    <div className="w-1 h-4 bg-[var(--brand-purple)] rounded-full" />
                    {category.category}
                  </h3>

                  {/* Shortcuts List */}
                  <div className="space-y-3">
                    {category.shortcuts.map((shortcut, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                        className="flex items-center justify-between gap-4 p-3 rounded-lg
                                 bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        {/* Description */}
                        <span className="text-white/80 text-[14px] group-hover:text-white
                                       transition-colors">
                          {shortcut.description}
                        </span>

                        {/* Keys */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              {keyIndex > 0 && (
                                <span className="text-white/30 text-[12px] mx-0.5">or</span>
                              )}
                              <kbd
                                className="px-3 py-1.5 bg-white/10 border border-white/20
                                         rounded-md text-white text-[13px] font-mono font-semibold
                                         shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                                         min-w-[40px] text-center"
                              >
                                {key}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-white/30 text-[13px] text-center">
                Press{' '}
                <kbd className="px-2 py-1 bg-white/10 rounded text-white/50 font-mono">?</kbd>{' '}
                anytime to view these shortcuts
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;
