import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Assuming standard framer-motion, adjust to 'motion/react' if using the specific new package
import {
  BarChart2,
  TrendingUp,
  Star,
  Clock,
  Heart,
  Target,
  Award,
  Calendar,
  LucideIcon,
} from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}

interface GenreData {
  name: string;
  percentage: number;
  color: string;
  hours: number;
}

interface ActivityDay {
  day: string;
  hours: number;
}

const STATS: Stat[] = [
  {
    label: 'HOURS WATCHED',
    value: '142h',
    change: '+12h this week',
    trend: 'up',
    icon: Clock,
    color: '#8b5cf6', // Brand Purple
  },
  {
    label: 'SHOWS COMPLETED',
    value: '23',
    change: '+3 this month',
    trend: 'up',
    icon: Star,
    color: '#22c55e', // Green
  },
  {
    label: 'WATCHLIST ITEMS',
    value: '47',
    change: '+8 recently',
    trend: 'up',
    icon: Heart,
    color: '#ef4444', // Red
  },
  {
    label: 'AVG. RATING',
    value: '4.6',
    change: 'All time high',
    trend: 'up',
    icon: Award,
    color: '#f59e0b', // Amber
  },
];

const GENRE_DATA: GenreData[] = [
  { name: 'Sci-Fi', percentage: 35, color: '#3b82f6', hours: 49.7 },
  { name: 'Action', percentage: 28, color: '#ef4444', hours: 39.8 },
  { name: 'Drama', percentage: 20, color: '#8b5cf6', hours: 28.4 },
  { name: 'Horror', percentage: 12, color: '#a855f7', hours: 17.0 },
  { name: 'Comedy', percentage: 5, color: '#10b981', hours: 7.1 },
];

const ACTIVITY_DATA: ActivityDay[] = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 5.3 },
  { day: 'Sat', hours: 6.8 },
  { day: 'Sun', hours: 5.5 },
];

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const maxHours = Math.max(...ACTIVITY_DATA.map((d) => d.hours));

  return (
    // OTT Tweak: Deep #141414 background with hidden overflow for background glowing orbs
    <div className="relative min-h-screen pt-32 px-4 md:px-12 pb-20 bg-[#141414] text-white overflow-hidden">

      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--brand-purple)]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-12"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-purple)] to-purple-900 flex items-center justify-center shadow-lg shadow-[var(--brand-purple)]/20">
            <BarChart2 size={28} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
            Your Analytics
          </h1>
        </div>
        <p className="text-white/50 text-lg max-w-xl">
          Track your watching habits and discover your entertainment patterns across the universe of cinema.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {STATS.map(({ label, value, change, trend, icon: Icon, color }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            // OTT Tweak: Glassmorphism cards with cinematic hover lift
            className="group relative rounded-2xl p-6 bg-[#1c1c1c]/80 backdrop-blur-xl border border-white/5
                     hover:border-white/20 transition-all duration-500 hover:-translate-y-2
                     hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
          >
            {/* Inner Glow effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
              style={{ background: `radial-gradient(circle at top right, ${color}15 0%, transparent 60%)` }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                {trend && (
                  <div className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full bg-white/5"
                    style={{ color: trend === 'up' ? '#22c55e' : '#ef4444' }}>
                    <TrendingUp size={14} />
                    <span>{trend === 'up' ? '+' : '-'}</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-4xl font-black text-white leading-none mb-2 tracking-tighter drop-shadow-md">{value}</p>
                <p className="text-xs font-bold text-white/40 mb-1 tracking-widest">{label}</p>
                {change && (
                  <p className="text-sm text-white/30 font-medium">{change}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-8 bg-[#1c1c1c]/80 backdrop-blur-xl border border-white/5"
        >
          <div className="flex items-center gap-3 mb-8">
            <Target size={24} className="text-[var(--brand-purple)]" />
            <h2 className="text-2xl font-bold text-white">Top Genres</h2>
          </div>

          <div className="space-y-6">
            {GENRE_DATA.map((genre, index) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold text-white/90">{genre.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white/50">{genre.hours.toFixed(1)}h</span>
                </div>

                {/* OTT Tweak: Glowing Progress Bars */}
                <div className="relative h-2.5 bg-black/50 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${genre.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full relative"
                    style={{
                      backgroundColor: genre.color,
                      boxShadow: `0 0 12px ${genre.color}90` // Neon glow effect
                    }}
                  >
                    {/* Glossy highlight line */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-8 bg-[#1c1c1c]/80 backdrop-blur-xl border border-white/5 flex flex-col"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-[var(--brand-purple)]" />
              <h2 className="text-2xl font-bold text-white">Watch History</h2>
            </div>

            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
                           transition-all outline-none ${selectedPeriod === period
                      ? 'bg-[var(--brand-purple)] text-white shadow-lg'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between gap-2 sm:gap-4 h-56 mt-auto">
            {ACTIVITY_DATA.map((data, index) => {
              const heightPercent = (data.hours / maxHours) * 100;
              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-3">
                  <motion.div
                    className="w-full relative group/bar cursor-pointer"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.8, type: 'spring', bounce: 0.3 }}
                  >
                    {/* Bar Chart Tweak: Premium gradient bars with hover lift */}
                    <div
                      className="w-full h-full rounded-t-md bg-gradient-to-t from-[var(--brand-purple)]/40 to-[var(--brand-purple)]
                               group-hover/bar:from-[var(--brand-purple)] group-hover/bar:to-purple-400
                               transition-all duration-300"
                    />

                    {/* Premium Tooltip */}
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2
                               bg-[#2a2a2a] border border-white/10 rounded-lg opacity-0 group-hover/bar:opacity-100
                               group-hover/bar:-translate-y-2 transition-all duration-300 pointer-events-none whitespace-nowrap
                               shadow-xl z-20"
                    >
                      <p className="text-white text-sm font-black">{data.hours.toFixed(1)} <span className="text-white/50 text-xs font-medium">hrs</span></p>
                      {/* Tooltip caret */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2a2a2a] rotate-45 border-r border-b border-white/10" />
                    </div>
                  </motion.div>

                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{data.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Achievement Section - Video Game / OTT Trophy Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-8 rounded-2xl overflow-hidden group cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-purple)]/20 via-[var(--brand-purple)]/5 to-transparent z-0" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[var(--brand-purple)]/30 via-transparent to-transparent transition-opacity duration-500 z-0" />

        <div className="relative z-10 p-6 md:p-8 flex items-center gap-6 border border-[var(--brand-purple)]/30 rounded-2xl bg-[#1c1c1c]/40 backdrop-blur-sm">
          <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            <Award size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white mb-1 tracking-tight">🎉 Achievement Unlocked: Binge Master</h3>
            <p className="text-white/60 text-sm md:text-base font-medium">
              You've watched 5+ hours this week! Your dedication to cinema is legendary. Keep the momentum going.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;