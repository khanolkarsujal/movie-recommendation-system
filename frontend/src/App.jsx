import React, { Component, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar  from './components/Navbar';

// ─── Code-split all pages ─────────────────────────────────────────────────────
const Home          = lazy(() => import('./pages/Home'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));
const ProfilePage   = lazy(() => import('./pages/Profile'));

// ─── Stub pages for non-built routes ─────────────────────────────────────────
function StubPage({ name }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
        <p className="text-white/50">This page is under construction.</p>
      </div>
    </div>
  );
}

// ─── Page Loading Skeleton ────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex flex-col gap-6 p-8 pt-24 min-h-screen">
      <div className="skeleton w-full h-[60vh] rounded-2xl" />
      <div className="skeleton w-48 h-6 rounded" />
      <div className="flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl" style={{ width: 280, height: 158 }} />
        ))}
      </div>
    </div>
  );
}

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
          <p className="text-white/50 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
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
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)', color: 'white' }}>
      <Sidebar />
      <Navbar />

      <main className="flex-grow pl-[var(--sidebar-width)]">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/analytics"     element={<AnalyticsPage />} />
              <Route path="/profile"       element={<ProfilePage />} />
              <Route path="/schedule"      element={<StubPage name="Schedule" />} />
              <Route path="/activity"      element={<StubPage name="Activity" />} />
              <Route path="/notifications" element={<StubPage name="Notifications" />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
