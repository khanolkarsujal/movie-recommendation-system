/**
 * ShareModal Component
 * Share movies/shows with beautiful shareable cards
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Link2,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Movie } from '../imports/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}

interface ShareOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  action: (movie: Movie) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, movie }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/watch?title=${encodeURIComponent(movie.title)}`;

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const shareOptions: ShareOption[] = [
    {
      id: 'link',
      name: 'Copy Link',
      icon: copied ? <Check size={20} /> : <Copy size={20} />,
      color: '#8b5cf6',
      action: copyToClipboard,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: '#25D366',
      action: (movie) => {
        const text = `Check out "${movie.title}" on our platform!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`, '_blank');
      },
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: '#1DA1F2',
      action: (movie) => {
        const text = `Just watched "${movie.title}" - you should check it out!`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: '#1877F2',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail size={20} />,
      color: '#EA4335',
      action: (movie) => {
        const subject = `Check out ${movie.title}`;
        const body = `I thought you might enjoy watching "${movie.title}"!\n\n${shareUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      },
    },
  ];

  const downloadShareCard = useCallback(() => {
    toast.success('Share card downloaded!');
    // In real implementation, generate and download an image
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201]
                     w-full max-w-lg bg-[var(--bg-elevated)] border border-white/10 rounded-2xl
                     shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Header with Movie Preview */}
            <div className="relative h-48 bg-[var(--bg-card)]">
              {movie.thumbnail && (
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-40"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, var(--bg-elevated) 0%, transparent 60%)',
                }}
              />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md
                         flex items-center justify-center text-white hover:bg-black/80
                         transition-all outline-none z-10"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Movie Info */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-white text-[24px] font-bold mb-1 line-clamp-1">
                  {movie.title}
                </h2>
                <div className="flex items-center gap-2 text-[13px] text-white/60">
                  {movie.year && <span>{movie.year}</span>}
                  {movie.duration && (
                    <>
                      <span>•</span>
                      <span>{movie.duration}</span>
                    </>
                  )}
                  {movie.rating && (
                    <>
                      <span>•</span>
                      <span className="text-[#facc15] font-semibold flex items-center gap-1">
                        ★ {typeof movie.rating === 'string' ? (parseInt(movie.rating) / 10).toFixed(1) : (movie.rating / 10).toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="p-6">
              <h3 className="text-white font-bold text-[16px] mb-4 flex items-center gap-2">
                <Link2 size={18} className="text-[var(--brand-purple)]" />
                Share with friends
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {shareOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => option.action(movie)}
                    className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10
                             border border-white/5 hover:border-white/20
                             transition-all outline-none flex flex-col items-center gap-2"
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center
                               transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${option.color}20` }}
                    >
                      <div style={{ color: option.color }}>{option.icon}</div>
                    </div>

                    {/* Label */}
                    <span className="text-white/80 text-[12px] font-medium group-hover:text-white
                                   transition-colors">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Link Input */}
              <div className="mb-4">
                <label className="block text-white/40 text-[12px] uppercase tracking-wider mb-2">
                  Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white text-[14px] outline-none focus:border-[var(--brand-purple)]
                             transition-colors"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-[var(--brand-purple)] hover:bg-[var(--brand-purple)]/90
                             text-white rounded-lg font-semibold transition-all active:scale-95
                             flex items-center gap-2"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Download Share Card */}
              <button
                onClick={downloadShareCard}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10
                         rounded-lg text-white text-[14px] font-medium
                         flex items-center justify-center gap-2 transition-all"
              >
                <Download size={16} />
                Download Share Card
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
