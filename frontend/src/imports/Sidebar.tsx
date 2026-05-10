import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
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

const SIDEBAR_W = 56;          // px — tighter, more premium
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_SPRING = { type: 'spring', stiffness: 380, damping: 22 } as const;

const avatarImg =
  'https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=200&h=200&fit=crop';

const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: Home, path: '/', label: 'Home' },
  { id: 'browse', icon: Film, path: '/browse', label: 'Browse' },
  { id: 'watchlist', icon: Heart, path: '/watchlist', label: 'Watchlist' },
  { id: 'activity', icon: Zap, path: '/activity', label: 'Activity' },
  { id: 'analytics', icon: BarChart2, path: '/analytics', label: 'Analytics' },
  { id: 'profile', icon: UserRound, path: '/profile', label: 'Profile' },
  { id: 'schedule', icon: Calendar, path: '/schedule', label: 'Schedule' },
  { id: 'notifs', icon: Bell, path: '/notifications', label: 'Notifications', badge: 2 },
];

const MENU_ITEMS = [
  { icon: UserRound, label: 'View Profile', action: 'profile', danger: false },
  { icon: ListVideo, label: 'My Watchlist', action: 'watchlist', danger: false },
  { icon: Settings, label: 'Settings', action: 'settings', danger: false },
  { icon: Palette, label: 'Appearance', action: 'appearance', danger: false },
  { icon: LogOut, label: 'Sign Out', action: 'signout', danger: true },
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipProps {
  label: string;
  anchorTop: number;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ label, anchorTop, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, x: -6, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -4, scale: 0.97 }}
        transition={{ duration: 0.14, ease: EASE_OUT, delay: 0.28 }}
        style={{
          position: 'fixed',
          top: anchorTop - 1,
          left: SIDEBAR_W + 10,
          zIndex: 99999,
          pointerEvents: 'none',
        }}
      >
        {/* Arrow */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -4,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderRight: '5px solid rgba(40,40,48,0.98)',
          }}
        />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 10px',
            borderRadius: 7,
            background: 'rgba(28,28,34,0.98)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            fontSize: 12,
            fontWeight: 600,
            color: '#e5e5e5',
            whiteSpace: 'nowrap',
            letterSpacing: '0.1px',
          }}
        >
          {label}
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── NavIcon ──────────────────────────────────────────────────────────────────

interface NavIconProps {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  onHover: (e: React.MouseEvent, id: string) => void;
  onLeave: () => void;
  hoveredId: string | null;
  hoverTop: number;
}

const NavIcon: React.FC<NavIconProps> = ({
  item, active, onClick, onHover, onLeave, hoveredId, hoverTop,
}) => {
  const Icon = item.icon;
  const isHovered = hoveredId === item.id;

  return (
    <div
      style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <motion.button
        role="button"
        tabIndex={0}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        onMouseEnter={(e) => onHover(e, item.id)}
        onMouseLeave={onLeave}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        transition={EASE_SPRING}
        style={{
          position: 'relative',
          width: 40,
          height: 40,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          transition: 'background 0.15s ease',
        }}
      >
        <Icon
          size={19}
          style={{
            color: active
              ? '#ffffff'
              : isHovered
                ? 'rgba(255,255,255,0.75)'
                : 'rgba(255,255,255,0.32)',
            transition: 'color 0.18s ease',
            strokeWidth: active ? 2.0 : 1.6,
          }}
        />

        {/* Notification badge */}
        {item.badge && item.badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.3 }}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#ef4444',
              border: `2px solid rgba(10,10,12,0.98)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 7,
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {item.badge > 9 ? '9+' : item.badge}
          </motion.span>
        )}
      </motion.button>

      <Tooltip label={item.label} anchorTop={hoverTop} visible={isHovered} />
    </div>
  );
};

// ─── AvatarMenu ───────────────────────────────────────────────────────────────

interface AvatarMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ open, onClose, onNavigate }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, x: -14, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
        exit={{ opacity: 0, x: -10, scale: 0.95, y: 4 }}
        transition={{ duration: 0.22, ease: EASE_OUT }}
        style={{
          position: 'fixed',
          left: SIDEBAR_W + 8,
          bottom: 12,
          width: 200,
          borderRadius: 14,
          background: 'rgba(18,18,22,0.98)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.04)',
          zIndex: 99999,
          overflow: 'hidden',
          padding: 6,
        }}
      >
        {/* User info header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 4,
          }}
        >
          <img
            src={avatarImg}
            alt="avatar"
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(139,92,246,0.5)',
            }}
          />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e5e5e5', lineHeight: 1.2 }}>
              John Doe
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>
              john@email.com
            </p>
          </div>
        </div>

        {/* Menu items */}
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isDividerBefore = item.action === 'signout';
          return (
            <React.Fragment key={item.action}>
              {isDividerBefore && (
                <div
                  style={{
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                    margin: '4px 8px',
                  }}
                />
              )}
              <motion.button
                whileHover={{
                  background: item.danger
                    ? 'rgba(239,68,68,0.08)'
                    : 'rgba(255,255,255,0.06)'
                }}
                onClick={() => {
                  onNavigate(`/${item.action}`);
                  onClose();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'pointer',
                  background: 'transparent',
                  fontSize: 13,
                  fontWeight: 500,
                  color: item.danger ? '#f87171' : 'rgba(255,255,255,0.78)',
                  textAlign: 'left',
                  transition: 'color 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Icon size={15} strokeWidth={1.8} />
                  {item.label}
                </span>
                {!item.danger && (
                  <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
                )}
              </motion.button>
            </React.Fragment>
          );
        })}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const location = useNavigate() && useLocation();
  const navigate = useNavigate();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverTop, setHoverTop] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Close menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  const handleHover = useCallback((e: React.MouseEvent, id: string) => {
    setHoverTop(e.currentTarget.getBoundingClientRect().top + 11);
    setHoveredId(id);
  }, []);

  const handleLeave = useCallback(() => setHoveredId(null), []);

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%      { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
        }
        @keyframes breathe {
          0%,100% { box-shadow: 0 0 0 2px rgba(139,92,246,0.35); }
          50%      { box-shadow: 0 0 0 3px rgba(139,92,246,0.55); }
        }
        .sidebar-avatar:focus-visible {
          outline: 2px solid rgba(139,92,246,0.8);
          outline-offset: 3px;
        }
      `}</style>

      <aside
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: SIDEBAR_W,
          height: '100vh',
          background: 'rgba(10,10,12,0.98)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 100,
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* ── Logo zone ── */}
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={EASE_SPRING}
          aria-label="Go home"
          style={{
            width: SIDEBAR_W,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(139,92,246,0.18)',
              border: '1.5px solid rgba(139,92,246,0.45)',
              flexShrink: 0,
              fontSize: 14,
              fontWeight: 800,
              color: '#a78bfa',
              letterSpacing: '-0.5px',
              userSelect: 'none',
            }}
          >
            S
          </span>
        </motion.button>

        {/* ── Hairline divider under logo ── */}
        <div
          aria-hidden="true"
          style={{
            width: 28,
            height: 1,
            background: 'rgba(255,255,255,0.06)',
            marginBottom: 6,
            flexShrink: 0,
          }}
        />

        {/* ── Nav icons ── */}
        <nav
          aria-label="Primary navigation"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            flexGrow: 1,
            width: '100%',
            paddingTop: 4,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavIcon
              key={item.id}
              item={item}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
              onHover={handleHover}
              onLeave={handleLeave}
              hoveredId={hoveredId}
              hoverTop={hoverTop}
            />
          ))}
        </nav>

        {/* ── Bottom zone ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            flexShrink: 0,
          }}
        >
          {/* Settings */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <motion.button
              onMouseEnter={(e) => handleHover(e, 'settings')}
              onMouseLeave={handleLeave}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              transition={EASE_SPRING}
              aria-label="Settings"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                background: hoveredId === 'settings'
                  ? 'rgba(255,255,255,0.06)'
                  : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              <Settings
                size={20}
                strokeWidth={1.8}
                style={{
                  color: hoveredId === 'settings'
                    ? 'rgba(255,255,255,0.85)'
                    : 'rgba(255,255,255,0.38)',
                  transition: 'color 0.18s ease',
                }}
              />
            </motion.button>
            <Tooltip label="Settings" anchorTop={hoverTop} visible={hoveredId === 'settings'} />
          </div>

          {/* Avatar */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <motion.button
              className="sidebar-avatar"
              onMouseEnter={(e) => handleHover(e, 'avatar')}
              onMouseLeave={handleLeave}
              onClick={() => setMenuOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setMenuOpen((v) => !v);
                }
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={EASE_SPRING}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                padding: 0,
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'breathe 3s ease-in-out infinite',
              }}
            >
              <img
                src={avatarImg}
                alt="User avatar"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                  border: menuOpen
                    ? '2px solid #8b5cf6'
                    : '2px solid rgba(139,92,246,0.35)',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </motion.button>

            <Tooltip
              label="My Account"
              anchorTop={hoverTop}
              visible={hoveredId === 'avatar' && !menuOpen}
            />

            <AvatarMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onNavigate={navigate}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;