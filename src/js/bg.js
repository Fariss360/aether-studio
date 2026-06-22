// Lightweight particle field: slow-drifting motes (suspended sediment) with
// faint links, drawn on a canvas behind all content. Cheap + capped DPR.
export function initBackground({ reduced }) {
  const canvas = document.querySelector('.bg-particles');
  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');

  let w, h, dpr, dots;
  const COUNT = Math.min(70, Math.round(innerWidth / 24));
  const LINK = 140;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }

  function seed() {
    dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr,
      r: (Math.random() * 1.6 + 0.6) * dpr
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 227, 216, 0.55)'; // cyan motes
      ctx.fill();
    }

    // faint links between nearby motes
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK * dpr) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(31, 163, 168, ${0.12 * (1 - dist / (LINK * dpr))})`;
          ctx.lineWidth = dpr * 0.6;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  let raf;
  resize(); seed(); frame();

  let to;
  addEventListener('resize', () => {
    clearTimeout(to);
    to = setTimeout(() => { resize(); seed(); }, 200);
  });

  // pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(frame);
  });
}
