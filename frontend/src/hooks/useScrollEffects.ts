/**
 * useScrollEffects Hook
 * Premium scroll-based effects and utilities
 */

import { useState, useEffect, useCallback, RefObject } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Hook for scroll position
 */
export const useScrollPosition = (): ScrollPosition => {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
};

/**
 * Hook for scroll direction
 */
export const useScrollDirection = (): 'up' | 'down' | null => {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY) {
        setDirection('down');
      } else if (currentY < lastY) {
        setDirection('up');
      }

      setLastY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

  return direction;
};

/**
 * Hook to detect if scrolled past threshold
 */
export const useScrollThreshold = (threshold: number = 100): boolean => {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPast(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isPast;
};

/**
 * Hook to detect if element is in viewport
 */
export const useInView = (
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
};

/**
 * Hook for scroll progress (0-1)
 */
export const useScrollProgress = (): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalScroll = documentHeight - windowHeight;
      const currentProgress = totalScroll > 0 ? scrollTop / totalScroll : 0;

      setProgress(Math.min(Math.max(currentProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

/**
 * Hook to lock/unlock body scroll
 */
export const useScrollLock = () => {
  const lock = useCallback(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }, []);

  const unlock = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  useEffect(() => {
    return () => unlock();
  }, [unlock]);

  return { lock, unlock };
};

/**
 * Hook for smooth scroll to element
 */
export const useSmoothScroll = () => {
  const scrollTo = useCallback((
    target: string | Element,
    options?: ScrollIntoViewOptions
  ) => {
    const element = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options,
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return { scrollTo, scrollToTop };
};

/**
 * Hook to detect if at bottom of page
 */
export const useAtBottom = (offset: number = 100): boolean => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      setIsAtBottom(scrollTop + windowHeight >= documentHeight - offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return isAtBottom;
};

export default {
  useScrollPosition,
  useScrollDirection,
  useScrollThreshold,
  useInView,
  useScrollProgress,
  useScrollLock,
  useSmoothScroll,
  useAtBottom,
};
