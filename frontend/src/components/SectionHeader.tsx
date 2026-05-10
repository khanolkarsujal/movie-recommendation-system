/**
 * SectionHeader Component
 * Premium section title with animated "Explore All" reveal on hover
 */

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

type SectionVariant = 'default' | 'mobile';

interface SectionHeaderProps {
  label?: string;
  title: string;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
  variant?: SectionVariant;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  onSeeAll,
  showSeeAll = false,
  variant = 'default',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const paddingClass = variant === 'mobile' ? 'px-5' : 'px-[60px]';

  return (
    <div
      className={`flex items-center justify-between py-2 ${paddingClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left: Label + Title */}
      <div className="flex items-baseline gap-2.5 min-w-0">
        {label && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2.5px',
              color: 'rgba(139,92,246,0.85)',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {label}
          </span>
        )}

        {/* Title + "Explore All" inline reveal */}
        <div className="flex items-center gap-1.5 group/title">
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: isHovered ? '#fff' : '#e0e0e0',
              lineHeight: 1.2,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '-0.01em',
              transition: 'color 0.2s ease',
            }}
          >
            {title}
          </h2>

          {/* Slide-in "Explore All" */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
              cursor: onSeeAll ? 'pointer' : 'default',
              pointerEvents: isHovered ? 'auto' : 'none',
            }}
            onClick={onSeeAll}
            role={onSeeAll ? 'button' : undefined}
            tabIndex={onSeeAll && isHovered ? 0 : -1}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && onSeeAll) onSeeAll();
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(167,139,250,0.9)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}
            >
              Explore All
            </span>
            <ChevronRight
              size={13}
              style={{ color: 'rgba(167,139,250,0.9)', flexShrink: 0, marginTop: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
