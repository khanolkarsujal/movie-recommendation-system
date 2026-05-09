import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import avatarImg from '../assets/avatar.png';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const navLinks = ['Home', 'Browse', 'Kids', 'Support', 'FAQ'];

  return (
    <nav className="fixed top-0 left-16 right-0 h-[60px] flex items-center justify-between px-6 z-[99] backdrop-blur-[6px] bg-[#111111]/40">
      {/* Left Section */}
      <div className="flex items-center">
        {/* Nav Links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeTab === link;
            return (
              <button
                key={link}
                onClick={() => setActiveTab(link)}
                className={`relative text-[15px] font-medium transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {link}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <button className="text-white transition-all duration-200 hover:scale-110">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="text-white transition-all duration-200 hover:scale-110">
            <Bell size={20} />
          </button>
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
            2
          </div>
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full border-2 border-white/30 overflow-hidden cursor-pointer transition-all duration-200 hover:border-white/50">
          <img 
            src={avatarImg} 
            alt="User Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
