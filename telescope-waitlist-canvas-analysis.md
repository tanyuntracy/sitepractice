# Telescope.fyi Waitlist Canvas Effect — Complete Analysis

**Source:** https://telescope.fyi/  
**Bundle:** `/_nuxt/DWF3tw4c.js`  
**Component:** `TheWaitlist` (data-v-da6eccb3)

---

## 1. Overview

The waitlist section uses a **full-viewport canvas** that draws a grid of product images. Images **scale up based on proximity to the cursor** (desktop) or follow a **circular orbit** (touch devices). The effect is scroll-triggered and fades in/out when entering/leaving the section.

---

## 2. Core JavaScript Logic (Extracted)

### 2.1 Global Mouse Tracking

```javascript
const mouse = { x: 0, y: 0, nX: 0, nY: 0 };

function onMouseMove(e) {
  mouse.x = clamp(0, e.clientX, window.innerWidth);
  mouse.y = clamp(0, e.clientY, window.innerHeight);
  mouse.nX = (mouse.x / window.innerWidth) * 2 - 1;
  mouse.nY = -(mouse.y / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, { passive: true });
```

### 2.2 Canvas Setup

```javascript
function createCanvas(options) {
  const { wrapper, canvas, autoResize, onResizeCallback } = options;
  const canvasEl = canvas || document.createElement('canvas');
  if (!canvas) wrapper.appendChild(canvasEl);

  const resize = () => {
    const ctx = canvasEl.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = wrapper.offsetWidth;
    const h = wrapper.offsetHeight;
    canvasEl.width = w * dpr;
    canvasEl.height = h * dpr;
    canvasEl.style.width = `${w}px`;
    canvasEl.style.height = `${h}px`;
    ctx.scale(dpr, dpr);
    onResizeCallback?.();
  };

  if (autoResize) window.addEventListener('resize', resize);
  resize();

  return {
    canvas: canvasEl,
    getContext: () => ctx,
    dispose: () => autoResize && window.removeEventListener('resize', resize),
  };
}
```

### 2.3 Image Data (72 images)

```javascript
const C = [
  { id: 'sports-outdoor1', ratio: 600 / 651 },
  { id: 'sports-outdoor2', ratio: 600 / 522 },
  { id: 'sports-outdoor3', ratio: 600 / 420 },
  { id: 'home-tech1', ratio: 600 / 612 },
  { id: 'home-tech2', ratio: 600 / 417 },
  { id: 'fashion1', ratio: 600 / 559 },
  { id: 'fashion2', ratio: 600 / 488 },
  { id: 'fashion3', ratio: 600 / 583 },
  { id: 'eat-drinks1', ratio: 600 / 544 },
  { id: 'eat-drinks2', ratio: 600 / 663 },
  { id: 'eac1', ratio: 600 / 428 },
  { id: 'eac2', ratio: 600 / 428 },
];

// 12 categories × 6 images each = 72 images
// URL: https://cdn.telescope.fyi/landing/hero/{id}/{0-5}.jpg
const w = C.flatMap((cat) =>
  Array(6).fill(null).map((_, i) => ({
    url: `https://cdn.telescope.fyi/landing/hero/${cat.id}/${i}.jpg`,
    ratio: cat.ratio,
  }))
);
gsap.utils.shuffle(w); // Randomize order
```

### 2.4 Grid Configuration (Responsive)

```javascript
function I() {
  if (window.innerWidth >= 1024) {
    E.imgSize = window.innerHeight * 0.075;   // 7.5% of viewport height
    E.maxDistance = window.innerHeight * 0.3;  // 30% of viewport height
  } else {
    E.imgSize = window.innerHeight * 0.05;     // 5% on mobile
    E.maxDistance = window.innerHeight * 0.2;  // 20% on mobile
  }
  E.gap = window.innerHeight * 0.06;           // 6% gap
  E.step = E.imgSize + E.gap;
  E.cols = Math.ceil(window.innerWidth / E.step);
  E.rows = Math.ceil(window.innerHeight / E.step);
  T = Math.min(window.innerWidth * 0.75, window.innerHeight * 0.75); // orbit radius
}
```

### 2.5 Render Loop (Main Effect Logic)

```javascript
function O(deltaTime, delta) {
  P.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Update focus point (cursor position)
  if (A) {
    // Touch device: circular orbit
    F.x = window.innerWidth * 0.5 + T * 0.75 * Math.cos(deltaTime * 0.75);
    F.y = window.innerHeight * 0.5 + T * Math.sin(deltaTime * 0.75);
  } else {
    // Desktop: smooth interpolation toward mouse (lerp factor: delta * 0.005)
    F.x = gsap.utils.interpolate(F.x, mouse.x, delta * 0.005);
    F.y = gsap.utils.interpolate(F.y, mouse.y, delta * 0.005);
  }

  for (let ie = -1; ie < E.rows + 1; ie++) {
    for (let le = -1; le < E.cols + 1; le++) {
      const ce = modulo(le * E.cols + ie, w.length);
      const ve = w[ce].ratio;

      // Aspect ratio
      let me, be;
      if (ve > 1) {
        me = E.imgSize;
        be = me / ve;
      } else {
        be = E.imgSize;
        me = be * ve;
      }

      // Position with parallax scroll (wraps around)
      const _e = gsap.utils.wrap(
        -E.step - E.gap,
        window.innerWidth + E.step,
        le * E.step + deltaTime * 100
      );
      const ye = gsap.utils.wrap(
        -E.step - E.gap,
        window.innerHeight + E.step,
        ie * E.step - deltaTime * 100
      );

      const Re = (E.imgSize - me) / 2;
      const Ae = (E.imgSize - be) / 2;
      const xe = _e + Re + E.imgSize * 0.5 - F.x;
      const W = ye + Ae + E.imgSize * 0.5 - F.y;
      const U = Math.sqrt(xe * xe + W * W); // distance from focus

      if (U < E.maxDistance) {
        // Scale: 0–4 based on distance, eased
        const Q =
          Math.max(0, 4 - Power1.easeInOut(U / E.maxDistance) * 4) *
          R.forceScale;
        const te = me * Q;
        const Y = be * Q;

        P.drawImage(
          w[ce].img,
          _e + (E.imgSize - te) / 2,
          ye + (E.imgSize - Y) / 2,
          te,
          Y
        );
      }
    }
  }
}
```

### 2.6 Activation / Deactivation

```javascript
function Z() {
  gsap.ticker.add(O);
  z = gsap.to(R, {
    forceScale: 1,
    duration: 0.6,
    ease: 'power2.inOut',
  });
}

function X() {
  J = gsap.to(R, {
    forceScale: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      gsap.ticker.remove(O);
    },
  });
}
```

---

## 3. Behavior Summary

### 3.1 Cursor / Focus Point

| Platform | Behavior |
|----------|----------|
| **Desktop** | Focus point interpolates toward `mouse.x`, `mouse.y` with `lerp_factor = delta * 0.005` (smooth follow) |
| **Touch** | Focus point orbits in a circle: `(cos(Δt * 0.75), sin(Δt * 0.75))` scaled by 75% of viewport |

### 3.2 Image Grid

- **Layout:** Grid of cells; each cell is `imgSize + gap` (e.g. 7.5% + 6% of viewport height)
- **Position:** Cells scroll with parallax (`deltaTime * 100` for X, `-deltaTime * 100` for Y); wrap around viewport
- **Image selection:** `modulo(col * cols + row, 72)` — cycles through 72 shuffled images

### 3.3 Scale / Distance

- **Distance:** `U = sqrt(dx² + dy²)` from cell center to focus point
- **Visibility:** Only drawn if `U < maxDistance` (30% viewport on desktop, 20% on mobile)
- **Scale formula:** `Q = max(0, 4 - Power1.easeInOut(U / maxDistance) * 4) * forceScale`
  - At `U = 0`: scale = 4× base size
  - At `U = maxDistance`: scale = 0 (fade out)
  - Easing: `Power1.easeInOut` (smooth falloff)

### 3.4 Opacity / Fade

- No explicit `globalAlpha` in the draw loop
- Visibility is controlled by **scale**: images scale to 0 at the edge of `maxDistance`, so they fade out by shrinking

### 3.5 Easing

- **Scale falloff:** `Power1.easeInOut` (smooth S-curve)
- **Activation:** `power2.inOut` (0.6s)
- **Deactivation:** `power2.out` (0.6s)
- **Mouse lerp:** `gsap.utils.interpolate(F.x, mouse.x, delta * 0.005)` — smooth cursor follow

### 3.6 Trigger

- **ScrollTrigger:** `start: 'top top'`, `end: 'bottom-100vh bottom'`
- **On enter:** `Z()` — activate effect
- **On leave back:** `X()` — deactivate effect
- **Button hover:** `onMouseenter` → `X()` (pause), `onMouseleave` → `Z()` (resume)

---

## 4. Visual Description (from Code)

When the waitlist section is in view:

1. **Grid:** A grid of small product images (sports, fashion, food, tech, etc.) scrolls slowly with parallax.
2. **Cursor proximity:** A circular region around the cursor (radius ~30% viewport on desktop) shows images that scale up toward the cursor.
3. **Scale:** Images near the cursor are up to 4× larger; at the edge of the region they shrink to 0.
4. **Smoothness:** The focus point follows the mouse with interpolation; images scale with smooth easing.
5. **Touch:** On touch devices, the “focus” moves in a circle instead of following the finger.
6. **Button:** Hovering over “Join Waitlist” pauses the effect (images fade out).

---

## 5. Dependencies

- **GSAP** (with ScrollTrigger, GSAP CSS plugin)
- **Vue 3** (ref, computed, onMounted)
- **Global `mouse`** object updated by `mousemove`
- **`createCanvas`** utility for canvas setup

---

## 6. Line References (telescope-bundle.js)

| Logic | Lines |
|-------|-------|
| createCanvas | 40716–40747 |
| TheWaitlist setup | 40760–41402 |
| Image categories | 40776–40789 |
| createCanvas call | 40797–40802 |
| ScrollTrigger setup | 40806–40902 |
| Z() / X() | 40905–40926 |
| recalcGrid | 40942–40953 |
| Render loop O() | 40955–41000 |
| Canvas element | 41239–41244 |
| mouse tracking | 37448–37462 |
| modulo | 37449 |
| clamp | 37448 |
| isTouch | 28047–28049 |
