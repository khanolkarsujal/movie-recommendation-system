import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';

/**
 * App.jsx — root shell.
 *
 * Responsibilities:
 *   • Renders the persistent layout chrome (Sidebar, Navbar)
 *   • Mounts the current page inside <main>
 *
 * State / data logic lives in the page components (pages/Home.jsx).
 */
function App() {
  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      {/* Persistent left sidebar — z-index 100, fixed */}
      <Sidebar />

      {/* Persistent top navbar — z-index 99, fixed, transparent */}
      <Navbar />

      {/* Page content — offset left for sidebar width (64px) */}
      <main className="flex-grow pl-[64px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<div className="p-8">Analytics Page</div>} />
          <Route path="/profile" element={<div className="p-8">Profile Page</div>} />
          <Route path="/schedule" element={<div className="p-8">Schedule Page</div>} />
          <Route path="/activity" element={<div className="p-8">Activity Page</div>} />
          <Route path="/notifications" element={<div className="p-8">Notifications Page</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
