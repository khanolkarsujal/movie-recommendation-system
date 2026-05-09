import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SeasonTabs from './components/SeasonTabs';

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

        <SeasonTabs
          seasons={seasons}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

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

