You are a Principal Product Designer with 12+ years 
experience shipping design systems for Netflix, 
Disney+, Apple TV+, and Prime Video.

You are doing a FULL Figma design audit and redesign 
of an existing streaming platform UI.

Your job: Take what exists and make it so good that 
a Netflix designer would be proud to ship it.

No compromises. No "good enough". 
Design like millions of people will use this daily.

════════════════════════════════════════
PHASE 1 — DESIGN SYSTEM FOUNDATION
(Build this FIRST before touching any screens)
════════════════════════════════════════

CREATE A FIGMA DESIGN SYSTEM PAGE called:
"🎨 Design System — Movie Platform"

── 1A. COLOR SYSTEM ──

Create color styles with EXACT values:

BACKGROUNDS:
  bg/page          #141414   ← base page
  bg/card          #181818   ← card surface
  bg/elevated      #232323   ← modals, panels
  bg/overlay       rgba(0,0,0,0.85) ← overlays
  bg/glass         rgba(20,20,20,0.92) ← navbar glass

BRAND:
  brand/purple     #8b5cf6   ← primary accent
  brand/purple-dim rgba(139,92,246,0.2) ← bg tint
  brand/purple-glow rgba(139,92,246,0.4) ← borders

SEMANTIC:
  status/match-green  #46d369  ← high match (Netflix)
  status/mid-yellow   #f59e0b  ← medium match
  status/low-red      #ef4444  ← low match / error
  status/new-blue     #3b82f6  ← new badge

TEXT:
  text/primary     #e5e5e5   ← main content
  text/secondary   rgba(255,255,255,0.65)
  text/muted       rgba(255,255,255,0.35)
  text/disabled    rgba(255,255,255,0.2)
  text/inverse     #141414   ← on white buttons

BORDERS:
  border/subtle    rgba(255,255,255,0.06)
  border/default   rgba(255,255,255,0.12)
  border/strong    rgba(255,255,255,0.25)
  border/brand     rgba(139,92,246,0.5)

── 1B. TYPOGRAPHY SYSTEM ──

Create text styles using "DM Sans" or "Inter":
(Import from Google Fonts in Figma)

DISPLAY:
  display/hero      72px / 800 / -1.5px tracking
  display/title     48px / 800 / -1px tracking

HEADING:
  heading/xl        32px / 700 / -0.5px
  heading/lg        24px / 700 / -0.3px
  heading/md        20px / 700 / 0px
  heading/sm        16px / 600 / 0px

BODY:
  body/lg           16px / 400 / 0.1px / 1.6 leading
  body/md           14px / 400 / 0.1px / 1.5 leading
  body/sm           13px / 400 / 0.1px / 1.4 leading

LABEL:
  label/lg          14px / 600 / 0.5px
  label/md          12px / 600 / 1px
  label/sm          11px / 700 / 1.5px uppercase
  label/xs          10px / 700 / 2px uppercase

Special:
  hero/gothic       72px / 700 (UnifrakturMaguntia)
  
── 1C. SPACING SYSTEM ──

Use 4px base grid. Create spacing tokens:

  space/1    4px
  space/2    8px
  space/3    12px
  space/4    16px
  space/5    20px
  space/6    24px
  space/8    32px
  space/10   40px
  space/12   48px
  space/16   64px
  space/20   80px

── 1D. ELEVATION / SHADOWS ──

Effect styles:
  shadow/card-hover  0 6px 30px rgba(0,0,0,0.8)
  shadow/modal       0 24px 80px rgba(0,0,0,0.9)
  shadow/tooltip     0 4px 16px rgba(0,0,0,0.6)
  shadow/button      0 4px 20px rgba(139,92,246,0.3)
  shadow/glow-purple 0 0 24px rgba(139,92,246,0.4)
  blur/glass         backdrop blur 20px

── 1E. BORDER RADIUS TOKENS ──

  radius/xs    3px   ← badges, HD tags
  radius/sm    4px   ← cards (Netflix standard)
  radius/md    6px   ← buttons
  radius/lg    10px  ← sidebar active
  radius/xl    12px  ← modals, panels
  radius/2xl   16px  ← large modals
  radius/full  999px ← pills, avatars, circles

── 1F. COMPONENT LIBRARY ──

Build these BASE components first:

ATOMS (smallest units):

1. Badge variants:
   - [NEW] blue, [HD] outlined, [4K] outlined
   - [98% Match] green filled
   - [TOP 10] red, [AWARD] gold
   - [16+] outlined, [PG] outlined
   Width: auto, Height: 20px, radius/xs

2. Genre Pill:
   - Default: transparent + border/default
   - Active: brand/purple bg + white text
   - Hover: border/brand
   Height: 32px, padding: 0 14px, radius/full

3. Icon Button (circle):
   - Size SM: 30px circle
   - Size MD: 36px circle  
   - Size LG: 44px circle
   - States: default / hover / active / disabled
   - Variants: play / heart / thumbs / info / add

4. CTA Button variants:
   - Primary: white bg, black text
   - Secondary: rgba(109,109,110,0.7) bg
   - Ghost: transparent, white border
   - Brand: purple bg, white text
   - Danger: red bg, white text
   Height: 44px, padding: 0 24px, radius/md

5. Avatar:
   - Sizes: 28px / 36px / 44px / 64px
   - States: default / with ring / with badge
   - Border: 2px brand/purple when active

6. Match Score Bar:
   - Full width bar, 3px height
   - Fill color changes: green/yellow/red
   - Label above: "98% Match"
   - Year + runtime metadata inline

7. Progress Bar (watch progress):
   - Height: 3px
   - Fill: brand/purple
   - Background: rgba(255,255,255,0.2)
   - Shows % watched

MOLECULES (combinations):

8. Card Thumbnail:
   - Image 16:9 (landscape) OR 2:3 (portrait)
   - Hover state with dark overlay + play center
   - Duration badge: top-right corner
   - Progress bar: absolute bottom
   - Title: absolute bottom-left
   - Border-radius: radius/sm (4px)

9. Hover Card Popup:
   - Width: 280px
   - Thumbnail top (16:9)
   - Info section: title, match bar, meta
   - Button row: play + heart + info
   - Appears above OR below card
   - Drop shadow/modal

10. Section Header:
    - Left: label (UPPERCASE purple) + title
    - Right: "See All →" (appears on hover)
    - Spacing: 60px left padding

11. Toast Notification:
    - Width: 320px
    - Dark bg + purple left border (3px)
    - Icon + message + dismiss X
    - Auto-dismiss progress bar at bottom
    - Position: top-right fixed

12. Skeleton Card:
    - Same dimensions as real card
    - Shimmer animation overlay
    - 3 variants: landscape / portrait / row item

13. Notification Item:
    - 48px thumbnail left
    - Title + subtitle + timestamp
    - Unread dot: 6px brand/purple right
    - Hover: subtle bg highlight

════════════════════════════════════════
PHASE 2 — REDESIGN EACH SCREEN
════════════════════════════════════════

Frame all screens at 1440×900 (desktop primary)
Also create 390×844 mobile frames for each.

── SCREEN 1: HOME PAGE ──

Layer stack (bottom to top):

LAYER 1 — SIDEBAR (fixed left, 54px wide):
Use auto layout, vertical
  Top group:
    Logo mark: 54×68px zone, "S" centered
    ─────────────────────────────────
    Nav icons (gap: 4px):
      Each icon cell: 54×48px
      Icon: 20px centered
      Active: purple tinted bg (40×40 rounded)
              left accent bar 3px purple
      Inactive: icon only, 45% opacity
      Hover: subtle bg reveal
      
    Icons in order:
      Home (active)
      Grid/Browse
      Heart/Watchlist
      BarChart/Analytics
      User/Profile
      Calendar
      Lightning/Activity
      Bell/Notifications
      
  Bottom group (pushed to bottom):
    Settings gear icon
    Avatar 36px circle + online dot

LAYER 2 — NAVBAR (fixed top, left:54px):
  Height: 68px
  Background: transparent (on hero)
  
  Left section:
    "Home" link — white, 600 weight, dot below
    "Browse" link — 65% opacity
    "Kids" link — 65% opacity
    "Support" link — 65% opacity
    "FAQ" link — 65% opacity
    Nav link font: 14px/500
    Gap between: 24px
    
  Right section (gap: 20px):
    Search icon 20px
    Bell icon 20px + badge (red dot, "2")
    Avatar 32px + chevron

LAYER 3 — HERO (full bleed, 100vh):

  Background image (full bleed):
    Movie backdrop: object-fit cover
    Position: center right
    
  Gradient overlays (2 layers):
    Horizontal: rgba(0,0,0,0.95) → transparent
    Vertical bottom: transparent → #141414
    
  Content (position: bottom 15%, left 60px):
    Platform badge (S icon + "PLATFORM ORIGINAL")
      icon: 20px purple circle
      text: 11px/700/2px tracking uppercase
      gap: 8px, mb: 10px
      
    TITLE (gothic font if show, bold if movie):
      Font: clamp(40px,5vw,68px) / 800
      Color: white
      Line-height: 1.05
      MB: 12px
      Text shadow: 0 4px 24px rgba(0,0,0,0.8)
      MAX 2 lines — truncate with ellipsis
      
    Metadata row (MB: 8px):
      [98% Match] green filled badge
      · 2024 · 2h 15m · [HD] · [16+]
      
    Description (MB: 20px):
      14px/400/1.6 leading
      rgba(255,255,255,0.75)
      Max 3 lines, line-clamp
      Max-width: 480px
      
    Button row (gap: 12px):
      [▶ Play Now] → primary white button
      [+ Watchlist] → secondary grey button
      [ⓘ More Info] → ghost button
      
    Progress dots (absolute bottom: 32px):
      5 dots: active=28×4px pill, inactive=6px circle
      
  Ambient glow (optional):
    Bottom-left radial gradient
    Movie accent color at 20% opacity
    Adds cinematic depth

LAYER 4 — SEASON TABS (sticky, below hero):
  Height: 52px
  Background: transparent (sticky: glass blur)
  Padding: 0 60px
  
  Tab items (gap: 24px):
    "Season 1" active: white/700 + sliding underline
    "Season 2" inactive: 50% opacity / 400 weight
    Episode count badge: 18px height, rounded, muted
  
  Active underline:
    Height: 2px, purple gradient
    Smooth slide animation between tabs

LAYER 5 — CARD ROWS:

Each row block:
  MB between rows: 32px
  
  Section header:
    Purple label: 10px/700/2px UPPERCASE
    Title: 18px/700 #e5e5e5
    "See All →" right: 13px purple (hover reveal)
    
  Cards container (horizontal scroll):
    Padding: 0 60px
    Gap: 8px
    Overflow-x: scroll, hidden scrollbar
    
  STANDARD CARD (landscape 16:9):
    Width: 220px
    Height: 124px (maintains 16:9)
    Border-radius: 4px
    Overflow: hidden
    
    Default state:
      Thumbnail image
      Subtle gradient bottom
      Duration badge: top-right
      Title: absolute bottom 8px left 8px
      Font: 12px/600 white
      
    Hover state (show as separate frame):
      Scale: 1.15× centered
      Z-index: above siblings
      After 500ms delay
      
    Hover card popup (280px wide):
      Appears above or below based on position
      See component spec above

SPECIAL ROW — TOP 10:
  Portrait cards (2:3 ratio)
  Width: 140px, Height: 210px
  Large rank number BEHIND card:
    Font-size: 160px / 900 weight
    -webkit-text-stroke: 3px rgba(255,255,255,0.5)
    Color: transparent (outlined only)
    Position: absolute, left:-25px, bottom:-20px
  Card overlaps number slightly (ml: 35px)

SPECIAL ROW — CONTINUE WATCHING:
  Same card size as standard
  PURPLE progress bar at card bottom (3px)
  "X min left" badge overlay bottom-right
  "Remove" × button top-right on hover

── SCREEN 2: BROWSE PAGE ──

Replace Season Tabs with Genre Pills:
  Pill style: 32px height, 14px padding
  Active: purple filled
  Inactive: outlined
  Sticky below navbar
  Horizontally scrollable

Browse Hero Banner:
  Height: 55vh (shorter than home)
  Full-bleed backdrop
  "Find Your Next Obsession" headline
  Search bar centered inside hero:
    Width: 480px, height: 48px
    Glass morphism style
    Icon left + input + clear button
    Placeholder: "Search movies, shows..."
    
Rows below:
  Top 10 row first
  Then genre rows based on filter

── SCREEN 3: MOVIE DETAIL MODAL ──

Trigger: clicking "More Info" ⌄ button

Overlay:
  rgba(0,0,0,0.85) backdrop + blur(4px)
  Click outside → close

Modal:
  Width: min(860px, 90vw)
  Max-height: 85vh, overflow-y: auto
  Background: #181818
  Border-radius: 12px
  No border
  box-shadow/modal

TOP SECTION (full width, 16:9):
  Backdrop image
  Gradient overlay bottom
  Positioned over image (bottom-left):
    Title: 36px/700 white
    Buttons: [▶ Play] [+ Watchlist] [♡ Like]
    Runtime + year + rating

CONTENT SECTION (padding: 24px 28px):
  Two-column layout:
  
  Left column (60%):
    [98% Match] · 2024 · 2h 15m · [HD] · [16+]
    Overview paragraph: 14px/400/1.6
    
    Cast row: "Starring: Actor1, Actor2, Actor3"
    font: 13px, label: muted, value: white
    
    Director: "Directed by: Name"
    
  Right column (40%):
    "Genres:" + pills
    "Available in:" + quality badges
    "Audio:" + languages
    "Subtitles:" + languages
    
  Full-width below:
    "More Like This" heading
    Horizontal mini card row (6 cards)

── SCREEN 4: VIDEO PLAYER ──

Full screen black (#000000)

TOP BAR (absolute, fades out):
  Height: 64px
  Gradient: rgba(0,0,0,0.8) → transparent
  [← Back] · [Movie Title] · [⚙ Settings]

CENTER:
  Empty black canvas
  Subtle "▶" ghost icon 80px centered
  Color: rgba(255,255,255,0.05)

BOTTOM CONTROLS (absolute, fades out):
  Gradient: transparent → rgba(0,0,0,0.9)
  Height: 96px
  Padding: 0 32px 20px
  
  Progress bar row:
    Track: 4px, rgba(255,255,255,0.2)
    Fill: 4px, #8b5cf6
    Thumb: 14px circle, white
    Time: "34:20 / 2:01:15" right of bar
    Hovering bar: expands to 6px
    Scrub preview thumbnail appears on hover
    
  Controls row:
    Left: [⏮-10s] [▶/⏸] [⏭+10s] [🔊 ───]
    Center: "Movie Title — Episode Name"
    Right: [Next Episode] [HD] [CC] [⛶]
    
    Icons: 22px white
    Play/Pause: 28px (larger)
    Font: 13px

── SCREEN 5: SEARCH PAGE ──

Triggered from navbar search icon

Full page transition:
  Dark overlay slides in from right
  Or: navbar expands to full search mode

Search header:
  "Search" title + X close
  Search input: full width, 48px height
  Auto-focus on open
  
Results layout:
  If query empty: "Top Searches" grid
  If typing: instant results list
  If results: full card grid

Top Searches (empty state):
  4×2 grid of popular movie cards
  No hover popup — direct navigate on click
  
Search results grid:
  4 columns, 16:9 cards
  Title below each card
  Match score badge

No results state:
  Search icon large, muted
  "No results for 'xyz'"
  "Try: Action · Horror · Sci-Fi" pill suggestions

════════════════════════════════════════
PHASE 3 — MOTION & INTERACTION SPECS
════════════════════════════════════════
Document in Figma as Prototype + annotations:

TIMING SCALE:
  Instant:   0ms    (toggle states)
  Fast:      150ms  (tooltips, micro)
  Normal:    250ms  (hovers, shows)
  Slow:      400ms  (panels, modals)
  Ambient:   600ms  (hero crossfade)
  Story:     1000ms (page transitions)

EASING:
  Bounce in:  cubic-bezier(0.34,1.56,0.64,1)
  Ease out:   cubic-bezier(0,0,0.2,1)
  Ease in:    cubic-bezier(0.4,0,1,1)
  Standard:   cubic-bezier(0.4,0,0.2,1)

KEY ANIMATIONS TO PROTOTYPE:

1. Card hover: 500ms delay → scale(1.15) + popup
2. Hero auto-rotate: 8s → crossfade 600ms
3. Modal open: scale(0.9)→1 + opacity 0→1, 300ms
4. Sidebar active: left bar slides in 150ms
5. Tab switch: underline slides 300ms
6. Toast in: translateX(100%)→0, 300ms ease-out
7. Skeleton shimmer: 1.5s linear infinite
8. Heart click: scale(1.4)→1 spring bounce
9. Image load: opacity 0→1, 400ms
10. Page transition: opacity 0→1, 250ms

════════════════════════════════════════
PHASE 4 — FIGMA FILE ORGANIZATION
════════════════════════════════════════

Pages structure:
  📄 Cover (project overview + team)
  🎨 Design System
  🖥 Desktop Screens
  📱 Mobile Screens
  🔄 Interactions & Prototypes
  🗂 Archive (old versions)

Frame naming convention:
  Desktop/Home — Hero
  Desktop/Home — Cards
  Desktop/Browse — Default
  Desktop/Browse — Genre Active
  Desktop/Player — Controls Visible
  Desktop/Player — Controls Hidden
  Mobile/Home — Hero
  Mobile/Home — Cards
  Mobile/Browse
  Component/Card — Default
  Component/Card — Hover
  Component/Modal — Movie Detail
  State/Empty — Watchlist
  State/Error — Network

Annotation style:
  Use FigJam sticky notes or Figma annotations
  Color code: 
    🔴 Red = critical UX issue
    🟡 Yellow = improvement needed
    🟢 Green = approved, ship ready
    🔵 Blue = interaction note

════════════════════════════════════════
QUALITY BAR — BEFORE MARKING DONE:
════════════════════════════════════════
Every screen passes this test:

THE NETFLIX TEST:
  Would a Netflix designer be embarrassed 
  to show this in a design review?
  If YES → not done yet.
  
THE GRANDMA TEST:
  Could a non-tech user figure out how 
  to find and play a movie in under 30s?
  If NO → not done yet.

THE DARK ROOM TEST:
  Does this look stunning on a 65" OLED TV 
  in a completely dark room?
  The contrast, the colors, the spacing —
  does it feel cinematic?
  If NO → not done yet.

THE MOTION TEST:
  Does every transition feel intentional?
  Nothing jarring, nothing missing,
  nothing that feels like a prototype.
  If NO → not done yet.