import React from 'react';
import { BarChart2, TrendingUp, Users, Star } from 'lucide-react';

const STATS = [
  { label: 'Hours Watched', value: '142h', icon: BarChart2, color: '#8b5cf6' },
  { label: 'Shows Completed', value: '23',  icon: Star,      color: '#22c55e' },
  { label: 'Trending Picks',  value: '8',   icon: TrendingUp, color: '#f59e0b' },
  { label: 'Following',       value: '14',  icon: Users,      color: '#3b82f6' },
];

export default function Analytics() {
  return (
    <div className="min-h-screen pt-24 px-8 md:px-[80px]">
      <h1 className="text-3xl font-bold text-white mb-8">Your Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-6 border border-white/5 flex flex-col gap-4"
            style={{ background: 'var(--bg-surface)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-white/50 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-white/30 text-sm">More detailed analytics coming soon.</p>
    </div>
  );
}
