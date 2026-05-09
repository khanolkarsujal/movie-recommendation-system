/**
 * Breadcrumb Component
 * Navigation breadcrumbs with smooth animations
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const navigate = useNavigate();

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
            )}

            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => item.path && navigate(item.path)}
              disabled={isLast}
              className={`
                flex items-center gap-2 text-[14px] transition-all outline-none
                ${
                  isLast
                    ? 'text-white font-semibold cursor-default'
                    : 'text-white/60 hover:text-white cursor-pointer'
                }
              `}
            >
              {item.icon && (
                <span className="flex-shrink-0">{item.icon}</span>
              )}
              <span className="truncate max-w-[200px]">{item.label}</span>
            </motion.button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

/**
 * Hook to generate breadcrumbs from current route
 */
export const useBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      path: '/',
      icon: <Home size={14} />,
    },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Capitalize and clean segment
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      path: index === segments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
};

export default Breadcrumb;
