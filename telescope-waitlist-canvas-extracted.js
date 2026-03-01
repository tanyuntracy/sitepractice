/**
 * TELESCOPE.FYI — Waitlist Section Canvas Effect
 * Extracted from https://telescope.fyi/ (DWF3tw4c.js)
 * Component: TheWaitlist (data-v-da6eccb3)
 *
 * This file contains the deobfuscated/cleaned JavaScript that powers
 * the canvas-based image grid effect in the waitlist section.
 */

// =============================================================================
// DEPENDENCIES (from bundle)
// =============================================================================

const clamp = (min, val, max) => (val < min ? min : val > max ? max : val);
const modulo = (n, m) => ((n % m) + m) % m;

// Global mouse position (updated by mousemove listener)
const mouse = { x: 0, y: 0, nX: 0, nY: 0 };

function onMouseMove(e) {
  mouse.x = clamp(0, e.clientX, window.innerWidth);
  mouse.y = clamp(0, e.clientY, window.innerHeight);
  mouse.nX = (mouse.x / window.innerWidth) * 2 - 1;
  mouse.nY = -(mouse.y / window.innerHeight) * 2 + 1;
}

function isTouch() {
  return !!('ontouchstart' in window || navigator.msMaxTouchPoints);
}

// =============================================================================
// CREATE CANVAS UTILITY
// =============================================================================

function createCanvas(options = {}) {
  const {
    wrapper = null,
    canvas = null,
    autoResize = false,
    onResizeCallback = null,
  } = options;

  if (!wrapper) throw Error('createCanvas: options.wrapper is required');

  let ctx, dpr, width, height;
  const canvasEl = canvas || (() => {
    const el = document.createElement('canvas');
    wrapper.appendChild(el);
    return el;
  })();

  function resize() {
    ctx = canvasEl.getContext('2d');
    dpr = Math.min(window.devicePixelRatio, 2);
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    canvasEl.style.width = `${width}px`;
    canvasEl.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    onResizeCallback?.();
  }

  if (autoResize) window.addEventListener('resize', resize);
  resize();

  return {
    canvas: canvasEl,
    wW: width,
    wH: height,
    getContext: () => ctx,
    dispose: () => {
      if (autoResize) window.removeEventListener('resize', resize);
    },
  };
}

// =============================================================================
// IMAGE DATA — 12 categories × 6 images each = 72 images
// =============================================================================

const IMAGE_CATEGORIES = [
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

// Flatten to 72 images: each category × 6 images (0.jpg through 5.jpg)
// URL pattern: https://cdn.telescope.fyi/landing/hero/{categoryId}/{index}.jpg
const images = IMAGE_CATEGORIES.flatMap((cat) =>
  Array(6)
    .fill(null)
    .map((_, i) => ({
      url: `https://cdn.telescope.fyi/landing/hero/${cat.id}/${i}.jpg`,
      ratio: cat.ratio,
    }))
);

// Shuffled for variety
gsap.utils.shuffle(images);

// =============================================================================
// GRID CONFIGURATION (recomputed on resize)
// =============================================================================

const gridConfig = {
  imgSize: 0,
  maxDistance: 0,
  gap: 0,
  step: 0,
  cols: 0,
  rows: 0,
};

function recalcGrid() {
  if (window.innerWidth >= 1024) {
    gridConfig.imgSize = window.innerHeight * 0.075;
    gridConfig.maxDistance = window.innerHeight * 0.3;
  } else {
    gridConfig.imgSize = window.innerHeight * 0.05;
    gridConfig.maxDistance = window.innerHeight * 0.2;
  }
  gridConfig.gap = window.innerHeight * 0.06;
  gridConfig.step = gridConfig.imgSize + gridConfig.gap;
  gridConfig.cols = Math.ceil(window.innerWidth / gridConfig.step);
  gridConfig.rows = Math.ceil(window.innerHeight / gridConfig.step);
}

// =============================================================================
// FOCUS POINT — cursor position (smoothed) or circular path (touch)
// =============================================================================

const focusPoint = { x: 0, y: 0 };
const forceScale = { forceScale: 0 }; // 0 = hidden, 1 = visible
let orbitRadius; // = Math.min(innerWidth * 0.75, innerHeight * 0.75)

// =============================================================================
// RENDER LOOP — called every GSAP tick when section is in view
// =============================================================================

function render(deltaTime, delta) {
  const ctx = canvasInstance.getContext();
  const E = gridConfig;
  const F = focusPoint;
  const R = forceScale;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Update focus point
  if (isTouchDevice) {
    // Touch: circular orbit based on time
    F.x = window.innerWidth * 0.5 + orbitRadius * 0.75 * Math.cos(deltaTime * 0.75);
    F.y = window.innerHeight * 0.5 + orbitRadius * Math.sin(deltaTime * 0.75);
  } else {
    // Desktop: smooth interpolation toward mouse (lerp factor: delta * 0.005)
    F.x = gsap.utils.interpolate(F.x, mouse.x, delta * 0.005);
    F.y = gsap.utils.interpolate(F.y, mouse.y, delta * 0.005);
  }

  // Draw grid of images
  for (let row = -1; row < E.rows + 1; row++) {
    for (let col = -1; col < E.cols + 1; col++) {
      const imgIndex = modulo(col * E.cols + row, images.length);
      const imgData = images[imgIndex];
      const ratio = imgData.ratio;

      // Compute draw dimensions (maintain aspect ratio)
      let drawW, drawH;
      if (ratio > 1) {
        drawW = E.imgSize;
        drawH = E.imgSize / ratio;
      } else {
        drawH = E.imgSize;
        drawW = E.imgSize * ratio;
      }

      // Position with parallax scroll (wraps around viewport)
      const baseX = gsap.utils.wrap(
        -E.step - E.gap,
        window.innerWidth + E.step,
        col * E.step + deltaTime * 100
      );
      const baseY = gsap.utils.wrap(
        -E.step - E.gap,
        window.innerHeight + E.step,
        row * E.step - deltaTime * 100
      );

      const offsetX = (E.imgSize - drawW) / 2;
      const offsetY = (E.imgSize - drawH) / 2;

      // Distance from focus point (cursor/mouse)
      const dx = baseX + offsetX + E.imgSize * 0.5 - F.x;
      const dy = baseY + offsetY + E.imgSize * 0.5 - F.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only draw if within maxDistance
      if (distance < E.maxDistance) {
        // Scale: 4 - (easeInOut(distance/maxDistance) * 4), clamped to [0, 4]
        // Closer to cursor = larger image (up to 4x base size)
        const scaleFactor =
          Math.max(0, 4 - Power1.easeInOut(distance / E.maxDistance) * 4) *
          R.forceScale;

        const finalW = drawW * scaleFactor;
        const finalH = drawH * scaleFactor;

        ctx.drawImage(
          imgData.img,
          baseX + (E.imgSize - finalW) / 2,
          baseY + (E.imgSize - finalH) / 2,
          finalW,
          finalH
        );
      }
    }
  }
}

// =============================================================================
// ACTIVATION / DEACTIVATION (scroll-triggered)
// =============================================================================

function activateEffect() {
  gsap.ticker.add(render);
  gsap.to(forceScale, {
    forceScale: 1,
    duration: 0.6,
    ease: 'power2.inOut',
  });
}

function deactivateEffect() {
  gsap.to(forceScale, {
    forceScale: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      gsap.ticker.remove(render);
    },
  });
}

// =============================================================================
// BUTTON HOVER — pause/resume when hovering "Join Waitlist" button
// =============================================================================

// onMouseenter on button → deactivateEffect() (images fade out)
// onMouseleave on button → activateEffect() (images fade in)
