import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';

const SeasonTabs = ({ seasons, activeTab, setActiveTab }) => {
  const tabRefs = useRef([]);
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, ready: false });

  const measureIndicator = () => {
    const activeEl = tabRefs.current[activeTab];
    const container = containerRef.current;
    if (!activeEl || !container) return;

    // getBoundingClientRect gives viewport-relative coords.
    // Subtract container's left to get position relative to the scroll container.
    const containerRect = container.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();

    setIndicatorStyle({
      // account for scroll position inside the container
      left: tabRect.left - containerRect.left + container.scrollLeft,
      width: tabRect.width,
      ready: true,
    });
  };

  // Re-measure whenever active tab changes (layout effect = before paint, no flicker)
  useLayoutEffect(() => {
    measureIndicator();
  }, [activeTab]);

  // Re-measure on resize
  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [activeTab]);

  return (
    <div className="relative w-full mt-6 mb-5">
      {/* Tab strip */}
      <div
        ref={containerRef}
        className="tab-strip relative flex flex-row items-center gap-8 h-12 overflow-x-auto px-[80px]"
      >
        {/* ── Sliding white underline indicator ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            height: 2,
            background: '#ffffff',
            borderRadius: 2,
            opacity: indicatorStyle.ready ? 1 : 0,
            transition: 'left 0.25s ease-in-out, width 0.25s ease-in-out, opacity 0.15s ease',
          }}
        />

        {/* ── Tab buttons ── */}
        {seasons.map((season, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              ref={(el) => { tabRefs.current[index] = el; }}
              onClick={() => setActiveTab(index)}
              className="tab-btn relative flex-shrink-0 py-2 whitespace-nowrap bg-transparent border-none cursor-pointer"
              style={{
                fontSize: 15,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                transition: 'color 0.2s ease',
                outline: 'none',
              }}
            >
              {season}

              {/* Hover underline — CSS-controlled via .tab-btn:hover .tab-hover-line */}
              {!isActive && (
                <span
                  className="tab-hover-line absolute bottom-0 left-0 w-full rounded-full pointer-events-none"
                  style={{
                    height: 2,
                    background: 'rgba(255,255,255,0.35)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Optional: hair-line separator below tabs */}
      <div
        className="absolute bottom-0 left-[80px] right-[80px]"
        style={{ height: 1, background: 'rgba(255,255,255,0.07)' }}
      />
    </div>
  );
};

export default SeasonTabs;
