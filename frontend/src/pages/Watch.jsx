import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Maximize, Volume2, VolumeX, Settings, Rewind, FastForward } from 'lucide-react';

function Watch() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const title = searchParams.get('title') || 'Video Player';

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  };

  useEffect(() => {
    handleMouseMove();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [playing]);

  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  
  // Fake progress update
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div 
      className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={() => setControlsVisible(true)}
    >
      <video
        ref={videoRef}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        autoPlay
        loop
        muted={muted}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="w-full p-8 flex items-center gap-6 pointer-events-auto" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            </div>

            {/* Bottom Bar */}
            <div className="w-full p-8 pointer-events-auto" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer relative group">
                <div className="absolute inset-y-0 left-0 bg-[var(--accent)] rounded-full" style={{ width: `${progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" style={{ left: `calc(${progress}% - 8px)` }} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={togglePlay} className="text-white hover:text-[var(--accent)] transition-colors">
                    {playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                  </button>
                  <button className="text-white hover:text-[var(--accent)] transition-colors">
                    <Rewind size={24} fill="currentColor" />
                  </button>
                  <button className="text-white hover:text-[var(--accent)] transition-colors">
                    <FastForward size={24} fill="currentColor" />
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-[var(--accent)] transition-colors flex items-center gap-3 ml-4">
                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>
                
                <div className="flex items-center gap-6">
                  <button className="text-white hover:text-[var(--accent)] transition-colors">
                    <Settings size={24} />
                  </button>
                  <button className="text-white hover:text-[var(--accent)] transition-colors">
                    <Maximize size={24} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Watch;
