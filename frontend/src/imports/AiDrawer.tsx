import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Film, Plus, Loader2, MessageSquare, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store';
import type { Movie } from './types';

const GREETINGS = [
  "What are you in the mood for tonight?",
  "Tell me your vibe and I'll find the perfect watch.",
  "Craving something dark? Epic? Heartwarming?",
  "Hello! I'm your AI cinema expert. What can I find for you?",
];

const SUGGESTIONS = [
  "Something like Blade Runner but newer",
  "Dark psychological thriller, no jump scares",
  "Feel-good anime for the weekend",
  "Epic sci-fi with stunning visuals",
];

const MOCK_RECS = [
  { id: 'ai-1', title: "Annihilation", year: 2018, why: "Atmospheric sci-fi with a deeply unsettling mystery.", thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop" },
  { id: 'ai-2', title: "Ex Machina",   year: 2014, why: "Intimate, cerebral AI thriller that gets under your skin.", thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop" },
  { id: 'ai-3', title: "Arrival",      year: 2016, why: "Masterful slow-burn alien contact story with emotional punch.", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2574&auto=format&fit=crop" },
  { id: 'ai-4', title: "Dune Part II", year: 2024, why: "Breathtaking cinematography and grand-scale world-building.", thumbnail: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2637&auto=format&fit=crop" },
  { id: 'ai-5', title: "The Matrix",   year: 1999, why: "Cyberpunk classic that defined a generation's aesthetic.", thumbnail: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2564&auto=format&fit=crop" },
];

interface Message {
  role: 'bot' | 'user';
  text?: string | null;
  recs?: typeof MOCK_RECS | null;
}

const BotMessage: React.FC<{ recs: typeof MOCK_RECS }> = ({ recs }) => {
  const { addToWatchlist, isInWatchlist } = useStore();

  return (
    <div className="space-y-3 mt-4">
      <p className="text-[13px] text-white/80 leading-relaxed font-medium">
        Based on your taste, here are some picks you might love:
      </p>
      <div className="grid gap-3">
        {recs.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/12 transition-all group"
          >
            <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-white/10">
               <img
                src={rec.thumbnail}
                alt={rec.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-bold text-white truncate">{rec.title}</span>
                <span className="text-[11px] text-white/40">{rec.year}</span>
              </div>
              <p className="text-[11px] text-white/55 leading-[1.4] mt-1 line-clamp-2">{rec.why}</p>
            </div>
            <button
              onClick={() => {
                const movie: Movie = { id: rec.id, title: rec.title, year: rec.year, thumbnail: rec.thumbnail, duration: '~2h' };
                if (isInWatchlist(movie.id)) {
                  toast.info('Already in your watchlist');
                } else {
                  addToWatchlist(movie);
                  toast.success(`Added "${rec.title}" to Watchlist`);
                }
              }}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 hover:bg-[var(--accent)]/40 flex items-center justify-center text-[var(--accent)] transition-all active:scale-90"
              aria-label="Add to watchlist"
            >
              <Plus size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const AiDrawer: React.FC = () => {
  const { aiDrawerOpen, setAiDrawerOpen } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aiDrawerOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)] }]);
    }
  }, [aiDrawerOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (aiDrawerOpen) {
        const timer = setTimeout(() => inputRef.current?.focus(), 400);
        return () => clearTimeout(timer);
    }
  }, [aiDrawerOpen]);

  const handleClose = useCallback(() => setAiDrawerOpen(false), [setAiDrawerOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1500));
    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: "I've analyzed your request and found some great matches!", recs: MOCK_RECS },
    ]);
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
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
            onClick={handleClose}
            className="fixed inset-0 z-[900] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[901] w-full max-w-[400px] flex flex-col bg-[#0a0a0e]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-white tracking-tight">AI Assistant</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'bot' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/60'
                    }`}>
                      {msg.role === 'bot' ? <Bot size={16} /> : <MessageSquare size={16} />}
                    </div>
                    
                    <div className="space-y-1">
                      {msg.text && (
                        <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                            : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      )}
                      {msg.recs && <BotMessage recs={msg.recs} />}
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                     <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Bot size={16} />
                     </div>
                     <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 flex items-center gap-2 text-[13px] text-white/60">
                        <Loader2 size={14} className="animate-spin text-purple-500" />
                        Analyzing cinematic database...
                     </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-4">
              {messages.length <= 1 && (
                <div className="space-y-2">
                  <p className="text-[11px] text-white/30 uppercase tracking-widest font-bold px-1">Quick Prompts</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestionClick(s)}
                        className="text-[12px] px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/60 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-0 bg-purple-600/10 blur-xl group-focus-within:opacity-100 opacity-0 transition-opacity" />
                <div className="relative flex items-center gap-2 bg-[#1a1a22] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-purple-500/50 transition-all shadow-inner">
                  <Film size={18} className="text-white/30" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Describe your mood..."
                    className="flex-1 bg-transparent text-[14px] text-white placeholder-white/20 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-center text-white/20">AI results are curated based on trending titles and your history.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
