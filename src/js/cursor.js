import { gsap } from 'gsap';

// Magnetic cursor: orange core + laggy teal ring that pulls toward
// [data-magnetic] elements and emits fluid ripples on movement/click.
export function initCursor({ reduced }) {
  if (reduced || matchMedia('(hover: none)').matches) return;

  const coreEl = document.querySelector('.cursor-core');
  const ringEl = document.querySelector('.cursor-ring');
  const core = gsap.quickSetter(coreEl, 'css');
  const ring = gsap.quickSetter(ringEl, 'css');

  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const cur = { x: pos.x, y: pos.y };
  let magnet = null;

  addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; });

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointerenter', () => (magnet = el));
    el.addEventListener('pointerleave', () => (magnet = null));
  });

  gsap.ticker.add(() => {
    let tx = pos.x, ty = pos.y;
    if (magnet) {
      const r = magnet.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      tx += (cx - tx) * 0.4;
      ty += (cy - ty) * 0.4;
    }
    cur.x += (tx - cur.x) * 0.2; // core: snappy
    cur.y += (ty - cur.y) * 0.2;
    core({ x: cur.x, y: cur.y, scale: magnet ? 0 : 1 });

    const rw = magnet ? magnet.offsetWidth + 24 : 32;
    const rh = magnet ? magnet.offsetHeight + 24 : 32;
    ring({
      x: cur.x + (pos.x - cur.x) * 0.5, // ring lags → fluid trail
      y: cur.y + (pos.y - cur.y) * 0.5,
      width: rw + 'px',
      height: rh + 'px',
      borderRadius: magnet ? '16px' : '50%',
      borderColor: magnet ? 'var(--voltage)' : 'var(--cyan)'
    });
  });

  // ripple emission
  let last = 0;
  function spawn(x, y, color) {
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.borderColor = color;
    document.body.append(r);
    gsap.fromTo(r,
      { x, y, scale: 0, opacity: 0.6 },
      { scale: 6, opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => r.remove() });
  }
  addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < 90) return; // throttle trail
    last = now;
    spawn(e.clientX, e.clientY, magnet ? 'var(--voltage)' : 'var(--cyan)');
  });
  addEventListener('pointerdown', (e) => spawn(e.clientX, e.clientY, 'var(--voltage)'));
}
