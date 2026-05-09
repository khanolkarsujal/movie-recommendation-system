import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart2,
  TrendingUp,
  Users,
  Star,
  Clock,
  Play,
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
    label: 'Hours Watched',
    value: '142h',
    change: '+12h this week',
    trend: 'up',
    icon: Clock,
    color: '#8b5cf6',
  },
  {
    label: 'Shows Completed',
    value: '23',
    change: '+3 this month',
    trend: 'up',
    icon: Star,
    color: '#22c55e',
  },
  {
    label: 'Watchlist Items',
    value: '47',
    change: '+8 recently',
    trend: 'up',
    icon: Heart,
    color: '#ef4444',
  },
  {
    label: 'Avg. Rating Given',
    value: '4.6',
    change: 'All time high',
    trend: 'up',
    icon: Award,
    color: '#f59e0b',
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
    <div className="min-h-screen pt-32 px-6 md:px-[60px] pb-20 bg-[var(--bg-page)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-[var(--brand-purple)]/20 flex items-center justify-center">
            <BarChart2 size={24} className="text-[var(--brand-purple)]" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">Your Analytics</h1>
        </div>
        <p className="text-white/40 text-[16px]">
          Track your watching habits and discover your entertainment patterns
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
      >
        {STATS.map(({ label, value, change, trend, icon: Icon, color }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="group relative rounded-[12px] p-6 bg-[var(--bg-card)] border border-[var(--border-default)]
                     hover:border-[var(--border-brand)] transition-all duration-300 hover:-translate-y-1
                     hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
          >
            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[12px] blur-xl"
              style={{ background: `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 70%)` }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300
                           group-hover:scale-110"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                {trend && (
                  <div className="flex items-center gap-1 text-[12px] font-semibold"
                    style={{ color: trend === 'up' ? '#22c55e' : '#ef4444' }}>
                    <TrendingUp size={14} />
                  </div>
                )}
              </div>

              <div>
                <p className="text-[36px] font-black text-white leading-none mb-2">{value}</p>
                <p className="text-[14px] font-medium text-white/50 mb-1">{label}</p>
                {change && (
                  <p className="text-[12px] text-white/30">{change}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[12px] p-8 bg-[var(--bg-card)] border border-[var(--border-default)]"
        >
          <div className="flex items-center gap-3 mb-8">
            <Target size={20} className="text-[var(--brand-purple)]" />
            <h2 className="text-[22px] font-bold text-white">Genre Breakdown</h2>
          </div>

          <div className="space-y-5">
            {GENRE_DATA.map((genre, index) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: genre.color }}
                    />
                    <span className="text-[15px] font-semibold text-white">{genre.name}</span>
                  </div>
                  <span className="text-[13px] text-white/40">{genre.hours.toFixed(1)}h</span>
                </div>

                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${genre.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: genre.color }}
                  />
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
          className="rounded-[12px] p-8 bg-[var(--bg-card)] border border-[var(--border-default)]"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-[var(--brand-purple)]" />
              <h2 className="text-[22px] font-bold text-white">Weekly Activity</h2>
            </div>

            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider
                           transition-all outline-none ${
                    selectedPeriod === period
                      ? 'bg-[var(--brand-purple)] text-white'
                      : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-48">
            {ACTIVITY_DATA.map((data, index) => {
              const heightPercent = (data.hours / maxHours) * 100;
              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-3">
                  <motion.div
                    className="w-full relative group/bar cursor-pointer"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.6, ease: 'easeOut' }}
                  >
                    <div
                      className="w-full h-full rounded-t-lg bg-gradient-to-t from-[var(--brand-purple)] to-[var(--brand-purple)]/60
                               group-hover/bar:from-[var(--brand-purple)]/90 group-hover/bar:to-[var(--brand-purple)]/80
                               transition-all duration-300"
                    />

                    {/* Tooltip */}
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
                               bg-black border border-white/20 rounded-lg opacity-0 group-hover/bar:opacity-100
                               transition-opacity pointer-events-none whitespace-nowrap"
                    >
                      <p className="text-white text-[12px] font-bold">{data.hours.toFixed(1)}h</p>
                    </div>
                  </motion.div>

                  <span className="text-[12px] font-semibold text-white/40">{data.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Achievement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-[12px] p-8 bg-gradient-to-r from-[var(--brand-purple)]/10 to-transparent
                 border border-[var(--brand-purple)]/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-purple)]/20 flex items-center justify-center">
            <Award size={32} className="text-[var(--brand-purple)]" />
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-white mb-1">🎉 Achievement Unlocked</h3>
            <p className="text-white/60 text-[14px]">
              Binge Master: Watched 5+ hours this week! Keep the momentum going.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
