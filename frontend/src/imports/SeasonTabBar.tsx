import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import type { IndicatorStyle } from './types';

const seasonCounts = [12, 10, 14, 8, 16];

interface SeasonTabsProps {
  seasons: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const SeasonTabs: React.FC<SeasonTabsProps> = ({ seasons, activeTab, setActiveTab }) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({ left: 0, width: 0, ready: false });
  const [isSticky, setIsSticky] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const measureIndicator = useCallback(() => {
    const activeEl = tabRefs.current[activeTab];
    const container = containerRef.current;
    if (!activeEl || !container) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();

    setIndicatorStyle({
      left: tabRect.left - containerRect.left + container.scrollLeft,
      width: tabRect.width,
      ready: true,
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [measureIndicator]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight - 64);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkOverflow = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [seasons, checkOverflow]);

  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl && containerRef.current) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setActiveTab(Math.min(activeTab + 1, seasons.length - 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActiveTab(Math.max(activeTab - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveTab(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveTab(seasons.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        break;
      default:
        break;
    }
  }, [activeTab, seasons.length, setActiveTab]);

  return (
    <div className={`w-full ${isSticky ? 'h-[64px]' : 'mt-6 mb-5'}`}>
      <div
        className={`w-full transition-all duration-300 ${
          isSticky
            ? 'fixed top-[64px] left-[64px] w-[calc(100%-64px)] z-50 bg-[#0d0d0d]/95 backdrop-blur-[20px] border-b border-white/5 py-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)] animate-slideDown'
            : 'relative bg-transparent border-transparent'
        }`}
      >
        <div className="relative w-full h-[64px] flex items-center">
          <div
            className="absolute left-[80px] top-0 bottom-0 w-[40px] z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #0d0d0d, transparent)',
              opacity: canScrollLeft ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-[80px] z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #0d0d0d, transparent)',
              opacity: canScrollRight ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}
          />

          <div
            ref={containerRef}
            role="tablist"
            onScroll={checkOverflow}
            onKeyDown={handleKeyDown}
            className="tab-strip relative flex flex-row items-center gap-8 h-full overflow-x-auto px-[80px]"
            style={{ scrollbarWidth: 'none' }}
          >
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.ready ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
              style={{
                position: 'absolute',
                bottom: 8,
                height: 2,
                background: '#8b5cf6',
                borderRadius: 2,
                boxShadow: '0 0 10px rgba(139,92,246,0.8)',
                zIndex: 2,
              }}
            />

            {seasons.map((season, index) => {
              const isActive = activeTab === index;
              const count = seasonCounts[index] || 12;

              return (
                <button
                  key={index}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tab-panel-${index}`}
                  tabIndex={isActive ? 0 : -1}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onClick={() => setActiveTab(index)}
                  className="tab-btn relative flex-shrink-0 h-full flex items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]/80 group"
                  style={{
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    {season}
                  </span>

                  {!isActive && (
                    <span
                      className="absolute bottom-[8px] left-0 w-full rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        height: 2,
                        background: 'rgba(255,255,255,0.2)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {!isSticky && (
            <div
              className="absolute bottom-0 left-[80px] right-[80px] pointer-events-none"
              style={{ height: 1, background: 'rgba(255,255,255,0.07)' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonTabs;
