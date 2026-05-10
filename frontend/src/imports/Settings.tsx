import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Bell, 
  PlayCircle, 
  Download, 
  Lock, 
  Share2, 
  CreditCard, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Crown
} from 'lucide-react';
import { useStore } from '../store';

const SETTINGS_TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'playback', label: 'Playback and performance', icon: PlayCircle },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'apps', label: 'Connected apps', icon: Share2 },
  { id: 'billing', label: 'Billing and payments', icon: CreditCard },
  { id: 'advanced', label: 'Advanced settings', icon: Sliders },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { heroMovie } = useStore(); // Just for context, though not strictly needed here

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-[60px] bg-[#0f0f0f] text-white">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-[280px] shrink-0">
          <h1 className="text-[20px] font-bold mb-6 px-3">Settings</h1>
          <nav className="flex flex-col gap-1">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-lg' 
                      : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-[800px]">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
                  <div className="flex-1">
                    <h2 className="text-[24px] font-bold mb-2">Account</h2>
                    <h3 className="text-[28px] font-black leading-tight mb-4 tracking-tight">
                      Choose how you appear and what you see on Streamify
                    </h3>
                    <p className="text-white/50 text-[15px]">
                      Signed in as <span className="text-white font-medium">khanolkarsujal@gmail.com</span>
                    </p>
                  </div>
                  
                  {/* Decorative Illustration (Simulated with Gradient/Icon) */}
                  <div className="relative w-32 h-32 md:w-44 md:h-44 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-purple)] to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                    <div className="relative w-full h-full bg-white/5 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                       <User size={64} className="text-white/20" />
                       <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                          <Sliders size={20} className="text-[var(--brand-purple)]" />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  {/* Section: Your Channel */}
                  <section className="pt-8 border-t border-white/10">
                    <h4 className="text-[16px] font-bold mb-1 uppercase tracking-wider text-white/40">Your Channel</h4>
                    <p className="text-[13px] text-white/50 mb-6">This is your public presence on Streamify. You need a profile to rate movies, comment on reviews, or create public watchlists.</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-[var(--brand-purple)] flex items-center justify-center text-xl font-black text-white shadow-lg">
                        S
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[17px] font-bold">Sujal Khanolkar Discipline</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button className="flex items-center gap-2 text-[14px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Channel status and features
                      </button>
                      <button className="flex items-center gap-2 text-[14px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Add or manage your profile(s)
                      </button>
                      <button className="flex items-center gap-2 text-[14px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        View advanced settings
                      </button>
                    </div>
                  </section>

                  {/* Section: Your Account */}
                  <section className="pt-8 border-t border-white/10">
                    <h4 className="text-[16px] font-bold mb-4 uppercase tracking-wider text-white/40">Your Account</h4>
                    <p className="text-[13px] text-white/50 mb-8">You sign in to Streamify with your Google Account</p>
                    
                    <div className="space-y-8">
                      {/* Google Account */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                         <span className="text-[15px] font-bold w-40">Google Account</span>
                         <div className="flex-1">
                            <button className="flex items-center gap-2 text-[14px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                              View or change your Google Account settings
                            </button>
                            <p className="text-[12px] text-white/40">You will be redirected to your Google Account page</p>
                         </div>
                      </div>

                      {/* Family Center */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                         <span className="text-[15px] font-bold w-40">Family Center</span>
                         <div className="flex-1">
                            <button className="flex items-center gap-2 text-[14px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                              Manage kids profiles and features for teens
                            </button>
                            <p className="text-[12px] text-white/40">Tools to connect parents, kids, and teens on Streamify</p>
                         </div>
                      </div>

                      {/* Membership */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                         <span className="text-[15px] font-bold w-40">Membership</span>
                         <div className="flex-1">
                            <div className="flex items-center gap-2">
                               <span className="text-[14px] text-white/80">No membership |</span>
                               <button className="flex items-center gap-1.5 text-[14px] font-bold text-[#facc15] hover:text-[#fbbf24] transition-colors">
                                 <Crown size={14} /> Get Streamify Premium
                               </button>
                            </div>
                            <p className="text-[12px] text-white/40">Streamify Premium offers uninterrupted movies, ad-free videos, and more</p>
                         </div>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab !== 'account' && (
               <motion.div
                key="other"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Sliders size={32} className="text-white/20" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{SETTINGS_TABS.find(t => t.id === activeTab)?.label}</h2>
                <p className="text-white/40 text-[14px] max-w-xs mx-auto">
                  This section is under construction. Advanced streaming controls will be available soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Settings;
