/**
 * Icon Button Component
 * 3 sizes × 5 variants × states
 */

import React from 'react';
import { Play, Heart, ThumbsUp, Info } from 'lucide-react';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'play' | 'heart' | 'heart-active' | 'thumbs' | 'info';

interface IconButtonProps {
  variant: IconButtonVariant;
  size?: IconButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label': string;
}

const sizeMap = {
  sm: { container: 28, icon: 14 },
  md: { container: 32, icon: 16 },
  lg: { container: 40, icon: 20 },
};

const variantStyles = {
  play: 'bg-white text-black hover:bg-white/90',
  heart: 'bg-transparent border border-[var(--border-default)] text-white hover:bg-white/10',
  'heart-active': 'bg-[var(--brand-purple-20)] border border-[var(--border-brand)] text-[var(--brand-purple)]',
  thumbs: 'bg-transparent border border-[var(--border-default)] text-white hover:bg-white/10',
  info: 'bg-transparent border border-[var(--border-default)] text-white hover:bg-white/10',
};

const iconMap = {
  play: Play,
  heart: Heart,
  'heart-active': Heart,
  thumbs: ThumbsUp,
  info: Info,
};

export const IconButton: React.FC<IconButtonProps> = ({
  variant,
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const { container, icon } = sizeMap[size];
  const Icon = iconMap[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        rounded-full
        flex items-center justify-center
        transition-all duration-200
        outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]
        ${variantStyles[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        ${className}
      `}
      style={{
        width: `${container}px`,
        height: `${container}px`,
      }}
    >
      <Icon size={icon} fill={variant === 'play' ? 'currentColor' : 'none'} />
    </button>
  );
};

export default IconButton;
