import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  Settings,
  Rewind,
  FastForward,
} from 'lucide-react';

const Watch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const title = searchParams.get('title') || 'Video Player';

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseMove = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    handleMouseMove();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case 'm':
          e.preventDefault();
          setMuted((m) => !m);
          break;
        case 'f':
          e.preventDefault();
          document.documentElement.requestFullscreen?.();
          break;
        case 'Escape':
          navigate(-1);
          break;
        case 'ArrowLeft':
          setProgress((p) => Math.max(0, p - 5));
          break;
        case 'ArrowRight':
          setProgress((p) => Math.min(100, p + 5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(percent);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={() => setControlsVisible(true)}
      style={{ cursor: controlsVisible ? 'default' : 'none' }}
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
            <div
              className="w-full p-8 flex items-center gap-6 pointer-events-auto"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
              }}
            >
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            </div>

            <div
              className="w-full p-8 pointer-events-auto"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
              }}
            >
              <div
                className="w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer relative group"
                onClick={handleProgressClick}
                role="slider"
                aria-label="Video progress"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--accent)] rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-[var(--accent)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
                      <Pause size={32} fill="currentColor" />
                    ) : (
                      <Play size={32} fill="currentColor" />
                    )}
                  </button>
                  <button
                    className="text-white hover:text-[var(--accent)] transition-colors outline-none"
                    aria-label="Rewind 10 seconds"
                  >
                    <Rewind size={24} fill="currentColor" />
                  </button>
                  <button
                    className="text-white hover:text-[var(--accent)] transition-colors outline-none"
                    aria-label="Forward 10 seconds"
                  >
                    <FastForward size={24} fill="currentColor" />
                  </button>
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-[var(--accent)] transition-colors flex items-center gap-3 ml-4 outline-none"
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    className="text-white hover:text-[var(--accent)] transition-colors outline-none"
                    aria-label="Settings"
                  >
                    <Settings size={24} />
                  </button>
                  <button
                    className="text-white hover:text-[var(--accent)] transition-colors outline-none"
                    aria-label="Fullscreen"
                    onClick={() => document.documentElement.requestFullscreen?.()}
                  >
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
};

export default Watch;
