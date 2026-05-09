import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[var(--bg-base)] flex flex-col items-center justify-center text-center px-8 z-50">
      <div className="relative mb-6 select-none">
        <motion.h1
          animate={glitch ? { x: [0, -4, 4, -2, 2, 0], skewX: [0, -3, 3, -1, 1, 0] } : { x: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[10rem] md:text-[14rem] font-black leading-none text-white/5"
          style={{ textShadow: glitch ? '3px 0 #8b5cf6, -3px 0 #ef4444' : 'none' }}
          aria-hidden="true"
        >
          404
        </motion.h1>
        <motion.h1
          animate={glitch ? { x: [0, 3, -3, 1, -1, 0] } : { x: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[14rem] font-black leading-none text-transparent"
          style={{
            WebkitTextStroke: '1px rgba(255,255,255,0.1)',
            textShadow: glitch
              ? '-3px 0 rgba(139,92,246,0.5), 3px 0 rgba(239,68,68,0.5)'
              : 'none',
          }}
          aria-label="404 Error"
        >
          404
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Lost in the Multiverse
        </h2>
        <p className="text-white/40 text-[15px] max-w-sm mb-10 leading-relaxed">
          The page you're looking for has drifted into another dimension. Let's get you back
          to something good.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-[14px] font-semibold transition-all hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <button
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[14px] font-bold transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(139,92,246,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Home size={16} /> Go Home
          </button>
        </div>
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center 60%, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default NotFound;
