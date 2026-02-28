---
name: Simple Case Study Site
overview: High-craft single-page design case study with scroll animations, lazy-loaded media, Vite vanilla, GitHub Pages, GoDaddy custom domain. Built from Figma node 1779:13392. Parallelized across 4 agents.
todos:
  - id: phase0-scaffold
    content: Scaffold Vite project, empty files, config, deploy workflow
    status: pending
  - id: phase1-agent-a
    content: "Agent A: complete style.css (tokens + components + responsive + animations)"
    status: pending
  - id: phase1-agent-b
    content: "Agent B: complete main.js (scroll observer + lazy video + first-title loader)"
    status: pending
  - id: phase1-agent-c
    content: "Agent C: Figma screenshots (~28 assets) for all sections → public/assets/"
    status: pending
  - id: phase1-agent-d
    content: "Agent D: HTML partials — _sections/01-title.html through 07-nav.html"
    status: pending
  - id: phase2-assembly
    content: "Assembly: merge partials into index.html with <main> wrapper + font preload, verify dev server"
    status: pending
  - id: phase3-review
    content: "Review: visual accuracy vs Figma at 1280px, animations, Lighthouse 90+, responsive, cross-browser"
    status: pending
  - id: phase4-deploy
    content: "Deploy: git init, GitHub repo tanyuntracy/sitepractice, push, verify Pages"
    status: pending
isProject: false
---

# Design Case Study Site -- Execution-Ready Plan

## What I'm Building

A high-craft, single-page design case study site from [Figma node 1779:13392](https://www.figma.com/design/HTTYQZgKdIPgYe6ds9zDJT/Draft---notes?node-id=1779-13392&m=dev). Long vertical scroll (~21,700px in Figma at 1280px wide), image and video heavy, with scroll-triggered text animations and a floating sticky nav card (310px centered, not a full-width bar). Includes a review/iteration quality gate before deploy. **Built with 4 parallel agents for ~3x speedup.**

## Decisions

- **Stack**: Vite vanilla (HTML + CSS + JS). No framework.
- **Font**: Inter from Google Fonts (400 + 500 weights -- verified from Figma design context). Loaded via `<link>` in HTML head (NOT `@import` in CSS -- avoids render-blocking chain).
- **Assets**: Figma MCP screenshots as placeholders (~28 images). User replaces with production exports later.
- **Videos**: Containers built with lazy-load pattern (`data-src` + poster). User drops MP4 files into `public/assets/` later.
- **Text**: Lorem Ipsum kept as-is from Figma. User replaces later.
- **Animations**: Fade-up + clip-reveal hybrid on section titles.
- **Hosting**: GitHub Pages (free, Fastly CDN). I create the repo and push.
- **Domain**: User buys on GoDaddy. Plan includes full DNS instructions.

---

## Permissions

### Upfront (approve once at the start, covers Phases 0-3)

I'll request all of these in a single batch before starting work:

- **Shell / npm**: Scaffold project, install deps, run dev server, build
- **Network**: npm install, Google Fonts fetch during dev
- **Figma MCP**: Extract screenshots for placeholder images (already connected)
- **Git write**: `git init` + local commits only (NO push until Phase 4)

These cover everything through local development and review. No code leaves your machine until you explicitly approve deploy.

### Deferred (require your individual approval later)

- **Phase 4 -- Deploy**: I'll pause and ask before running `gh repo create tanyuntracy/sitepractice` + `git push`. You review the local build first, then greenlight.
- **Domain setup**: Manual -- you purchase the domain and configure DNS yourself whenever ready.

**Git safety**: All git operations target `tanyuntracy/sitepractice` (personal). I will verify with `gh auth status` and `git remote -v` before any push to ensure nothing goes to an organization.

---

## Parallelization Architecture

### Why this works

Every agent writes to **different files** and reads from the **same contract** (the CSS class names and HTML patterns documented in this plan). No agent needs another agent's output file. The only sequential gates are Scaffold (creates the file structure) and Assembly (merges the partials).

### Dependency graph

```
Phase 0: Scaffold (sequential, ~5 min)
    │
    ├──→ Agent A: style.css ─────────────────┐
    ├──→ Agent B: main.js ───────────────────┤
    ├──→ Agent C: Figma → public/assets/ ────┤ Phase 1 (4 agents parallel, ~20-25 min wall clock)
    └──→ Agent D: _sections/*.html ──────────┤
                                              │
Phase 2: Assembly (sequential, ~10 min) ◄────┘
    │
Phase 3: Review & fix (~30-45 min)
    │
Phase 4: Deploy (~10 min)
```

### Agent assignments


| Agent     | Writes to                                                 | Reads from                                                                    | Est. time |
| --------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- | --------- |
| A: CSS    | `style.css`                                               | This plan (Design Spec + Component Library)                                   | 20-25 min |
| B: JS     | `main.js`                                                 | This plan (class names: `.animate-on-scroll`, `.title-reveal`, `.lazy-video`) | 10-15 min |
| C: Assets | `public/assets/*.webp` (~28 files)                        | Figma MCP (node IDs from Asset Manifest below)                                | 10-15 min |
| D: HTML   | `_sections/01-title.html` through `_sections/07-nav.html` | This plan (HTML patterns + asset paths)                                       | 20-25 min |


The critical path is **max(Agent A, Agent D) + Assembly + Review + Deploy = ~65-95 min**.

### Time estimate (parallel)


| Phase                   | Wall clock     | What happens                                  |
| ----------------------- | -------------- | --------------------------------------------- |
| Phase 0: Scaffold       | 5 min          | 1 agent creates project structure             |
| Phase 1: Parallel build | 20-25 min      | 4 agents run simultaneously                   |
| Phase 2: Assembly       | 10 min         | 1 agent merges partials → index.html          |
| Phase 3: Review & fix   | 30-45 min      | Visual check, Lighthouse, responsive, iterate |
| Phase 4: Deploy         | 10 min         | Git, GitHub, Pages                            |
| **Total wall clock**    | **~75-95 min** | **~3x faster than sequential**                |


### The contract (how agents stay in sync)

All agents work from two shared references in this plan:

1. **Design Spec** (below) -- exact colors, typography, spacing from Figma
2. **CSS Component Library spec** (below) -- class names, CSS rules, HTML patterns

No agent needs to read another agent's output. If Agent D writes `<div class="info-block">`, it trusts that Agent A will have defined `.info-block` with the correct CSS. Both reference the same spec.

---

## Design Spec (extracted from Figma -- source of truth)

### Colors

- Primary text: `#1a1915`
- Subdued text: `rgba(26, 25, 21, 0.75)` (= #1a1915 at 75% opacity)
- Background: `#ffffff`
- Dark section BG: `#07103b`
- CTA button BG: `#1a1915`
- CTA button text: `#ffffff`

### Typography (all Inter from Google Fonts)


| Role           | Font  | Size | Weight        | Line-height | Tracking | Color               |
| -------------- | ----- | ---- | ------------- | ----------- | -------- | ------------------- |
| Page title     | Inter | 56px | Regular (400) | 1.2         | -1.12px  | #1a1915             |
| Section title  | Inter | 56px | Regular (400) | 1.2         | -1.68px  | #1a1915             |
| Section tags   | Inter | 20px | Medium (500)  | 1.4         | -0.2px   | rgba(26,25,21,0.75) |
| Card label     | Inter | 20px | Medium (500)  | 1.4         | -0.2px   | rgba(26,25,21,0.75) |
| Body large     | Inter | 32px | Regular (400) | 1.4         | -0.32px  | #1a1915             |
| Body / sidebar | Inter | 16px | Regular (400) | 1.3         | 0        | #1a1915             |
| Meta label     | Inter | 14px | Regular (400) | 1.4         | 0.14px   | rgba(26,25,21,0.75) |
| Meta value     | Inter | 16px | Regular (400) | 1.3         | 0        | #1a1915             |
| Nav name       | Inter | 20px | Medium (500)  | 1.4         | -0.2px   | #1a1915             |
| Nav small      | Inter | 14px | Regular (400) | 1.4         | 0.14px   | rgba(26,25,21,0.75) |
| CTA button     | Inter | 14px | Regular (400) | 1.4         | 0.14px   | #ffffff             |


### Layout Measurements (exact from updated Figma metadata)

**Page frame**: 1280px wide, 21702px tall
**Content area**: 1240px wide, centered with 20px margin each side (x=20 in Figma)

**Global vertical rhythm** (exact Figma values):


| Spacing role            | Exact value | Where used                                          |
| ----------------------- | ----------- | --------------------------------------------------- |
| Section-to-section gap  | **240px**   | Between S1→S2, S2→S3, S3→S4, S4→End                 |
| Within-section sub-gap  | **160px**   | Hero-section→detail, detail→detail, project→project |
| Within hero-section gap | **64px**    | title→asset, asset→description, description→asset2  |
| Section header height   | **103px**   | 28px tags + 8px gap + 67px title (consistent)       |


**Title area** (positioned in root 1280px frame, NOT inside 1240px content area):


| Element                         | x       | y         | width   | height |
| ------------------------------- | ------- | --------- | ------- | ------ |
| Title 1 "This is a title"       | **241** | 256       | **800** | 67     |
| Title 2 "This is another title" | **241** | 832       | **800** | 67     |
| Gap: title1→title2              |         | **509px** |         |        |
| Gap: title2→content start       |         | **480px** |         |        |


**Section dimensions** (y positions relative to content frame "maini content" at y=1379):


| Section | Figma node | Figma name  | y          | height   | Internal structure                                                                                            |
| ------- | ---------- | ----------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| S1      | 1779:13396 | "section 1" | 0          | **4515** | hero-section(1723: title→64→asset600→64→desc228→64→asset600) → 160 → detail(1488) → 160 → detail(984)         |
| S2      | 1779:13977 | "section 2" | **4755**   | 4595     | hero-section(1803: title→64→asset**640**→64→desc228→64→asset**640**) → 160 → detail(984) → 160 → detail(1488) |
| S3      | 1779:17287 | "section 3" | **9590**   | 3891     | hero-section(1099: title→64→asset**640**→64→desc228) → 160 → detail(1488) → 160 → detail(984)                 |
| S4      | 1779:17468 | "section 4" | **13721**  | **4585** | title("Another title", centered w=315) → 160 → 4 projects (each: asset640 + info, 160px apart)                |
| "End."  | 1779:17741 |             | **19925*** | 67       | x=**583**, w=114, centered. *in root frame                                                                    |
| Footer  | 1779:18106 |             | 21602*     | 60       | *in root frame, position:fixed in CSS                                                                         |


**IMPORTANT changes from earlier plan versions:**

- "Title 3" NO LONGER EXISTS as a standalone element. "Another title" is now inside S4.
- All hero ASSETS in S2, S3, and S4 are **640px** tall. Only S1 heroes are **600px**.
- All gaps WITHIN a hero-section wrapper are **64px** (NOT 160px between description→asset2).
- The 160px gap only appears between the hero-section wrapper and detail blocks.

**Component dimensions:**

- Info block: left column 320px + gap 64px + right column flex-1. Height is auto (varies by content: 228px, 270px, or 278px).
- Info pair vertical gap: 16px, internal label-to-value gap: 4px
- Card group: sidebar 185px (24px left padding, 161px text width) + gap 64px + cards column 991px
- Content card: 991px x 480px, inner padding 40px, screenshot at top:40px right:40px w:624 h:400
- Cards stack gap: 24px
- S1 hero assets: 1240 x **600**px
- S2, S3, S4 hero assets: 1240 x **640**px
- Phone frame: ~240px x 519px, border-radius 33px
- Detail block: 1240px wide, 984px or 1488px tall
- S4 project: asset(1240x640) + 64px + info-block(auto height)

### Sticky Nav (IMPORTANT: not a full-width bar)

The sticky nav is three separate elements at the page bottom:

1. **Left**: "Confidential" text at x=20 (Inter Regular, 14px, subdued color)
2. **Center**: A **floating 310px white card** centered horizontally (x=465.625)
  - Shadow: `0px 4px 16px rgba(26,25,21,0.03), 0px 2px 2px rgba(26,25,21,0.01)`
  - Padding: 24px left, 12px right, 12px top/bottom
  - Contains: "Tracy Tan" (Inter Medium, 20px) + button frame 92x36 with "Let's talk" (bg #1a1915, Inter Regular 14px white)
3. **Right**: "Scroll" + chevron-down icon at x=1170 (Inter Regular, 14px, subdued color)

The overall footer area is 1240px wide, 60px tall, fixed at the bottom.

---

## Detailed Build Plan

---

### Phase 0: Scaffold (sequential, 1 agent, ~5 min)

Creates the empty project structure so all Phase 1 agents have files to write to.

```
sitepractice/
  index.html          ← empty shell (Phase 2 assembly fills this)
  style.css           ← empty (Agent A fills)
  main.js             ← empty (Agent B fills)
  vite.config.js
  package.json
  public/
    CNAME
    assets/            ← empty dir (Agent C fills with ~28 screenshots)
  _sections/           ← empty dir (Agent D writes HTML partials here)
  .github/
    workflows/
      deploy.yml
```

`vite.config.js`:

```javascript
import { defineConfig } from 'vite'
export default defineConfig({ base: '/' })
```

`deploy.yml`: GitHub Actions workflow -- `npm run build` and deploy `dist/` on push to `main`.

Run `npm init -y && npm install vite --save-dev` and add build/dev scripts.

---

### Phase 1: Parallel Build (4 agents, ~20-25 min wall clock)

All 4 agents launch simultaneously after scaffold completes. Each writes to different files. All reference the Design Spec and CSS Component Library sections of this plan as their contract.

### Asset Strategy Reference (all agents read this)

Every visual element on the page falls into one of three categories.

**A. BUILD IN CSS (zero image bytes, resolution-independent):**

- Dark navy section backgrounds (`#07103b` / `#161929`) -- just `background-color`
- Content card container backgrounds -- `background-color` + `border-radius` + `box-shadow`
- Phone device frames / bezels (~240x519, `border-radius: 33px`) -- CSS rounded rect with shadow
- Info block layout, text, sticky nav, separators -- HTML + CSS
- Card labels ("Plan", "Track", "Report", etc.) -- HTML text

**B. EXPORT AS FLAT IMAGE (design work being showcased):**

Product screenshots, mockups, and illustrations. Export from Figma as WebP.

**C. HYBRID (CSS container + image content inside):**

1. **Hero sections**: Export full background WITH ellipse blobs baked in as one flat WebP. Screenshot overlay is a separate lazy-loaded `<img>`.
2. **Phone mockups**: Dark BG as CSS. Phone frame as CSS. Screen content as flat image.
3. **Content cards**: Card container as CSS. Label as HTML text. Screenshot inside as image.

### Agent A: Complete `style.css` (~20-25 min)

**Output file**: `style.css`

Agent A writes the ENTIRE stylesheet in one pass. This is the longest Phase 1 task.

**CSS Strategy: pixel-perfect at 1280px, fluid below.**

- Use `max-width` + `width: 100%` (never bare `width: NNNpx` on containers)
- Use `aspect-ratio` on heroes and content cards (NOT on info blocks -- those are auto height)
- Use CSS custom properties for spacing, overridden per breakpoint via `clamp()`

**File must start with these tokens (NO @import for fonts -- that goes in HTML head):**

```css
:root {
  --color-text: #1a1915;
  --color-text-sub: rgba(26, 25, 21, 0.75);
  --color-bg: #ffffff;
  --color-dark: #07103b;
  --color-cta: #1a1915;
  --font: 'Inter', sans-serif;
  --max-w: 1240px;
  --pad: 24px;

  --gap-section: clamp(80px, 18.75vw, 240px);
  --gap-sub: clamp(60px, 12.5vw, 160px);
  --gap-header: clamp(32px, 5vw, 64px);

  --title-size: clamp(32px, 4.375vw, 56px);
  --body-large-size: clamp(20px, 2.5vw, 32px);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font); color: var(--color-text); background: var(--color-bg); padding-bottom: 72px; }
img, video { display: block; max-width: 100%; }
```

**Then these component classes:**

#### A1. Page-level wrapper

```css
main.content-wrap {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--pad);
}
```

#### A2. Page title + title area

```css
.page-title {
  font-size: var(--title-size);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -1.12px;
  color: var(--color-text);
  text-align: center;
}
.title-area {
  max-width: 800px;
  padding: 0 var(--pad);
}
@media (min-width: 1280px) {
  .title-area {
    margin-left: 241px;
    padding: 0;
  }
}
```

#### A3. Section containers + spacing

```css
.case-study + .case-study { margin-top: var(--gap-section); }

.section-header {
  padding: 0 var(--pad);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-tags {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.2px;
  color: var(--color-text-sub);
}
.section-title {
  font-size: var(--title-size);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -1.68px;
  color: var(--color-text);
}
```

#### A4. Hero-section wrapper (wraps: title + asset(s) + description)

Instead of adjacent-sibling selectors (which break when elements are nested), use a flex-column wrapper with CSS gap for the 64px internal rhythm.

```css
.hero-section {
  display: flex;
  flex-direction: column;
  gap: var(--gap-header);
}
.hero-section + .detail { margin-top: var(--gap-sub); }
.detail + .detail { margin-top: var(--gap-sub); }
```

#### A5. Hero (BG + overlay stack)

```css
.hero {
  position: relative;
  width: 100%;
  max-width: var(--max-w);
  aspect-ratio: 1240 / 600;
  overflow: hidden;
}
.hero--tall {
  aspect-ratio: 1240 / 640;
}
.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-overlay {
  position: absolute;
}
```

S1 heroes use `.hero` (600px). S2, S3, S4 heroes use `.hero.hero--tall` (640px).

#### A6. Info block (description)

```css
.info-block {
  display: flex;
  gap: var(--gap-header);
  align-items: flex-start;
  padding: 0 var(--pad);
}
.info-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}
.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.info-label {
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.14px;
  color: var(--color-text-sub);
  max-width: 320px;
  width: 100%;
}
.info-value {
  font-size: 16px;
  line-height: 1.3;
  color: var(--color-text);
}
.info-body {
  flex: 1 0 0;
  min-width: 0;
  font-size: var(--body-large-size);
  line-height: 1.4;
  letter-spacing: -0.32px;
  color: var(--color-text);
}
```

#### A7. Card group + content card

```css
.card-group {
  display: flex;
  gap: var(--gap-header);
  align-items: flex-start;
}
.card-group-sidebar {
  flex-shrink: 0;
  padding: 24px 0 0 24px;
  width: 185px;
  font-size: 16px;
  line-height: 1.3;
}
.card-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  min-width: 0;
  max-width: 991px;
}
.content-card {
  position: relative;
  width: 100%;
  max-width: 991px;
  aspect-ratio: 991 / 480;
  background: #fff;
  overflow: hidden;
}
.content-card-label {
  position: absolute;
  top: 8.33%;
  left: 4.04%;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.2px;
  color: var(--color-text-sub);
  max-width: 29.67%;
}
.content-card img,
.content-card video {
  position: absolute;
  top: 8.33%;
  right: 4.04%;
  width: 62.97%;
  height: 83.33%;
  object-fit: cover;
}
```

#### A8. Sidebar + content layout

```css
.sidebar-content {
  display: flex;
  gap: var(--gap-header);
  align-items: flex-start;
  padding: 0 var(--pad);
}
.sidebar-text {
  flex-shrink: 0;
  padding-top: 24px;
  width: 161px;
  font-size: 16px;
  line-height: 1.3;
}
.sidebar-main {
  flex: 1;
  min-width: 0;
}
```

#### A9. S4 project block + centered title

```css
.section-4-title {
  font-size: var(--title-size);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -1.12px;
  color: var(--color-text);
  text-align: center;
  max-width: 315px;
  margin: 0 auto;
}
.project + .project { margin-top: var(--gap-sub); }
.project .hero { margin-bottom: var(--gap-header); }
```

#### A10. Phone frame

```css
.phone-frame {
  position: relative;
  width: 240px;
  height: 519px;
  border-radius: 33px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.phone-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

#### A11. Sticky nav

```css
.sticky-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-w);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--pad);
  z-index: 50;
  pointer-events: none;
}
.sticky-nav > * { pointer-events: auto; }
.nav-side {
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.14px;
  color: var(--color-text-sub);
}
.nav-card {
  background: #fff;
  width: 310px;
  padding: 12px 12px 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 16px rgba(26,25,21,0.03), 0px 2px 2px rgba(26,25,21,0.01);
}
.nav-name {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.2px;
}
.nav-cta {
  background: var(--color-cta);
  color: #fff;
  height: 36px;
  min-width: 92px;
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### A12. Animation classes

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
.stagger-on-scroll > .animate-on-scroll:nth-child(1) { transition-delay: 0s; }
.stagger-on-scroll > .animate-on-scroll:nth-child(2) { transition-delay: 0.1s; }
.stagger-on-scroll > .animate-on-scroll:nth-child(3) { transition-delay: 0.2s; }
.stagger-on-scroll > .animate-on-scroll:nth-child(4) { transition-delay: 0.3s; }

.title-reveal {
  clip-path: inset(0 0 100% 0);
  transform: translateY(20px);
  transition: clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.title-reveal.visible {
  clip-path: inset(0 0 0% 0);
  transform: translateY(0);
}
```

#### A13. Responsive media queries

```css
@media (max-width: 767px) {
  .info-block { flex-direction: column; gap: 32px; }
  .card-group { flex-direction: column; gap: 24px; }
  .sidebar-content { flex-direction: column; gap: 24px; }
  .card-group-sidebar { width: 100%; padding: 0 var(--pad); }
  .sidebar-text { width: 100%; padding-top: 0; }
  .content-card { aspect-ratio: auto; min-height: 300px; }
  .content-card img,
  .content-card video { width: calc(100% - 80px); height: auto; }
  .nav-side { display: none; }
  .sticky-nav { justify-content: center; }
  .title-area { max-width: 100%; margin-left: 0; }
}

@media (min-width: 768px) and (max-width: 1279px) {
  .info-block { gap: 32px; }
  .card-group { gap: 32px; }
  .card-group-sidebar { width: 140px; }
  .sidebar-text { width: 120px; }
  .title-area { max-width: 100%; margin-left: auto; margin-right: auto; }
}
```

At >= 1280px, all `clamp()` values reach their Figma maximums. No overrides needed.

---

### Agent B: Complete `main.js` (~10-15 min)

**Output file**: `main.js`

```javascript
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll, .title-reveal')
  .forEach(el => scrollObserver.observe(el));

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      video.src = video.dataset.src;
      video.play();
      videoObserver.unobserve(video);
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.lazy-video').forEach(v => videoObserver.observe(v));

window.addEventListener('load', () => {
  const firstTitle = document.querySelector('.title-reveal');
  if (firstTitle) firstTitle.classList.add('visible');
});
```

---

### Agent C: Figma Screenshots → `public/assets/` (~10-15 min)

**Output files**: ~28 placeholder images extracted via Figma MCP `get_screenshot`.

**Complete asset manifest with Figma node IDs:**


| #   | File name                  | Figma node          | Description                                    | Dimensions |
| --- | -------------------------- | ------------------- | ---------------------------------------------- | ---------- |
| 1   | `s1-hero-1-bg.webp`        | 1779:13402          | S1 gradient ellipse BG + 3 app logos           | 1240x600   |
| 2   | `s1-hero-2.webp`           | 1779:13428          | S1 gradient BG + dashboard screenshot          | 1240x600   |
| 3   | `s1-detail-visual.webp`    | (inside 1779:13434) | "Visual design" card content                   | 992x480    |
| 4   | `s1-detail-motion.webp`    | (inside 1779:13434) | "Motion design" card content                   | 992x480    |
| 5   | `s1-detail-content.webp`   | (inside 1779:13434) | "Content design" card content                  | 992x480    |
| 6   | `s1-detail-human.webp`     | (inside 1779:13953) | "For human" card                               | 992x480    |
| 7   | `s1-detail-playbook.webp`  | (inside 1779:13953) | "Content playbook" section                     | 992x480    |
| 8   | `s1-detail-machine.webp`   | (inside 1779:13953) | "For machine" card                             | 992x480    |
| 9   | `s2-hero-1.webp`           | 1779:13983          | S2 gradient + dashboard overlay                | 1240x640   |
| 10  | `s2-hero-2.webp`           | 1779:14416          | S2 second hero asset                           | 1240x640   |
| 11  | `s2-detail-cards.webp`     | (inside 1779:14447) | 3 info cards (One global / Strength / Revenue) | 1240x~300  |
| 12  | `s2-before.webp`           | (inside 1779:14447) | Before section - app icons row                 | 992x480    |
| 13  | `s2-after.webp`            | (inside 1779:14447) | After section - 3 screenshots                  | 992x480    |
| 14  | `s2-card-plan.webp`        | (inside 1779:17262) | Plan card screenshot                           | 624x400    |
| 15  | `s2-card-track.webp`       | (inside 1779:17262) | Track card screenshot                          | 624x400    |
| 16  | `s2-card-report.webp`      | (inside 1779:17262) | Report card screenshot                         | 624x400    |
| 17  | `s3-hero.webp`             | 1779:17292          | S3 gradient + support dashboard                | 1240x640   |
| 18  | `s3-card-investigate.webp` | (inside 1779:17314) | Investigate card content                       | 992x480    |
| 19  | `s3-card-communicate.webp` | (inside 1779:17314) | Communicate card content                       | 992x480    |
| 20  | `s3-card-resolution.webp`  | (inside 1779:17314) | Resolution card content                        | 992x480    |
| 21  | `s3-before.webp`           | (inside 1779:17333) | S3 Before section                              | 992x480    |
| 22  | `s3-after.webp`            | (inside 1779:17333) | S3 After section                               | 992x480    |
| 23  | `s4-project-1.webp`        | 1779:17474          | Gradient + phone mockup (Bank & Card)          | 1240x640   |
| 24  | `s4-project-2.webp`        | 1779:17500          | Phone collage (Klarna etc.)                    | 1240x640   |
| 25  | `s4-project-3.webp`        | 1779:17557          | Dark gradient hero                             | 1240x640   |
| 26  | `s4-project-4.webp`        | (inside 1779:17472) | Wolt phone + sky BG                            | 1240x640   |
| 27  | `poster-video-1.webp`      |                     | Video poster placeholder                       | 1240x600   |
| 28  | `poster-video-2.webp`      |                     | Video poster placeholder                       | 1240x600   |


Agent C screenshots each node and saves to `public/assets/` with the file names above. These are placeholders -- user replaces with production Figma exports later.

---

### Agent D: HTML Partials → `_sections/*.html` (~20-25 min)

**Output files**: 7 partial HTML files (fragments only, no `<html>`/`<head>`/`<body>` wrapper).

#### `_sections/01-title.html` — Title area

```html
<section class="title-area" id="title" style="padding-top: 256px;">
  <h1 class="page-title title-reveal">This is a title</h1>
</section>
<section class="title-area" style="margin-top: 509px;">
  <h2 class="page-title title-reveal">This is another title</h2>
</section>
```

#### `_sections/02-cs1.html` — Section 1

Uses `.hero-section` wrapper for the title→asset→description→asset chain (all 64px gaps via CSS gap). First hero uses `loading="eager" fetchpriority="high"` (above the fold).

```html
<section class="case-study" id="section-1">
  <div class="hero-section">
    <div class="section-header">
      <span class="section-tags animate-on-scroll">Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum</span>
      <h2 class="section-title title-reveal">Long title</h2>
    </div>
    <div class="hero animate-on-scroll">
      <img class="hero-bg" src="/assets/s1-hero-1-bg.webp" alt="" width="1240" height="600"
           loading="eager" fetchpriority="high" decoding="async">
    </div>
    <div class="info-block">
      <div class="info-meta stagger-on-scroll">
        <div class="info-row animate-on-scroll"><span class="info-label">Label</span><span class="info-value">Value</span></div>
        <div class="info-row animate-on-scroll"><span class="info-label">Label</span><span class="info-value">Value</span></div>
        <div class="info-row animate-on-scroll"><span class="info-label">Label</span><span class="info-value">Value</span></div>
        <div class="info-row animate-on-scroll"><span class="info-label">Label</span><span class="info-value">Value</span></div>
      </div>
      <div class="info-body animate-on-scroll"><p>Lorem Ipsum paragraph...</p></div>
    </div>
    <div class="hero animate-on-scroll">
      <img class="hero-bg" src="/assets/s1-hero-2.webp" alt="" width="1240" height="600"
           loading="lazy" decoding="async">
    </div>
  </div>

  <div class="detail">
    <!-- sidebar-content with Visual design / Motion design / Content design cards -->
  </div>

  <div class="detail">
    <!-- sidebar-content with For human / Content playbook / For machine cards -->
  </div>
</section>
```

#### `_sections/03-cs2.html` — Section 2

Same `.hero-section` wrapper pattern. Heroes use `.hero--tall` (640px). Includes Before/After as detail blocks INSIDE this section (not standalone).

```html
<section class="case-study" id="section-2">
  <div class="hero-section">
    <div class="section-header">...</div>
    <div class="hero hero--tall animate-on-scroll">
      <img class="hero-bg" src="/assets/s2-hero-1.webp" alt="" width="1240" height="640"
           loading="lazy" decoding="async">
    </div>
    <div class="info-block">...</div>
    <div class="hero hero--tall animate-on-scroll">
      <img class="hero-bg" src="/assets/s2-hero-2.webp" alt="" width="1240" height="640"
           loading="lazy" decoding="async">
    </div>
  </div>

  <div class="detail">
    <!-- 3 info cards + Before/After -->
  </div>

  <div class="detail">
    <div class="card-group">
      <div class="card-group-sidebar">Sidebar text...</div>
      <div class="card-stack">
        <div class="content-card animate-on-scroll">
          <span class="content-card-label">Plan</span>
          <img src="/assets/s2-card-plan.webp" alt="Plan" width="624" height="400" loading="lazy" decoding="async">
        </div>
        <div class="content-card animate-on-scroll">
          <span class="content-card-label">Track</span>
          <img src="/assets/s2-card-track.webp" alt="Track" width="624" height="400" loading="lazy" decoding="async">
        </div>
        <div class="content-card animate-on-scroll">
          <span class="content-card-label">Report</span>
          <img src="/assets/s2-card-report.webp" alt="Report" width="624" height="400" loading="lazy" decoding="async">
        </div>
      </div>
    </div>
  </div>
</section>
```

#### `_sections/04-cs3.html` — Section 3

Same patterns. Single 640px hero (no second asset). Investigate/Communicate/Resolution cards. Before/After detail block inside this section.

#### `_sections/05-cs4.html` — Section 4

Centered title + 4 project blocks, each with a 640px asset and info block.

```html
<section class="case-study" id="section-4">
  <h2 class="section-4-title title-reveal">Another title</h2>

  <div class="project">
    <div class="hero hero--tall animate-on-scroll">
      <img class="hero-bg" src="/assets/s4-project-1.webp" alt="" width="1240" height="640" loading="lazy" decoding="async">
    </div>
    <div class="info-block">...</div>
  </div>

  <div class="project">
    <div class="hero hero--tall animate-on-scroll">
      <img class="hero-bg" src="/assets/s4-project-2.webp" alt="" width="1240" height="640" loading="lazy" decoding="async">
    </div>
    <div class="info-block">...</div>
  </div>

  <div class="project">
    <div class="hero hero--tall animate-on-scroll">
      <img class="hero-bg" src="/assets/s4-project-3.webp" alt="" width="1240" height="640" loading="lazy" decoding="async">
    </div>
    <div class="info-block">...</div>
  </div>

  <div class="project">
    <div class="hero hero--tall animate-on-scroll">
      <img class="hero-bg" src="/assets/s4-project-4.webp" alt="" width="1240" height="640" loading="lazy" decoding="async">
    </div>
    <div class="info-block">...</div>
  </div>
</section>
```

#### `_sections/06-end.html` — End text

```html
<section class="end-section" style="margin-top: var(--gap-section);">
  <h2 class="page-title" style="text-align: center;">End.</h2>
</section>
```

#### `_sections/07-nav.html` — Sticky nav

```html
<nav class="sticky-nav">
  <span class="nav-side nav-left">Confidential</span>
  <div class="nav-card">
    <span class="nav-name">Tracy Tan</span>
    <a href="mailto:..." class="nav-cta">Let's talk</a>
  </div>
  <a href="#title" class="nav-side nav-right">
    Scroll <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  </a>
</nav>
```

---

### Phase 2: Assembly (sequential, 1 agent, ~10 min)

Merge all partials into `index.html`. Font loaded via `<link>` in head (NOT CSS @import).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tracy Tan — Design Case Study</title>
  <meta name="description" content="Design case study by Tracy Tan">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

  <main class="content-wrap">
    <!-- contents of _sections/01-title.html -->
    <!-- contents of _sections/02-cs1.html -->
    <!-- contents of _sections/03-cs2.html -->
    <!-- contents of _sections/04-cs3.html -->
    <!-- contents of _sections/05-cs4.html -->
    <!-- contents of _sections/06-end.html -->
  </main>

  <!-- Nav is OUTSIDE main (fixed position, not part of content flow) -->
  <!-- contents of _sections/07-nav.html -->

  <script type="module" src="/main.js"></script>
</body>
</html>
```

After assembly:

1. Start dev server (`npm run dev`)
2. Verify page loads at `localhost:5173`
3. Quick smoke check: sections render, CSS applies, images load
4. Delete `_sections/` directory (no longer needed)

### Phase 3: Review & Iteration (craft is the top priority -- 1:1 to Figma)

The site should look indistinguishable from the Figma at 1280px.

**3a. Section-by-Section Figma Overlay Comparison**

Method:

1. Set browser to exactly 1280px viewport width
2. For each section, use Figma MCP `get_screenshot` to get the Figma rendering
3. Take a browser screenshot of the same section
4. Compare side-by-side. Check every detail.


| Section     | Figma node | Key measurements to verify                            |
| ----------- | ---------- | ----------------------------------------------------- |
| Title 1     | 1779:13393 | x=**241**, y=256, **800**x67, Inter 56px, ls -1.12px  |
| Title 2     | 1779:13394 | x=**241**, y=832, **800**x67, 509px below title 1     |
| S1 header   | 1779:13398 | 103px tall, 8px gap between tags and title            |
| S1 hero 1   | 1779:13402 | 1240x**600**, 64px below header                       |
| S1 info     | 1779:13413 | 64px below hero, 320px left + 64px gap + flex-1 right |
| S1 hero 2   | 1779:13428 | 1240x**600**, **64px** below info (NOT 160px)         |
| S1 detail   | 1779:13434 | **160px** below hero-section wrapper                  |
| S2 hero 1   | 1779:13983 | 1240x**640**, 64px below S2 header                    |
| S2 hero 2   | 1779:14416 | 1240x**640**, 64px below S2 info                      |
| S2 cards    | 1779:17262 | sidebar 185px + 64px gap + 991px cards                |
| S3 hero     | 1779:17292 | 1240x**640**                                          |
| S3 cards    | 1779:17314 | Investigate/Communicate/Resolution                    |
| S4 title    | 1779:19223 | centered, w=315, INSIDE section 4                     |
| S4 projects | 1779:17472 | 4 projects, 640px assets, 160px apart                 |
| "End."      | 1779:17741 | x=**583**, w=114, y=**19925**                         |
| Nav card    | 1779:18107 | 310px, centered, button 92x36                         |


**3b. Common Pixel-Perfect Pitfalls**

- **Font**: Inter from Google Fonts may render slightly differently than Figma. Verify letter-spacing at 56px.
- **Letter-spacing sign**: -1.68px means TIGHTER. CSS `letter-spacing` is additive.
- **240px section gaps**: Measure with DevTools. Every gap between sections must be exactly 240px at 1280px.
- **64px gaps WITHIN hero-section**: All internal gaps (title→asset, asset→description, description→asset2) are 64px.
- **160px gaps between hero-section→detail**: This is the ONLY place 160px appears inside a section.
- **S2, S3, S4 heroes are 640px**: Only S1 is 600px. Easy to miss.
- **Title area x=241, w=800**: NOT x=192/w=917 (old values). NOT centered in 1240px content.
- **S4 title is centered**: w=315, `text-align: center`, NOT left-aligned.
- **Nav card shadow**: Very subtle (0.03 and 0.01 alpha). Must be present.

**3c. Animation Review**

- Title clip-reveals smooth (no layout shift)
- Stagger delays natural (100ms increments)
- Videos lazy-load with poster visible first
- No flash of un-animated content
- First title animates on page load

**3d. Performance Audit**

Lighthouse (Incognito, desktop): target 90+ on all four scores.

- First fold < 500KB
- First hero uses `fetchpriority="high"` + `loading="eager"`
- All other images use `loading="lazy"`
- No layout shift (explicit width/height on all images)
- Font loaded via preconnect (not render-blocking @import)

**3e. Responsive Check**


| Viewport   | --gap-section | --title-size | Layout              | Check             |
| ---------- | ------------- | ------------ | ------------------- | ----------------- |
| 375px      | 80px (min)    | 32px (min)   | Single column       | No overflow       |
| 768px      | 144px         | 33.6px       | 2-col, tighter gaps | Cards scale       |
| 1024px     | 192px         | 44.8px       | Near-desktop        | Proportional      |
| **1280px** | **240px**     | **56px**     | **1:1 Figma**       | **Pixel-perfect** |
| 1440px     | 240px (max)   | 56px (max)   | Centered            | No stretch        |


**3f. Fix Issues (craft-first priority)**

1. Vertical spacing (240/160/64px)
2. Typography (weight, letter-spacing sign, line-height)
3. Colors (#1a1915, 75% opacity subdued)
4. Component dimensions (card 991x480, hero 600 vs 640)
5. Title positioning (x=241, w=800)
6. Nav card (310px floating, not full-width)
7. Animation smoothness
8. Performance
9. Responsive edge cases

### Phase 4: Deploy (PAUSED -- requires your explicit approval)

**I will STOP here and ask for your go-ahead.** You review the local build at `localhost:5173` first.

**IMPORTANT: Personal account only. Repo goes under `tanyuntracy`, NOT any organization.**

```bash
gh auth status
gh repo create tanyuntracy/sitepractice --public --source=. --push
git remote -v
```

After push:

1. Go to `https://github.com/tanyuntracy/sitepractice/settings/pages`
2. Source: GitHub Actions
3. Verify first Actions run succeeds

Domain setup (when ready):

1. Buy domain on GoDaddy
2. DNS: 4 A-records (`185.199.108.153` through `.111.153`) + CNAME (`www` → `tanyuntracy.github.io`)
3. GitHub: Settings > Pages > Custom domain > enter domain > Enforce HTTPS
4. Update `public/CNAME` with actual domain

---

## What the User Needs to Do Later

1. **Replace placeholder images** -- Export from Figma as WebP (80% quality, at display dimensions), match filenames in `public/assets/`
2. **Add video files** -- Drop compressed MP4 files into `public/assets/`, update `data-src` paths
3. **Replace Lorem Ipsum** -- Edit text content in `index.html`
4. **Buy domain** -- Follow DNS instructions above
5. **Push** -- `git push` and the site auto-deploys

---

## Asset Replacement Guide

**Screenshots/mockups:** WebP, 80% quality, 1x scale at frame dimensions.

**Hero backgrounds:** Select hero frame, hide screenshot overlay, export remaining BG as flat WebP.

**Phone screens:** Export inner screen frame as WebP (~240x519). CSS phone frame wraps it.

**Videos:**

```bash
ffmpeg -i input.mov -c:v libx264 -crf 28 -preset slow \
  -vf scale=1280:720 -an -movflags +faststart output.mp4
```

Export poster frame (first frame) as WebP for each video.