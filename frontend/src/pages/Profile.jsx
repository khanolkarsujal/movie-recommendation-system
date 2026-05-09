import React from 'react';
import avatarImg from '../assets/avatar.png';

const PROFILE_STATS = [
  { label: 'Watchlist',  value: '47' },
  { label: 'Completed',  value: '23' },
  { label: 'Reviews',    value: '12' },
];

export default function Profile() {
  return (
    <div className="min-h-screen pt-24 px-8 md:px-[80px]">
      {/* Cover */}
      <div
        className="w-full h-40 rounded-2xl mb-0"
        style={{ background: 'linear-gradient(135deg, #1a0a2e, #6d28d9 50%, #0f3460)' }}
      />
      {/* Avatar + Name */}
      <div className="relative flex items-end gap-6 -mt-12 mb-8 px-4">
        <img
          src={avatarImg}
          alt="Profile avatar"
          className="w-24 h-24 rounded-full border-4 object-cover"
          style={{ borderColor: 'var(--bg-base)' }}
        />
        <div className="pb-1">
          <h1 className="text-2xl font-bold text-white">John Doe</h1>
          <p className="text-white/50 text-sm">john@email.com</p>
        </div>
      </div>
      {/* Stats */}
      <div className="flex gap-8 mb-10">
        {PROFILE_STATS.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-white/50">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-white/30 text-sm">Full profile editor coming soon.</p>
    </div>
  );
}
