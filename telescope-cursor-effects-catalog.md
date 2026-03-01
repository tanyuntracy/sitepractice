# Telescope.fyi — Complete Cursor/Mouse Interaction Effects Catalog

**Source:** https://telescope.fyi/  
**Method:** CSS source analysis, JavaScript bundle inspection, Vue component structure  
**Note:** Page is a Nuxt.js SPA; content loads dynamically. Analysis based on compiled assets.

---

## Global Infrastructure

### Mouse Position Tracking (JavaScript)
- **Location:** Main bundle (`DWF3tw4c.js`)
- **Implementation:** `window.addEventListener('mousemove', onMouseMove, { passive: true })`
- **Effect:** Global `mouse.x` and `mouse.y` updated via `clamp(clientX/clientY, 0, window.innerWidth/Height)`
- **Purpose:** Feeds cursor-following and potentially parallax effects site-wide
- **Type:** Cursor-following (data layer)

### Page Transition Cursor
- **CSS:** `html.is-transitioning { cursor: progress }`
- **Effect:** Default arrow becomes loading spinner during page transitions
- **Type:** State-based (transition)

---

## Section 1: Header / App Shell

*No dedicated header section in CSS; header appears to be part of layout.*

### Standard Interactive Elements
- **Buttons/Links:** `[role=button], button { cursor: pointer }` — default pointer on clickable elements
- **Disabled:** `:disabled { cursor: default }`

---

## Section 2: Hero (data-v-f71d0079)

**Structure:** `.hero` — 400svh height, sticky center content, scattered images + zoom center image

### 2A. Scattered Media Images — Hover / Pointer
- **Element:** `.hero .medias .media .hover`
- **CSS:** `cursor: pointer; top: -15%; right: -15%; bottom: -15%; left: -15%; position: absolute`
- **Effect:** Each of 12 scattered images has an extended hit area; cursor becomes pointer on hover
- **Type:** Hover-based
- **No custom cursor:** Uses default pointer

### 2B. Media Images — Click Behavior
- **Structure:** `.media` wraps `.img` and `.hover`; `.hover` is the interactive overlay
- **Effect:** Images are clickable (opens modal or navigates); no visible hover transform in CSS
- **Type:** Click-based

### 2C. Hero — Scroll Effects (No Mouse)
- **Elements:** `.hero .zoom-img`, `.hero .sticky .line span`, `.hero .medias .media`
- **Variables:** `--p1`, `--p2` (scroll progress)
- **Effect:** Zoom, line movement, media reveal driven by scroll (GSAP ScrollTrigger)
- **Type:** Scroll-based only; no mouse parallax in hero CSS

### 2D. Launch Button
- **Element:** `.launch`
- **Position:** `position: fixed` (desktop)
- **Effect:** Standard link/button; default pointer cursor
- **Type:** Hover/click-based

### 2E. Scroll Indicator
- **Element:** `.scroll` (icon + label)
- **Effect:** Visual only; no custom cursor
- **Type:** Scroll-based animation (icon rotates with scroll progress)

---

## Section 3: Slider (data-v-5a2fb63a)

**Structure:** `.slider` — 350svh, fullscreen circular slider with curator profiles

### 3A. Custom Cursor — Cursor-Following
- **Element:** `.slider .sticky .controls .cursor`
- **CSS:** 
  - `position: fixed; left: 0; top: 0; margin-left: -1.75rem; margin-top: -2.5rem`
  - `width: 3.5rem; height: 3.5rem; border-radius: 100%`
  - `background-color: var(--color-yellow); color: var(--color-black)`
  - `opacity: 0; transform: scale(0); pointer-events: none`
  - Desktop only (`display: none` on mobile)
- **Visual:** Yellow circle with chevron arrows (::before, ::after pseudo-elements)
- **Modifiers:** `.-prev` (left arrow), default (right arrow) — arrows rotate based on hover side
- **Effect:** Replaces default cursor when over slider; follows mouse via JS (uses global mouse tracking)
- **Type:** Cursor-following, hover-based activation
- **Activation:** Visible when `.is-ui-active` on slider; positioned via `left`/`top` from mousemove

### 3B. Controls — Click Areas
- **Element:** `.slider .sticky .controls`
- **CSS:** `cursor: pointer` (desktop, `@media (pointer:fine)`)
- **Layout:** Left half = prev, right half = next (desktop); centered buttons on mobile
- **Type:** Click-based (slide navigation)

### 3C. Thumbnails — Hover
- **Element:** `.slider .thumbnails .thumbnail-item`
- **CSS:** `:hover .thumbnail-item:last-child { flex: 1 }`; `:hover .thumbnail-item:hover { flex: 1 }`
- **Effect:** Hovered thumbnail expands; others shrink
- **Type:** Hover-based
- **Cursor:** Default (no custom cursor)

### 3D. Dots Navigation
- **Element:** `.slider .dots li button`
- **Effect:** Standard button hover; no custom cursor
- **Type:** Click-based

---

## Section 4: About (data-v-e151c6ed)

**Structure:** `.about` — intro text + product cards column

### 4A. Custom Cursor — Cursor-Following
- **Element:** `.about .top .cursor`
- **CSS:**
  - `position: fixed; visibility: hidden; z-index: 3`
  - Mobile: `height: 1.35rem; width: 1.35rem`
  - Desktop: `height: 2rem; width: 2rem`
- **States:**
  - `.is-active` → `visibility: visible`
  - `.is-active .cursor .tt-icon` → `transform: rotate(0) scale(1)`
  - `.is-hidden .cursor .tt-icon` → `transform: rotate(0) scale(0)`
- **Icon:** `.tt-icon` — `transform: rotate(45deg) scale(0)` by default; scales in with bounce
- **Effect:** Small icon (likely plus/cross) follows mouse when About section is active
- **Type:** Cursor-following, scroll-based activation (visible when section in view)
- **Scope:** Only when `.about .top` is active (scroll-triggered)

### 4B. Product Cards — Scroll Parallax
- **Element:** `.about .column .ui-productCard .img img`
- **CSS:** `transform: translateY(calc(var(--shift) * var(--px) * -1))`
- **Effect:** Images shift vertically based on scroll (`--px` from ScrollTrigger)
- **Type:** Scroll-based parallax; no mouse

### 4C. Product Card Buttons — Hover
- **Element:** `.ui-productCard .media button`
- **CSS:** `:hover):before { transform: scale(1.1) }`
- **Effect:** Bookmark/plus button scales on hover
- **Type:** Hover-based
- **Cursor:** Default pointer

### 4D. Mobile Card Carousel
- **Element:** `.about .column` (mobile)
- **CSS:** `transform: translate3d(calc((var(--card-width)*-2.5 - 1.8rem + 50vw)*var(--x)), 0, 0)`
- **Effect:** Horizontal scroll/carousel; `--x` likely from touch/scroll
- **Type:** Scroll/touch-based

---

## Section 5: Curation (data-v-1b6203d2)

**Structure:** `.curation` — alternating yellow/beige tilted sections with text

### 5A. Section Structure
- **CSS:** `pointer-events: none` on `.curation` (entire section)
- **SVG/Content:** `pointer-events: none` on decorative SVGs
- **Effect:** No direct mouse interaction; section is non-interactive
- **Type:** None (scroll-only)

### 5B. Text Elements
- **Element:** `.curation .section .el`
- **Effect:** Transform based on `--dir`, `--c-dir` (scroll-driven)
- **Type:** Scroll-based; no cursor effects

---

## Section 6: Zoom / Discover (data-v-c601d33e)

**Structure:** `.zoom` — 800svh, large masked image with curator list

### 6A. Zoom Image
- **Element:** `.zoom .zoom-img`
- **Effect:** Scale and position driven by `--p2` (scroll)
- **Type:** Scroll-based; no mouse interaction

### 6B. Slider List
- **Element:** `.zoom .slider .list li`
- **Effect:** Active item gets full opacity; others faded
- **Type:** Scroll-based (list scrolls with page)

### 6C. Card (Desktop)
- **Element:** `.zoom .slider .card`
- **Effect:** Small profile card; standard hover/click
- **Type:** Hover/click-based; default cursor

### 6D. Thumbnail Items
- **Element:** `.zoom .slider .thumbnail-item`
- **Effect:** Click to select curator
- **Type:** Click-based; default cursor

**No custom cursor in Zoom section.**

---

## Section 7: Waitlist (data-v-da6eccb3)

**Structure:** `.waitlist` — "Join the waitlist" with email signup

### 7A. Canvas Effect
- **Element:** `canvas` (direct child of `.waitlist`)
- **CSS:** `position: absolute; top/right/bottom/left: 0; pointer-events: none`
- **Effect:** Full-section canvas overlay; likely draws scattered images or particles
- **Type:** Canvas-based visual; no pointer events (clicks pass through)
- **Note:** Canvas may use `mousemove` for internal effects (e.g. parallax); not visible in CSS

### 7B. Effect Container
- **Element:** `.waitlist .effect`
- **CSS:** `pointer-events: none; position: absolute`
- **Child:** `.effect .item` — `opacity: 0; visibility: hidden` (hidden)
- **Effect:** Container for canvas or hidden DOM elements; non-interactive
- **Type:** Visual layer only

### 7C. Waitlist Block / Button
- **Element:** `.waitlist .waitlist-block .btn`
- **CSS:** Extended hit area via `::before` (top/right/bottom/left: -3rem)
- **Effect:** Standard form/button; default cursor
- **Type:** Click-based

### 7D. Scroll Animations
- **Elements:** `.waitlist .intro-title .svg-word`, `.waitlist .word`
- **Effect:** Text animates in on scroll (`.is-active`)
- **Type:** Scroll-based

**No custom cursor in Waitlist section.**

---

## Section 8: App Footer (data-v-fe098279)

**Structure:** `.app-footer` — fixed bottom bar with brand, buttons, links

### 8A. Footer Container
- **CSS:** `pointer-events: none` on `.app-footer`
- **Exception:** `a, button { pointer-events: all }` — only interactive elements receive clicks
- **Effect:** Background/container doesn’t block clicks; buttons/links do
- **Type:** Layout/UX

### 8B. Buttons & Links
- **Elements:** `.app-footer .buttons a`, `.app-footer .socials a`, etc.
- **Effect:** Standard hover (e.g. `.tt-icon { transform: scale(1.1) }` on social links)
- **Type:** Hover/click-based; default cursor

### 8C. Credit Link
- **Element:** `.app-footer .credit`
- **CSS:** `:hover { color: var(--color-gray) }`
- **Type:** Hover-based

### 8D. Link Underline
- **Element:** `.app-footer .link`
- **CSS:** `::before` scales from 0 to 1 on hover
- **Type:** Hover-based

**No custom cursor in Footer.**

---

## Section 9: Modals (data-v-d322073c, data-v-e62bd07b, etc.)

### 9A. Modal Backdrop
- **Element:** `.tt-modal .bg`
- **CSS:** `cursor: pointer` — click to close
- **Type:** Click-based

### 9B. Success Overlay
- **Element:** `.tt-modal .success-bg::after`
- **CSS:** `cursor: pointer` — clickable overlay
- **Type:** Click-based

### 9C. Form Inputs / Buttons
- **Effect:** Standard form controls; default cursor
- **Type:** Hover/click-based

---

## Section 10: Shared Components

### 10A. UI Button (data-v-92dc713c)
- **Hover:** Background/color swap; `.chars div` animates (slideUpDown)
- **Cursor:** Default pointer
- **Type:** Hover-based

### 10B. Product Card (data-v-2c63185d)
- **Hover:** `.media button::before { transform: scale(1.1) }`
- **Type:** Hover-based

### 10C. Parallax Media (data-v-ad6b4b7d)
- **Element:** `.ui-parallaxMedia`
- **Effect:** `transform: translateY(calc(var(--shift) * var(--px) * -1))` — scroll parallax
- **Type:** Scroll-based; no mouse

---

## Summary Table

| Section        | data-v     | Custom Cursor | Cursor-Following | Hover Effects      | Canvas | Parallax Mouse |
|----------------|------------|---------------|------------------|--------------------|--------|----------------|
| Hero           | f71d0079   | No            | No               | Yes (pointer)      | No     | No             |
| Slider         | 5a2fb63a   | Yes (yellow)  | Yes              | Yes (thumbnails)   | No     | No             |
| About          | e151c6ed   | Yes (icon)    | Yes              | Yes (cards)        | No     | No             |
| Curation       | 1b6203d2   | No            | No               | No                 | No     | No             |
| Zoom           | c601d33e   | No            | No               | Yes (default)      | No     | No             |
| Waitlist       | da6eccb3   | No            | No               | No                 | Yes    | Unknown (JS)   |
| Footer         | fe098279   | No            | No               | Yes (links)        | No     | No             |
| Modals         | various    | No            | No               | Yes (backdrop)     | No     | No             |

---

## Key Findings

1. **Custom cursors:** 2 — Slider (yellow circle with arrows), About (small icon).
2. **Cursor-following:** Both custom cursors use `position: fixed` and global mouse tracking.
3. **Canvas:** 1 — Waitlist section; `pointer-events: none`; possible mouse-driven effects in JS.
4. **Parallax mouse:** Not clearly implemented in CSS; global `mouse.x`/`mouse.y` suggest it may exist in JS.
5. **Scroll parallax:** Hero, About, Zoom, Curation use scroll-driven transforms.
6. **Hover effects:** Buttons, cards, thumbnails, links use standard hover (scale, color, flex).
