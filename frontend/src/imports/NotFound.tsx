import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Bookmark, TrendingUp, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  // Generate some random stars for the background
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; opacity: number }[]>([]);
  useEffect(() => {
    const newStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-center px-8 relative overflow-hidden font-sans">
      
      {/* Deep Space Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[800px] bg-[var(--brand-purple)]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--brand-purple)]/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px]" />
        
        {/* Stars */}
        {stars.map(star => (
          <div 
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        
        {/* 404 Centerpiece Graphic */}
        <div className="relative flex items-center justify-center gap-6 mb-10 select-none">
          {/* Orbital Ring passing through everything */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-4 rounded-[100%] border-[1px] border-[var(--brand-purple)]/40 pointer-events-none" />

          {/* The Left 4 */}
          <span 
            className="text-[12rem] md:text-[16rem] font-light leading-none text-transparent" 
            style={{ WebkitTextStroke: '2px rgba(139,92,246,0.3)' }}
          >
            4
          </span>
          
          {/* The 0 - Planet */}
          <div 
            className="relative w-32 h-32 md:w-48 md:h-48 rounded-full" 
            style={{ 
              background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.4) 0%, rgba(10,10,12,0.8) 80%)', 
              boxShadow: 'inset 0 0 50px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.15)' 
            }}
          >
            {/* Center Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#c4b5fd] shadow-[0_0_15px_rgba(167,139,250,1)]" />
          </div>

          {/* The Right 4 */}
          <span 
            className="text-[12rem] md:text-[16rem] font-light leading-none text-transparent" 
            style={{ WebkitTextStroke: '2px rgba(139,92,246,0.3)' }}
          >
            4
          </span>
        </div>

        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--brand-purple)]/30 bg-[var(--brand-purple)]/10 text-[#c4b5fd] text-[13px] font-bold tracking-[0.15em] uppercase mb-8"
        >
          <AlertCircle size={15} />
          Page Not Found
        </motion.div>

        {/* Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-[32px] md:text-[40px] font-bold text-white mb-4 tracking-tight">
            Lost in the Multiverse
          </h2>
          <p className="text-white/50 text-[16px] md:text-[18px] max-w-lg mx-auto mb-12 leading-relaxed">
            This page drifted into another dimension. Let's navigate you back to something real.
          </p>

          {/* Primary Actions */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-[8px] bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 text-[15px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-[8px] bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 text-[15px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <Home size={18} /> Go Home
            </button>
          </div>

          {/* Quick Links Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="text-white/30 text-[13px] font-medium tracking-widest uppercase md:mr-2">
              Or Try &rarr;
            </span>
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-transparent border border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 text-[14px] font-medium transition-all">
                <Search size={15} /> Search
              </button>
              <button onClick={() => navigate('/watchlist')} className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-transparent border border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 text-[14px] font-medium transition-all">
                <Bookmark size={15} /> Watchlist
              </button>
              <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-transparent border border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 text-[14px] font-medium transition-all">
                <TrendingUp size={15} /> Trending
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;
