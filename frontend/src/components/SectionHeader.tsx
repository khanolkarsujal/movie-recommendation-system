/**
 * SectionHeader Component
 * Full-width section titles with optional "See All" link
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
      className={`
        flex items-center justify-between
        py-4
        ${paddingClass}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left: Label + Title */}
      <div className="flex flex-col gap-1">
        {label && (
          <span
            className="
              text-[var(--brand-purple)]
              text-[11px]
              font-bold
              uppercase
              tracking-[2px]
              leading-none
            "
          >
            {label}
          </span>
        )}
        <h2
          className="
            text-white
            text-[20px]
            font-bold
            leading-tight
          "
        >
          {title}
        </h2>
      </div>

      {/* Right: See All link (appears on hover) */}
      {showSeeAll && onSeeAll && (
        <button
          onClick={onSeeAll}
          className={`
            flex items-center gap-1
            text-[var(--text-secondary)]
            text-[14px]
            font-semibold
            transition-all duration-300
            hover:text-white
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
          `}
          aria-label="See all"
        >
          <span>See All</span>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
