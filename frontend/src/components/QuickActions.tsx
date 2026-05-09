/**
 * QuickActions Component
 * Floating action menu for quick access to common features
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Download,
  Share2,
  Heart,
  Plus,
  Search,
  PlayCircle,
  History,
  TrendingUp,
  Settings,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const actions: QuickAction[] = [
    {
      id: 'watchlist',
      icon: <Heart size={20} />,
      label: 'Watchlist',
      color: '#ef4444',
      onClick: () => navigate('/watchlist'),
    },
    {
      id: 'trending',
      icon: <TrendingUp size={20} />,
      label: 'Trending',
      color: '#8b5cf6',
      onClick: () => navigate('/browse'),
    },
    {
      id: 'continue',
      icon: <PlayCircle size={20} />,
      label: 'Continue Watching',
      color: '#3b82f6',
      onClick: () => navigate('/'),
    },
    {
      id: 'search',
      icon: <Search size={20} />,
      label: 'Search',
      color: '#10b981',
      onClick: () => {
        // Trigger search modal
        setIsOpen(false);
      },
    },
    {
      id: 'history',
      icon: <History size={20} />,
      label: 'Watch History',
      color: '#f59e0b',
      onClick: () => navigate('/analytics'),
    },
    {
      id: 'settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      color: '#6b7280',
      onClick: () => navigate('/profile'),
    },
  ];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full
                 bg-gradient-to-br from-[var(--brand-purple)] to-purple-600
                 shadow-[0_8px_32px_rgba(139,92,246,0.5)]
                 flex items-center justify-center text-white
                 hover:shadow-[0_12px_48px_rgba(139,92,246,0.7)]
                 transition-all outline-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Quick actions menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="sparkles"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Actions Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
            />

            {/* Actions Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-28 right-8 z-[100] w-80 bg-[var(--bg-elevated)]
                       border border-white/10 rounded-2xl p-6
                       shadow-[0_24px_80px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
              <h3 className="text-white font-bold text-[18px] mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-[var(--brand-purple)]" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10
                             border border-white/5 hover:border-white/20
                             transition-all outline-none flex flex-col items-center gap-2"
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center
                               transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}20` }}
                    >
                      <div style={{ color: action.color }}>{action.icon}</div>
                    </div>

                    {/* Label */}
                    <span className="text-white/80 text-[13px] font-medium group-hover:text-white
                                   transition-colors text-center">
                      {action.label}
                    </span>

                    {/* Glow effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                               rounded-xl blur-xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${action.color}20 0%, transparent 70%)`,
                      }}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Keyboard Hint */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-white/30 text-[11px] text-center">
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    /
                  </kbd>{' '}
                  for search,{' '}
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50 font-mono">
                    ?
                  </kbd>{' '}
                  for shortcuts
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickActions;
