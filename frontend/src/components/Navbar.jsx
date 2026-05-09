import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, X, Menu, Settings, Heart, UserRound, Palette, LogOut, Film } from 'lucide-react';
import avatarImg from '../assets/avatar.png';
import { trendingNow, newReleases, generateEpisodes } from '../data/movies';

const navLinks = [
  { path: '/browse', label: 'Home' },
  { path: '#browse', label: 'Browse', hasMegaMenu: true },
  { path: '#kids', label: 'Kids' },
  { path: '#support', label: 'Support' },
  { path: '#faq', label: 'FAQ' },
];

const mockNotifications = [
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

const genres = [
  { name: 'Action', color: '#ef4444' },
  { name: 'Adventure', color: '#f59e0b' },
  { name: 'Animation', color: '#10b981' },
  { name: 'Comedy', color: '#eab308' },
  { name: 'Crime', color: '#6366f1' },
  { name: 'Documentary', color: '#14b8a6' },
  { name: 'Drama', color: '#f8fafc' },
  { name: 'Fantasy', color: '#22c55e' },
  { name: 'Horror', color: '#a855f7' },
  { name: 'Sci-Fi', color: '#3b82f6' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [browseHovered, setBrowseHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const notificationsRef = useRef(null);
  const avatarMenuRef = useRef(null);
  const browseTimeoutRef = useRef(null);

  // ─── Scroll Behavior ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ─── Outside Click & Escape Handlers ──────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchOpen && searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (notificationsOpen && notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (avatarMenuOpen && avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setAvatarMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [searchOpen, notificationsOpen, avatarMenuOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      // small delay to allow animation to start
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Browse Mega Menu delays
  const handleBrowseEnter = () => {
    clearTimeout(browseTimeoutRef.current);
    browseTimeoutRef.current = setTimeout(() => setBrowseHovered(true), 300);
  };

  const handleBrowseLeave = () => {
    clearTimeout(browseTimeoutRef.current);
    browseTimeoutRef.current = setTimeout(() => setBrowseHovered(false), 150);
  };

  // ─── Search Logic ───────────────────────────────────────────────────────────
  // Build a searchable pool of all available content
  const searchPool = useMemo(() => {
    const all = [...trendingNow, ...newReleases, ...generateEpisodes(1), ...generateEpisodes(2)];
    // Deduplicate by ID
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
      .slice(0, 6); // Max 6 results
  }, [searchQuery, searchPool]);

  // ─── Render Components ────────────────────────────────────────────────────
  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <nav
      className={`fixed top-0 left-[64px] right-0 h-[64px] flex items-center justify-between px-8 z-[99] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        scrolled
          ? 'bg-[#141414]/85 backdrop-blur-[20px] border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-transparent shadow-none'
      }`}
    >
      {/* ── LEFT SECTION (Links) ────────────────────────────────────────── */}
      <div className="flex items-center">
        <div className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/browse' && location.pathname === '/browse');
            return (
              <div
                key={link.label}
                onMouseEnter={link.hasMegaMenu ? handleBrowseEnter : undefined}
                onMouseLeave={link.hasMegaMenu ? handleBrowseLeave : undefined}
                className="h-[64px] flex items-center relative"
              >
                <button
                  onClick={() => navigate(link.path)}
                  className={`nav-link text-[15px] transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]/80 ${
                    isActive ? 'font-semibold text-white' : 'font-normal text-white/65 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>

                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8b5cf6] rounded-full shadow-[0_0_8px_#8b5cf6]"
                  />
                )}

                {/* Browse Mega Menu */}
                {link.hasMegaMenu && (
                  <AnimatePresence>
                    {browseHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute top-[64px] left-0 w-[480px] bg-[#0d0d0d]/98 border border-white/5 rounded-b-2xl p-6 backdrop-blur-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.7)] cursor-default"
                      >
                        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                          {genres.map((genre) => (
                            <div
                              key={genre.name}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-white/75 hover:text-white hover:bg-[#8b5cf6]/10 cursor-pointer transition-colors duration-150"
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: genre.color }}
                              />
                              {genre.name}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white/80 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ── RIGHT SECTION (Actions) ─────────────────────────────────────── */}
      <div className="flex items-center gap-6">
        
        {/* Inline Search Expansion */}
        <div className="relative flex items-center justify-end h-[64px]" ref={searchContainerRef}>
          <motion.div
            initial={false}
            animate={{ width: searchOpen ? 240 : 20, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`flex items-center overflow-hidden ${
              searchOpen ? 'bg-white/10 border border-white/15 rounded-[20px] backdrop-blur-[8px]' : ''
            }`}
          >
            {/* Search Icon / Button */}
            <button
              onClick={() => !searchOpen && setSearchOpen(true)}
              className={`text-white transition-transform duration-200 outline-none flex-shrink-0 ${
                searchOpen ? 'ml-3' : 'hover:scale-110'
              }`}
            >
              <Search size={20} className={searchOpen ? 'text-white/60' : ''} />
            </button>

            {/* Input Field */}
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-[14px] w-full px-2.5 py-1.5 placeholder-white/40"
              style={{ display: searchOpen ? 'block' : 'none' }}
            />

            {/* Close Search X */}
            {searchOpen && (
              <button
                onClick={() => setSearchOpen(false)}
                className="text-white/60 hover:text-white mr-3 transition-colors outline-none flex-shrink-0"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>

          {/* Search Results Dropdown */}
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

        {/* Notifications */}
        <div className="relative h-[64px] flex items-center" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="text-white relative group/bell transition-transform duration-200 hover:scale-110 outline-none"
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

          {/* Notification Panel */}
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

        {/* User Avatar Dropdown */}
        <div className="relative h-[64px] flex items-center" ref={avatarMenuRef}>
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="w-9 h-9 rounded-full border-2 border-white/30 overflow-hidden cursor-pointer transition-colors duration-200 hover:border-white/60 outline-none"
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
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/5">
                  <img src={avatarImg} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 className="text-[14px] text-white font-bold leading-tight">John Doe</h4>
                    <p className="text-[12px] text-white/50">john@email.com</p>
                  </div>
                </div>

                {/* Items */}
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

      {/* ── MOBILE FULL-SCREEN MENU ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 bg-[#0a0a0a]/98 z-[100] flex flex-col p-8 md:hidden backdrop-blur-xl"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className="text-[24px] font-semibold text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
