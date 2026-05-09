import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { Play, Plus, Info } from 'lucide-react';

function App() {
  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      <Sidebar />
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow pl-16">

        {/* Hero Section */}
        <div className="relative h-[85vh] w-full overflow-hidden">
          {/* Hero Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-transparent to-transparent z-1" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-1" />
          
          {/* Placeholder for Hero Image */}
          <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-gray-800 text-9xl font-bold opacity-10 uppercase tracking-tighter select-none">Demonic Slash</span>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-12 pt-20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold">S</span>
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest text-white/60">slothui original</span>
            </div>
            
            <h1 className="text-7xl font-bold mb-6 tracking-tight max-w-2xl leading-tight">
              Demonic Slash
            </h1>
            
            <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
              <span className="text-white font-medium">2028</span>
              <span>82 Seasons</span>
              <span className="px-2 py-0.5 border border-gray-700 rounded text-[10px]">CARTOON</span>
              <div className="flex items-center gap-1 text-yellow-500">
                <span>★★★★★</span>
                <span className="text-white ml-1">4.8</span>
              </div>
            </div>
            
            <p className="max-w-xl text-lg text-gray-400 mb-10 leading-relaxed">
              When a small, unsuspecting town becomes the hunting ground for a malevolent entity, 
              a group of unlikely heroes must rise — The Demonic Slash Group.
            </p>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all transform hover:scale-105">
                <Play size={20} fill="currentColor" />
                Play S1 E1
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md">
                <Plus size={24} />
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md">
                <Info size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="px-12 -mt-20 relative z-20 pb-20">
          <div className="flex items-center gap-8 mb-8 border-b border-white/5">
            <button className="pb-4 border-b-2 border-purple-500 text-white font-medium">Season 1</button>
            <button className="pb-4 text-gray-500 hover:text-white transition-colors">Season 2</button>
            <button className="pb-4 text-gray-500 hover:text-white transition-colors">Season 3</button>
            <button className="pb-4 text-gray-500 hover:text-white transition-colors">Season 4</button>
            <button className="pb-4 text-gray-500 hover:text-white transition-colors">Season 5</button>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-3 overflow-hidden border border-white/5 transition-all group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                   <div className="w-full h-full flex items-center justify-center text-white/5 font-bold italic">EPISODE {i}</div>
                </div>
                <h3 className="text-sm font-medium group-hover:text-purple-400 transition-colors">Episode {i}: Demon {i === 1 ? 'Arrives' : i === 2 ? 'Dies' : 'Resurrected'}</h3>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
