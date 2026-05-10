import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Zap,
  Settings,
  Heart,
  Film,
} from 'lucide-react';
import type { NavItem } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_COLLAPSED = 64;
const SIDEBAR_EXPANDED = 220;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_SPRING = { type: 'spring', stiffness: 380, damping: 22 } as const;


// ─── NavIcon ──────────────────────────────────────────────────────────────────

interface NavIconProps {
  item: NavItem;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

const NavIcon: React.FC<NavIconProps> = ({ item, active, expanded, onClick }) => {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full px-3 mb-2">
      <motion.button
        role="button"
        tabIndex={0}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
        }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center w-full h-10 rounded-xl cursor-pointer border-none outline-none group bg-transparent overflow-hidden"
      >
        {/* Active/Hover Pill Highlight */}
        <AnimatePresence>
          {(active || isHovered) && (
            <motion.div
              layoutId="activePill"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`absolute inset-0 rounded-xl z-0 ${active ? 'bg-[var(--brand-purple)]/20' : 'bg-white/10'}`}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex items-center min-w-[40px] justify-center ml-[-2px]">
          <Icon
            size={20}
            className={`transition-colors duration-200 ${active ? 'text-white' : isHovered ? 'text-white/90' : 'text-white/50'
              }`}
            strokeWidth={active ? 2.5 : 2}
          />
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white border border-[#0a0a0c]">
              {item.badge}
            </span>
          )}
        </div>

        {/* Expanded Label */}
        <div className="relative z-10 whitespace-nowrap overflow-hidden flex-1 text-left ml-2">
          <motion.span
            animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            className={`text-[14px] font-medium transition-colors ${active ? 'text-white' : isHovered ? 'text-white/90' : 'text-white/50'
              }`}
            style={{ display: 'block' }}
          >
            {item.label}
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: Home, path: '/', label: 'Home' },
  { id: 'browse', icon: Film, path: '/browse', label: 'Browse' },
  { id: 'watchlist', icon: Heart, path: '/watchlist', label: 'Watchlist' },
  { id: 'activity', icon: Zap, path: '/activity', label: 'Activity' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: 'settings', icon: Settings, path: '/settings', label: 'Settings' },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  return (
    <motion.aside
      aria-label="Main navigation"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      animate={{ width: isExpanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      transition={EASE_SPRING}
      className="fixed left-0 top-0 h-screen bg-[#0a0a0c]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[100] shadow-2xl overflow-hidden"
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-3 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl bg-[var(--brand-purple)]/20 border border-[var(--brand-purple)]/50 flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
        >
          <span className="text-[var(--brand-purple)] font-black text-xl leading-none">S</span>
        </button>
        <motion.span
          animate={{ opacity: isExpanded ? 1 : 0 }}
          className="text-white font-bold text-xl ml-3 whitespace-nowrap tracking-tight"
        >
          Streamify
        </motion.span>
      </div>

      {/* Primary Nav */}
      <nav className="flex flex-col flex-1 mt-4">
        {NAV_ITEMS.map((item) => (
          <NavIcon
            key={item.id}
            item={item}
            active={isActive(item.path)}
            expanded={isExpanded}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* Bottom Nav */}
      <nav className="flex flex-col mb-6">
        {BOTTOM_ITEMS.map((item) => (
          <NavIcon
            key={item.id}
            item={item}
            active={isActive(item.path)}
            expanded={isExpanded}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;