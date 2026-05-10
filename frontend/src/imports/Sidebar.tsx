import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  BarChart2,
  UserRound,
  Calendar,
  Zap,
  Bell,
  Settings,
  LogOut,
  Palette,
  Heart,
  Film,
  ChevronRight,
  ListVideo,
} from 'lucide-react';
import type { NavItem } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_COLLAPSED = 64;
const SIDEBAR_EXPANDED = 220;
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_SPRING = { type: 'spring', stiffness: 380, damping: 22 } as const;

const avatarImg = 'https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=200&h=200&fit=crop';

const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: Home, path: '/', label: 'Home' },
  { id: 'browse', icon: Film, path: '/browse', label: 'Browse' },
  { id: 'watchlist', icon: Heart, path: '/watchlist', label: 'Watchlist' },
  { id: 'activity', icon: Zap, path: '/activity', label: 'Activity' },
  { id: 'analytics', icon: BarChart2, path: '/analytics', label: 'Analytics' },
  { id: 'schedule', icon: Calendar, path: '/schedule', label: 'Schedule' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: 'notifs', icon: Bell, path: '/notifications', label: 'Notifications', badge: 2 },
  { id: 'settings', icon: Settings, path: '/settings', label: 'Settings' },
];

const MENU_ITEMS = [
  { icon: UserRound, label: 'View Profile', action: 'profile', danger: false },
  { icon: ListVideo, label: 'My Watchlist', action: 'watchlist', danger: false },
  { icon: Settings, label: 'Settings', action: 'settings', danger: false },
  { icon: Palette, label: 'Appearance', action: 'appearance', danger: false },
  { icon: LogOut, label: 'Sign Out', action: 'signout', danger: true },
];

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
            className={`transition-colors duration-200 ${
              active ? 'text-white' : isHovered ? 'text-white/90' : 'text-white/50'
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
            className={`text-[14px] font-medium transition-colors ${
              active ? 'text-white' : isHovered ? 'text-white/90' : 'text-white/50'
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

// ─── AvatarMenu ───────────────────────────────────────────────────────────────

interface AvatarMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const AvatarMenu = React.forwardRef<HTMLDivElement, AvatarMenuProps>(
  ({ open, onClose, onNavigate }, ref) => (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -10, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, x: -10, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="fixed bottom-4 left-[72px] w-[220px] rounded-2xl bg-[#121216] border border-white/10 backdrop-blur-2xl shadow-2xl z-[99999] overflow-hidden p-1.5"
        >
          <div className="flex items-center gap-3 p-3 border-b border-white/10 mb-1">
            <img
              src={avatarImg}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-[var(--brand-purple)]"
            />
            <div>
              <p className="text-[14px] font-bold text-white leading-tight">John Doe</p>
              <p className="text-[12px] text-white/40 leading-snug">john@email.com</p>
            </div>
          </div>

          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isDividerBefore = item.action === 'signout';
            return (
              <React.Fragment key={item.action}>
                {isDividerBefore && <div className="h-px bg-white/10 my-1 mx-2" />}
                <button
                  onClick={() => { onNavigate(`/${item.action}`); onClose(); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-colors
                    ${item.danger ? 'text-red-400 hover:bg-red-400/10' : 'text-white/70 hover:text-white hover:bg-white/10'}
                  `}
                >
                  <span className="flex items-center gap-2.5 text-[14px] font-medium">
                    <Icon size={16} strokeWidth={2} />
                    {item.label}
                  </span>
                  {!item.danger && <ChevronRight size={14} className="opacity-40" />}
                </button>
              </React.Fragment>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        avatarMenuRef.current && !avatarMenuRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.aside
        aria-label="Main navigation"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => { setIsExpanded(false); setMenuOpen(false); }}
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

        {/* Bottom Actions */}
        <div className="shrink-0 pb-6 flex flex-col">
          {BOTTOM_ITEMS.map((item) => (
            <NavIcon
              key={item.id}
              item={item}
              active={isActive(item.path)}
              expanded={isExpanded}
              onClick={() => navigate(item.path)}
            />
          ))}

          <div className="w-full px-4 my-2">
            <div className="h-px w-full bg-white/10" />
          </div>

          <div className="w-full px-3 mt-2" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full flex items-center h-10 rounded-xl hover:bg-white/10 transition-colors shrink-0"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 ml-[-2px]">
                <img
                  src={avatarImg}
                  alt="Profile"
                  className={`w-8 h-8 rounded-full object-cover border-2 ${menuOpen ? 'border-[var(--brand-purple)]' : 'border-white/20'}`}
                />
              </div>
              <motion.div
                animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                className="whitespace-nowrap overflow-hidden flex-1 text-left ml-2 flex flex-col"
              >
                <span className="text-white text-[13px] font-bold leading-tight">John Doe</span>
                <span className="text-white/40 text-[11px] font-medium leading-tight">View Profile</span>
              </motion.div>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Render AvatarMenu completely outside the aside to prevent overflow clipping */}
      <AvatarMenu
        ref={avatarMenuRef}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
      />
    </>
  );
};

export default Sidebar;