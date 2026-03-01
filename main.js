/* ── Password gate ── */
const SITE_PASSWORD = 'tracy&intercom';

(function initPasswordGate() {
  const gate = document.getElementById('passwordGate');
  const form = document.getElementById('passwordForm');
  const input = document.getElementById('passwordInput');
  const error = document.getElementById('passwordError');

  if (!gate || !form) return;

  if (sessionStorage.getItem('site_auth') === '1') {
    gate.classList.add('hidden');
    return;
  }

  document.body.classList.add('gate-locked');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === SITE_PASSWORD) {
      sessionStorage.setItem('site_auth', '1');
      document.body.classList.remove('gate-locked');
      gate.classList.add('hidden');
      startTitleAnimation();
    } else {
      error.classList.add('visible');
      form.classList.remove('shake');
      form.classList.add('error');
      void form.offsetWidth;
      form.classList.add('shake');
      input.value = '';
      input.focus();
    }
  });
})();

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const initialHash = window.location.hash;
if (initialHash) {
  const target = document.querySelector(initialHash);
  if (target) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'auto' });
    });
  } else {
    window.scrollTo(0, 0);
  }
} else {
  window.scrollTo(0, 0);
}

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

document.querySelectorAll('.interstitial-title .blur-in')
  .forEach(el => scrollObserver.observe(el));

function ensureMuted(video) {
  video.muted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.defaultMuted = true;
  video.loop = false;
  video.removeAttribute('loop');
}

function tryPlay(video) {
  ensureMuted(video);
  const p = video.play();
  if (p !== undefined) {
    p.catch(() => {
      ensureMuted(video);
      video.play().catch(() => {});
    });
  }
}

const stalledVideos = new Set();

function loadVideoSources(video) {
  if (video.dataset.loaded) return;
  video.dataset.loaded = '1';
  ensureMuted(video);

  const wasPreloaded = video.dataset.preloading === '1';
  if (!wasPreloaded) {
    if (video.dataset.srcWebm) {
      const webm = document.createElement('source');
      webm.src = video.dataset.srcWebm;
      webm.type = 'video/webm';
      video.appendChild(webm);
    }
    if (video.dataset.srcMp4) {
      const mp4 = document.createElement('source');
      mp4.src = video.dataset.srcMp4;
      mp4.type = 'video/mp4';
      video.appendChild(mp4);
    }
  }

  video.preload = 'auto';

  video.addEventListener('stalled', () => stalledVideos.add(video));
  video.addEventListener('error', () => stalledVideos.add(video));
  video.addEventListener('playing', () => stalledVideos.delete(video));

  if (wasPreloaded && video.readyState >= 1) {
    stalledVideos.delete(video);
    if (video.dataset.inView === '1') tryPlay(video);
    return;
  }

  if (!wasPreloaded) video.load();

  const onReady = () => {
    stalledVideos.delete(video);
    if (video.dataset.inView === '1') tryPlay(video);
  };

  if (video.readyState >= 3) {
    onReady();
  } else {
    video.addEventListener('canplay', onReady, { once: true });
    video.addEventListener('loadeddata', onReady, { once: true });
  }
}

function preloadVideoFull(video) {
  if (video.dataset.loaded || video.dataset.preloading) return;
  video.dataset.preloading = '1';
  ensureMuted(video);

  if (video.dataset.srcWebm) {
    const webm = document.createElement('source');
    webm.src = video.dataset.srcWebm;
    webm.type = 'video/webm';
    video.appendChild(webm);
  }
  if (video.dataset.srcMp4) {
    const mp4 = document.createElement('source');
    mp4.src = video.dataset.srcMp4;
    mp4.type = 'video/mp4';
    video.appendChild(mp4);
  }

  video.preload = 'auto';
  video.load();
}

const preloadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      preloadVideoFull(entry.target);
      preloadObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '200% 0px' });

const playbackObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.dataset.inView = '1';
      if (!video.dataset.loaded) {
        loadVideoSources(video);
      } else if (video.paused) {
        if (video.ended) video.currentTime = 0;
        tryPlay(video);
      }
    } else {
      video.dataset.inView = '0';
      if (video.dataset.loaded) video.pause();
    }
  });
}, { rootMargin: '50% 0px' });

document.querySelectorAll('.lazy-video').forEach(v => {
  ensureMuted(v);
  preloadObserver.observe(v);
  playbackObserver.observe(v);
});

setInterval(() => {
  if (!stalledVideos.size) return;
  stalledVideos.forEach(video => {
    if (video.dataset.inView !== '1') return;
    ensureMuted(video);
    video.load();
    video.addEventListener('canplay', () => {
      stalledVideos.delete(video);
      tryPlay(video);
    }, { once: true });
  });
}, 3000);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  document.querySelectorAll('.lazy-video').forEach(video => {
    if (video.dataset.loaded && video.dataset.inView === '1' && video.paused) {
      tryPlay(video);
    }
  });
});

function startTitleAnimation() {
  const blurTitles = document.querySelectorAll('.title-area > .blur-in');
  const first = blurTitles[0];
  const second = blurTitles[1];

  if (!first || first.classList.contains('visible')) return;

  first.classList.add('visible');

  first.addEventListener('transitionend', function onIn(e) {
    if (e.propertyName !== 'opacity') return;
    first.removeEventListener('transitionend', onIn);

    setTimeout(() => {
      first.classList.remove('visible');

      first.addEventListener('transitionend', function onOut(e) {
        if (e.propertyName !== 'opacity') return;
        first.removeEventListener('transitionend', onOut);
        if (second) second.classList.add('visible');
      });
    }, 600);
  });
}

window.addEventListener('load', () => {
  if (sessionStorage.getItem('site_auth') === '1') {
    startTitleAnimation();
  }
});

const snapTarget = document.querySelector('#section-1 .section-header');
let hasSnapped = !!initialHash && initialHash !== '#title';
let touchStartY = 0;

function doSnap() {
  hasSnapped = true;
  cleanup();
  const y = snapTarget.getBoundingClientRect().top + window.scrollY - 64;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo({ top: y, behavior: 'smooth' });
  setTimeout(() => { document.documentElement.style.scrollBehavior = ''; }, 1200);
}

function cleanup() {
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('keydown', onSnapKey);
}

function inTitleArea() {
  return !hasSnapped && window.scrollY < window.innerHeight * 0.5;
}

function onWheel(e) {
  if (!inTitleArea()) return;
  if (e.deltaY > 0) { e.preventDefault(); doSnap(); }
}
function onTouchStart(e) { touchStartY = e.touches[0].clientY; }
function onTouchMove(e) {
  if (!inTitleArea()) return;
  if (touchStartY - e.touches[0].clientY > 10) { e.preventDefault(); doSnap(); }
}
function onSnapKey(e) {
  if (!inTitleArea()) return;
  if (e.code === 'ArrowDown' || e.code === 'PageDown' || e.code === 'Space') {
    e.preventDefault(); doSnap();
  }
}

window.addEventListener('wheel', onWheel, { passive: false });
window.addEventListener('touchstart', onTouchStart, { passive: true });
window.addEventListener('touchmove', onTouchMove, { passive: false });
window.addEventListener('keydown', onSnapKey);

// Scroll-driven hero full-bleed expansion (first hero per section)
(function initHeroBleed() {
  const wrap = document.querySelector('.content-wrap');
  const targets = [];
  document.querySelectorAll('.case-study:not(#section-4)').forEach(section => {
    const hero = section.querySelector('.hero');
    if (hero) targets.push(hero);
  });
  if (!wrap || !targets.length) return;

  let naturalW = 0;

  const wrapEntries = [];
  targets.forEach(hero => {
    const gw = hero.querySelector('.hero-graphic-wrap');
    if (gw) wrapEntries.push({ hero, gw });
  });

  function lockGraphicSizes() {
    wrapEntries.forEach(({ hero, gw }) => {
      hero.style.removeProperty('width');
      hero.style.removeProperty('max-width');
      hero.style.removeProperty('margin-left');
      gw.style.removeProperty('max-width');
      gw.style.removeProperty('max-height');
    });
    const sizes = wrapEntries.map(({ gw }) => {
      const r = gw.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });
    wrapEntries.forEach(({ gw }, i) => {
      gw.style.maxWidth = sizes[i].w + 'px';
      gw.style.maxHeight = sizes[i].h + 'px';
    });
  }

  function measureNatural() {
    const pad = parseFloat(getComputedStyle(wrap).paddingLeft) || 0;
    naturalW = wrap.clientWidth - pad * 2;
    targets.forEach(hero => {
      hero.style.setProperty('--hero-natural-w', naturalW + 'px');
    });
    lockGraphicSizes();
  }

  function update() {
    const viewH = window.innerHeight;
    const viewW = document.documentElement.clientWidth;
    const extraMax = viewW - naturalW;
    if (extraMax <= 0) return;

    targets.forEach(hero => {
      const rect = hero.getBoundingClientRect();

      if (rect.bottom <= 0 || rect.top >= viewH) {
        hero.style.removeProperty('width');
        hero.style.removeProperty('max-width');
        hero.style.removeProperty('margin-left');
        return;
      }

      const raw = (viewH - rect.top) / (viewH / 2);
      const clamped = Math.max(0, Math.min(1, raw));
      const progress = clamped * clamped * (3 - 2 * clamped);

      if (progress < 0.005) {
        hero.style.removeProperty('width');
        hero.style.removeProperty('max-width');
        hero.style.removeProperty('margin-left');
        return;
      }

      const extra = extraMax * progress;
      hero.style.setProperty('width', (naturalW + extra) + 'px', 'important');
      hero.style.setProperty('max-width', 'none', 'important');
      hero.style.setProperty('margin-left', (-extra / 2) + 'px', 'important');
    });
  }

  measureNatural();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => { measureNatural(); update(); });
  update();
})();

const stickyNav = document.querySelector('.sticky-nav');
const section1 = document.querySelector('#section-1');
const endSection = document.querySelector('.end-section');

if (stickyNav && section1) {
  const navLinksEl = stickyNav.querySelector('.nav-links');
  const navCardEl = stickyNav.querySelector('.nav-card');
  const navSides = stickyNav.querySelectorAll('.nav-side');

  function applyNavState(expanded, atEnd) {
    stickyNav.classList.toggle('at-end', !!atEnd);

    if (atEnd) {
      stickyNav.classList.remove('expanded');
      navLinksEl.style.setProperty('max-width', '0', 'important');
      navLinksEl.style.setProperty('opacity', '0', 'important');
      navCardEl.style.setProperty('flex-grow', '0', 'important');
      navSides.forEach(s => { s.style.cssText = ''; });
      return;
    }

    if (expanded) {
      stickyNav.classList.add('expanded');
      navLinksEl.style.cssText = '';
      navCardEl.style.cssText = '';
      navSides.forEach(s => { s.style.cssText = ''; });
    } else {
      stickyNav.classList.remove('expanded');
      navLinksEl.style.setProperty('max-width', '0', 'important');
      navLinksEl.style.setProperty('opacity', '0', 'important');
      navCardEl.style.setProperty('flex-grow', '0', 'important');
      navSides.forEach(s => {
        s.style.setProperty('opacity', '', '');
        s.style.setProperty('max-width', '', '');
      });
    }
  }

  applyNavState(false, false);

  let navTicking = false;
  let navReady = false;

  function updateNav() {
    if (section1.offsetTop < 200) return;
    const isMobile = window.innerWidth < 768;
    const atEnd = !isMobile && endSection && window.scrollY > endSection.offsetTop - window.innerHeight * 0.5;
    const expanded = !atEnd && window.scrollY > section1.offsetTop - 100;
    applyNavState(expanded, atEnd);
    if (navReady) {
      if (!atEnd) {
        navLinksEl.style.cssText = '';
        navCardEl.style.cssText = '';
        navSides.forEach(s => { s.style.cssText = ''; });
      }
    }
  }

  function initNav() {
    updateNav();
    navReady = true;
    navLinksEl.style.cssText = '';
    navCardEl.style.cssText = '';
    navSides.forEach(s => { s.style.cssText = ''; });
  }

  if (document.readyState === 'complete') {
    initNav();
  } else {
    window.addEventListener('load', initNav);
  }

  window.addEventListener('scroll', () => {
    if (!navTicking) {
      requestAnimationFrame(() => { updateNav(); navTicking = false; });
      navTicking = true;
    }
  }, { passive: true });
}

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.case-study, .interstitial-title');
const sectionIds = ['section-1', 'section-2', 'section-3', 'section-4-intro'];
let clickLock = false;
let lastHash = window.location.hash;

function setActiveLink(idx) {
  navLinks.forEach(l => l.classList.remove('active'));
  if (idx >= 0 && idx < navLinks.length) navLinks[idx].classList.add('active');
}

function updateHash(hash) {
  if (hash === lastHash) return;
  lastHash = hash;
  history.replaceState(null, '', hash || (window.location.pathname + window.location.search));
}

navLinks.forEach((link, i) => {
  link.addEventListener('click', () => {
    clickLock = true;
    setActiveLink(i);
    lastHash = '#' + sectionIds[i];
    setTimeout(() => { clickLock = false; }, 800);
  });
});

let hashTicking = false;
window.addEventListener('scroll', () => {
  if (hashTicking || clickLock) return;
  hashTicking = true;
  requestAnimationFrame(() => {
    hashTicking = false;
    const scrollY = window.scrollY;
    const offset = 120;
    let currentId = null;

    for (let i = sections.length - 1; i >= 0; i--) {
      const s = sections[i];
      if (s.offsetTop - offset <= scrollY) {
        currentId = s.id;
        break;
      }
    }

    if (currentId) {
      updateHash('#' + currentId);
      setActiveLink(sectionIds.indexOf(currentId));
    } else {
      updateHash('');
      navLinks.forEach(l => l.classList.remove('active'));
    }
  });
}, { passive: true });

if (navLinks.length && sections.length) {
  const visibilityMap = new Map();

  const activeObserver = new IntersectionObserver((entries) => {
    if (clickLock) return;
    entries.forEach(entry => {
      visibilityMap.set(entry.target.id, entry.intersectionRatio);
    });
    let bestId = null;
    let bestRatio = 0;
    for (const [id, ratio] of visibilityMap) {
      if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
    }
    if (bestRatio > 0.02) {
      setActiveLink(sectionIds.indexOf(bestId));
    } else {
      navLinks.forEach(l => l.classList.remove('active'));
    }
  }, { threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1] });

  sections.forEach(s => activeObserver.observe(s));
}

(function initCanvasReveal() {
  const zones = document.querySelectorAll('.cursor-reveal-zone');
  if (!zones.length) return;

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
  }

  function easeInOut(t) { return t * t * (3 - 2 * t); }

  function wrap(min, max, val) {
    const r = max - min;
    return min + ((((val - min) % r) + r) % r);
  }

  zones.forEach(zone => {
    const canvas = zone.querySelector('.reveal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const prefix = zone.dataset.revealPrefix || '';
    const count = parseInt(zone.dataset.revealCount, 10) || 0;
    const images = [];
    for (let i = 1; i <= count; i++) {
      const img = new Image();
      img.src = prefix + i + '.webp';
      images.push(img);
    }

    const CELL = 0.075;
    const GAP = 0.06;
    const MAX_DIST = 0.3;
    const MAX_SCALE = 4;
    const LERP = 0.005;
    const DRIFT = 50;

    const focus = { x: window.innerWidth / 2, y: 0 };
    let t0 = 0, tPrev = 0, active = false, raf = null;

    function resize() {
      const h = zone.offsetHeight;
      canvas.width = window.innerWidth * dpr;
      canvas.height = h * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = h + 'px';
      focus.y = h / 2;
    }

    function tick(now) {
      if (!active) return;
      if (!t0) { t0 = now; tPrev = now; }
      const dt = Math.min(now - tPrev, 50);
      tPrev = now;
      const elapsed = (now - t0) / 1000;

      const rect = zone.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = canvas.height / dpr;

      if (isTouch) {
        const rad = Math.min(vw, vh) * 0.35;
        focus.x = vw / 2 + rad * Math.cos(elapsed * 0.75);
        focus.y = vh / 2 + rad * Math.sin(elapsed * 0.75);
      } else {
        focus.x += (mouse.x - focus.x) * LERP * dt;
        focus.y += ((mouse.y - rect.top) - focus.y) * LERP * dt;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      const ready = images.filter(im => im.complete && im.naturalWidth);
      if (!ready.length) { raf = requestAnimationFrame(tick); return; }

      const cell = vw * CELL;
      const step = cell + vw * GAP;
      const maxD = vw * MAX_DIST;
      const cols = Math.ceil(vw / step) + 2;
      const rows = Math.ceil(vh / step) + 2;

      let idx = 0;
      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const cx = wrap(-step, vw + step, c * step + elapsed * DRIFT);
          const cy = wrap(-step, vh + step, r * step - elapsed * DRIFT * 0.7);
          const dx = cx - focus.x;
          const dy = cy - focus.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxD) {
            const s = Math.max(0, MAX_SCALE - easeInOut(dist / maxD) * MAX_SCALE);
            if (s > 0.01) {
              const img = ready[idx % ready.length];
              const w = cell * s;
              const h = w * img.naturalHeight / img.naturalWidth;
              ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
            }
          }
          idx++;
        }
      }

      raf = requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          active = true;
          resize();
          t0 = 0;
          if (!raf) raf = requestAnimationFrame(tick);
        } else {
          active = false;
          if (raf) { cancelAnimationFrame(raf); raf = null; }
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    }, { threshold: 0.05 });

    obs.observe(zone);
    window.addEventListener('resize', resize);
  });
})();
