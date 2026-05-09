/**
 * Badge Component
 * 8 variants following Netflix-style design system
 */

import React from 'react';
import { Award } from 'lucide-react';

type BadgeVariant = 'new' | 'hd' | '4k' | 'rating' | 'award' | 'top10' | 'trending' | 'pg';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  new: 'bg-[#3b82f6] text-white border-transparent',
  hd: 'bg-transparent text-[var(--text-secondary)] border-[var(--border-default)]',
  '4k': 'bg-transparent text-[var(--text-secondary)] border-[var(--border-default)]',
  rating: 'bg-transparent text-[var(--text-secondary)] border-[var(--border-default)]',
  pg: 'bg-transparent text-[var(--text-secondary)] border-[var(--border-default)]',
  award: 'bg-[#FFD700] text-black border-transparent shadow-[0_2px_8px_rgba(255,215,0,0.4)]',
  top10: 'bg-[rgba(239,68,68,0.2)] text-[#ef4444] border-[rgba(239,68,68,0.4)]',
  trending: 'bg-[var(--brand-purple-10)] text-[var(--brand-purple)] border-[var(--brand-purple-40)]',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1
        h-5 px-[7px]
        rounded-[3px] border
        text-[11px] font-bold uppercase tracking-[2px]
        leading-none
        ${badgeStyles[variant]}
        ${className}
      `}
    >
      {variant === 'award' && <Award size={11} strokeWidth={2.5} />}
      {children}
    </span>
  );
};

export default Badge;