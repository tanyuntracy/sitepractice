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
