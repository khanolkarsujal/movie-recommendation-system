/**
 * Match Score Component
 * Shows match percentage with color-coded scoring
 */

import React from 'react';
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

function getScoreColor(score: number): string {
  if (score >= 75) return '#46d369'; // Green
  if (score >= 40) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
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
  const numericScore = parseScore(score);
  const scoreColor = getScoreColor(numericScore);

  return (
    <div className={`flex items-center gap-2.5 text-[12px] ${className}`}>
      {/* Match Score */}
      <span
        className="font-bold"
        style={{ color: scoreColor }}
      >
        {numericScore}% Match
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

      {/* Progress Bar Variant */}
      {variant === 'with-bar' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${numericScore}%`,
              backgroundColor: scoreColor,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MatchScore;
