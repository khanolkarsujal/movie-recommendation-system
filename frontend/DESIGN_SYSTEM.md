# 🎨 OTT Platform Design System

Professional Netflix-quality design tokens and components.

---

## Color System

### Backgrounds (3-Layer Depth)
```css
--bg-page:      #141414   /* Base page background */
--bg-card:      #181818   /* Card surfaces */
--bg-elevated:  #232323   /* Modals, panels */
--bg-overlay:   rgba(0,0,0,0.85)  /* Overlays */
--bg-glass:     rgba(20,20,20,0.92) /* Navbar glass */
```

### Brand Colors
```css
--brand-purple:      #8b5cf6
--brand-purple-dim:  rgba(139,92,246,0.2)
--brand-purple-glow: rgba(139,92,246,0.4)
```

### Semantic Colors
```css
--status-match-green: #46d369  /* High match (Netflix) */
--status-mid-yellow:  #f59e0b  /* Medium match */
--status-low-red:     #ef4444  /* Low match / error */
--status-new-blue:    #3b82f6  /* New badge */
```

### Text Colors
```css
--text-primary:   #e5e5e5                /* Main content */
--text-secondary: rgba(255,255,255,0.65) /* Secondary text */
--text-muted:     rgba(255,255,255,0.35) /* Muted text */
--text-disabled:  rgba(255,255,255,0.2)  /* Disabled state */
--text-inverse:   #141414                /* On white buttons */
```

### Borders
```css
--border-subtle:  rgba(255,255,255,0.06)
--border-default: rgba(255,255,255,0.12)
--border-strong:  rgba(255,255,255,0.25)
--border-brand:   rgba(139,92,246,0.5)
```

---

## Typography System

### Display (Hero Titles)
- **display/hero**: 72px / 800 weight / -1.5px tracking
- **display/title**: 48px / 800 weight / -1px tracking

### Headings
- **heading/xl**: 32px / 700 / -0.5px
- **heading/lg**: 24px / 700 / -0.3px
- **heading/md**: 20px / 700 / 0px
- **heading/sm**: 16px / 600 / 0px

### Body Text
- **body/lg**: 16px / 400 / 0.1px / 1.6 leading
- **body/md**: 14px / 400 / 0.1px / 1.5 leading
- **body/sm**: 13px / 400 / 0.1px / 1.4 leading

### Labels
- **label/lg**: 14px / 600 / 0.5px
- **label/md**: 12px / 600 / 1px
- **label/sm**: 11px / 700 / 1.5px UPPERCASE
- **label/xs**: 10px / 700 / 2px UPPERCASE

**Font Family**: DM Sans or Inter (from Google Fonts)

---

## Spacing System (4px Grid)

Always align to the 4px base grid. Never use arbitrary values like 9px or 13px.

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
```

**Examples:**
- Card padding: `var(--space-4)` (16px)
- Section gap: `var(--space-8)` (32px)
- Hero padding: `var(--space-16)` (64px)

---

## Border Radius

```css
--radius-xs:   3px   /* Badges, HD tags */
--radius-sm:   4px   /* Cards (Netflix standard) */
--radius-md:   6px   /* Buttons */
--radius-lg:   10px  /* Sidebar active */
--radius-xl:   12px  /* Modals, panels */
--radius-2xl:  16px  /* Large modals */
--radius-full: 999px /* Pills, avatars, circles */
```

---

## Shadows & Elevation

```css
--shadow-card-hover:  0 6px 30px rgba(0,0,0,0.8)
--shadow-modal:       0 24px 80px rgba(0,0,0,0.9)
--shadow-tooltip:     0 4px 16px rgba(0,0,0,0.6)
--shadow-button:      0 4px 20px rgba(139,92,246,0.3)
--shadow-glow-purple: 0 0 24px rgba(139,92,246,0.4)
```

**Backdrop Blur**: 20px for glass morphism effects

---

## Component Specifications

### 1. Badge Variants
- Height: 20px
- Radius: `var(--radius-xs)` (3px)
- Padding: 0 8px
- Font: 10px / 700 / 2px UPPERCASE

**Types:**
- `[NEW]` - Blue background
- `[HD]` / `[4K]` - Outlined
- `[98% Match]` - Green filled
- `[TOP 10]` - Red
- `[16+]` / `[PG]` - Outlined

### 2. Genre Pill
- Height: 32px
- Padding: 0 14px
- Radius: `var(--radius-full)`
- Font: 14px / 600

**States:**
- Default: transparent + `--border-default`
- Active: `--brand-purple` bg + white text
- Hover: `--border-brand`

### 3. Icon Button (Circle)
- Sizes: 30px / 36px / 44px diameter
- Variants: play / heart / thumbs / info / add
- States: default / hover / active / disabled

### 4. CTA Button
- Height: 44px
- Padding: 0 24px
- Radius: `var(--radius-md)` (6px)
- Font: 16px / 600

**Variants:**
- **Primary**: white bg, black text
- **Secondary**: `rgba(109,109,110,0.7)` bg
- **Ghost**: transparent, white border
- **Brand**: purple bg, white text
- **Danger**: red bg, white text

### 5. Card Thumbnail
- Image ratio: 16:9 (landscape) or 2:3 (portrait)
- Border-radius: `var(--radius-sm)` (4px)
- Standard width: 220px (landscape)
- Portrait width: 140px

**Hover State:**
- Scale: 1.15× (centered)
- Delay: 500ms
- Z-index: above siblings
- Dark overlay + centered play button

### 6. Progress Bar
- Height: 3px
- Fill: `--brand-purple`
- Background: `rgba(255,255,255,0.2)`
- Position: absolute bottom on card

### 7. Match Score Bar
- Width: full
- Height: 3px
- Colors: green (high) / yellow (mid) / red (low)
- Label above: "98% Match"

---

## Motion & Timing

### Timing Scale
```css
Instant:  0ms     /* Toggle states */
Fast:     150ms   /* Tooltips, micro-interactions */
Normal:   250ms   /* Hovers, shows */
Slow:     400ms   /* Panels, modals */
Ambient:  600ms   /* Hero crossfade */
Story:    1000ms  /* Page transitions */
```

### Easing Functions
```css
Bounce in:  cubic-bezier(0.34, 1.56, 0.64, 1)
Ease out:   cubic-bezier(0, 0, 0.2, 1)
Ease in:    cubic-bezier(0.4, 0, 1, 1)
Standard:   cubic-bezier(0.4, 0, 0.2, 1)
```

### Key Animations
1. **Card hover**: 500ms delay → scale(1.15) + popup
2. **Hero auto-rotate**: 8s → crossfade 600ms
3. **Modal open**: scale(0.9)→1 + opacity, 300ms
4. **Sidebar active**: left bar slides in 150ms
5. **Tab switch**: underline slides 300ms
6. **Toast in**: translateX(100%)→0, 300ms ease-out
7. **Skeleton shimmer**: 1.5s linear infinite
8. **Heart click**: scale(1.4)→1 spring bounce
9. **Image load**: opacity 0→1, 400ms
10. **Page transition**: opacity 0→1, 250ms

---

## Layout Specifications

### Sidebar
- Width: 54px (fixed)
- Background: `var(--bg-card)`
- Border-right: `var(--border-subtle)`

**Active State:**
- Purple tinted background (40×40 rounded)
- Left accent bar: 3px `--brand-purple`

### Navbar
- Height: 68px
- Background: transparent (glass on scroll)
- Padding: 0 60px

### Card Rows
- Padding: 0 60px
- Gap between cards: 8px
- Gap between rows: 32px
- Horizontal scroll with hidden scrollbar

### Hero
- Height: 100vh
- Gradient overlays: horizontal + vertical bottom
- Content: bottom 15%, left 60px

---

## Quality Standards

### The Netflix Test
Would a Netflix designer be proud to ship this? If not, iterate.

### The 4px Grid Rule
Everything aligns to the 4px grid. No exceptions.

### The 3-Layer Depth System
```
Layer 1 (Base):     #141414
Layer 2 (Cards):    #181818
Layer 3 (Elevated): #232323
```

This creates visual depth and premium feel.

### Typography Hierarchy
Maximum 3 font sizes per screen:
- Large (title)
- Medium (body)
- Small (metadata)

This creates clear visual flow and prevents chaos.

---

## Usage Examples

### Using Color Tokens
```tsx
// Background
<div className="bg-[var(--bg-card)]">

// Text
<p className="text-[var(--text-secondary)]">

// Border
<div className="border border-[var(--border-default)]">
```

### Using Spacing
```tsx
// Padding
<div className="p-[var(--space-4)]">    /* 16px */
<div className="px-[var(--space-8)]">   /* 32px horizontal */

// Gap
<div className="gap-[var(--space-2)]">  /* 8px */
```

### Using Shadows
```tsx
// Card hover effect
<div className="hover:shadow-[var(--shadow-card-hover)]">

// Modal
<div className="shadow-[var(--shadow-modal)]">
```

### Using Radius
```tsx
// Card
<div className="rounded-[var(--radius-sm)]">  /* 4px */

// Button
<button className="rounded-[var(--radius-md)]">  /* 6px */

// Pill
<div className="rounded-[var(--radius-full)]">  /* 999px */
```

---

## Accessibility

- All interactive elements: minimum 44×44px hit area
- Color contrast: minimum 4.5:1 for body text
- Focus states: visible ring with `--ring` color
- ARIA labels on all icon buttons
- Keyboard navigation support for all interactions
- Screen reader friendly semantic HTML

---

**Built for production. Ship with confidence.**
