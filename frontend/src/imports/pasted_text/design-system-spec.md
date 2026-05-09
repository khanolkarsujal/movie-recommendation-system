You are a Principal Product Designer + Design Systems 
Engineer at a top-tier streaming company.

MISSION: Design and spec EVERY frontend feature of 
this OTT platform so completely that a developer 
only needs to swap mock data for real API calls.

Every screen, every state, every interaction must 
be designed. Nothing left to imagination.

When developer sees these designs they must say:
"I know exactly what to build — just wire the data."

════════════════════════════════════════
FIGMA FILE STRUCTURE — CREATE EXACTLY:
════════════════════════════════════════

Pages:
├── 🎨 Design Tokens
├── 🧩 Component Library
├── 🖥️ Desktop Screens (1440px)
├── 📱 Mobile Screens (390px)
├── 🔄 All States & Variants
├── ⚡ Interactions & Flows
└── 📋 Dev Handoff Specs

════════════════════════════════════════
PAGE 1 — DESIGN TOKENS (build first)
════════════════════════════════════════

Section 1: COLOR SYSTEM
Create Figma color styles for ALL of these:

Backgrounds:
  bg-page         = #141414  ← entire page base
  bg-card         = #181818  ← all card surfaces
  bg-elevated     = #232323  ← modals, dropdowns
  bg-input        = #2a2a2a  ← form inputs
  bg-glass        = rgba(20,20,20,0.92) ← navbar scrolled
  bg-overlay      = rgba(0,0,0,0.85)   ← modal backdrop
  bg-hero-gradient= see gradient specs

Brand:
  brand-purple    = #8b5cf6  ← primary accent
  brand-purple-10 = rgba(139,92,246,0.10)
  brand-purple-20 = rgba(139,92,246,0.20)
  brand-purple-40 = rgba(139,92,246,0.40)

Status:
  match-high   = #46d369  ← 75-100% match (Netflix green)
  match-mid    = #f59e0b  ← 40-74% match
  match-low    = #ef4444  ← 0-39% match
  badge-new    = #3b82f6  ← NEW badge
  badge-top10  = #ef4444  ← TOP 10 badge
  badge-award  = #f59e0b  ← AWARD badge

Text:
  text-primary   = #e5e5e5       ← main content
  text-secondary = rgba(255,255,255,0.65)
  text-muted     = rgba(255,255,255,0.35)
  text-disabled  = rgba(255,255,255,0.20)
  text-on-brand  = #ffffff       ← on purple bg
  text-on-light  = #141414       ← on white buttons

Borders:
  border-subtle  = rgba(255,255,255,0.06)
  border-default = rgba(255,255,255,0.12)
  border-strong  = rgba(255,255,255,0.25)
  border-brand   = rgba(139,92,246,0.50)
  border-input   = rgba(255,255,255,0.15)
  border-focus   = #8b5cf6

Section 2: TYPOGRAPHY STYLES
Import: DM Sans (primary) from Google Fonts

Create ALL Figma text styles:

Display:
  display-72/800  → hero title main
  display-48/700  → page titles

Heading:
  h1-32/700       → modal titles
  h2-24/700       → section titles
  h3-20/600       → subsection titles
  h4-16/600       → card section titles
  h5-14/600       → small headers

Body:
  body-16/400     → descriptions, modals
  body-14/400     → general text
  body-13/400     → secondary info
  body-12/400     → metadata, timestamps

Label:
  label-14/600    → button text
  label-13/600    → nav links, tab labels
  label-12/700    → section sublabels
  label-11/700/2px-spacing/UPPERCASE → category labels
  label-10/700/2px-spacing/UPPERCASE → micro labels

Special:
  gothic-68/700   → UnifrakturMaguntia hero title

Section 3: SPACING
Document 4px grid:
  4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 60 / 80

Section 4: RADIUS
  2px → micro (progress bars)
  4px → cards (primary — Netflix standard)
  5px → buttons
  6px → tooltips
  8px → hover cards, inputs
  10px → sidebar active state
  12px → modals, panels, dropdowns
  20px → genre filter pills
  999px → avatar circles

Section 5: SHADOWS (Figma effects)
  card-hover  → 0 6px 30px rgba(0,0,0,0.8)
  modal       → 0 24px 80px rgba(0,0,0,0.9)
  tooltip     → 0 4px 16px rgba(0,0,0,0.6)
  btn-brand   → 0 4px 20px rgba(139,92,246,0.35)
  glow-purple → 0 0 24px rgba(139,92,246,0.40)

════════════════════════════════════════
PAGE 2 — COMPONENT LIBRARY
════════════════════════════════════════

── ATOM COMPONENTS ──

1. BADGE (8 variants)
   Height: 20px, Radius: 3px, Padding: 0 7px
   Font: label-11 uppercase
   
   Variants:
   [NEW]      → bg #3b82f6, white text
   [HD]       → transparent, border-default, text-secondary
   [4K]       → transparent, border-default, text-secondary
   [16+]      → transparent, border-default, text-secondary
   [PG]       → transparent, border-default, text-secondary
   [AWARD]    → bg #f59e0b/20, text #f59e0b, border #f59e0b/40
   [TOP 10]   → bg #ef4444/20, text #ef4444, border #ef4444/40
   [TRENDING] → bg brand-purple-10, text brand-purple, border brand-purple-40

2. MATCH SCORE COMPONENT
   Contains:
   - Score text: "98% Match" label-12/700
     Color driven by score:
     ≥75% → match-high (#46d369)
     ≥40% → match-mid (#f59e0b)
     <40%  → match-low (#ef4444)
   - Dot separator: "·" text-muted
   - Metadata: "2024 · 2h 01m" text-secondary body-12
   - [HD] badge inline
   
   Variants: 
   horizontal-full / horizontal-compact / with-bar-below

3. PROGRESS BAR (3 variants)
   Height: 2px / 3px / 4px
   Track: rgba(255,255,255,0.15) radius 2px
   Fill: brand-purple, radius 2px
   
   Watch progress bar variant:
   Track: rgba(255,255,255,0.2)
   Fill: brand-purple
   Shows: "14 min left" label floating above right end
   
   Match score bar variant:
   Fill color: driven by score % (green/yellow/red)
   Animated: fill width 0% → actual% on appear

4. ICON BUTTON (3 sizes × 5 variants × 3 states)
   
   Sizes:
   SM: 28px circle
   MD: 32px circle  
   LG: 40px circle
   
   Variants:
   Play    → filled white bg, black icon (primary)
   Heart   → transparent, border-default, white icon
   Heart✓  → brand-purple-20 bg, border-brand, purple icon (active)
   Thumbs  → transparent, border-default, white icon
   Info/⌄  → transparent, border-default, white icon
   
   States per variant:
   Default / Hover (bg lightens 10%) / Active (pressed) / Disabled

5. BUTTON (5 variants × 3 sizes × 3 states)
   
   Variants:
   Primary → white bg, black text (Play Now)
   Secondary → rgba(109,109,110,0.7) bg, white text
   Ghost → transparent, border-strong, white text
   Brand → brand-purple bg, white text
   Danger → #ef4444 bg, white text
   
   Sizes:
   SM: height 36px, padding 0 16px, font label-13
   MD: height 44px, padding 0 24px, font label-14
   LG: height 52px, padding 0 32px, font label-16
   
   States: Default / Hover / Active / Loading / Disabled
   
   Loading state:
   Shows spinning ring instead of text
   Text: "Loading..." faded
   Pointer-events: none

6. GENRE PILL (2 variants × 2 states)
   
   Pill shape: radius 999px
   Padding: 7px 16px
   Height: 32px
   Font: label-13/500
   
   Variants:
   Default (Browse filter) → border-default, text-secondary
   Compact (card popup) → bg rgba(255,255,255,0.08)
   
   States:
   Active: brand-purple bg, white text, no border
   Inactive: border-default, text-secondary
   Hover: border-brand, text-primary

7. AVATAR (4 sizes × 3 states)
   
   Sizes: 28px / 36px / 44px / 64px
   Shape: circle (radius 999px)
   
   States:
   Default: image only
   Active: 2px brand-purple ring, 2px gap
   Online: small green dot bottom-right (8px)

8. TOAST NOTIFICATION (3 variants)
   
   Width: 320px, Radius: 10px
   Background: bg-elevated
   Border-left: 3px solid
   Padding: 14px 16px
   Shadow: card-hover
   
   Variants:
   Success → border #46d369, icon ✓
   Error   → border #ef4444, icon ✕
   Info    → border brand-purple, icon ℹ
   
   Content:
   Row 1: Icon + Title (label-14/600)
   Row 2: Message (body-13, text-secondary)
   Row 3: Auto-dismiss progress bar (2px, brand-purple)
   X close button: top-right corner
   
   Animation: slides in from right, fades out after 3s

9. SKELETON CARD (3 variants)
   
   Same dimensions as real cards
   Background: bg-card
   Shimmer overlay: 
   bg: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)
   Animated left → right, 1.5s loop
   
   Variants:
   Landscape (220×124px) → matches standard card
   Portrait (140×210px) → matches Top 10 card
   Row item (full width × 72px) → matches list items

10. TOOLTIP
    Background: bg-elevated
    Border: border-subtle
    Radius: 6px
    Padding: 6px 10px
    Font: body-12, text-primary
    Arrow: 6px triangle pointing to target
    
    Variants: top / bottom / left / right
    Delay: 300ms before appear
    Animation: fade + 4px slide from arrow direction

── MOLECULE COMPONENTS ──

11. MOVIE CARD — STANDARD (landscape 16:9)
    
    Default state:
    Width: 220px, Height: 124px
    Radius: 4px, Overflow: hidden
    
    Layers (bottom to top):
    A. Thumbnail image (cover, center)
    B. Gradient bottom: transparent → rgba(0,0,0,0.7)
    C. Duration badge: top-right, 8px inset
       Bg: rgba(0,0,0,0.7), radius 3px, padding 3px 6px
       Font: label-10, text-primary
    D. Title: bottom-left, 8px inset
       Font: body-12/600, text-primary
       Max 1 line, ellipsis
    E. Progress bar: very bottom, 3px, brand-purple
       (only for Continue Watching row)
    
    Hover state (show as separate variant):
    Card scale: 1.05 (slight size increase)
    Hover popup appears above OR below
    (See component #12)
    
    States to design:
    Default / Hover / In-Watchlist / Playing / Completed
    
    Special badge overlays (top-left corner):
    NEW: blue badge
    TOP 10 + number: red badge
    TRENDING: purple badge
    AWARD WINNER: gold badge

12. HOVER CARD POPUP
    
    Width: 280px
    Background: #181818
    Radius: 8px (top only if below, bottom only if above)
    Shadow: card-hover
    
    TOP: Thumbnail (280×158px, 16:9)
    Gradient overlay bottom of thumbnail
    
    MIDDLE (padding 10px 12px 4px):
    Row 1: Title — body-13/700, text-primary, 1 line max
    Row 2: [98% Match] · 2024 · 2h 01m · [HD]
    Row 3: Match score bar (2px, animated)
    
    BOTTOM (padding 4px 12px 12px):
    Button row:
    [▶ Play] 32px  [♡ Add] 30px  space-auto  [⌄ Info] 30px
    
    Direction variants:
    Popup-Above: radius 8px bottom, arrow bottom-center
    Popup-Below: radius 8px top, arrow top-center
    Popup-Left-Edge: aligned to left of card
    Popup-Right-Edge: aligned to right of card
    
    ALL 4 direction variants required for dev handoff

13. MOVIE CARD — PORTRAIT (Top 10)
    
    Width: 140px, Height: 210px
    Radius: 4px
    
    Large rank number (behind card):
    Font: 160px/900 Arial Black
    -webkit-text-stroke: 3px rgba(255,255,255,0.45)
    Color: transparent (outlined)
    Position: absolute bottom -20px, left -25px
    Z-index: 0
    
    Card image: z-index 1, margin-left 35px
    Image width: 105px (overlaps number)

14. SECTION HEADER
    
    Full-width component, height auto
    Padding: 0 60px (desktop) / 0 20px (mobile)
    Margin-bottom: 10px
    
    Left side (column):
    Label: label-11 uppercase, brand-purple, mb 3px
    Title: h2-18/700, text-primary (#e5e5e5)
    
    Right side:
    "See All →" label-13, brand-purple
    Opacity: 0 by default
    Opacity: 1 on row hover (design as variant)
    
    Variants: default / row-hovered / mobile

15. NOTIFICATION ITEM
    
    Width: 100%, Height: 72px
    Padding: 12px 16px
    Background: transparent
    Hover: bg-card
    
    Left: Thumbnail 48×48px, radius 6px
    Center: 
      Title: label-13/600, text-primary
      Message: body-12, text-secondary, 1 line max
      Time: label-11, text-muted
    Right: Unread dot 6px brand-purple (if unread)
    
    States: Read / Unread / Hover

16. SEARCH RESULT ITEM
    
    Height: 56px
    Padding: 8px 16px
    Display: flex, gap 12px
    
    Left: Poster 40×56px, radius 4px
    Center:
      Title: label-14/600, text-primary
      Year + Genre: body-12, text-secondary
    Right: Match score "98%" label-12, match-high
    
    States: Default / Hover / Selected

════════════════════════════════════════
PAGE 3 — DESKTOP SCREENS (1440×900)
════════════════════════════════════════

Design EVERY screen with EVERY state.
Use components from library. Auto-layout everything.

── SCREEN 1: HOME — HERO STATE ──

Frame: 1440×900 (viewport above fold)

Layer Stack:
[1] Sidebar (54px, fixed left)
[2] Hero Section (full bleed behind navbar)
[3] Navbar (transparent, floating)

SIDEBAR DESIGN (54×900px):
Background: bg-page (#141414)
No border-right

Top zone (54×68px = navbar height):
S logo mark: 34px rounded-square, brand-purple
Centered in 54×68px zone

Icon zone (54×auto, flex column, gap 4px):
Each icon slot: 54×48px
Icon: 20px, text-secondary
Active icon slot:
  40×40px rounded-10 bg-card + brand-purple-20
  3px left accent bar (brand-purple, height 22px)
  Icon: text-primary
Hover icon slot:
  40×40px rounded-10 bg-card
  Icon: text-primary

Icons in order (with route labels):
Home → /
Grid → /browse
Heart → /watchlist
BarChart → /analytics
User → /profile
Calendar → /schedule
Zap → /activity
Bell → /notifications (+ badge "2")

Notification badge:
16px circle, #ef4444, white label-9
Position: top-right of bell icon
Subtle pulse animation (document)

Bottom zone:
Settings gear: icon only, text-muted
Avatar: 36px circle + 2px ring if active

HERO SECTION (full 1440×900px):
Background: TMDB backdrop image (full bleed)
Object-fit: cover, Object-position: center right

Gradient layers (document for dev):
Layer A - Horizontal:
  rgba(0,0,0,0.95) 0%
  rgba(0,0,0,0.75) 35%
  rgba(0,0,0,0.20) 65%
  transparent 100%
Layer B - Vertical bottom:
  transparent 50%
  rgba(20,20,20,0.85) 80%
  #141414 100%

Content block (position: bottom 14%, left 60px):
Max-width: 520px
Gap between elements: 10-12px

Platform badge:
20px brand-purple circle (S) + "PLATFORM ORIGINAL"
Font: label-11 uppercase, letter-spacing 1.5px

Title:
Font: gothic-68/700 (UnifrakturMaguntia) OR
      display-48/800 (DM Sans for non-show)
Color: text-primary
Line-height: 1.05
Max 2 lines

Metadata row (flex, gap 10px, align center):
[98% Match] green filled badge
Dot "·" separator (text-muted)
"2024" body-14/500 text-secondary
Dot "·"
"2h 01m" body-14/500 text-secondary
[HD] badge
[16+] badge

Description:
body-15/400, rgba(255,255,255,0.75)
Line-height: 1.6, max-width: 460px
Max 3 lines (line-clamp: 3)

Buttons row (flex, gap 12px, mt 8px):
[▶ Play Now] → Primary MD button
[+ Watchlist] → Secondary MD button
[ⓘ More Info] → Ghost MD button (desktop only)

Progress dots (bottom: 32px, left: 60px):
5 dots: active = 28×4px pill white
        inactive = 6px circle rgba(255,255,255,0.3)
Active dot has inner fill bar animating 0→100%

NAVBAR (position: top 0, left 54px):
Width: calc(1440 - 54)px
Height: 68px
Background: TRANSPARENT (hero state)
No border, no shadow

Left section (padding-left: 6px):
Nav links: Home · Browse · Kids · Support · FAQ
Font: label-14/500
Active "Home": text-primary, dot below center
Inactive: rgba(255,255,255,0.65)
Gap between links: 24px

Right section (padding-right: 32px, gap 20px):
Search icon: 20px, text-primary
Bell icon: 20px + notification badge (16px red)
Avatar: 32px circle

── SCREEN 2: HOME — SCROLLED STATE ──

Same as above but scroll position = 300px

Differences:
- Navbar: background bg-glass, backdrop-blur 20px
          border-bottom: border-subtle
- Hero: partially scrolled, content moving up
- Season Tab Bar: stuck to top below navbar

SEASON TAB BAR (stuck position):
Background: bg-glass, backdrop-blur 20px
Height: 52px
Padding: 0 60px
Border-bottom: border-subtle
Top: 68px (below navbar)

Tab items (gap 24px):
Active tab: text-primary/700 + 2px brand-purple underline
            Sliding indicator (design both states)
Inactive: text-secondary/400
Episode count badge: 18px, rounded-full, bg-card

── SCREEN 3: HOME — CARD ROWS ──

Frame: 1440×1200 (full scrolled content)

FIRST ROW — Season 1 Episodes:

Section header with JUST ADDED label

Cards (horizontal scroll):
8 landscape cards (220×124px, gap 8px)
Scroll padding: 60px left
Right edge fades: gradient mask right edge

Left/right scroll arrows:
Only on row hover
Left: absolute, 64px from left, centered vertically
Right: absolute, 0 from right, centered vertically
Each: 48×100px, gradient bg, ChevronIcon white

SECOND ROW — Continue Watching:

Section header with CONTINUE WATCHING label

Cards same as standard BUT:
Progress bar at bottom (brand-purple, 3px)
"X min left" badge overlay bottom-right:
  Body-11, bg rgba(0,0,0,0.7), rounded-3px
Remove (×) button: top-right, only on hover
  20px circle, bg rgba(0,0,0,0.7), white × 10px

THIRD ROW — Top 10 in Your Country:

Section header with TOP 10 IN YOUR COUNTRY label
Portrait cards (140×210px) with rank numbers

FOURTH ROW — Trending Now:

Standard landscape cards with 🔥 TRENDING badge

FIFTH ROW — New This Week:

Standard landscape cards with NEW badge (blue)

SIXTH ROW — Because You Watched [X]:

Header: "Because you watched" → small, muted
Title: Show/movie name → text-primary
Standard landscape cards, no special badge

── SCREEN 4: BROWSE PAGE ──

GENRE FILTER BAR (below navbar, sticky):
Height: 56px
Background: bg-glass, backdrop-blur
Border-bottom: border-subtle
Padding: 0 60px
Scroll: horizontal, hidden scrollbar

Pills: All · Action · Drama · Horror · Sci-Fi
       Comedy · Thriller · Fantasy · Animation · Crime
Active pill: brand-purple bg, white text
Inactive: border-default, text-secondary
Hover: border-brand, text-primary
Pill height: 32px, radius: 999px

BROWSE HERO (below filter bar):
Height: 55vh
Full bleed backdrop
Same gradient system as home hero
BUT: no gothic title, regular bold title
     "Continue" + "Watchlist" buttons only
     "FEATURED PICK" category label above title

Search bar INSIDE hero (centered):
Width: 480px, Height: 48px
Position: 55% from left, 65% from top
Background: rgba(0,0,0,0.5)
Border: border-default
Backdrop-blur: 8px
Radius: 8px
Padding: 0 16px
Left: search icon (text-muted)
Right: clear × (only when has text)
Font: body-15, text-primary
Placeholder: "Search movies, shows, genres..."

BROWSE ROWS (same system as home):
Top 10 row first
Then: Action · Drama · Horror · Sci-Fi rows
Each row filtered by active genre pill

── SCREEN 5: MOVIE DETAIL MODAL ──

Overlay: rgba(0,0,0,0.85) + backdrop-blur 4px
Click outside → close

Modal: width min(860px, 90vw)
       max-height: 85vh
       overflow-y: auto
       background: bg-elevated (#232323)
       radius: 12px 12px 0 0
       shadow: modal
       Position: centered on screen

Close button: top-right 16px
32px circle, bg rgba(0,0,0,0.5)
White × icon 16px
Hover: bg rgba(0,0,0,0.7)

TOP SECTION (full-width, 16:9 ratio):
Backdrop image full bleed
Gradient bottom: transparent → bg-elevated

Content overlaid bottom-left (padding 24px):
Category label (small, purple)
Title: h1-32/700
Buttons: [▶ Play] [+ Watchlist] [♡ Like]
Runtime + Rating metadata

CONTENT SECTION (padding 28px):
Two-column layout (60% / 40%):

Left column:
Match + metadata row
Overview: body-14/400/1.6 text-secondary
Max 5 lines, expandable
"Cast: Actor 1, Actor 2, Actor 3" row
"Director: Name" row
"Genre:" + pill tags

Right column:
"More Like This" heading (shows 3 mini cards)
Platform + quality info
Audio/subtitle languages

BOTTOM: "More Like This" full row (3 cards)

── SCREEN 6: VIDEO PLAYER ──

Frame: 1440×900 (full screen)
Background: #000000

CONTROLS VISIBLE STATE:

TOP BAR (absolute, top 0, full width):
Height: 68px
Gradient: rgba(0,0,0,0.8) → transparent
Left: ← Back button (arrow + "Back", body-15 white)
Center: Movie title (body-15/600 white)
Right: ⚙ Settings (20px white icon)

EMPTY CENTER:
Film icon: 56px, rgba(255,255,255,0.04)
"Video player" text: body-16, rgba(255,255,255,0.06)
Centered both axes

BOTTOM BAR (absolute, bottom 0, full width):
Height: 96px
Gradient: transparent → rgba(0,0,0,0.9)
Padding: 0 32px 20px

Progress section:
Time left: "34:20 / 2:01:15" body-12 white (right align)
Track: 4px, rgba(255,255,255,0.2), radius 2px, full width
Fill: 4px, brand-purple, 35% width
Thumb: 14px circle, white, at fill end
       Hover: track expands to 6px

Scrub preview (on track hover):
80×45px thumbnail above cursor
Time code below thumbnail
bg-elevated, radius 4px

Controls row (below progress, gap 20px):
Left group:
  ⏮ -10s icon (22px white)
  ▶/⏸ Play/Pause (28px white, primary)
  ⏭ +10s icon (22px white)
  🔊 Volume icon (22px white)
  Volume slider: 80px track, bg rgba(255,255,255,0.2)
  Time: "34:20 / 2:01:15" body-12 text-muted
  
Right group (margin-left: auto):
  Next Episode button: label-13, border-default
  [HD ▼] badge: border-default, dropdown arrow
  CC subtitle toggle: 20px icon
  ⛶ Fullscreen: 22px icon

CONTROLS HIDDEN STATE:
All overlays: opacity 0
Cursor: none
Background: pure black
Empty center remains

── SCREEN 7: SEARCH PAGE ──

EMPTY STATE (no query):
Search header:
"Search" h2-24/700
Input: full width, 52px height, bg-input
Search icon left, text-primary
Clear × right (hidden when empty)
Font: body-16, text-primary

"Top Searches" below:
Label-11 uppercase, brand-purple
Grid: 4 columns, landscape cards
No hover popup here (direct navigate)
Subtle "🔥" trending icon on popular items

TYPING STATE (has query):
Input shows typed text + clear button
Below: instant results list
Each result: SearchResultItem component (designed above)
"No results for 'xyz'" empty state (if none)

RESULTS STATE (query complete):
Heading: "Results for 'horror'"
Count: "142 titles" (text-muted)
Filter row: [All] [Movies] [TV Shows]
Grid: 4 columns of standard cards
Pagination or infinite scroll indicator

── SCREEN 8: WATCHLIST PAGE ──

Heading: "My Watchlist" h1-32/700
Count: "24 titles saved" text-muted
Sort bar: [Date Added ▼] [A-Z] [Rating] pills

POPULATED STATE:
Grid: 5 columns landscape cards
Same hover popup as everywhere else
Cards show: X remove button on hover (top-right)

EMPTY STATE:
Center of page:
Bookmark icon: 64px, text-muted
"Your watchlist is empty" h2-24/700
"Movies you save will appear here" body-15 text-muted
[Browse Movies] → Primary button → /browse

── SCREEN 9: NOTIFICATIONS PANEL ──

Dropdown from bell icon
Width: 340px
Radius: 0 0 12px 12px (top flush with navbar)
Max-height: 480px, overflow-y: auto
Background: bg-elevated
Shadow: modal
Border: border-subtle

Header (sticky):
"Notifications" label-16/700
"Mark all read" brand-purple label-13 (right)
Border-bottom: border-subtle
Padding: 16px

Notification items:
3-5 items using NotificationItem component
"Unread" section first
"Earlier" section below (divider label)

Footer:
"View all notifications →" centered
Brand-purple, label-13, border-top border-subtle
Padding: 12px

════════════════════════════════════════
PAGE 4 — MOBILE SCREENS (390×844px)
════════════════════════════════════════

── MOBILE: HOME ──

No sidebar (hidden)
Bottom nav bar (fixed, bottom 0):
Height: 56px + safe area
Background: bg-page
Border-top: border-subtle
5 tabs: Home · Browse · Search · Watchlist · Profile
Active: brand-purple icon + brand-purple label
Inactive: text-muted icon + text-muted label
Icon: 22px, Label: label-10 below icon

Hero: height 60vh
Content: bottom 80px, left 20px, right 20px
Title: 28px/700 (not 68px)
Description: hidden on mobile (space)
Buttons: [▶ Play] + [+ Watchlist] only (2 buttons)
         Full width, stacked if needed

Cards: 2 per row grid layout (NOT horizontal scroll)
Gap: 6px
Padding: 0 16px

Section headers:
Padding: 0 16px
"See All" always visible (not hover-only)

── MOBILE: BROWSE ──

Genre pills: horizontal scroll (touch-friendly)
Pill height: 36px (larger touch target)
Hero banner: height 40vh
Search bar: full width below hero, not inside it

── MOBILE: VIDEO PLAYER ──

Portrait mode: standard layout adapted
Landscape mode: full screen controls same as desktop
Double-tap left/right: ±10s seek
Swipe down: minimize player (picture-in-picture)

════════════════════════════════════════
PAGE 5 — ALL STATES & VARIANTS
════════════════════════════════════════

Design EVERY state a user can encounter:

── LOADING STATES ──

App initial load:
Full screen bg-page
Platform S logo (40px, brand-purple)
Subtle pulse animation
Fade out after 1.2s

Hero loading:
Dark bg + gradient (no image yet)
Content: skeleton bars in correct positions
No flash — seamless into real content

Card row loading:
Section header: real (title loads instantly)
Cards: SkeletonCard components ×8
Shimmer: left → right animation

── ERROR STATES ──

API Error (card row):
Section header normal
Cards area: error message inline
"Failed to load · Retry ↺" label-13, text-muted
Retry button: Ghost SM, brand-purple

Network Error (full page):
Dark illustration (simple, abstract)
"Connection lost" h2-24/700
"Check your internet and try again" body-14
[↺ Retry] Primary button
Auto-retry countdown: "Retrying in 5s..."

Image Error (card thumbnail):
Dark gradient bg-card fill
Platform logo centered (20px, text-muted)
No broken image icon

── INTERACTION STATES ──

Heart/Watchlist toggle:
State A (not saved): ♡ empty, border-default
State B (saved): ❤ filled, brand-purple, border-brand
              bg: brand-purple-20
Animation between: scale 1→1.4→1 spring bounce
               + 6 tiny heart particles scatter

Genre pill active/inactive:
Active → brand-purple bg, white, no border
Inactive → border, text-secondary
Transition: background + border color, 200ms

Tab active underline:
Slides from old to new tab (not fade/swap)
Document: underline x position per tab

Card hover popup:
4 position variants (up/down/left-edge/right-edge)
Each shows exactly same content, different positioning
Delay: 500ms before appearing
Dismiss: immediate on mouse leave

════════════════════════════════════════
PAGE 6 — INTERACTIONS & PROTOTYPE
════════════════════════════════════════

Build Figma prototypes for these flows:

FLOW 1: Browse + Play
Home → hover card → click More Info → Modal
Modal → Play → Video Player → Back → Home

FLOW 2: Search
Navbar search click → search expands
Type query → results appear
Click result → Movie Detail Modal

FLOW 3: Watchlist
Hover card → click Heart → toast appears
Navigate to /watchlist → see saved movie
Hover card → click × remove → card disappears

FLOW 4: Genre Browse
Browse page → click Horror pill
Cards animate out → skeleton → Horror movies load
Click card → hover popup → More Info → Modal

FLOW 5: Continue Watching
Home → Continue Watching row → hover card
"Continue" button + progress shown
Click Play → Video Player at saved position

════════════════════════════════════════
PAGE 7 — DEV HANDOFF SPECS
════════════════════════════════════════

Create annotation frames for each component:

CARD COMPONENT SPEC:
- Exact dimensions labeled
- Spacing measurements (use Figma's redline)
- Color tokens (not hex — use token names)
- Font style names from library
- All variant conditions documented
- Mock data schema shown beside component:
  {
    id: number,
    title: string,
    posterPath: string,
    backdropPath: string,
    releaseDate: string,
    runtime: number,
    voteAverage: number,
    genres: Genre[],
    overview: string
  }

INTERACTION TIMING SPEC:
Document in a table:
  Hover card delay: 500ms
  Hover card appear: 250ms ease-out
  Hover card dismiss: immediate
  Card scale: 200ms cubic-bezier(0.4,0,0.2,1)
  Modal open: 300ms spring
  Toast appear: 300ms ease-out (slide right)
  Toast dismiss: 200ms + 3s delay
  Tab underline slide: 300ms cubic-bezier(0.4,0,0.2,1)
  Heart bounce: 400ms spring(stiffness:400,damping:20)
  Hero crossfade: 600ms ease-in-out
  Navbar glass: 400ms ease-in-out (on scroll)

API DATA MAPPING:
For each screen, show which component 
uses which API field:

HeroSection:
  backdrop_path → hero background image
  title → main title text
  overview → description paragraph
  vote_average × 10 → match score %
  release_date.slice(0,4) → year
  runtime → formatted duration

MovieCard:
  backdrop_path OR poster_path → thumbnail
  title → card title overlay
  release_date.slice(0,4) → year in popup
  vote_average × 10 → match % in popup
  runtime → duration badge

Document EVERY component → API field mapping.
This is the exact spec developers use to wire data.