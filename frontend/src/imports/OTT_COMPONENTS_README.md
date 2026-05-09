# Professional OTT Platform Components

A comprehensive collection of production-ready, TypeScript-based React components for building modern OTT (Over-The-Top) streaming platforms like Netflix, Disney+, and Prime Video.

## 📦 Components Overview

### Core Components

1. **Hero.tsx** - Premium hero section with parallax effects, auto-rotating content, and video previews
2. **Navbar.tsx** - Responsive navigation with search, notifications, and mega menu
3. **Sidebar.tsx** - Vertical navigation with icon tooltips and smooth animations
4. **MovieModal.tsx** - Detailed movie/show information modal with metadata
5. **VideoPlayer.tsx** - Full-screen video player with custom controls
6. **SeasonTabBar.tsx** - Tabbed navigation for seasons with sticky behavior
7. **Top10Row.tsx** - Horizontal carousel for top 10 trending content

### Shared Resources

- **types.ts** - Comprehensive TypeScript interfaces and types

## ✨ Key Improvements

### 1. TypeScript Migration
- **Full type safety** with strict TypeScript interfaces
- **Proper prop types** for all components
- **Type-safe event handlers** and callbacks
- **Generic types** for reusable components

### 2. Accessibility Enhancements
- **ARIA labels** on all interactive elements
- **Keyboard navigation** support (Arrow keys, Home, End, Enter, Escape)
- **Focus management** with visible focus indicators
- **Screen reader** friendly markup
- **Proper semantic HTML** structure

### 3. Performance Optimizations
- **React.memo** for expensive components
- **useCallback** for stable function references
- **useMemo** for computed values
- **Lazy loading** with React.Suspense
- **Image preloading** for smooth transitions
- **Virtualization-ready** scroll containers

### 4. Code Quality
- **Clean architecture** with separation of concerns
- **Reusable hooks** and utilities
- **Consistent naming** conventions
- **Reduced duplication** through abstraction
- **Better error handling**
- **Proper cleanup** in useEffect hooks

### 5. User Experience
- **Smooth animations** with Framer Motion
- **Responsive design** for all screen sizes
- **Touch-friendly** interactions
- **Loading states** and skeletons
- **Optimistic UI** updates
- **Reduced motion** support for accessibility

## 🎨 Component Features

### Hero Component
```tsx
import Hero from './imports/Hero';

<Hero />
```

**Features:**
- Auto-rotating featured content (8-second intervals)
- Video preview on hover (2-second delay)
- Parallax scrolling effects
- Mouse pan interaction
- Muted/unmuted video toggle
- Gradient overlays and noise texture
- Progress indicators
- Responsive typography
- Reduced motion support

**Props:** None (uses global store)

---

### Navbar Component
```tsx
import Navbar from './imports/Navbar';

<Navbar />
```

**Features:**
- Sticky navigation with backdrop blur
- Expandable search with autocomplete
- Notification center with unread badges
- User avatar dropdown menu
- Browse mega menu with genre filters
- Mobile-friendly hamburger menu
- Keyboard shortcuts (Escape to close)

**Props:** None (uses React Router)

---

### Sidebar Component
```tsx
import Sidebar from './imports/Sidebar';

<Sidebar />
```

**Features:**
- Icon-based vertical navigation
- Tooltip labels on hover
- Active state indicators
- Notification badges
- Smooth scale animations
- User avatar menu
- Brand logo link
- Settings access

**Props:** None (uses React Router)

---

### MovieModal Component
```tsx
import MovieModal from './imports/MovieModal';

<MovieModal
  movie={movieData}
  onClose={() => setIsOpen(false)}
/>
```

**Features:**
- Full movie/show details
- Genre tags with color coding
- Rating display with color indicators
- Play, add to list, like, share actions
- Continue watching progress bar
- "More Like This" recommendations
- Backdrop click to close
- Escape key to close

**Props:**
- `movie: Movie | null` - Movie data object
- `onClose: () => void` - Close handler

---

### VideoPlayer Component
```tsx
import VideoPlayer from './imports/VideoPlayer';

<VideoPlayer
  movie={movieData}
  onClose={() => setPlayerOpen(false)}
/>
```

**Features:**
- Full-screen video player
- Custom playback controls
- Volume control with slider
- Rewind/forward 10 seconds
- Subtitle toggle
- Quality selector (HD/4K)
- Auto-hide controls (3-second timeout)
- Keyboard shortcuts (Space, M, Escape)

**Props:**
- `movie: Movie | null` - Movie data object
- `onClose: () => void` - Close handler

---

### SeasonTabBar Component
```tsx
import SeasonTabBar from './imports/SeasonTabBar';

<SeasonTabBar
  seasons={['Season 1', 'Season 2', 'Season 3']}
  activeTab={activeIndex}
  setActiveTab={setActiveIndex}
/>
```

**Features:**
- Sticky behavior on scroll
- Animated sliding indicator
- Horizontal scroll with fade overlays
- Keyboard navigation (Arrow keys, Home, End)
- Auto-scroll active tab into view
- Smooth transitions

**Props:**
- `seasons: string[]` - Array of season labels
- `activeTab: number` - Active tab index
- `setActiveTab: (index: number) => void` - Tab change handler

---

### Top10Row Component
```tsx
import Top10Row from './imports/Top10Row';

<Top10Row
  title="Top 10 in Your Country"
  episodes={episodeData}
/>
```

**Features:**
- Horizontal scrolling carousel
- Massive rank numbers (1-10)
- Hover effects and scaling
- Scroll navigation buttons
- Overflow fade indicators
- "See All" link on hover
- Optimized scroll performance

**Props:**
- `title: string` - Row title
- `episodes: Episode[]` - Array of episode/movie data

---

## 📋 TypeScript Interfaces

### Movie Interface
```typescript
interface Movie {
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
```

### Episode Interface
```typescript
interface Episode extends Movie {
  episodeNumber?: number;
  seasonNumber?: number;
}
```

### Notification Interface
```typescript
interface Notification {
  id: number | string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  thumb?: string;
}
```

## 🎯 Best Practices Implemented

### 1. Component Structure
- Single Responsibility Principle
- Composition over inheritance
- Props interface at the top
- Hooks before render logic
- Event handlers as callbacks
- Early returns for null checks

### 2. State Management
- Local state for UI concerns
- Global store (Zustand) for shared data
- Derived state with useMemo
- Stable callbacks with useCallback
- Ref for imperative operations

### 3. Styling
- Tailwind CSS utility classes
- Inline styles for dynamic values
- CSS custom properties for theming
- Framer Motion for animations
- Responsive breakpoints (md:, lg:)

### 4. Accessibility
- Semantic HTML elements
- ARIA roles and attributes
- Focus management
- Keyboard event handlers
- Skip links where needed
- Color contrast compliance

### 5. Performance
- Component memoization
- Hook optimization
- Image lazy loading
- Event listener cleanup
- Passive event listeners
- Debounced/throttled handlers

## 🚀 Usage Examples

### Basic Setup
```tsx
import Hero from './imports/Hero';
import Navbar from './imports/Navbar';
import Sidebar from './imports/Sidebar';

function App() {
  return (
    <>
      <Sidebar />
      <Navbar />
      <Hero />
      {/* Other content */}
    </>
  );
}
```

### With Modal
```tsx
import { useState } from 'react';
import MovieModal from './imports/MovieModal';

function Browse() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <>
      {/* Movie cards */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </>
  );
}
```

### With Video Player
```tsx
import { useState } from 'react';
import VideoPlayer from './imports/VideoPlayer';

function Watch() {
  const [playing, setPlaying] = useState(true);
  const [movie, setMovie] = useState<Movie>(/* ... */);

  return (
    <>
      {playing && (
        <VideoPlayer
          movie={movie}
          onClose={() => setPlaying(false)}
        />
      )}
    </>
  );
}
```

## 🎨 Theming

Components use CSS custom properties for easy theming:

```css
:root {
  --accent: #8b5cf6;
  --bg-surface: #141414;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.65);
}
```

## 📱 Responsive Breakpoints

- **Mobile**: Default (< 768px)
- **Tablet**: md: (≥ 768px)
- **Desktop**: lg: (≥ 1024px)
- **Wide**: xl: (≥ 1280px)

## ⚡ Performance Tips

1. **Image Optimization**: Use optimized formats (WebP) and lazy loading
2. **Code Splitting**: Lazy load heavy components with React.lazy()
3. **Virtualization**: Use for long lists (e.g., episode grids)
4. **Debounce Search**: Avoid excessive API calls
5. **Memoize Expensive Calculations**: Use useMemo for filters/sorts

## 🔧 Maintenance

### Adding New Components
1. Create TypeScript file (.tsx)
2. Define props interface
3. Add types to types.ts if shared
4. Follow existing patterns
5. Add accessibility features
6. Test keyboard navigation
7. Document in this README

### Code Style
- Use functional components
- TypeScript strict mode
- ESLint + Prettier
- 2-space indentation
- Named exports for utilities
- Default export for components

## 📄 License

These components are part of a professional OTT platform starter kit.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion**
