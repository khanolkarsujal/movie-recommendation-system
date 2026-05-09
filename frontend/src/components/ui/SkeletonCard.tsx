/**
 * Skeleton Card Component
 * 3 variants: landscape, portrait, row item
 */

import React from 'react';

type SkeletonVariant = 'landscape' | 'portrait' | 'row';

interface SkeletonCardProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantDimensions = {
  landscape: 'w-[220px] h-[124px]', // 16:9
  portrait: 'w-[140px] h-[210px]', // 2:3
  row: 'w-full h-[72px]',
};

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'landscape',
  className = '',
}) => {
  return (
    <div
      className={`
        bg-[var(--bg-card)]
        rounded-[4px]
        overflow-hidden
        ${variantDimensions[variant]}
        ${className}
      `}
    >
      <div className="skeleton w-full h-full" />
    </div>
  );
};

export default SkeletonCard;
