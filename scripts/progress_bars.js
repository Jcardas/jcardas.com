// Animate progress bars on page load
(function animateProgressBars() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate() {
    const bars = document.querySelectorAll('.progress-bar[data-target]');
    bars.forEach((bar, idx) => {
      const target = parseInt(bar.getAttribute('data-target'), 10);
      if (Number.isNaN(target)) return;

      // Stagger slightly for a nicer effect
      const delay = prefersReduced ? 0 : idx * 100;

      // Ensure starting width is 0%
      bar.style.width = '0%';

      // Trigger on next frame to allow transition
      setTimeout(() => {
        if (!prefersReduced) {
          bar.style.transitionProperty = 'width';
          // If Tailwind classes set transition, keep them; this is just a guard.
        } else {
          // Remove transition for reduced motion users
          bar.style.transition = 'none';
        }
  const clamped = Math.max(0, Math.min(100, target));
  bar.style.width = `${clamped}%`;
  bar.setAttribute('aria-valuenow', String(clamped));
      }, delay + 50);
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Delay slightly to ensure layout is calculated
    setTimeout(animate, 0);
  } else {
    window.addEventListener('DOMContentLoaded', animate);
  }
})();
