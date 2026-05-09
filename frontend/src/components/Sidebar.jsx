import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import avatarImg from '../assets/avatar.png';

const navItems = [
  { id: 'home',          icon: Home,      path: '/',          label: 'Home' },
  { id: 'movies',        icon: Film,      path: '/browse',    label: 'Browse' },
  { id: 'watchlist',     icon: Heart,     path: '/watchlist', label: 'Watchlist' },
  { id: 'analytics',    icon: BarChart2,  path: '/analytics', label: 'Analytics' },
  { id: 'profile',      icon: UserRound,  path: '/profile',   label: 'Profile' },
  { id: 'calendar',     icon: Calendar,   path: '/schedule',  label: 'Schedule' },
  { id: 'lightning',    icon: Zap,        path: '/activity',  label: 'Activity' },
  { id: 'notifications',icon: Bell,       path: '/notifications', label: 'Notifications', badge: 2 },
];

// Tooltip Component
const Tooltip = ({ isVisible, label, top }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.15, ease: 'easeOut', delay: 0.3 }}
          style={{
            position: 'fixed',
            top: top + 6, // Vertically center relative to 44px button height
            left: 72, // 64px sidebar + 8px gap
            zIndex: 9999,
          }}
          className="bg-[#1e1e1e]/95 border border-white/10 rounded-md px-3 py-1.5 backdrop-blur-md pointer-events-none"
        >
          {/* Arrow */}
          <div 
            className="absolute top-1/2 -left-[5px] -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[5px] border-r-white/10"
          />
          <span className="text-[13px] text-white font-medium whitespace-nowrap">{label}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverTop, setHoverTop] = useState(0);
  const [ringBell, setRingBell] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const menuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Bell ring animation interval (every 10s if has notifications)
  useEffect(() => {
    const hasNotifications = navItems.find((i) => i.id === 'notifications')?.badge > 0;
    if (hasNotifications) {
      setRingBell(true);
      const timer = setTimeout(() => setRingBell(false), 500);
      
      const interval = setInterval(() => {
        setRingBell(true);
        setTimeout(() => setRingBell(false), 500);
      }, 10000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, []);

  // Close menu on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleMouseEnter = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverTop(rect.top);
    setHoveredId(id);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[64px] bg-[#111111] flex flex-col items-center z-[100]">
      {/* Unified Header Zone */}
      <div className="h-[64px] flex items-center justify-center w-full">
        <div className="flex items-center gap-1 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Film size={18} color="white" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-2 flex-grow mt-2 items-center w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.div
              key={item.id}
              role="button"
              tabIndex={0}
              onMouseEnter={(e) => handleMouseEnter(e, item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(item.path)}
              onKeyDown={(e) => handleKeyDown(e, () => navigate(item.path))}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              transition={{ hover: { type: 'spring', stiffness: 400, damping: 10 } }}
              className={`relative w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]/80 ${
                active ? 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 shadow-[0_0_16px_rgba(139,92,246,0.3)]' : 'bg-transparent hover:bg-white/5 border border-transparent'
              }`}
              style={{ transition: 'background 0.2s ease, border 0.2s ease' }}
            >
              {/* Active Left Accent Bar */}
              {active && (
                <div className="absolute left-[-10px] w-[3px] h-[24px] bg-[#8b5cf6] rounded-r-[3px]" />
              )}

              <Icon
                size={22}
                className={`relative z-10 transition-colors duration-200 ${
                  active ? 'text-white' : 'text-white/45 hover:text-white/85'
                } ${item.id === 'notifications' && ringBell ? 'animate-bellRing' : ''}`}
              />

              {/* Notification Badge */}
              {item.badge > 0 && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#8b5cf6] rounded-full border-2 border-[#111111] flex items-center justify-center z-20 animate-badgePulse">
                  <span className="text-[9px] text-white font-bold">{item.badge}</span>
                </div>
              )}

              <Tooltip isVisible={hoveredId === item.id} label={item.label} top={hoverTop} />
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-4 mt-auto mb-4 w-full">
        {/* Settings */}
        <motion.div
          role="button"
          tabIndex={0}
          onMouseEnter={(e) => handleMouseEnter(e, 'settings')}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => {}}
          onKeyDown={(e) => handleKeyDown(e, () => {})}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-transparent hover:bg-white/5 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]/80"
          style={{ transition: 'background 0.2s ease' }}
        >
          <Settings size={22} className="text-white/45 hover:text-white/85 transition-colors duration-200" />
          <Tooltip isVisible={hoveredId === 'settings'} label="Settings" top={hoverTop} />
        </motion.div>

        {/* Avatar */}
        <div className="relative" ref={menuRef}>
          <motion.div
            role="button"
            tabIndex={0}
            onMouseEnter={(e) => handleMouseEnter(e, 'avatar')}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setMenuOpen(!menuOpen)}
            onKeyDown={(e) => handleKeyDown(e, () => setMenuOpen(!menuOpen))}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer animate-breathingPulse outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]/80"
          >
            <img src={avatarImg} alt="User Avatar" className="w-full h-full object-cover" />
          </motion.div>
          <Tooltip isVisible={hoveredId === 'avatar' && !menuOpen} label="My Account" top={hoverTop} />

          {/* Avatar Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -12, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -12, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="fixed left-[72px] bottom-4 bg-[#141414]/98 border border-white/10 rounded-xl p-2 min-w-[180px] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-[9999]"
              >
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] text-white/85 hover:bg-white/10 transition-colors ease-in-out duration-150 cursor-pointer">
                  <UserRound size={16} />
                  View Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] text-white/85 hover:bg-white/10 transition-colors ease-in-out duration-150 cursor-pointer">
                  <Settings size={16} />
                  Settings
                </button>
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] text-white/85 hover:bg-white/10 transition-colors ease-in-out duration-150 cursor-pointer">
                  <Palette size={16} />
                  Appearance
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] text-white/85 hover:bg-white/10 hover:text-[#ef4444] transition-colors ease-in-out duration-150 cursor-pointer">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
