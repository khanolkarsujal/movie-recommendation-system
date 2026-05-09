/**
 * Progress Bar Component
 * 3 variants: watch progress, match score, generic
 */

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: 2 | 3 | 4;
  variant?: 'watch' | 'match' | 'default';
  timeLeft?: string; // "14 min left"
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 3,
  variant = 'default',
  timeLeft,
  color,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const getProgressColor = () => {
    if (color) return color;
    if (variant === 'match') {
      if (clampedProgress >= 75) return '#46d369';
      if (clampedProgress >= 40) return '#f59e0b';
      return '#ef4444';
    }
    return 'var(--brand-purple)';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Time Left Label (Watch variant) */}
      {variant === 'watch' && timeLeft && (
        <div className="absolute -top-6 right-0 text-[11px] text-white/70">
          {timeLeft}
        </div>
      )}

      {/* Progress Track */}
      <div
        className="w-full rounded-[2px] bg-white/15 overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* Progress Fill */}
        <div
          className="h-full rounded-[2px] transition-all duration-300 ease-out"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: getProgressColor(),
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
