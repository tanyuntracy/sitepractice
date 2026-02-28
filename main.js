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

function ensureMuted(video) {
  video.muted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.defaultMuted = true;
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
      } else if (video.paused) {
        tryPlay(video);
      }
    } else if (video.dataset.loaded && !video.paused) {
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
      if (video.dataset.loaded && video.paused) {
        const rect = video.getBoundingClientRect();
        const inView = rect.top < window.innerHeight + 200 && rect.bottom > -200;
        if (inView) tryPlay(video);
      }
    });
    retryStalledVideos();
  }, { once: true, passive: true });
});

window.addEventListener('load', () => {
  const firstTitle = document.querySelector('.title-reveal');
  if (firstTitle) firstTitle.classList.add('visible');
});

const stickyNav = document.querySelector('.sticky-nav');
const section1 = document.querySelector('#section-1');

if (stickyNav && section1) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const isBelow = !entry.isIntersecting && entry.boundingClientRect.top > 0;
      stickyNav.classList.toggle('expanded', !isBelow);
    });
  }, { threshold: 0 }).observe(section1);
}

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.case-study');

if (navLinks.length && sections.length) {
  const sectionIds = ['section-1', 'section-2', 'section-3', 'section-4'];

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = sectionIds.indexOf(entry.target.id);
        if (idx !== -1) {
          navLinks.forEach(l => l.classList.remove('active'));
          navLinks[idx].classList.add('active');
        }
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(s => activeObserver.observe(s));
}
