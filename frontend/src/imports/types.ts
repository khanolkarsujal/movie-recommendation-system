/**
 * Shared TypeScript types for OTT Platform Components
 */

export interface Movie {
  id: number | string;
  title: string;
  badge?: string;
  year?: string | number;
  duration?: string;
  match?: string;
  rating?: string | number;
  genre?: string;
  genres?: string[];
  quality?: string;
  audio?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  accent?: string;
  trailerUrl?: string;
  isCustom?: boolean;
  progress?: number;
}

export interface Episode extends Movie {
  episodeNumber?: number;
  seasonNumber?: number;
}

export interface Notification {
  id: number | string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  thumb?: string;
}

export interface NavLink {
  path: string;
  label: string;
  hasMegaMenu?: boolean;
}

export interface Genre {
  name: string;
  color: string;
}

export interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  path: string;
  label: string;
  badge?: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface IndicatorStyle {
  left: number;
  width: number;
  ready: boolean;
}

export interface FeaturedItem {
  id: number | string;
  title: string;
  label: string;
  match: string;
  year: string | number;
  duration: string;
  rating: string | number;
  genres: string[];
  description: string;
  image: string;
  progress: number;
  accent: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text?: string | null;
  recs?: RecommendationItem[] | null;
}

export interface RecommendationItem {
  title: string;
  year: number;
  why: string;
  thumb: string;
}
