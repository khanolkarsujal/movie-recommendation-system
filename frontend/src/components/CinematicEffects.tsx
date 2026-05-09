/**
 * CinematicEffects Component
 * Premium visual effects for immersive experience
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Parallax scroll effect
 */
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

interface BackdropBlurProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

/**
 * Premium backdrop blur with gradient
 */
export const BackdropBlur: React.FC<BackdropBlurProps> = ({
  className = '',
  intensity = 'medium',
}) => {
  const blurMap = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl',
  };

  return (
    <div
      className={`
        absolute inset-0 ${blurMap[intensity]}
        bg-gradient-to-b from-black/40 via-black/20 to-transparent
        ${className}
      `}
    />
  );
};

interface GlowEffectProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
  className?: string;
}

/**
 * Glow effect for emphasis
 */
export const GlowEffect: React.FC<GlowEffectProps> = ({
  color = 'var(--brand-purple)',
  size = 'md',
  intensity = 0.6,
  className = '',
}) => {
  const sizeMap = {
    sm: 'blur-2xl',
    md: 'blur-3xl',
    lg: 'blur-[100px]',
  };

  return (
    <div
      className={`absolute pointer-events-none ${sizeMap[size]} ${className}`}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: intensity,
      }}
    />
  );
};

interface FilmGrainProps {
  opacity?: number;
  className?: string;
}

/**
 * Film grain overlay for cinematic feel
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({
  opacity = 0.03,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none mix-blend-overlay ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
};

/**
 * Vignette effect
 */
export const Vignette: React.FC<{ intensity?: number; className?: string }> = ({
  intensity = 0.5,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
};

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

/**
 * Scroll-based reveal animation
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  const initial = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial }}
      animate={
        isVisible
          ? { opacity: 1, y: 0, x: 0 }
          : { opacity: 0, ...initial }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface MouseTrackingGlowProps {
  color?: string;
  size?: number;
  intensity?: number;
}

/**
 * Mouse tracking glow effect
 */
export const MouseTrackingGlow: React.FC<MouseTrackingGlowProps> = ({
  color = 'rgba(139, 92, 246, 0.15)',
  size = 600,
  intensity = 1,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-0 mix-blend-screen"
      animate={{
        opacity: isVisible ? intensity : 0,
        left: mousePos.x - size / 2,
        top: mousePos.y - size / 2,
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(60px)',
      }}
    />
  );
};

/**
 * Shimmer loading effect
 */
export const ShimmerEffect: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

interface PulseGlowProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  className?: string;
}

/**
 * Pulsing glow animation
 */
export const PulseGlow: React.FC<PulseGlowProps> = ({
  children,
  color = 'var(--brand-purple)',
  duration = 2,
  className = '',
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px ${color}40`,
          `0 0 40px ${color}60`,
          `0 0 20px ${color}40`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export const CinematicEffects = {
  Parallax,
  BackdropBlur,
  GlowEffect,
  FilmGrain,
  Vignette,
  ScrollReveal,
  MouseTrackingGlow,
  ShimmerEffect,
  PulseGlow,
};

export default CinematicEffects;
