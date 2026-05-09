import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0e] px-8 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 mx-auto">
              <AlertCircle size={40} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Something went wrong</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              {this.state.error?.message || 'An unexpected cinematic error occurred. Our team of space explorers has been notified.'}
            </p>
            
            <button
              onClick={this.handleRetry}
              className="group flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
            >
              <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
              Try again
            </button>
            
            <button 
                onClick={() => window.location.href = '/'}
                className="mt-4 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
                Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
