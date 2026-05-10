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
  hd: 'bg-white/10 backdrop-blur-md text-white/95 border-white/30 shadow-sm',
  '4k': 'bg-white/10 backdrop-blur-md text-white/95 border-white/30 shadow-sm',
  rating: 'bg-white/10 backdrop-blur-md text-white/95 border-white/30 shadow-sm',
  pg: 'bg-white/10 backdrop-blur-md text-white/95 border-white/30 shadow-sm',
  award: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
  top10: 'bg-[rgba(239,68,68,0.15)] text-[#f87171] border-[rgba(239,68,68,0.3)]',
  trending: 'bg-[rgba(139,92,246,0.15)] text-[#a78bfa] border-[rgba(139,92,246,0.3)]',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1
        h-[20px] px-2.5
        rounded-full border-[0.5px]
        text-[10px] font-bold uppercase tracking-[0.5px]
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