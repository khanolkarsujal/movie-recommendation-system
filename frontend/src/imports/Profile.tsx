import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Plus, SlidersHorizontal } from 'lucide-react';

interface ProfileData {
  id: number;
  name: string;
  initial: string;
  color: string;
  subtitle: string;
  isKids?: boolean;
}

const PROFILES: ProfileData[] = [
  { id: 1, name: 'John', initial: 'J', color: '#a78bfa', subtitle: '3 new titles' },
  { id: 2, name: 'Sarah', initial: 'S', color: '#fb7185', subtitle: 'Continue watching' },
  { id: 3, name: 'Kids', initial: 'K', color: '#fbbf24', subtitle: 'Safe mode on', isKids: true },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [managing, setManaging] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState<number | null>(null);

  const handleProfileClick = useCallback(
    (profile: ProfileData) => {
      if (managing) return;
      setLoadingProfile(profile.id);
      setTimeout(() => {
        navigate('/browse');
      }, 1200);
    },
    [managing, navigate]
  );

  const toggleManaging = useCallback(() => {
    setManaging((m) => !m);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0f] flex flex-col items-center justify-center min-h-screen overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8b5cf6]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Right Indicator */}
      <div className="absolute top-8 right-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
        <span className="text-[#8b5cf6]/60 text-[14px] font-medium tracking-wide">4 profiles</span>
      </div>

      <AnimatePresence>
        {!loadingProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center relative z-10 w-full max-w-4xl px-6"
          >
            {/* Header Text */}
            <div className="text-center mb-16">
              <p className="text-[#8b5cf6]/60 text-[12px] font-bold tracking-[0.2em] uppercase mb-4">
                Good Evening
              </p>
              <h1 className="text-white text-[42px] font-medium tracking-tight">
                Who's watching?
              </h1>
            </div>

            {/* Profile Grid */}
            <div className="flex flex-wrap justify-center items-start gap-6 md:gap-10 mb-16">
              {PROFILES.map((p) => (
                <div key={p.id} className="group flex flex-col items-center cursor-pointer">
                  <button
                    onClick={() => handleProfileClick(p)}
                    className="w-[140px] h-[140px] rounded-[24px] overflow-visible border-2 border-transparent group-hover:border-white/20 transition-all duration-300 relative group-hover:scale-105 outline-none bg-[#1a1625] flex items-center justify-center shadow-lg"
                    aria-label={`Select ${p.name}'s profile`}
                  >
                    {/* The Initial */}
                    <span 
                      className="text-[54px] font-normal" 
                      style={{ color: p.color }}
                    >
                      {p.initial}
                    </span>

                    {/* Kids Badge */}
                    {p.isKids && (
                      <div className="absolute -top-3 -right-3 bg-[#fbbf24] text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                        KIDS
                      </div>
                    )}

                    {/* Managing Overlay */}
                    {managing && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-[22px] backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xl">✏️</span>
                        </div>
                      </div>
                    )}
                  </button>
                  <div className="mt-5 text-center">
                    <h3 className="text-white/90 text-[17px] font-medium group-hover:text-white transition-colors mb-1">
                      {p.name}
                    </h3>
                    <p className="text-white/40 text-[13px] font-medium">
                      {p.subtitle}
                    </p>
                  </div>
                </div>
              ))}

              {/* Add Profile Button */}
              <div className="group flex flex-col items-center cursor-pointer">
                <button
                  className="w-[140px] h-[140px] rounded-[24px] border-[1.5px] border-dashed border-white/10 group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-300 flex items-center justify-center outline-none"
                  aria-label="Add new profile"
                >
                  <Plus size={36} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </button>
                <div className="mt-5 text-center">
                  <h3 className="text-white/40 text-[17px] font-medium group-hover:text-white/70 transition-colors">
                    Add Profile
                  </h3>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full max-w-2xl h-px bg-white/5 mb-12" />

            {/* Manage Profiles Button */}
            <button
              onClick={toggleManaging}
              className="flex items-center gap-3 px-6 py-3 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 hover:border-white/30 hover:text-white transition-all text-[15px] font-medium outline-none"
            >
              <SlidersHorizontal size={16} />
              {managing ? 'Done' : 'Manage Profiles'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center z-10"
          >
            <div className="w-16 h-16 border-4 border-[var(--brand-purple)]/20 border-t-[var(--brand-purple)] rounded-full animate-spin mb-6" />
            <h2 className="text-white/80 text-xl font-medium animate-pulse">
              Loading Profile...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
