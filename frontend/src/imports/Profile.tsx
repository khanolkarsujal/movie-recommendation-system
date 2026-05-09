import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const avatarImg = 'https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=200&h=200&fit=crop';

interface ProfileData {
  id: number;
  name: string;
  color: string;
  img: string;
}

const PROFILES: ProfileData[] = [
  { id: 1, name: 'John', color: '#8b5cf6', img: avatarImg },
  {
    id: 2,
    name: 'Sarah',
    color: '#ef4444',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Kids',
    color: '#10b981',
    img: 'https://images.unsplash.com/photo-1606122017369-d782bbb78592?w=200&h=200&fit=crop',
  },
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
    <div className="fixed inset-0 z-[200] bg-[#050508] flex flex-col items-center justify-center min-h-screen">
      <AnimatePresence>
        {!loadingProfile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="text-white text-4xl md:text-5xl font-medium mb-12 tracking-tight">
              {managing ? 'Manage Profiles' : "Who's watching?"}
            </h1>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16">
              {PROFILES.map((p) => (
                <div key={p.id} className="group flex flex-col items-center cursor-pointer">
                  <button
                    onClick={() => handleProfileClick(p)}
                    className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-[3px] border-transparent group-hover:border-white transition-all duration-300 relative group-hover:scale-105 outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]"
                    aria-label={`Select ${p.name}'s profile`}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    {managing && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xl">✏️</span>
                        </div>
                      </div>
                    )}
                  </button>
                  <span className="mt-4 text-white/60 text-[15px] font-medium group-hover:text-white transition-colors">
                    {p.name}
                  </span>
                </div>
              ))}

              <div className="group flex flex-col items-center cursor-pointer">
                <button
                  className="w-28 h-28 md:w-36 md:h-36 rounded-xl border-[3px] border-white/20 group-hover:border-white group-hover:bg-white/10 transition-all duration-300 flex items-center justify-center outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]"
                  aria-label="Add new profile"
                >
                  <Plus size={48} className="text-white/50 group-hover:text-white" />
                </button>
                <span className="mt-4 text-white/60 text-[15px] font-medium group-hover:text-white transition-colors">
                  Add Profile
                </span>
              </div>
            </div>

            <button
              onClick={toggleManaging}
              className="px-6 py-2 border border-white/40 text-white/60 hover:border-white hover:text-white transition-colors text-[14px] tracking-[2px] uppercase font-bold outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {managing ? 'Done' : 'Manage Profiles'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 border-4 border-white/10 border-t-[var(--accent)] rounded-full animate-spin mb-6" />
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
