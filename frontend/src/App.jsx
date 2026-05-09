import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  
  const seasons = [
    "Season 1", "Season 2", "Season 3", 
    "Season 4", "Season 5"
  ];

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      <Sidebar />
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow pl-[64px]">
        <Hero />

        {/* Tab Bar Container */}
        <div className="relative w-full px-[80px] mt-6 mb-5 flex flex-row items-center gap-8 h-12 overflow-x-auto scrollbar-hide">
          {/* Sliding Indicator (Alternative implementation for smooth sliding) */}
          <div 
            className="absolute bottom-0 h-[2px] bg-white rounded-full transition-all duration-250 ease-in-out"
            style={{ 
              width: '65px', // Approximate width of "Season X" text
              left: `calc(80px + ${activeTab * (65 + 32)}px)` // padding-left + index * (width + gap)
            }}
          />

          {seasons.map((season, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative py-2 text-[15px] whitespace-nowrap transition-colors duration-200 group ${
                activeTab === index 
                  ? 'text-white font-semibold' 
                  : 'text-white/50 font-medium hover:text-white/85'
              }`}
            >
              {season}
              {/* Hover underline for inactive tabs */}
              {activeTab !== index && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
            </button>
          ))}
        </div>

        {/* Episode Cards Grid */}
        <div className="px-[80px] pb-20 mt-4">
          <div className="grid grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-3 overflow-hidden border border-white/5 transition-all group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                   <div className="w-full h-full flex items-center justify-center text-white/5 font-bold italic">
                     S{activeTab + 1} E{i}
                   </div>
                </div>
                <h3 className="text-[15px] font-medium text-white/90 group-hover:text-purple-400 transition-colors">
                  Episode {i}: {
                    i === 1 ? 'Demon Arrives' : 
                    i === 2 ? 'The Shadow' : 
                    i === 3 ? 'Blood Moon' :
                    i === 4 ? 'Fallen' : 'Resurrection'
                  }
                </h3>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

