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
  Minus,
  MoreVertical,
  History,
  Pause,
  Settings as SettingsIcon,
  MessageSquare,
  Layout,
  MessageCircle
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
    details: 'Dancecode Electronics · 19M views',
    time: '2h ago',
    dateGroup: 'TODAY',
    badge: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80&fit=crop',
    duration: '2:18:12',
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
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80&fit=crop',
    duration: '2:18:12',
  },
  {
    id: 3,
    type: 'added',
    action: 'Added',
    target: 'The Last Oracle',
    suffix: ' to watchlist',
    details: 'Fantasy · 8 Episodes',
    time: '5h ago',
    dateGroup: 'TODAY',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80&fit=crop',
    duration: '45:00',
  },
  {
    id: 4,
    type: 'searched',
    action: 'Searched for',
    target: '"sci-fi thrillers 2024"',
    details: '12 results found',
    time: '6h ago',
    dateGroup: 'TODAY',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80&fit=crop',
    duration: '',
  },
  {
    id: 5,
    type: 'watched',
    action: 'Finished',
    target: 'Echoes of Tomorrow',
    suffix: ' — S1',
    details: 'Sci-Fi · 10 Episodes',
    time: 'Yesterday',
    dateGroup: 'YESTERDAY',
    badge: 'Season done',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80&fit=crop',
    duration: '10 Episodes',
  },
  {
    id: 6,
    type: 'watched',
    action: 'Watched',
    target: 'Velocity',
    details: 'Action · 1h 58m',
    time: 'Yesterday',
    dateGroup: 'YESTERDAY',
    badge: '45% watched',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80&fit=crop',
    duration: '1:58:00',
  },
  {
    id: 7,
    type: 'removed',
    action: 'Removed',
    target: 'Kingdom of Ashes',
    suffix: ' from watchlist',
    details: 'Drama',
    time: 'Yesterday',
    dateGroup: 'YESTERDAY',
    thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80&fit=crop',
    duration: '2:10:00',
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
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80&fit=crop',
    duration: 'S1 E10',
  },
];

const Activity: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter(a => {
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'Watched' && a.type === 'watched') ||
      (activeFilter === 'Ratings' && a.type === 'rated') ||
      (activeFilter === 'Watchlist' && (a.type === 'added' || a.type === 'removed')) ||
      (activeFilter === 'Searches' && a.type === 'searched');
    
    const matchesSearch = a.target.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Group by dateGroup
  const grouped = filteredActivities.reduce((acc, curr) => {
    if (!acc[curr.dateGroup]) acc[curr.dateGroup] = [];
    acc[curr.dateGroup].push(curr);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-[60px] text-white bg-[#0f0f0f]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Feed */}
        <div className="flex-1">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Watch history</h1>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    activeFilter === filter 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-[20px] font-bold mb-6">
                  {date.charAt(0) + date.slice(1).toLowerCase()}
                </h3>
                <div className="flex flex-col gap-4">
                  {items.map((item, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={item.id} 
                      className="group flex gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-48 h-28 shrink-0 rounded-lg overflow-hidden bg-white/5">
                        <img 
                          src={item.thumbnail} 
                          alt={item.target} 
                          className="w-full h-full object-cover"
                        />
                        {item.duration && (
                          <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[11px] font-bold">
                            {item.duration}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col pt-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-[16px] font-bold text-white mb-1 line-clamp-2">
                              {item.action} {item.target}{item.suffix}
                            </h4>
                            <div className="flex flex-col text-[13px] text-white/50">
                              <span>{item.details}</span>
                              <span className="mt-1">{item.time}</span>
                            </div>
                          </div>
                          <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white">
                            <MoreVertical size={20} />
                          </button>
                        </div>
                        {item.badge && (
                          <div className="mt-auto">
                            <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[11px] font-bold rounded">
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:w-[360px] flex flex-col gap-8">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search watch history"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-transparent border-b border-white/20 focus:border-white outline-none text-[15px] transition-colors"
            />
          </div>

          {/* Controls List */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[14px] font-medium">
              <Trash2 size={20} className="text-white/70" />
              Clear all watch history
            </button>
            <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[14px] font-medium">
              <Pause size={20} className="text-white/70" />
              Pause watch history
            </button>
            <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[14px] font-medium">
              <SettingsIcon size={20} className="text-white/70" />
              Manage all history
            </button>
          </div>

          {/* Links List */}
          <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
            <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[14px] font-medium">
              <MessageSquare size={18} className="text-white/70" />
              Comments
            </button>
            <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[14px] font-medium">
              <Layout size={18} className="text-white/70" />
              Posts
            </button>
            <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[14px] font-medium">
              <MessageCircle size={18} className="text-white/70" />
              Live chat
            </button>
          </div>

          {/* Stats Summary (re-integrated) */}
          <div className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-white/30 mb-6">Your Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              {statCards.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-white/40">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Activity;
