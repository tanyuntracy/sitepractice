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

  video.load();

  const onReady = () => {
    stalledVideos.delete(video);
    tryPlay(video);
  };

  if (video.readyState >= 3) {
    onReady();
  } else {
    video.addEventListener('canplay', onReady, { once: true });
    video.addEventListener('loadeddata', onReady, { once: true });
  }

  video.addEventListener('error', () => stalledVideos.add(video), { once: true });
}

const playbackObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      if (!video.dataset.loaded) {
        loadVideoSources(video);
      } else {
        video.currentTime = 0;
        tryPlay(video);
      }
    } else if (video.dataset.loaded) {
      video.pause();
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.lazy-video').forEach(v => {
  ensureMuted(v);
  playbackObserver.observe(v);
});

function retryStalledVideos() {
  if (!stalledVideos.size) return;
  stalledVideos.forEach(video => {
    ensureMuted(video);
    video.load();
    video.addEventListener('canplay', () => {
      stalledVideos.delete(video);
      tryPlay(video);
    }, { once: true });
  });
}

['click', 'touchstart', 'scroll'].forEach(evt => {
  document.addEventListener(evt, () => {
    document.querySelectorAll('.lazy-video').forEach(video => {
      if (video.dataset.loaded && (video.paused || video.ended)) {
        const rect = video.getBoundingClientRect();
        const inView = rect.top < window.innerHeight + 200 && rect.bottom > -200;
        if (inView) {
          video.currentTime = 0;
          tryPlay(video);
        }
      }
    });
    retryStalledVideos();
  }, { once: true, passive: true });
});

window.addEventListener('load', () => {
  const blurTitles = document.querySelectorAll('.blur-in');
  const first = blurTitles[0];
  const second = blurTitles[1];

  if (!first) return;

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

if (stickyNav && section1) {
  const navLinksEl = stickyNav.querySelector('.nav-links');
  const navCardEl = stickyNav.querySelector('.nav-card');
  const navSides = stickyNav.querySelectorAll('.nav-side');

  function applyNavState(expanded) {
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

  applyNavState(false);

  let navTicking = false;
  let navReady = false;

  function updateNav() {
    if (section1.offsetTop < 200) return;
    const expanded = window.scrollY > section1.offsetTop - 100;
    applyNavState(expanded);
    if (navReady) {
      navLinksEl.style.cssText = '';
      navCardEl.style.cssText = '';
      navSides.forEach(s => { s.style.cssText = ''; });
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

document.querySelectorAll('.collage-img').forEach(img => {
  img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
});

(function initCursorParallax() {
  const zones = document.querySelectorAll('.cursor-parallax-zone');
  if (!zones.length || window.matchMedia('(pointer: coarse)').matches) return;

  const mouse = { x: 0.5, y: 0.5 };
  const current = { x: 0.5, y: 0.5 };
  const EASE = 0.06;
  const MAX_SHIFT = 25;
  const activeZones = new Set();
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeZones.add(entry.target);
        if (!rafId) tick();
      } else {
        activeZones.delete(entry.target);
        entry.target.querySelectorAll('[data-parallax-depth]').forEach(el => {
          el.style.removeProperty('--parallax-x');
          el.style.removeProperty('--parallax-y');
        });
        if (!activeZones.size && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  zones.forEach(z => observer.observe(z));

  function tick() {
    current.x += (mouse.x - current.x) * EASE;
    current.y += (mouse.y - current.y) * EASE;

    const ox = (current.x - 0.5) * 2;
    const oy = (current.y - 0.5) * 2;

    activeZones.forEach(zone => {
      zone.querySelectorAll('[data-parallax-depth]').forEach(el => {
        const d = parseFloat(el.dataset.parallaxDepth) || 0;
        el.style.setProperty('--parallax-x', (ox * d * MAX_SHIFT) + 'px');
        el.style.setProperty('--parallax-y', (oy * d * MAX_SHIFT) + 'px');
      });
    });

    rafId = requestAnimationFrame(tick);
  }
})();
