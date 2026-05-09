import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Film, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

const GREETINGS = [
  "What are you in the mood for tonight?",
  "Tell me your vibe and I'll find the perfect watch.",
  "Craving something dark? Epic? Heartwarming?",
];

const SUGGESTIONS = [
  "Something like Blade Runner but newer",
  "Dark psychological thriller, no jump scares",
  "Feel-good anime for the weekend",
  "Epic sci-fi with stunning visuals",
];

const MOCK_RECS = [
  { title: "Annihilation", year: 2018, why: "Atmospheric sci-fi with a deeply unsettling mystery.", thumb: "https://picsum.photos/seed/ann/80/120" },
  { title: "Ex Machina",   year: 2014, why: "Intimate, cerebral AI thriller that gets under your skin.", thumb: "https://picsum.photos/seed/exm/80/120" },
  { title: "Arrival",      year: 2016, why: "Masterful slow-burn alien contact story with emotional punch.", thumb: "https://picsum.photos/seed/arr/80/120" },
  { title: "Dune Part II", year: 2024, why: "Breathtaking cinematography and grand-scale world-building.", thumb: "https://picsum.photos/seed/dun/80/120" },
  { title: "The Matrix",   year: 1999, why: "Cyberpunk classic that defined a generation's aesthetic.", thumb: "https://picsum.photos/seed/mat/80/120" },
];

function BotMessage({ recs }) {
  const { addToWatchlist, isInWatchlist } = useStore();

  if (!recs) return null;
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-white/80 leading-relaxed">
        Based on your taste, here are 5 picks you'll love:
      </p>
      {recs.map((rec, i) => (
        <motion.div
          key={rec.title}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
        >
          <img
            src={rec.thumb}
            alt={rec.title}
            className="w-10 h-14 object-cover rounded-md flex-shrink-0 bg-white/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-bold text-white">{rec.title}</span>
              <span className="text-[11px] text-white/40">{rec.year}</span>
            </div>
            <p className="text-[11px] text-white/55 leading-[1.4] mt-0.5">{rec.why}</p>
          </div>
          <button
            onClick={() => {
              const movie = { id: `ai-${rec.title}`, title: rec.title, year: rec.year, thumbnail: rec.thumb, duration: '~2h' };
              if (isInWatchlist(movie.id)) {
                toast('Already in watchlist!', { icon: '✓' });
              } else {
                addToWatchlist(movie);
                toast.success(`Added "${rec.title}" to Watchlist`, {
                  style: { background: '#1a1a22', color: '#fff', border: '1px solid rgba(139,92,246,0.4)' },
                });
              }
            }}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)]/20 hover:bg-[var(--accent)]/40 flex items-center justify-center text-[var(--accent)] transition-colors"
            aria-label="Add to watchlist"
          >
            <Plus size={13} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export default function AiDrawer() {
  const { aiDrawerOpen, closeAiDrawer } = useStore();
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const messagesEndRef             = useRef(null);
  const inputRef                   = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (aiDrawerOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)], recs: null }]);
    }
  }, [aiDrawerOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (aiDrawerOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [aiDrawerOpen]);

  // Escape key close
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeAiDrawer();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAiDrawer]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Simulate AI response (replace with real Claude API call)
    await new Promise((r) => setTimeout(r, 1400));
    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: null, recs: MOCK_RECS },
    ]);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {aiDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAiDrawer}
            className="fixed inset-0 z-[900] bg-black/50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[901] w-[360px] flex flex-col"
            style={{
              background: 'rgba(10, 10, 14, 0.97)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/8 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles size={18} className="text-[var(--accent)]" />
                  <h2 className="text-[16px] font-bold text-white">AI Movie Assistant</h2>
                </div>
                <p className="text-[12px] text-white/40">Tell me what you're in the mood for</p>
              </div>
              <button
                onClick={closeAiDrawer}
                className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all outline-none"
                aria-label="Close AI drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' ? (
                    <div className="max-w-[90%] space-y-2">
                      {msg.text && (
                        <div className="px-4 py-3 rounded-2xl rounded-tl-sm text-[13px] text-white/90 leading-relaxed"
                          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.15))', border: '1px solid rgba(139,92,246,0.2)' }}
                        >
                          {msg.text}
                        </div>
                      )}
                      {msg.recs && <BotMessage recs={msg.recs} />}
                    </div>
                  ) : (
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-white/8 border border-white/10 text-[13px] text-white/90 leading-relaxed">
                      {msg.text}
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 text-[13px] text-white/60"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
                    Finding perfect matches…
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-3 flex-shrink-0">
                <p className="text-[11px] text-white/30 uppercase tracking-wider font-bold mb-2">Try asking</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/8 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[var(--accent)]/50 transition-colors">
                <Film size={15} className="text-white/30 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="I'm in the mood for something..."
                  className="flex-1 bg-transparent text-[13px] text-white placeholder-white/30 outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all flex-shrink-0"
                  aria-label="Send"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
