import React from 'react';
import { Play, Plus, Info } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0d0d0d]">
      {/* Background Image */}
      <img 
        src={heroBg} 
        alt="Demonic Slash Background" 
        className="absolute top-0 right-0 w-full h-full object-cover object-[right_center]"
      />

      {/* Left Side Gradient Overlay */}
      <div 
        className="absolute inset-0 z-1"
        style={{
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 35%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)'
        }}
      />

      {/* Bottom Gradient Fade */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[120px] z-2"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0d0d0d)'
        }}
      />

      {/* Content Block */}
      <div className="absolute left-20 bottom-[180px] z-10 max-w-[520px] flex flex-col gap-3 ml-4">
        {/* Platform Badge */}
        <div className="flex items-center gap-1.5 animate-fadeIn opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
          <div className="w-4.5 h-4.5 bg-purple-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">S</span>
          </div>
          <span className="text-[13px] font-medium text-white uppercase tracking-[0.5px]">slothui original</span>
        </div>

        {/* Show Title */}
        <h1 
          className="text-7xl font-bold text-white leading-none tracking-tight animate-slideUp opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]"
          style={{ 
            fontFamily: "'UnifrakturMaguntia', cursive",
            textShadow: '0 4px 24px rgba(0,0,0,0.8)'
          }}
        >
          Demonic Slash
        </h1>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-sm animate-fadeIn opacity-0 [animation-delay:0.6s] [animation-fill-mode:forwards]">
          <span className="font-semibold text-white">2028</span>
          <span className="text-white/80">82 Seasons</span>
          <span className="px-2.5 py-0.5 border border-white/50 rounded text-[12px] text-white">Cartoon</span>
          <div className="flex items-center gap-1">
            <span className="text-[#f59e0b] tracking-tighter text-lg">★★★★★</span>
            <span className="font-semibold text-white ml-1">4.8</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] text-white/80 leading-relaxed max-w-[420px] animate-fadeIn opacity-0 [animation-delay:0.7s] [animation-fill-mode:forwards]">
          When a small, unsuspecting town becomes the hunting ground for a malevolent entity, 
          a group of unlikely heroes must rise — The Demonic Slash Group.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-2 animate-slideUp opacity-0 [animation-delay:0.9s] [animation-fill-mode:forwards]">
          <div className="flex items-center gap-3 group cursor-pointer">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/15 border border-white/30 backdrop-blur-md transition-all duration-300 group-hover:bg-white/25 group-hover:scale-105">
              <Play size={18} fill="white" className="ml-1" />
            </button>
            <span className="text-[15px] font-medium text-white group-hover:text-white/90">Play S1 E1</span>
          </div>

          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/25 transition-all duration-300 hover:bg-white/20">
            <Plus size={18} className="text-white" />
          </button>

          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/25 transition-all duration-300 hover:bg-white/20">
            <Info size={18} className="text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
