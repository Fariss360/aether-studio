// Decoupled nav island: shrinks on scroll-down, expands on scroll-up,
// and lifts toward the pointer when nearby.
export function initNav({ gsap, ScrollTrigger }) {
  const nav = document.querySelector('.nav-island');
  if (!nav) return;

  // scroll-direction response
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const down = self.direction > 0 && self.scroll() > 80;
      gsap.to(nav, {
        scale: down ? 0.92 : 1,
        opacity: down ? 0.6 : 1,
        y: down ? -10 : 0,
        duration: 0.5, ease: 'power3.out', overwrite: 'auto'
      });
    }
  });

  // mouse-proximity lift
  addEventListener('pointermove', (e) => {
    const r = nav.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < 280) {
      gsap.to(nav, { x: dx * 0.04, y: dy * 0.06, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.to(nav, { x: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
    }
  });
}
