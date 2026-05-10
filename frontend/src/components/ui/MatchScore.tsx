/**
 * Match Score Component
 * Shows match percentage with color-coded scoring
 */

import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from './Badge';

interface MatchScoreProps {
  score: number | string; // 0-100 or "85%"
  year?: string | number;
  duration?: string;
  quality?: 'HD' | '4K';
  rating?: string; // "PG" | "PG-13" | "R" | "16+"
  variant?: 'full' | 'compact' | 'with-bar';
  className?: string;
}

function parseScore(score: number | string): number {
  if (typeof score === 'string') {
    return parseInt(score.replace('%', ''));
  }
  return score;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  year,
  duration,
  quality,
  rating,
  variant = 'full',
  className = '',
}) => {
  const numericScore = typeof score === 'string' ? parseFloat(score.replace('%', '')) : score;

  return (
    <div className={`flex items-center gap-2.5 text-[12px] ${className}`}>
      {/* Star Rating */}
      <span className="flex items-center gap-1 font-bold text-[#facc15]">
        <Star size={12} fill="currentColor" /> {numericScore >= 10 ? (numericScore / 10).toFixed(1) : numericScore.toFixed(1)}
      </span>

      {/* Metadata */}
      {variant !== 'compact' && (
        <>
          {year && (
            <>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-secondary)]">{year}</span>
            </>
          )}

          {duration && (
            <>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-secondary)]">{duration}</span>
            </>
          )}

          {quality && (
            <Badge variant="hd">{quality}</Badge>
          )}

          {rating && (
            <Badge variant="rating">{rating}</Badge>
          )}
        </>
      )}

    </div>
  );
};

export default MatchScore;
