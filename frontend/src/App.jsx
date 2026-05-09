import React from 'react';
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
 * When react-router-dom is added, <Routes> will replace <Home /> here.
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
        <Home />
      </main>
    </div>
  );
}

export default App;
