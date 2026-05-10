import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Bell, 
  CheckCircle2,
  Clock,
  Tv,
  Film,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';

const filters = ['All', 'Movies', 'TV Shows', 'My Watchlist'];

const days = [
  { day: 'SAT', date: '9' },
  { day: 'SUN', date: '10', active: true, hasEvent: true },
  { day: 'MON', date: '11' },
  { day: 'TUE', date: '12' },
  { day: 'WED', date: '13' },
  { day: 'THU', date: '14', hasEvent: true },
  { day: 'FRI', date: '15' },
  { day: 'SAT', date: '16' },
  { day: 'SUN', date: '17' },
  { day: 'MON', date: '18', hasEvent: true },
  { day: 'TUE', date: '19' },
  { day: 'WED', date: '20' },
];

const scheduleGroups = [
  {
    dateStr: "TODAY — MAY 10",
    isToday: true,
    items: [
      {
        id: 1,
        title: "Echoes of Tomorrow",
        suffix: " — S2 Premiere",
        metaLeft: "Available now · 8.7",
        badges: [
          { text: "New season", icon: <Check size={12} className="mr-1 inline"/>, bg: "bg-emerald-500/10 border border-emerald-500/20", textCol: "text-emerald-400" },
          { text: "10 Episodes", bg: "bg-[#4c1d95]/40", textCol: "text-[#a78bfa]" },
          { text: "Sci-Fi", bg: "bg-[#831843]/40", textCol: "text-[#f472b6]" }
        ],
        metaRightTop: "Today",
        metaRightBottom: "All episodes",
        notified: true,
        iconBg: "bg-indigo-500/10",
        iconCol: "text-indigo-500",
        icon: <Tv size={22} />
      },
      {
        id: 2,
        title: "Midnight Run",
        metaLeft: "2h 05m · 7.9",
        badges: [
          { text: "Movie", bg: "bg-blue-900/40", textCol: "text-blue-400" },
          { text: "Thriller", bg: "bg-amber-900/40", textCol: "text-amber-500" }
        ],
        metaRightTop: "Today",
        metaRightBottom: "4K available",
        notified: false,
        iconBg: "bg-purple-500/10",
        iconCol: "text-purple-500",
        icon: <Film size={22} />
      }
    ]
  },
  {
    dateStr: "MAY 14",
    items: [
      {
        id: 3,
        title: "The Last Oracle",
        suffix: " — S1 E5",
        metaLeft: "~52m per ep · 9.1",
        badges: [
          { text: "New episode", bg: "bg-[#4c1d95]/40", textCol: "text-[#a78bfa]" },
          { text: "Fantasy", bg: "bg-[#831843]/40", textCol: "text-[#f472b6]" }
        ],
        metaRightTop: "May 14",
        metaRightBottom: "Wed · 9:00 PM",
        notified: true,
        iconBg: "bg-emerald-500/10",
        iconCol: "text-emerald-500",
        icon: <Tv size={22} />
      }
    ]
  },
  {
    dateStr: "MAY 18",
    items: [
      {
        id: 4,
        title: "Shadow Protocol 2",
        metaLeft: "2h 34m · India",
        badges: [
          { text: "Movie", bg: "bg-blue-900/40", textCol: "text-blue-400" },
          { text: "Action", bg: "bg-indigo-900/40", textCol: "text-indigo-400" },
          { text: "8 days", icon: <Clock size={12} className="mr-1 inline" />, bg: "bg-yellow-900/40", textCol: "text-yellow-500" }
        ],
        metaRightTop: "May 18",
        metaRightBottom: "Sun · All day",
        notified: false,
        iconBg: "bg-orange-500/10",
        iconCol: "text-orange-500",
        icon: <Film size={22} />
      },
      {
        id: 5,
        title: "Velocity",
        suffix: " — Director's Cut",
        metaLeft: "2h 20m · 4K HDR",
        badges: [
          { text: "Movie", bg: "bg-blue-900/40", textCol: "text-blue-400" },
          { text: "Action", bg: "bg-indigo-900/40", textCol: "text-indigo-400" }
        ],
        metaRightTop: "May 18",
        metaRightBottom: "Extended cut",
        notified: false,
        iconBg: "bg-blue-500/10",
        iconCol: "text-blue-500",
        icon: <Film size={22} />
      }
    ]
  },
  {
    dateStr: "MAY 24",
    items: [
      {
        id: 6,
        title: "Kingdom of Ashes",
        suffix: " — S3",
        metaLeft: "~48m per ep · 8.4",
        badges: [
          { text: "New season", icon: <Check size={12} className="mr-1 inline"/>, bg: "bg-emerald-500/10 border border-emerald-500/20", textCol: "text-emerald-400" },
          { text: "8 Episodes", bg: "bg-[#4c1d95]/40", textCol: "text-[#a78bfa]" }
        ],
        metaRightTop: "May 24",
        metaRightBottom: "Sat · Weekly",
        notified: false,
        iconBg: "bg-yellow-600/10",
        iconCol: "text-yellow-600",
        icon: <Tv size={22} />
      }
    ]
  }
];

const Schedule: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-[60px] text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Release Schedule</h1>
          <span className="px-3 py-1 bg-[#4c1d95]/40 text-[#a78bfa] text-xs font-semibold rounded-full border border-[#8b5cf6]/20">
            12 upcoming
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              viewMode === 'list' 
                ? 'bg-white/10 border-white/20' 
                : 'bg-transparent border-white/10 hover:bg-white/5'
            }`}
          >
            <List size={16} /> List
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              viewMode === 'calendar' 
                ? 'bg-white/10 border-white/20' 
                : 'bg-transparent border-white/10 hover:bg-white/5'
            }`}
          >
            <CalendarIcon size={16} /> Calendar
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
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
        
        <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
          <Bell size={16} /> Notify all
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="mb-12">
        <h3 className="text-[12px] font-bold tracking-widest text-white/30 uppercase mb-4 ml-1">
          MAY 2026
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {days.map((d, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-center min-w-[64px] h-[72px] rounded-xl border shrink-0 relative transition-colors cursor-pointer ${
                d.active 
                  ? 'bg-[#8b5cf6] border-[#8b5cf6]' 
                  : 'bg-[#111113] border-white/5 hover:border-white/20'
              }`}
            >
              <span className={`text-[11px] font-bold tracking-wider mb-1 ${d.active ? 'text-white/80' : 'text-white/40'}`}>
                {d.day}
              </span>
              <span className={`text-[18px] font-bold ${d.active ? 'text-white' : 'text-white/80'}`}>
                {d.date}
              </span>
              {d.hasEvent && (
                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${d.active ? 'bg-white' : 'bg-[#8b5cf6]'}`} />
              )}
            </div>
          ))}
        </div>
        {/* Fake scrollbar track */}
        <div className="flex items-center mt-2 px-1">
          <ChevronLeft size={14} className="text-white/30 mr-2 shrink-0" />
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-white/30 rounded-full" />
          </div>
          <ChevronRight size={14} className="text-white/30 ml-2 shrink-0" />
        </div>
      </div>

      {/* Schedule Feed */}
      <div className="flex flex-col gap-10">
        {scheduleGroups.map((group, idx) => (
          <div key={idx} className="relative">
            {/* Timeline connector (behind) */}
            <div className="absolute left-0 top-[22px] bottom-0 w-px bg-white/5 -z-10 hidden md:block" />
            
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-[11px] font-bold tracking-widest text-white/40 uppercase bg-[var(--bg-page)] pr-4">
                {group.dateStr}
              </h3>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="flex flex-col gap-3">
              {group.items.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-xl border relative transition-colors ${
                    group.isToday 
                      ? 'bg-white/[0.02] border-[#8b5cf6]/30' 
                      : 'bg-[#111113] border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Left accent line for Today items */}
                  {group.isToday && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b5cf6] rounded-l-xl shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
                  )}

                  <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <div className={item.iconCol}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <p className="text-[16px] text-white font-semibold mb-1">
                        {item.title} <span className="text-white/60 font-normal">{item.suffix}</span>
                      </p>
                      <div className="flex items-center gap-2 mb-2 text-[13px] text-white/40">
                        <span className="w-1.5 h-1.5 border border-white/30 rounded-sm inline-block shrink-0" />
                        {item.metaLeft}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.badges.map((b, bIdx) => (
                          <span key={bIdx} className={`px-2 py-0.5 rounded text-[11px] font-semibold ${b.bg} ${b.textCol}`}>
                            {b.icon}{b.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-0 w-full md:w-auto">
                    <div className="flex flex-col md:items-end">
                      <span className="text-[14px] font-medium text-white/90">
                        {item.metaRightTop}
                      </span>
                      <span className="text-[12px] text-white/40">
                        {item.metaRightBottom}
                      </span>
                    </div>
                    
                    <button 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors border ${
                        item.notified 
                          ? 'bg-transparent border-white/20 text-white/80 hover:bg-white/5' 
                          : 'bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      {item.notified ? (
                        <><Check size={14} /> Notified</>
                      ) : (
                        <><Bell size={14} /> Notify me</>
                      )}
                    </button>
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

export default Schedule;
