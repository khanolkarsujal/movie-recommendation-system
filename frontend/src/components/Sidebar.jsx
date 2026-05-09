import React, { useState } from 'react';
import { 
  Home, 
  BarChart2, 
  UserRound, 
  Calendar, 
  Zap, 
  Bell, 
  Settings 
} from 'lucide-react';
import avatarImg from '../assets/avatar.png';

const Sidebar = () => {
  const [active, setActive] = useState('home');

  const navItems = [
    { id: 'home', icon: Home },
    { id: 'analytics', icon: BarChart2 },
    { id: 'profile', icon: UserRound },
    { id: 'calendar', icon: Calendar },
    { id: 'lightning', icon: Zap },
    { id: 'notifications', icon: Bell },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[#111111] flex flex-col items-center py-4 z-100 border-r border-white/5">
      {/* Brand Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <span className="text-[#111] font-bold text-xl select-none">S</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 group"
            >
              {/* Hover effect background */}
              <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                isActive 
                ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                : 'group-hover:bg-white/10'
              }`} />
              
              <Icon 
                size={22} 
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-[#111]' : 'text-gray-400 group-hover:text-white'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-4 mt-auto">
        <button className="relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 group">
          <div className="absolute inset-0 rounded-full group-hover:bg-white/10 transition-all duration-200" />
          <Settings 
            size={22} 
            className="relative z-10 text-gray-400 group-hover:text-white transition-colors duration-200" 
          />
        </button>
        
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-white/20 transition-all duration-200 cursor-pointer">
          <img 
            src={avatarImg} 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
