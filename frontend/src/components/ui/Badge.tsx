/**
 * Badge Component
 * Premium badge variants for the streaming platform
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
  new: 'bg-[#2563eb]/90 text-white border-transparent',
  hd: 'bg-black/50 backdrop-blur-md text-white/90 border-white/20 shadow-sm',
  '4k': 'bg-black/50 backdrop-blur-md text-white/90 border-white/20 shadow-sm',
  rating: 'bg-black/50 backdrop-blur-md text-white/90 border-white/20 shadow-sm',
  pg: 'bg-black/50 backdrop-blur-md text-white/90 border-white/20 shadow-sm',
  award: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
  top10: 'bg-[rgba(239,68,68,0.15)] text-[#f87171] border-[rgba(239,68,68,0.3)]',
  trending: 'bg-[rgba(139,92,246,0.15)] text-[#a78bfa] border-[rgba(139,92,246,0.3)]',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1
        h-[18px] px-[6px]
        rounded-[5px] border
        text-[9px] font-bold uppercase tracking-[0.5px]
        leading-none
        ${badgeStyles[variant]}
        ${className}
      `}
    >
      {variant === 'award' && <Award size={10} strokeWidth={2.5} />}
      {children}
    </span>
  );
};

export default Badge;