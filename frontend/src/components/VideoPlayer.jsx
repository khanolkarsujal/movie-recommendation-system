import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Settings, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Subtitles, Hd } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayer = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const controlsTimeoutRef = useRef(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') setIsPlaying(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    handleMouseMove();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-black z-[9999] flex flex-col overflow-hidden cursor-none"
      style={{ cursor: showControls ? 'default' : 'none' }}
      onMouseMove={handleMouseMove}
    >
      {/* Top Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-[64px] px-8 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent"
          >
            <div 
              className="flex items-center gap-4 text-white cursor-pointer hover:opacity-70 transition-opacity"
              onClick={onClose}
            >
              <ArrowLeft size={24} />
              <span className="text-[16px] font-semibold">Back</span>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 text-white text-[16px] font-semibold">
              {movie?.title || 'Unknown Title'}
            </div>

            <div className="text-white cursor-pointer hover:scale-110 transition-transform">
              <Settings size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Area */}
      <div className="flex-grow flex flex-col items-center justify-center gap-4 pointer-events-none">
        <div className="opacity-30 flex flex-col items-center gap-4">
          <Play size={64} className="text-white fill-white" />
          <div className="text-center">
            <p className="text-[18px] text-white/30 font-medium">Video Player</p>
            <p className="text-[13px] text-white/15">Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 w-full h-[120px] px-8 pb-5 flex flex-col justify-end gap-4 bg-gradient-to-t from-black/90 to-transparent"
          >
            {/* Progress Bar */}
            <div className="group relative w-full h-1 bg-white/20 rounded-full cursor-pointer hover:h-1.5 transition-all">
              <div className="absolute top-0 left-0 h-full bg-[#8b5cf6] rounded-full" style={{ width: '35%' }} />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_6px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: '35%' }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:scale-110 transition-transform">
                  {isPlaying ? <Pause size={28} className="fill-white" /> : <Play size={28} className="fill-white" />}
                </button>
                <button className="text-white hover:scale-110 transition-transform">
                  <RotateCcw size={22} />
                </button>
                <button className="text-white hover:scale-110 transition-transform">
                  <RotateCw size={22} />
                </button>
                <div className="flex items-center gap-3 group">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-white">
                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </button>
                  <div className="w-0 group-hover:w-20 overflow-hidden transition-all duration-300 h-1 bg-white/20 rounded-full relative">
                    <div className="absolute top-0 left-0 h-full bg-white" style={{ width: isMuted ? '0%' : '70%' }} />
                  </div>
                </div>
                <span className="text-white text-[13px] ml-2">1:24:30 / 2:01:15</span>
              </div>

              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1.5 border border-white/40 rounded px-1.5 py-0.5 text-[11px] text-white font-bold hover:bg-white/10 transition-colors">
                  HD
                </button>
                <button className="text-white hover:scale-110 transition-transform">
                  <Subtitles size={20} />
                </button>
                <button className="text-white hover:scale-110 transition-transform">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
