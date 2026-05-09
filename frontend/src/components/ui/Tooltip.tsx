/**
 * Tooltip Component
 * 4 position variants with arrow
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactElement;
}

const positionStyles = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2',
    arrowRotate: 'rotate-180',
    animation: { y: 4 },
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2',
    arrowRotate: '',
    animation: { y: -4 },
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 -rotate-90',
    arrowRotate: '',
    animation: { x: 4 },
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 rotate-90',
    arrowRotate: '',
    animation: { x: -4 },
  },
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 300,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const styles = positionStyles[position];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, ...styles.animation }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, ...styles.animation }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-[999] whitespace-nowrap
              ${styles.container}
            `}
          >
            <div
              className="
                bg-[var(--bg-elevated)]
                border border-[var(--border-subtle)]
                rounded-[6px]
                px-2.5 py-1.5
                text-[12px] text-[var(--text-primary)]
                shadow-[var(--shadow-tooltip)]
              "
            >
              {content}

              {/* Arrow */}
              <div className={`absolute ${styles.arrow}`}>
                <div
                  className={`
                    w-0 h-0
                    border-l-[6px] border-l-transparent
                    border-r-[6px] border-r-transparent
                    border-b-[6px] border-b-[var(--bg-elevated)]
                    ${styles.arrowRotate}
                  `}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
