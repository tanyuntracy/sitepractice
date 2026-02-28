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
