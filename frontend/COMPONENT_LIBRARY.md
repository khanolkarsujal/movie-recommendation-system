# 🧩 Component Library - Netflix-Quality OTT Platform

Complete production-ready component library following professional streaming platform standards.

## 📥 Import Guide

**Individual imports:**
```tsx
import { Badge } from '@/components/ui/Badge';
import { MovieCard } from '@/components/MovieCard';
```

**Barrel imports (recommended):**
```tsx
// All UI atoms
import { Badge, Button, IconButton, MatchScore, ProgressBar, SkeletonCard, Tooltip } from '@/components/ui';

// All molecules + atoms
import { MovieCard, Top10Card, SectionHeader, HoverCardPopup, Badge, Button } from '@/components';
```

---

## 📦 Component Index

### Atoms (Basic UI Elements)
1. [Badge](#1-badge) - 8 variants for status indicators
2. [MatchScore](#2-matchscore) - Percentage display with metadata
3. [ProgressBar](#3-progressbar) - 3 variants for different use cases
4. [IconButton](#4-iconbutton) - Circular action buttons
5. [Button](#5-button) - 5 variants × 3 sizes
6. [SkeletonCard](#6-skeletoncard) - Loading states
7. [Tooltip](#7-tooltip) - 4 position variants

### Molecules (Composite Components)
8. [MovieCard](#8-moviecard) - Standard landscape card
9. [HoverCardPopup](#9-hovercardpopup) - Detailed preview on hover
10. [Top10Card](#10-top10card) - Portrait card with rank
11. [SectionHeader](#11-sectionheader) - Row titles with labels

---

## Atom Components

### 1. Badge

**8 Variants:** `new`, `hd`, `4k`, `rating`, `pg`, `award`, `top10`, `trending`

**Specs:**
- Height: 20px
- Radius: 3px
- Padding: 0 7px
- Font: 11px/700/UPPERCASE/2px letter-spacing

**Usage:**
```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="new">NEW</Badge>
<Badge variant="hd">HD</Badge>
<Badge variant="4k">4K</Badge>
<Badge variant="rating">16+</Badge>
<Badge variant="award">AWARD</Badge>
<Badge variant="top10">TOP 10</Badge>
<Badge variant="trending">TRENDING</Badge>
```

**Variants:**

| Variant | Background | Text Color | Border | Use Case |
|---------|-----------|------------|--------|----------|
| `new` | #3b82f6 | white | none | New releases |
| `hd` | transparent | text-secondary | border-default | Quality indicator |
| `4k` | transparent | text-secondary | border-default | Quality indicator |
| `rating` | transparent | text-secondary | border-default | Age rating (16+, PG) |
| `pg` | transparent | text-secondary | border-default | Age rating |
| `award` | #f59e0b/20 | #f59e0b | #f59e0b/40 | Award winner |
| `top10` | #ef4444/20 | #ef4444 | #ef4444/40 | Top 10 content |
| `trending` | purple-10 | brand-purple | purple-40 | Trending content |

---

### 2. MatchScore

Shows percentage match with color-coded scoring following Netflix standards.

**Color Logic:**
- ≥75% → Green (#46d369)
- 40-74% → Yellow (#f59e0b)
- <40% → Red (#ef4444)

**Variants:** `full`, `compact`, `with-bar`

**Usage:**
```tsx
import { MatchScore } from '@/components/ui/MatchScore';

// Full metadata
<MatchScore
  score={98}
  year="2024"
  duration="2h 15m"
  quality="HD"
  rating="16+"
  variant="full"
/>

// Compact (score only)
<MatchScore score="85%" variant="compact" />

// With animated progress bar
<MatchScore score={92} variant="with-bar" />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `score` | `number \| string` | ✓ | Match percentage (0-100 or "85%") |
| `year` | `string \| number` | | Release year |
| `duration` | `string` | | Runtime (e.g., "2h 15m") |
| `quality` | `'HD' \| '4K'` | | Video quality |
| `rating` | `string` | | Age rating (PG, PG-13, R, 16+) |
| `variant` | `'full' \| 'compact' \| 'with-bar'` | | Display style |

---

### 3. ProgressBar

**3 Variants:** `watch`, `match`, `default`

**Heights:** 2px, 3px, 4px

**Usage:**
```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

// Watch progress (purple)
<ProgressBar
  progress={45}
  height={3}
  variant="watch"
  timeLeft="14 min left"
/>

// Match score (color changes based on value)
<ProgressBar
  progress={85}
  height={2}
  variant="match"
/>

// Custom color
<ProgressBar
  progress={60}
  height={4}
  color="#10b981"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | required | 0-100 percentage |
| `height` | `2 \| 3 \| 4` | 3 | Bar height in pixels |
| `variant` | `'watch' \| 'match' \| 'default'` | 'default' | Visual style |
| `timeLeft` | `string` | | "14 min left" label |
| `color` | `string` | | Custom progress color |

---

### 4. IconButton

**3 Sizes:** SM (28px), MD (32px), LG (40px)

**5 Variants:** `play`, `heart`, `heart-active`, `thumbs`, `info`

**Usage:**
```tsx
import { IconButton } from '@/components/ui/IconButton';

<IconButton
  variant="play"
  size="lg"
  onClick={() => playMovie()}
  aria-label="Play movie"
/>

<IconButton
  variant="heart"
  size="md"
  onClick={() => addToWatchlist()}
  aria-label="Add to watchlist"
/>

<IconButton
  variant="heart-active"
  size="md"
  aria-label="Remove from watchlist"
/>
```

**Variant Styles:**

| Variant | Background | Border | Icon | Use Case |
|---------|-----------|--------|------|----------|
| `play` | white | none | black (filled) | Primary action |
| `heart` | transparent | border-default | white | Add to watchlist |
| `heart-active` | purple-20 | border-brand | purple | In watchlist |
| `thumbs` | transparent | border-default | white | Like/dislike |
| `info` | transparent | border-default | white | More info |

---

### 5. Button

**5 Variants:** `primary`, `secondary`, `ghost`, `brand`, `danger`

**3 Sizes:** SM (36px), MD (44px), LG (52px)

**States:** Default, Hover, Active, Loading, Disabled

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  ▶ Play Now
</Button>

<Button variant="secondary" size="md">
  + Watchlist
</Button>

<Button variant="ghost" size="md">
  ⓘ More Info
</Button>

<Button variant="brand" loading>
  Processing...
</Button>

<Button variant="danger" disabled>
  Delete
</Button>
```

**Variant Styles:**

| Variant | Background | Text | Shadow | Use Case |
|---------|-----------|------|--------|----------|
| `primary` | white | black | none | Play Now |
| `secondary` | rgba(109,109,110,0.7) | white | none | Watchlist |
| `ghost` | transparent | white | none | More Info |
| `brand` | brand-purple | white | purple glow | Premium actions |
| `danger` | #ef4444 | white | none | Destructive |

**Size Specs:**

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 36px | 0 16px | 13px |
| `md` | 44px | 0 24px | 14px |
| `lg` | 52px | 0 32px | 16px |

---

### 6. SkeletonCard

**3 Variants:** `landscape` (220×124px), `portrait` (140×210px), `row` (full×72px)

**Animation:** Shimmer left → right, 1.5s loop

**Usage:**
```tsx
import { SkeletonCard } from '@/components/ui/SkeletonCard';

// Loading landscape cards
<div className="flex gap-2">
  {Array.from({ length: 8 }).map((_, i) => (
    <SkeletonCard key={i} variant="landscape" />
  ))}
</div>

// Loading Top 10 portrait cards
<SkeletonCard variant="portrait" />

// Loading list items
<SkeletonCard variant="row" />
```

---

### 7. Tooltip

**4 Positions:** `top`, `bottom`, `left`, `right`

**Delay:** 300ms default

**Usage:**
```tsx
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="Play movie" position="top">
  <button>▶</button>
</Tooltip>

<Tooltip content="Add to watchlist" position="bottom" delay={500}>
  <IconButton variant="heart" aria-label="Add" />
</Tooltip>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | required | Tooltip text |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | 'top' | Arrow position |
| `delay` | `number` | 300 | Show delay in ms |
| `children` | `ReactElement` | required | Trigger element |

---

## Molecule Components

### 8. MovieCard

**Standard Landscape 16:9**

**Dimensions:** 220px × 124px

**Layers:**
1. Thumbnail image (full bleed)
2. Bottom gradient (transparent → rgba(0,0,0,0.7))
3. Duration badge (top-right, 8px inset)
4. Title (bottom-left, 8px inset)
5. Progress bar (bottom, 3px) - Continue Watching only

**States:** Default, Hover, In-Watchlist, Playing, Completed

**Special Badges (top-left):**
- NEW (blue)
- TOP 10 + number (red)
- TRENDING (purple)
- AWARD WINNER (gold)

**Hover Behavior:**
- Scale: 1.05× (slight zoom)
- Delay: 500ms
- Shows HoverCardPopup (see #9)

**Usage:**
```tsx
import { MovieCard } from '@/components/MovieCard';

<MovieCard
  movie={{
    id: 1,
    title: "Movie Title",
    thumbnail: "https://...",
    duration: "2h 15m",
    progress: 45, // Optional
  }}
  badge="new" // Optional
  showProgress // Continue Watching variant
  onPlay={() => playMovie(1)}
/>
```

---

### 9. HoverCardPopup

**Width:** 280px

**Direction Variants:** `above`, `below`, `left-edge`, `right-edge`

**Structure:**
1. **TOP:** Thumbnail (280×158px, 16:9)
2. **MIDDLE:** Title + Metadata + Match score bar
3. **BOTTOM:** Action buttons (Play, Add, Info)

**Usage:**
```tsx
import { HoverCardPopup } from '@/components/HoverCardPopup';

<HoverCardPopup
  movie={movieData}
  direction="below"
  onPlay={() => {}}
  onAdd={() => {}}
  onInfo={() => {}}
/>
```

**Positioning Logic:**
- **above**: When card is in bottom half of viewport
- **below**: When card is in top half
- **left-edge**: When card is on left side
- **right-edge**: When card is on right side

---

### 10. Top10Card

**Portrait 2:3 Ratio**

**Dimensions:** 140px × 210px

**Special Feature:** Large rank number BEHIND card

**Rank Number Specs:**
- Font: 160px / 900 weight / Arial Black
- -webkit-text-stroke: 3px rgba(255,255,255,0.45)
- Color: transparent (outlined)
- Position: absolute bottom -20px, left -25px
- Z-index: 0

**Card Image:**
- Z-index: 1
- Margin-left: 35px
- Width: 105px (overlaps number)

**Usage:**
```tsx
import { Top10Card } from '@/components/Top10Card';

<Top10Card
  rank={1}
  movie={movieData}
  onClick={() => playMovie(1)}
/>
```

---

### 11. SectionHeader

**Full-width component**

**Layout:**
- **Left:** Label (purple, uppercase) + Title
- **Right:** "See All →" (appears on row hover)

**Padding:**
- Desktop: 0 60px
- Mobile: 0 20px

**Variants:** `default`, `row-hovered`, `mobile`

**Usage:**
```tsx
import { SectionHeader } from '@/components/SectionHeader';

<SectionHeader
  label="JUST ADDED"
  title="Season 1 Episodes"
  onSeeAll={() => navigate('/season/1')}
  showSeeAll // Optional
/>

<SectionHeader
  label="CONTINUE WATCHING"
  title="Pick up where you left off"
/>
```

---

## Animation Timing

| Interaction | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| Hover card delay | 500ms | - | Before appearing |
| Hover card appear | 250ms | ease-out | Fade + slide |
| Hover card dismiss | immediate | - | On mouse leave |
| Card scale | 200ms | cubic-bezier(0.4,0,0.2,1) | On hover |
| Modal open | 300ms | spring | Scale + fade |
| Toast appear | 300ms | ease-out | Slide from right |
| Toast dismiss | 200ms + 3s delay | - | Auto-dismiss |
| Tab underline | 300ms | cubic-bezier(0.4,0,0.2,1) | Slide animation |
| Heart bounce | 400ms | spring(400,20) | Add to watchlist |
| Hero crossfade | 600ms | ease-in-out | Auto-rotate |
| Navbar glass | 400ms | ease-in-out | On scroll |

---

## Design Token Reference

### Colors
```css
--bg-page: #141414
--bg-card: #181818
--bg-elevated: #232323

--brand-purple: #8b5cf6

--match-high: #46d369
--match-mid: #f59e0b
--match-low: #ef4444

--text-primary: #e5e5e5
--text-secondary: rgba(255,255,255,0.65)
--text-muted: rgba(255,255,255,0.35)

--border-default: rgba(255,255,255,0.12)
--border-brand: rgba(139,92,246,0.5)
```

### Spacing (4px grid)
```css
4px / 8px / 12px / 16px / 20px / 24px / 32px / 40px / 48px / 60px / 80px
```

### Radius
```css
2px → progress bars
4px → cards (Netflix standard)
5px → buttons
6px → tooltips
8px → hover cards, inputs
10px → sidebar active
12px → modals
20px → pills
999px → circles
```

### Shadows
```css
--shadow-card-hover: 0 6px 30px rgba(0,0,0,0.8)
--shadow-modal: 0 24px 80px rgba(0,0,0,0.9)
--shadow-tooltip: 0 4px 16px rgba(0,0,0,0.6)
--shadow-button: 0 4px 20px rgba(139,92,246,0.35)
```

---

## Component Checklist

**Atoms:**
- [x] Badge (8 variants)
- [x] MatchScore (3 variants)
- [x] ProgressBar (3 variants)
- [x] IconButton (3 sizes × 5 variants)
- [x] Button (5 variants × 3 sizes)
- [x] SkeletonCard (3 variants)
- [x] Tooltip (4 positions)

**Molecules:**
- [x] MovieCard (landscape)
- [x] HoverCardPopup (4 directions)
- [x] Top10Card (portrait)
- [x] SectionHeader (3 variants)

**Pages (Existing):**
- [x] Home
- [x] Browse
- [x] Watch
- [x] Watchlist
- [x] Profile
- [x] Analytics
- [x] NotFound

---

**All components follow Netflix quality standards and are production-ready!** 🎬
