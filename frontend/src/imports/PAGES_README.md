# Professional OTT Platform Pages - TypeScript

All page-level components converted to TypeScript with enhanced functionality and accessibility.

## Page Components

### Browse.tsx
Browse and discover content with filtering capabilities.

**Features:**
- Genre filter bar integration
- Search functionality
- Top 10 trending section
- Multiple genre rows
- Grid view for filtered results
- Empty state handling
- Responsive layout

**State:**
- `activeGenre: string` - Currently selected genre
- `searchQuery: string` - Search input value
- `scrolled: boolean` - Scroll position tracking

**Usage:**
```tsx
import Browse from './imports/Browse';
<Route path="/browse" element={<Browse />} />
```

---

### Watch.tsx
Full-screen video player with custom controls.

**Features:**
- Custom video controls
- Keyboard shortcuts (Space, K, M, F, Arrows, Escape)
- Auto-hide controls (3s timeout)
- Progress bar with click-to-seek
- Volume control
- Fullscreen support
- Play/pause toggle
- Accessible ARIA labels

**Keyboard Shortcuts:**
- `Space/K` - Play/Pause
- `M` - Mute/Unmute
- `F` - Fullscreen
- `Escape` - Exit player
- `←/→` - Seek backward/forward

**Usage:**
```tsx
import Watch from './imports/Watch';
<Route path="/watch" element={<Watch />} />
```

---

### Watchlist.tsx
User's saved content management.

**Features:**
- Grid layout with responsive columns
- Remove from watchlist
- Play button on hover
- Progress indicators
- Empty state with CTA
- Card animations
- Toast notifications
- Lazy loading images

**Props:** None (uses Zustand store)

**Usage:**
```tsx
import Watchlist from './imports/Watchlist';
<Route path="/watchlist" element={<Watchlist />} />
```

---

### Home.tsx
Main landing page with all content sections.

**Features:**
- Hero section integration
- Genre filter bar
- Season tab navigation
- Continue watching row
- Featured banner
- Current season episodes
- Top 10 trending
- New releases
- Personalized recommendations
- Smooth scrolling

**State:**
- `activeGenre: string` - Selected genre filter
- `activeTab: number` - Active season index

**Usage:**
```tsx
import Home from './imports/Home';
<Route path="/" element={<Home />} />
```

---

### Profile.tsx
Profile selection and management.

**Features:**
- Multiple profile cards
- Add new profile option
- Profile editing mode toggle
- Loading state animation
- Smooth transitions
- Keyboard navigation
- Focus management

**State:**
- `managing: boolean` - Edit mode toggle
- `loadingProfile: number | null` - Loading state

**Usage:**
```tsx
import Profile from './imports/Profile';
<Route path="/profile" element={<Profile />} />
```

---

### Analytics.tsx
User analytics and statistics dashboard.

**Features:**
- Stats cards grid
- Icon with colored backgrounds
- Responsive layout
- Hover effects
- Coming soon placeholder

**Data:**
- Hours watched
- Shows completed
- Trending picks
- Following count

**Usage:**
```tsx
import Analytics from './imports/Analytics';
<Route path="/analytics" element={<Analytics />} />
```

---

### NotFound.tsx
404 error page with glitch effect.

**Features:**
- Animated glitch effect (2.8s interval)
- Dual-layer 404 text
- Go back button
- Go home button
- Ambient background glow
- Smooth animations
- Accessibility labels

**Usage:**
```tsx
import NotFound from './imports/NotFound';
<Route path="*" element={<NotFound />} />
```

---

## TypeScript Improvements

### Type Safety
```typescript
// All pages use proper interfaces
interface WatchlistCardProps {
  movie: Movie;
  onRemove: (id: number | string) => void;
}

// Event handlers are typed
const handlePlayClick = useCallback(
  (e: React.MouseEvent) => {
    // ...
  },
  [navigate, movie.title]
);
```

### Enhanced Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML structure

### Performance Optimizations
- `useCallback` for event handlers
- `useMemo` for filtered data
- Passive event listeners
- Proper cleanup in effects
- Conditional rendering

### Code Quality
- Consistent naming conventions
- Clear component structure
- Extracted sub-components
- Reusable type definitions
- ESLint/Prettier ready

## Routing Setup

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './imports/Home';
import Browse from './imports/Browse';
import Watch from './imports/Watch';
import Watchlist from './imports/Watchlist';
import Profile from './imports/Profile';
import Analytics from './imports/Analytics';
import NotFound from './imports/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## State Management

All pages integrate with Zustand store:

```typescript
// Example from Watchlist page
const { watchlist, removeFromWatchlist } = useStore();

// Example from Browse page  
const { setHeroMovie } = useStore();
```

## Navigation Patterns

### Programmatic Navigation
```typescript
const navigate = useNavigate();

// Go back
navigate(-1);

// Navigate to route
navigate('/browse');

// Navigate with query params
navigate(`/watch?title=${encodeURIComponent(title)}`);
```

### Query Parameters
```typescript
// Read query params (Watch page)
const searchParams = new URLSearchParams(location.search);
const title = searchParams.get('title') || 'Video Player';
```

## Responsive Design

All pages support:
- **Mobile**: < 768px
- **Tablet**: ≥ 768px (md:)
- **Desktop**: ≥ 1024px (lg:)
- **Wide**: ≥ 1280px (xl:)

## Animation Patterns

### Page Transitions
```typescript
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
```

### List Animations
```typescript
<AnimatePresence>
  {items.map(item => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    />
  ))}
</AnimatePresence>
```

## Error Handling

### Image Loading
```typescript
onError={(e) => {
  e.currentTarget.src = `https://picsum.photos/seed/${id}/400/225`;
}}
```

### Empty States
- Watchlist empty state with browse CTA
- No search results message
- No genre content message

## Performance Tips

1. **Lazy Load Images**: Use `loading="lazy"` attribute
2. **Memoize Filters**: Use `useMemo` for expensive operations
3. **Passive Listeners**: Add `{ passive: true }` to scroll listeners
4. **Cleanup Effects**: Always cleanup timers and listeners
5. **Optimize Re-renders**: Use `useCallback` for handlers

## Browser Support

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers  

---

**🎬 Professional OTT Platform Pages - Production Ready**

*Built with TypeScript, React Router, Framer Motion, and Zustand*
