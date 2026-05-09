# 📋 Development Specification - OTT Platform

Complete implementation specifications for Netflix-quality streaming platform.

---

## 🎯 Overview

This document provides **pixel-perfect specifications** for every screen, component, and interaction in the platform. Developers should be able to build the entire application using only this spec + design tokens.

**Goal:** When a developer sees these specs, they say:
> "I know exactly what to build — just wire the data."

---

## 🖥️ Desktop Screens (1440×900)

### SCREEN 1: Home - Hero State

**Frame:** 1440×900 (viewport above fold)

**Layer Stack:**
1. Sidebar (54px fixed left)
2. Hero Section (full bleed)
3. Navbar (transparent floating)

---

#### Sidebar Design (54×900px)

**Background:** `var(--bg-page)` (#141414)
**Border:** None

**Top Zone (54×68px):**
- Logo: 34px rounded square, brand-purple
- Centered in zone

**Icon Zone (54×auto, flex column, gap 4px):**

Each icon slot: 54×48px

**Active State:**
```css
background: var(--bg-card) + rgba(139,92,246,0.2)
border-radius: 10px
width: 40px, height: 40px
position: relative

/* Left accent bar */
::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 22px;
  background: var(--brand-purple);
  border-radius: 0 2px 2px 0;
}
```

**Icons (in order):**
- Home → `/` (active)
- Grid → `/browse`
- Heart → `/watchlist`
- BarChart → `/analytics`
- User → `/profile`
- Calendar → `/schedule`
- Zap → `/activity`
- Bell → `/notifications` (+ badge)

**Notification Badge:**
```css
width: 16px;
height: 16px;
background: #ef4444;
border-radius: 999px;
position: absolute;
top: 8px;
right: 10px;
font-size: 9px;
color: white;
font-weight: 700;
```

**Bottom Zone:**
- Settings icon (20px, text-muted)
- Avatar (36px circle + 2px purple ring if active)

---

#### Hero Section (1440×900px)

**Background:** TMDB backdrop image
- object-fit: cover
- object-position: center right

**Gradient Layers:**

Layer A (Horizontal):
```css
background: linear-gradient(
  90deg,
  rgba(0,0,0,0.95) 0%,
  rgba(0,0,0,0.75) 35%,
  rgba(0,0,0,0.20) 65%,
  transparent 100%
);
```

Layer B (Vertical Bottom):
```css
background: linear-gradient(
  180deg,
  transparent 50%,
  rgba(20,20,20,0.85) 80%,
  #141414 100%
);
```

**Content Block:**
```css
position: absolute;
bottom: 14%;
left: 60px;
max-width: 520px;
gap: 10-12px between elements
```

**Platform Badge:**
```html
<div class="platform-badge">
  <div class="icon">S</div>
  <span>PLATFORM ORIGINAL</span>
</div>
```
```css
.platform-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.icon {
  width: 20px;
  height: 20px;
  background: var(--brand-purple);
  border-radius: 50%;
}
span {
  font: label-11 uppercase;
  letter-spacing: 1.5px;
}
```

**Title:**
- Font: UnifrakturMaguntia 68px/700 (for shows) OR DM Sans 48px/800 (for movies)
- Color: var(--text-primary)
- Line-height: 1.05
- Max: 2 lines with ellipsis

**Metadata Row:**
```html
<div class="metadata">
  <Badge variant="match">98% Match</Badge>
  <span class="dot">·</span>
  <span>2024</span>
  <span class="dot">·</span>
  <span>2h 01m</span>
  <Badge variant="hd">HD</Badge>
  <Badge variant="rating">16+</Badge>
</div>
```
```css
.metadata {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dot {
  color: var(--text-muted);
}
span {
  font: body-14/500;
  color: var(--text-secondary);
}
```

**Description:**
```css
font: body-15/400;
color: rgba(255,255,255,0.75);
line-height: 1.6;
max-width: 460px;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
overflow: hidden;
```

**Button Row:**
```html
<div class="buttons">
  <Button variant="primary" size="md">▶ Play Now</Button>
  <Button variant="secondary" size="md">+ Watchlist</Button>
  <Button variant="ghost" size="md">ⓘ More Info</Button>
</div>
```
```css
.buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
```

**Progress Dots:**
```css
position: absolute;
bottom: 32px;
left: 60px;
display: flex;
gap: 8px;

/* Active dot */
.dot.active {
  width: 28px;
  height: 4px;
  background: white;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

/* Fill animation */
.dot.active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.5);
  transform-origin: left;
  animation: fill 8s linear forwards;
}

/* Inactive dot */
.dot.inactive {
  width: 6px;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
}
```

---

#### Navbar (position: top 0, left 54px)

**Default State (Hero visible):**
```css
width: calc(100vw - 54px);
height: 68px;
background: transparent;
border: none;
position: fixed;
top: 0;
left: 54px;
z-index: 100;
```

**Scrolled State (Hero scrolled):**
```css
background: var(--bg-glass);
backdrop-filter: blur(20px);
border-bottom: 1px solid var(--border-subtle);
transition: all 400ms ease-in-out;
```

**Left Section:**
```html
<nav class="nav-links">
  <a href="/" class="active">Home</a>
  <a href="/browse">Browse</a>
  <a href="/kids">Kids</a>
  <a href="/support">Support</a>
  <a href="/faq">FAQ</a>
</nav>
```
```css
.nav-links {
  display: flex;
  gap: 24px;
  padding-left: 6px;
}

a {
  font: label-14/500;
  color: rgba(255,255,255,0.65);
  transition: color 200ms;
}

a.active {
  color: var(--text-primary);
  position: relative;
}

a.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--text-primary);
  border-radius: 50%;
}
```

**Right Section:**
```html
<div class="nav-actions">
  <SearchIcon size={20} />
  <div class="notification-bell">
    <BellIcon size={20} />
    <span class="badge">2</span>
  </div>
  <img src={avatar} class="avatar" />
</div>
```
```css
.nav-actions {
  display: flex;
  gap: 20px;
  padding-right: 32px;
  align-items: center;
}

.notification-bell {
  position: relative;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 50%;
  font-size: 9px;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
```

---

### SCREEN 2: Home - Card Rows

**Frame:** 1440×1200 (full scrolled content)

---

#### Card Row Structure

**Section Header:**
```html
<SectionHeader
  label="JUST ADDED"
  title="Season 1 Episodes"
  showSeeAll={rowHovered}
/>
```

**Horizontal Scroll Container:**
```css
.card-row {
  position: relative;
  padding: 0 60px;
  margin-bottom: 32px;
}

.cards-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.cards-container::-webkit-scrollbar {
  display: none;
}
```

**Scroll Arrows (on row hover):**
```css
.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 300ms;
  cursor: pointer;
}

.row:hover .scroll-arrow {
  opacity: 1;
}

.scroll-arrow.left {
  left: 0;
  background: linear-gradient(90deg, var(--bg-page), transparent);
  justify-content: flex-start;
  padding-left: 16px;
}

.scroll-arrow.right {
  right: 0;
  background: linear-gradient(-90deg, var(--bg-page), transparent);
  justify-content: flex-end;
  padding-right: 16px;
}
```

---

#### Continue Watching Row (Special Variant)

Same as standard card BUT adds:

**Progress Bar:**
```css
.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.2);
}

.progress-fill {
  height: 100%;
  background: var(--brand-purple);
  transition: width 300ms;
}
```

**Time Left Badge:**
```css
.time-left {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 3px 6px;
  background: rgba(0,0,0,0.7);
  border-radius: 3px;
  font: body-11;
  color: white;
}
```

**Remove Button (on hover):**
```css
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 200ms;
  cursor: pointer;
}

.card:hover .remove-btn {
  opacity: 1;
}
```

---

#### Top 10 Row (Special Variant)

Uses portrait cards (140×210px) with rank numbers.

**Rank Number:**
```css
.rank-container {
  position: relative;
}

.rank-number {
  position: absolute;
  bottom: -20px;
  left: -25px;
  font-size: 160px;
  font-weight: 900;
  font-family: Arial Black, sans-serif;
  color: transparent;
  -webkit-text-stroke: 3px rgba(255,255,255,0.45);
  z-index: 0;
  user-select: none;
  pointer-events: none;
}

.rank-image {
  position: relative;
  z-index: 1;
  margin-left: 35px;
  width: 105px;
  height: 210px;
  object-fit: cover;
  border-radius: 4px;
}
```

---

### SCREEN 3: Browse Page

**Genre Filter Bar (sticky below navbar):**
```css
.genre-bar {
  position: sticky;
  top: 68px;
  height: 56px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 0 60px;
  z-index: 90;
  display: flex;
  gap: 12px;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
}

.genre-pill {
  height: 32px;
  padding: 0 16px;
  border-radius: 999px;
  font: label-13/500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 200ms;
}

.genre-pill.inactive {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
}

.genre-pill.active {
  background: var(--brand-purple);
  border: none;
  color: white;
}

.genre-pill.inactive:hover {
  border-color: var(--border-brand);
  color: var(--text-primary);
}
```

**Browse Hero:**
```css
height: 55vh;
/* Same gradient system as home hero */
/* BUT: simpler title, no gothic font */
```

**Search Bar (inside hero):**
```css
.search-bar {
  position: absolute;
  left: 55%;
  top: 65%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 48px;
  background: rgba(0,0,0,0.5);
  border: 1px solid var(--border-default);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font: body-15;
  color: var(--text-primary);
}

.search-bar input::placeholder {
  color: var(--text-muted);
}
```

---

### SCREEN 4: Movie Detail Modal

**Overlay:**
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
```

**Modal:**
```css
.modal {
  width: min(860px, 90vw);
  max-height: 85vh;
  overflow-y: auto;
  background: var(--bg-elevated);
  border-radius: 12px 12px 0 0;
  box-shadow: var(--shadow-modal);
}
```

**Close Button:**
```css
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0,0,0,0.7);
}
```

**Top Section (16:9):**
```css
.modal-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.modal-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(transparent, var(--bg-elevated));
}
```

**Content Section:**
```css
.modal-content {
  padding: 28px;
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 32px;
}

.left-column {
  /* Match score + overview + cast/director */
}

.right-column {
  /* More Like This preview + platform info */
}
```

---

### SCREEN 5: Video Player

**Full Screen Layout:**
```css
.player {
  position: fixed;
  inset: 0;
  background: #000000;
  z-index: 2000;
}

.player.hide-controls {
  cursor: none;
}

.player.hide-controls .controls {
  opacity: 0;
  pointer-events: none;
}
```

**Top Bar:**
```css
.player-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  background: linear-gradient(rgba(0,0,0,0.8), transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  transition: opacity 300ms;
}
```

**Bottom Controls:**
```css
.player-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 96px;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  padding: 0 32px 20px;
  transition: opacity 300ms;
}

.progress-section {
  margin-bottom: 12px;
}

.progress-track {
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.progress-track:hover {
  height: 6px;
}

.progress-fill {
  height: 100%;
  background: var(--brand-purple);
  border-radius: 2px;
  position: relative;
}

.progress-thumb {
  position: absolute;
  right: -7px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
}
```

**Controls Row:**
```css
.controls-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.left-controls {
  display: flex;
  gap: 20px;
  align-items: center;
}

.right-controls {
  margin-left: auto;
  display: flex;
  gap: 16px;
  align-items: center;
}
```

---

## 📱 Mobile Screens (390×844px)

### Mobile: Home

**No Sidebar** - Hidden on mobile

**Bottom Nav Bar:**
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--bg-page);
  border-top: 1px solid var(--border-subtle);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  z-index: 100;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-muted);
}

.nav-tab.active {
  color: var(--brand-purple);
}

.nav-tab-icon {
  width: 22px;
  height: 22px;
}

.nav-tab-label {
  font: label-10;
}
```

**Hero Adjustments:**
```css
.hero-mobile {
  height: 60vh;
}

.hero-content {
  bottom: 80px;
  left: 20px;
  right: 20px;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
}

.hero-description {
  display: none; /* Hidden on mobile to save space */
}

.hero-buttons {
  flex-direction: column;
  width: 100%;
}

.hero-buttons button {
  width: 100%;
}
```

**Cards Grid (NOT horizontal scroll):**
```css
.cards-grid-mobile {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding: 0 16px;
}
```

---

## 🎬 Interaction Flows

### FLOW 1: Browse + Play

**Steps:**
1. Home → Hover card (500ms delay)
2. Popup appears above/below
3. Click "More Info" → Modal opens (300ms spring)
4. Modal → Click "Play" → Video Player (fade 250ms)
5. Player → Click "Back" → Home (fade 250ms)

---

### FLOW 2: Search

**Steps:**
1. Navbar → Click search icon
2. Search expands (slide 300ms)
3. Type query → Results appear (instant, debounced 500ms)
4. Click result → Movie Detail Modal

---

### FLOW 3: Watchlist

**Steps:**
1. Hover card → Click Heart (empty)
2. Heart animates (scale 1→1.4→1, 400ms spring)
3. Toast appears bottom-right (slide 300ms)
4. Navigate to `/watchlist`
5. See saved movie in grid
6. Hover → Click × remove
7. Card animates out (fade + scale 200ms)

---

### FLOW 4: Genre Browse

**Steps:**
1. Browse page → Click "Horror" pill
2. Pill becomes active (background transition 200ms)
3. Cards fade out (200ms)
4. Skeletons appear
5. Horror movies load
6. Cards fade in (300ms stagger)

---

## 📊 API Data Mapping

### HeroSection Component

```typescript
// TMDB API → Component Props
{
  backdrop_path → heroBackgroundImage
  title → mainTitleText
  overview → descriptionParagraph
  vote_average × 10 → matchScorePercentage
  release_date.slice(0,4) → year
  runtime → formattedDuration("2h 15m")
}
```

### MovieCard Component

```typescript
{
  backdrop_path OR poster_path → thumbnailImage
  title → cardTitleOverlay
  release_date.slice(0,4) → yearInPopup
  vote_average × 10 → matchPercentageInPopup
  runtime → durationBadge
}
```

---

## ✅ Implementation Checklist

### Design Tokens
- [x] Colors defined in CSS
- [x] Typography scale documented
- [x] Spacing (4px grid) enforced
- [x] Radius values standardized
- [x] Shadows specified

### Components
- [x] Badge (8 variants)
- [x] MatchScore
- [x] ProgressBar
- [x] IconButton
- [x] Button
- [x] SkeletonCard
- [x] Tooltip
- [ ] MovieCard
- [ ] HoverCardPopup
- [ ] Top10Card
- [ ] SectionHeader

### Screens
- [x] Home - Hero
- [x] Home - Card Rows
- [x] Browse
- [x] Watch
- [x] Watchlist
- [x] Profile
- [x] Analytics
- [x] NotFound

### States
- [x] Loading (skeletons)
- [x] Error (retry UI)
- [ ] Empty states
- [x] Hover states
- [ ] Focus states (accessibility)

### Interactions
- [ ] Card hover (500ms delay)
- [ ] Modal open/close
- [ ] Toast notifications
- [ ] Heart bounce animation
- [ ] Tab underline slide
- [ ] Genre pill transitions

---

**Every pixel specified. Ready to build!** 🚀
