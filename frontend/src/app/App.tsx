import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from '../components/ErrorBoundary';

// Layout Components
import Navbar from '../imports/Navbar';
import Sidebar from '../imports/Sidebar';

// Page Components
import Home from '../imports/Home';
import Browse from '../imports/Browse';
import Watch from '../imports/Watch';
import Watchlist from '../imports/Watchlist';
import Profile from '../imports/Profile';
import Analytics from '../imports/Analytics';
import Activity from '../imports/Activity';
import Schedule from '../imports/Schedule';
import NotFound from '../imports/NotFound';

// Enhanced Global Components
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { NetworkStatus } from '../components/NetworkStatus';
import { AiDrawer } from '../imports/AiDrawer';
import AiButton from '../imports/AiButton';
import BackToTop from '../imports/BackToTop';

function AppContent() {
  const location = useLocation();
  const isWatchPage = location.pathname === '/watch';
  const isProfilePage = location.pathname === '/profile';

  return (
    <>
      {/* Layout */}
      {!isWatchPage && !isProfilePage && <Navbar />}
      {!isWatchPage && !isProfilePage && <Sidebar />}

      {/* Main Content */}
      <main className={`min-h-screen bg-[var(--bg-page)] ${(!isWatchPage && !isProfilePage) ? 'pl-[64px]' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Always-Available Features */}
      <KeyboardShortcuts />
      <NetworkStatus />
      <AiDrawer />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}