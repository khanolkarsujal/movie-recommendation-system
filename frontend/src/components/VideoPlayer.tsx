/**
 * VideoPlayer Component
 * Netflix-quality video player with skip intro, next episode, PiP, and advanced controls
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Rewind,
  FastForward,
  SkipForward,
  Subtitles,
  PictureInPicture,
  Cast,
  ArrowLeft,
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  episode?: {
    season: number;
    episode: number;
    title: string;
  };
  hasIntro?: boolean;
  introStart?: number;
  introEnd?: number;
  hasCredits?: boolean;
  creditsStart?: number;
  nextEpisode?: {
    title: string;
    thumbnail: string;
    onPlay: () => void;
  };
  onBack?: () => void;
  onComplete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  episode,
  hasIntro = true,
  introStart = 10,
  introEnd = 90,
  hasCredits = true,
  creditsStart = 2700, // 45 min
  nextEpisode,
  onBack,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipCredits, setShowSkipCredits] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(15);

  // Format time
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Mouse move handler
  const handleMouseMove = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [playing]);

  // Update time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Check for skip intro
      if (hasIntro && video.currentTime >= introStart && video.currentTime < introEnd) {
        setShowSkipIntro(true);
      } else {
        setShowSkipIntro(false);
      }

      // Check for skip credits
      if (hasCredits && video.currentTime >= creditsStart) {
        setShowSkipCredits(true);
      }

      // Show next episode in last 30 seconds
      if (nextEpisode && duration - video.currentTime <= 30 && duration - video.currentTime > 0) {
        setShowNextEpisode(true);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setShowNextEpisode(true);
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [hasIntro, introStart, introEnd, hasCredits, creditsStart, nextEpisode, duration, onComplete]);

  // Next episode countdown
  useEffect(() => {
    if (!showNextEpisode || !nextEpisode) return;

    const interval = setInterval(() => {
      setNextEpisodeCountdown((prev) => {
        if (prev <= 1) {
          nextEpisode.onPlay();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showNextEpisode, nextEpisode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

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
          toggleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(duration, video.currentTime + 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          break;
        case 'i':
          e.preventDefault();
          if (showSkipIntro) skipIntro();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, showSkipIntro]);

  // Sync video with state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
      video.volume = volume;
      video.playbackRate = playbackRate;
    }
  }, [muted, volume, playbackRate]);

  // Functions
  const togglePlay = () => setPlaying((p) => !p);
  const toggleMute = () => setMuted((m) => !m);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const skipIntro = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = introEnd;
      setShowSkipIntro(false);
    }
  }, [introEnd]);

  const skipCredits = useCallback(() => {
    if (nextEpisode) {
      nextEpisode.onPlay();
    }
  }, [nextEpisode]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  }, [duration]);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={() => setControlsVisible(true)}
      style={{ cursor: controlsVisible ? 'default' : 'none' }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
      />

      {/* Controls Overlay */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div
              className="w-full p-6 flex items-center gap-6 pointer-events-auto"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
              }}
            >
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md
                         flex items-center justify-center text-white transition-all outline-none"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <h1 className="text-white text-[18px] font-semibold mb-0.5">{title}</h1>
                {episode && (
                  <p className="text-white/60 text-[13px]">
                    S{episode.season}:E{episode.episode} - {episode.title}
                  </p>
                )}
              </div>
            </div>

            {/* Center - Skip Buttons */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 pointer-events-auto">
              <AnimatePresence>
                {showSkipIntro && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={skipIntro}
                    className="px-6 py-3 bg-white/90 hover:bg-white text-black rounded-md
                             text-[14px] font-bold transition-all flex items-center gap-2
                             shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                  >
                    <SkipForward size={18} />
                    Skip Intro
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showSkipCredits && nextEpisode && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={skipCredits}
                    className="px-6 py-3 bg-white/90 hover:bg-white text-black rounded-md
                             text-[14px] font-bold transition-all flex items-center gap-2
                             shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                  >
                    <SkipForward size={18} />
                    Next Episode
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Next Episode Card */}
            <AnimatePresence>
              {showNextEpisode && nextEpisode && (
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="absolute bottom-32 right-8 w-80 bg-[var(--bg-elevated)] border border-white/10
                           rounded-xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8)] pointer-events-auto"
                >
                  <div className="relative h-44">
                    <img
                      src={nextEpisode.thumbnail}
                      alt="Next episode"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/60 text-[12px] uppercase tracking-wider font-bold">
                        Next Episode
                      </p>
                      <p className="text-white text-[14px] font-semibold">
                        {nextEpisodeCountdown}s
                      </p>
                    </div>

                    <h3 className="text-white font-bold text-[15px] mb-3 line-clamp-2">
                      {nextEpisode.title}
                    </h3>

                    <button
                      onClick={() => setShowNextEpisode(false)}
                      className="text-white/60 hover:text-white text-[13px] font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Controls */}
            <div
              className="w-full p-6 pointer-events-auto"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              }}
            >
              {/* Progress Bar */}
              <div
                className="w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer relative group"
                onClick={handleProgressClick}
              >
                {/* Buffered */}
                <div
                  className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
                  style={{ width: `${buffered}%` }}
                />

                {/* Progress */}
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--brand-purple)] rounded-full"
                  style={{ width: `${progress}%` }}
                />

                {/* Scrubber */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full
                           opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:scale-110 transition-transform"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime -= 10;
                      }
                    }}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <Rewind size={24} />
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime += 10;
                      }
                    }}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <FastForward size={24} />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    {muted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 accent-white"
                  />

                  <span className="text-white text-[14px] font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`text-white hover:scale-110 transition-transform ${
                      showSubtitles ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    <Subtitles size={22} />
                  </button>

                  <button
                    onClick={togglePiP}
                    className="text-white hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                  >
                    <PictureInPicture size={22} />
                  </button>

                  <button className="text-white hover:scale-110 transition-transform opacity-60 hover:opacity-100">
                    <Cast size={22} />
                  </button>

                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    <Settings size={22} />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:scale-110 transition-transform"
                  >
                    {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Menu */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-24 right-8 w-64 bg-black/95 backdrop-blur-xl border border-white/10
                     rounded-xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
          >
            <div className="p-4 space-y-4">
              <div>
                <p className="text-white/60 text-[12px] uppercase tracking-wider mb-2">Playback Speed</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackRate(speed)}
                      className={`py-2 rounded text-[13px] font-medium transition-all ${
                        playbackRate === speed
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {speed}×
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-white/60 text-[12px] uppercase tracking-wider mb-2">Quality</p>
                <div className="space-y-1">
                  {['Auto', '4K', '1080p', '720p', '480p'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`w-full py-2 px-3 rounded text-left text-[13px] font-medium transition-all ${
                        quality === q
                          ? 'bg-white text-black'
                          : 'bg-transparent text-white hover:bg-white/10'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
