import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Note: if you are using 'motion/react' instead of 'framer-motion', just change the import above!
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, X, Settings, Heart, UserRound, Palette, LogOut, Film } from 'lucide-react';
import { trendingNow, newReleases, generateEpisodes } from '../data/movies';
import type { Notification, Movie } from './types';
import { useStore } from '../store';

const avatarImg = 'https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=200&h=200&fit=crop';

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Episode Available',
    body: 'Episode 5 of Demonic Slash',
    time: '2 hours ago',
    unread: true,
    thumb: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&q=80',
  },
  {
    id: 2,
    title: 'Trending Movie',
    body: 'Shadow Realm is now #1',
    time: '5 hours ago',
    unread: true,
    thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&q=80',
  },
  {
    id: 3,
    title: 'Watchlist Update',
    body: 'A new season of Eclipse Hunters was added',
    time: '1 day ago',
    unread: false,
    thumb: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=100&q=80',
  },
];

// --- 🌟 Navbar-Optimized AI Button ---
const NavbarAiButton = () => {
  const { toggleAiDrawer } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center mr-2 ml-2">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[48px] whitespace-nowrap bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white shadow-xl flex items-center gap-1.5 pointer-events-none z-[100]"
          >
            Ask AI Assistant
            <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-[#0B0F19]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative w-9 h-9 cursor-pointer group flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleAiDrawer}
      >
        {/* Ambient Glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-[8px] z-[-1]"
          animate={{ opacity: isHovered ? 1 : 0.4, scale: isHovered ? 1.2 : 1 }}
          style={{ background: "linear-gradient(135deg, #00F2FE, #A18CD1)" }}
          transition={{ duration: 0.3 }}
        />

        {/* Spinning Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: isHovered ? 2 : 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full z-0"
          style={{ background: 'conic-gradient(from 0deg at 50% 50%, #00F2FE 0%, #4FACFE 25%, #A18CD1 50%, #FBC2EB 75%, #00F2FE 100%)' }}
        />

        {/* Dark Inner Core */}
        <div className="absolute inset-[1.5px] z-10 bg-[#141414] rounded-full flex items-center justify-center transition-colors group-hover:bg-[#1a1a24]">
          {/* Sparkle Logo */}
          <motion.svg
            width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? [0, 10, -5, 0] : 0 }}
          >
            <path d="M12 4L13.8 9.8L19.5 11.5L13.8 13.2L12 19L10.2 13.2L4.5 11.5L10.2 9.8L12 4Z" fill="url(#nav-sparkle)" />
            <motion.path
              d="M5.5 3L6.2 5.8L9 6.5L6.2 7.2L5.5 10L4.8 7.2L2 6.5L4.8 5.8L5.5 3Z"
              fill={isHovered ? "#A855F7" : "#fff"}
              animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.path
              d="M18.5 14L19 16L21 16.5L19 17L18.5 19L18 17L16 16.5L18 16L18.5 14Z"
              fill={isHovered ? "#06B6D4" : "#fff"}
              animate={{ scale: isHovered ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <defs>
              <linearGradient id="nav-sparkle" x1="4.5" y1="4" x2="19.5" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor={isHovered ? "#06B6D4" : "#fff"} />
                <stop offset="1" stopColor={isHovered ? "#3B82F6" : "#fff"} />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      </div>
    </div>
  );
};
// ------------------------------------------

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchOpen && searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notificationsOpen && notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (avatarMenuOpen && avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setAvatarMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [searchOpen, notificationsOpen, avatarMenuOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  const searchPool = useMemo<Movie[]>(() => {
    const all = [...trendingNow, ...newReleases, ...generateEpisodes(1), ...generateEpisodes(2)];
    return Array.from(new Map(all.map(item => [item.id, item])).values());
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return searchPool
      .filter(item =>
        item.title.toLowerCase().includes(q) ||
        (item.genres && item.genres.some(g => g.toLowerCase().includes(q)))
      )
      .slice(0, 6);
  }, [searchQuery, searchPool]);

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <nav
      className={`fixed top-0 left-[64px] right-0 h-[64px] flex items-center justify-between px-8 z-[99] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled
          ? 'bg-[#141414]/85 backdrop-blur-[20px] border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-transparent shadow-none'
        }`}
    >
      {/* Left side - Logo/Brand */}
      <div className="flex items-center">
        <h1 className="text-white text-[20px] font-bold tracking-tight">
          Discover
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex items-center justify-end h-[64px]" ref={searchContainerRef}>
          <motion.div
            initial={false}
            animate={{ width: searchOpen ? 240 : 20, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`flex items-center overflow-hidden ${searchOpen ? 'bg-white/10 border border-white/15 rounded-[20px] backdrop-blur-[8px]' : ''
              }`}
          >
            <button
              onClick={() => !searchOpen && setSearchOpen(true)}
              className={`text-white transition-transform duration-200 outline-none flex-shrink-0 ${searchOpen ? 'ml-3' : 'hover:scale-110'
                }`}
              aria-label="Search"
            >
              <Search size={20} className={searchOpen ? 'text-white/60' : ''} />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-[14px] w-full px-2.5 py-1.5 placeholder-white/40"
              style={{ display: searchOpen ? 'block' : 'none' }}
              aria-label="Search content"
            />

            {searchOpen && (
              <button
                onClick={() => setSearchOpen(false)}
                className="text-white/60 hover:text-white mr-3 transition-colors outline-none flex-shrink-0"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>

          <AnimatePresence>
            {searchOpen && searchQuery.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[56px] right-0 w-[360px] bg-[#0f0f0f]/98 border border-white/5 rounded-xl backdrop-blur-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden max-h-[400px] overflow-y-auto"
              >
                <div className="p-3">
                  <p className="text-[12px] font-bold tracking-wider text-white/40 uppercase px-2 pb-3 pt-1">
                    {searchResults.length > 0 ? 'Top Results' : 'No Results'}
                  </p>

                  {searchResults.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Search size={24} className="text-white/20" />
                      </div>
                      <h3 className="text-[15px] font-bold text-white mb-1">No results for "{searchQuery}"</h3>
                      <p className="text-[12px] text-white/40 mb-6">Try different keywords or browse our suggested genres below</p>

                      <div className="flex flex-wrap justify-center gap-2">
                        {['Action', 'Sci-Fi', 'Drama'].map(suggest => (
                          <button
                            key={suggest}
                            onClick={() => setSearchQuery(suggest)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/70 hover:bg-white/10 hover:text-white transition-all"
                          >
                            {suggest}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {searchResults.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(`/watch?title=${encodeURIComponent(res.title)}`);
                          }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                        >
                          <div className="w-14 h-[76px] bg-white/10 rounded-md overflow-hidden flex-shrink-0 relative">
                            {res.thumbnail ? (
                              <img src={res.thumbnail} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" alt={res.title} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Film size={16} className="text-white/30" /></div>
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          </div>
                          <div>
                            <h4 className="text-[14px] text-white font-bold mb-1">{res.title}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-white/50">
                              <span>{res.year || 2025}</span>
                              {res.genres && (
                                <>
                                  <span>·</span>
                                  <span>{res.genres[0]}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🌟 NEW AI LOGO BUTTON PLACED HERE 🌟 */}
        <NavbarAiButton />

        <div className="relative h-[64px] flex items-center" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="text-white relative group/bell transition-transform duration-200 hover:scale-110 outline-none"
            aria-label="Notifications"
          >
            <div className="group-hover/bell:animate-[bellShake_0.6s_ease-in-out]">
              <Bell size={20} />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[9px] flex items-center justify-center rounded-full font-bold border-2 border-[#111111] box-content">
                {unreadCount}
              </div>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: 'top right' }}
                className="absolute top-[52px] right-[-120px] w-[340px] bg-[#0f0f0f]/98 border border-white/5 rounded-2xl backdrop-blur-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <h3 className="text-[16px] text-white font-bold">Notifications</h3>
                  <button className="text-[13px] text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="flex flex-col max-h-[360px] overflow-y-auto">
                  {mockNotifications.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-start gap-3 p-3.5 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <img src={note.thumb} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="text-[13px] text-white font-medium mb-0.5">{note.title}</p>
                        <p className="text-[12px] text-white/60 leading-snug mb-1">{note.body}</p>
                        <p className="text-[11px] text-white/40">{note.time}</p>
                      </div>
                      {note.unread && <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-2 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative h-[64px] flex items-center" ref={avatarMenuRef}>
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="w-9 h-9 rounded-full border-2 border-white/30 overflow-hidden cursor-pointer transition-colors duration-200 hover:border-white/60 outline-none"
            aria-label="User menu"
          >
            <img src={avatarImg} alt="User Profile" className="w-full h-full object-cover" />
          </button>

          <AnimatePresence>
            {avatarMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: 'top right' }}
                className="absolute top-[52px] right-0 w-[220px] bg-[#0f0f0f]/98 border border-white/5 rounded-2xl backdrop-blur-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b border-white/5">
                  <img src={avatarImg} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 className="text-[14px] text-white font-bold leading-tight">John Doe</h4>
                    <p className="text-[12px] text-white/50">john@email.com</p>
                  </div>
                </div>

                <div className="flex flex-col py-2">
                  <button onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/80 hover:bg-white/5 transition-colors w-full text-left outline-none">
                    <UserRound size={16} /> Switch Profile
                  </button>
                  <button onClick={() => navigate('/browse')} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/80 hover:bg-white/5 transition-colors w-full text-left outline-none">
                    <Heart size={16} /> My Watchlist
                  </button>
                  <button onClick={() => navigate('/profile')} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/80 hover:bg-white/5 transition-colors w-full text-left outline-none">
                    <Settings size={16} /> Account Settings
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/80 hover:bg-white/5 transition-colors w-full text-left outline-none">
                    <Palette size={16} /> Appearance
                  </button>

                  <div className="h-px bg-white/10 my-1 mx-4" />

                  <button onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/80 hover:bg-[#ef4444]/10 hover:text-[#ef4444] transition-colors w-full text-left outline-none">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;