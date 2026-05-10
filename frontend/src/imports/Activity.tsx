import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Trash2, 
  Play, 
  Star, 
  PlusSquare, 
  Search, 
  MinusSquare,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

const statCards = [
  {
    value: '18',
    label: 'Titles watched',
    trend: '+4 this week',
    trendUp: true,
    neutral: false,
  },
  {
    value: '47h',
    label: 'Watch time',
    trend: '+6h this week',
    trendUp: true,
    neutral: false,
  },
  {
    value: '5',
    label: 'Ratings given',
    trend: '-2 vs last week',
    trendUp: false,
    neutral: false,
  },
  {
    value: '3',
    label: 'Added to list',
    trend: 'Same as last week',
    trendUp: true,
    neutral: true,
  },
];

const filters = ['All', 'Watched', 'Ratings', 'Watchlist', 'Searches'];

const activities = [
  {
    id: 1,
    type: 'watched',
    action: 'Watched',
    target: 'Shadow Protocol',
    details: 'Movie · Action · 2h 18m',
    time: '2h ago',
    dateGroup: 'TODAY',
    badge: 'Completed',
    badgeColor: 'purple',
    icon: Play,
    iconColor: 'text-[#a78bfa]',
    iconBg: 'bg-[#8b5cf6]/20',
  },
  {
    id: 2,
    type: 'rated',
    action: 'Rated',
    target: 'Shadow Protocol',
    details: 'Your review · Movie',
    time: '2h ago',
    dateGroup: 'TODAY',
    badge: '★ 4.5',
    badgeColor: 'yellow',
    icon: Star,
    iconColor: 'text-[#fbbf24]',
    iconBg: 'bg-[#f59e0b]/20',
  },
  {
    id: 3,
    type: 'added',
    action: 'Added',
    target: 'The Last Oracle',
    suffix: ' to watchlist',
    details: 'TV Show · Fantasy · 8 Episodes',
    time: '5h ago',
    dateGroup: 'TODAY',
    icon: PlusSquare,
    iconColor: 'text-[#38bdf8]',
    iconBg: 'bg-[#0ea5e9]/20',
  },
  {
    id: 4,
    type: 'searched',
    action: 'Searched for',
    target: '"sci-fi thrillers 2024"',
    details: '12 results found',
    time: '6h ago',
    dateGroup: 'TODAY',
    icon: Search,
    iconColor: 'text-[#818cf8]',
    iconBg: 'bg-[#6366f1]/20',
  },
  {
    id: 5,
    type: 'watched',
    action: 'Finished',
    target: 'Echoes of Tomorrow',
    suffix: ' — S1',
    details: 'TV Show · Sci-Fi · 10 Episodes',
    time: 'Yesterday',
    dateGroup: 'YESTERDAY',
    badge: 'Season done',
    badgeColor: 'purple',
    icon: Play,
    iconColor: 'text-[#a78bfa]',
    iconBg: 'bg-[#8b5cf6]/20',
  },
  {
    id: 6,
    type: 'watched',
    action: 'Watched',
    target: 'Velocity',
    details: 'Movie · Action · 1h 58m',
    time: 'Yesterday',
    dateGroup: 'YESTERDAY',
    badge: '45% watched',
    badgeColor: 'purple',
    icon: Play,
    iconColor: 'text-[#a78bfa]',
    iconBg: 'bg-[#8b5cf6]/20',
  },
  {
    id: 7,
    type: 'removed',
    action: 'Removed',
    target: 'Kingdom of Ashes',
    suffix: ' from watchlist',
    details: 'Movie · Drama',
    time: 'Yesterday',
    dateGroup: 'YESTERDAY',
    icon: MinusSquare,
    iconColor: 'text-[#f87171]',
    iconBg: 'bg-[#ef4444]/20',
  },
  {
    id: 8,
    type: 'rated',
    action: 'Rated',
    target: 'Echoes of Tomorrow',
    details: 'Your review · TV Show',
    time: 'Yesterday',
    dateGroup: 'YESTERDAY',
    badge: '★ 5.0',
    badgeColor: 'yellow',
    icon: Star,
    iconColor: 'text-[#fbbf24]',
    iconBg: 'bg-[#f59e0b]/20',
  },
];

const Activity: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredActivities = activities.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Watched' && a.type === 'watched') return true;
    if (activeFilter === 'Ratings' && a.type === 'rated') return true;
    if (activeFilter === 'Watchlist' && (a.type === 'added' || a.type === 'removed')) return true;
    if (activeFilter === 'Searches' && a.type === 'searched') return true;
    return false;
  });

  // Group by dateGroup
  const grouped = filteredActivities.reduce((acc, curr) => {
    if (!acc[curr.dateGroup]) acc[curr.dateGroup] = [];
    acc[curr.dateGroup].push(curr);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-[60px] text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Recent Activity</h1>
          <span className="px-3 py-1 bg-[#8b5cf6]/20 text-[#a78bfa] text-xs font-semibold rounded-full border border-[#8b5cf6]/30">
            24 events
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-[#141418] border border-white/5 rounded-xl p-5 flex flex-col gap-1">
            <span className="text-3xl font-bold">{stat.value}</span>
            <span className="text-[13px] text-white/50">{stat.label}</span>
            <div className="flex items-center gap-1.5 mt-2">
              {stat.neutral ? (
                <Minus size={14} className="text-[#10b981]" />
              ) : stat.trendUp ? (
                <ArrowUpRight size={14} className="text-[#10b981]" />
              ) : (
                <ArrowDownRight size={14} className="text-[#ef4444]" />
              )}
              <span className={`text-[12px] font-medium ${stat.neutral ? 'text-[#10b981]' : stat.trendUp ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeFilter === filter 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[13px] font-semibold tracking-widest text-white/40 uppercase">
          Activity Feed
        </h2>
        <button className="text-[13px] font-medium text-[#a78bfa] hover:text-white transition-colors">
          View all &rarr;
        </button>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <h3 className="text-[11px] font-bold tracking-widest text-white/30 uppercase mb-4 ml-2">
              {date}
            </h3>
            <div className="flex flex-col gap-2">
              {items.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className="flex items-start justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <item.icon size={18} className={item.iconColor} />
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <p className="text-[15px] text-white/80 mb-1 leading-snug">
                        {item.action} <strong className="text-white font-semibold">{item.target}</strong>{item.suffix}
                      </p>
                      <p className="text-[13px] text-white/40">
                        {item.details}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 pt-0.5">
                    <span className="text-[12px] text-white/30 font-medium">
                      {item.time}
                    </span>
                    {item.badge && (
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        item.badgeColor === 'purple' 
                          ? 'bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/20' 
                          : 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Activity;
