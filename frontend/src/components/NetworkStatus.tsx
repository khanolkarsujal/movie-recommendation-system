/**
 * NetworkStatus Component
 * Shows connection quality and offline mode indicator
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, WifiLow, AlertTriangle } from 'lucide-react';

type ConnectionQuality = 'offline' | 'slow' | 'good' | 'excellent';

interface NetworkInfo {
  isOnline: boolean;
  quality: ConnectionQuality;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export const NetworkStatus: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: navigator.onLine,
    quality: 'good',
  });
  const [showIndicator, setShowIndicator] = useState(false);
  const [dismissedOffline, setDismissedOffline] = useState(false);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection;
      let quality: ConnectionQuality = 'good';

      if (!navigator.onLine) {
        quality = 'offline';
      } else if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;

        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          quality = 'slow';
        } else if (effectiveType === '3g' || downlink < 1) {
          quality = 'good';
        } else {
          quality = 'excellent';
        }

        setNetworkInfo({
          isOnline: navigator.onLine,
          quality,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        });
      } else {
        setNetworkInfo({
          isOnline: navigator.onLine,
          quality: navigator.onLine ? 'good' : 'offline',
        });
      }

      // Show indicator for offline or slow connections
      if (quality === 'offline' || quality === 'slow') {
        setShowIndicator(true);
        setDismissedOffline(false);
      } else if (quality === 'excellent') {
        // Auto-hide when connection is excellent
        setTimeout(() => setShowIndicator(false), 3000);
      }
    };

    const handleOnline = () => {
      updateNetworkStatus();
      setDismissedOffline(false);
    };

    const handleOffline = () => {
      updateNetworkStatus();
    };

    // Listen for connection changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    // Initial check
    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  const getIcon = () => {
    switch (networkInfo.quality) {
      case 'offline':
        return <WifiOff size={18} />;
      case 'slow':
        return <WifiLow size={18} />;
      case 'good':
        return <Wifi size={18} />;
      case 'excellent':
        return <Wifi size={18} />;
    }
  };

  const getMessage = () => {
    switch (networkInfo.quality) {
      case 'offline':
        return {
          title: 'No Internet Connection',
          description: 'You are currently offline. Some features may not be available.',
          color: '#ef4444',
        };
      case 'slow':
        return {
          title: 'Slow Connection Detected',
          description: 'Video quality may be reduced to improve playback.',
          color: '#f59e0b',
        };
      case 'good':
        return {
          title: 'Connection Restored',
          description: 'You are back online.',
          color: '#10b981',
        };
      case 'excellent':
        return {
          title: 'Excellent Connection',
          description: 'Enjoying optimal streaming quality.',
          color: '#10b981',
        };
    }
  };

  const message = getMessage();

  // Don't show if dismissed and offline
  if (dismissedOffline && networkInfo.quality === 'offline') {
    return null;
  }

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] max-w-md"
        >
          <div
            className="relative bg-[var(--bg-elevated)] border rounded-xl p-4
                     shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden"
            style={{ borderColor: `${message.color}40` }}
          >
            {/* Accent border */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: message.color }}
            />

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${message.color}20`, color: message.color }}
              >
                {getIcon()}
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <h4 className="text-white font-semibold text-[15px] mb-1">
                  {message.title}
                </h4>
                <p className="text-white/60 text-[13px] leading-relaxed">
                  {message.description}
                </p>

                {/* Connection details */}
                {networkInfo.effectiveType && networkInfo.quality !== 'offline' && (
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-white/40">
                    <span className="uppercase">{networkInfo.effectiveType}</span>
                    {networkInfo.downlink && (
                      <>
                        <span>•</span>
                        <span>{networkInfo.downlink.toFixed(1)} Mbps</span>
                      </>
                    )}
                    {networkInfo.rtt && (
                      <>
                        <span>•</span>
                        <span>{networkInfo.rtt}ms</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => {
                  setShowIndicator(false);
                  if (networkInfo.quality === 'offline') {
                    setDismissedOffline(true);
                  }
                }}
                className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;
