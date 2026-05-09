import React, { Component, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AiDrawer from './components/AiDrawer';
import AiButton from './components/AiButton';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';

// ─── Code-split all pages ─────────────────────────────────────────────────────
const Home       = lazy(() => import('./pages/Home'));
const Browse     = lazy(() => import('./pages/Browse'));
const Watchlist  = lazy(() => import('./pages/Watchlist'));
const Watch      = lazy(() => import('./pages/Watch'));
const Analytics  = lazy(() => import('./pages/Analytics'));
const Profile    = lazy(() => import('./pages/Profile'));
const NotFound   = lazy(() => import('./pages/NotFound'));

// ─── Page Loading Skeleton ────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex flex-col gap-6 p-8 pt-24 min-h-screen">
      <div className="skeleton w-full h-[60vh] rounded-2xl" />
      <div className="skeleton w-48 h-6 rounded" />
      <div className="flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl flex-shrink-0" style={{ width: 280, height: 158 }} />
        ))}
      </div>
    </div>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ done }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#141414',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      opacity: done ? 0 : 1,
      pointerEvents: done ? 'none' : 'all',
      transition: 'opacity 0.5s ease',
    }}>
      <div style={{
        width: 60, height: 60,
        background: '#8b5cf6',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontWeight: 900,
        color: 'white',
        animation: 'pulse 1s ease infinite alternate',
      }}>S</div>
    </div>
  );
}

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen flex-col gap-4 text-center px-8">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-3xl">⚠</div>
          <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
          <p className="text-white/50 max-w-md">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const isImmersive = location.pathname.startsWith('/watch');
  const [splashDone, setSplashDone] = React.useState(false);
  const [scrollPercent, setScrollPercent] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPercent(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)', color: 'white' }}>
      <SplashScreen done={splashDone} />
      
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[2px] bg-[#8b5cf6] z-[9999] transition-all duration-100 ease-out"
        style={{ width: `${scrollPercent}%` }}
      />
      
      {/* Navigation — hidden on profile select & watch screens */}
      {!isImmersive && <Sidebar />}
      {!isImmersive && <Navbar />}

      {/* Main content */}
      <main className={`flex-grow min-w-0 ${!isImmersive ? 'pl-[var(--sidebar-width)]' : ''}`}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/"          element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/browse"    element={<PageWrapper><Browse /></PageWrapper>} />
                <Route path="/watchlist" element={<PageWrapper><Watchlist /></PageWrapper>} />
                <Route path="/watch"     element={<PageWrapper><Watch /></PageWrapper>} />
                <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
                <Route path="/profile"   element={<PageWrapper><Profile /></PageWrapper>} />
                <Route path="*"          element={<PageWrapper><NotFound /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>

        {/* Footer — hidden on immersive screens */}
        {!isImmersive && <Footer />}
      </main>

      {/* Global floating UI */}
      {!isImmersive && (
        <>
          <AiDrawer />
          <AiButton />
          <BackToTop />
        </>
      )}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a22',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}

export default App;
