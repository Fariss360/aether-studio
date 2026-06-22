import { splitChars } from './util.js';
import { videoController } from './clips.js';

// THE REEL — horizontal revolving carousel.
// Video nodes ride a horizontal ring around the central hub. Scrolling spins
// the ring: each node sweeps to the front (large, sharp, autoplaying), then
// recedes to the back (small, blurred, faded) as the next one arrives.
export function initTimeline({ gsap, ScrollTrigger }) {
  const field = document.querySelector('.constellation');
  const svg = document.querySelector('.edges');
  if (!field) return;

  const { focus, ensureLoaded, nodes } = videoController();
  const N = nodes.length;
  if (!N) return;

  gsap.set(nodes, { xPercent: -50, yPercent: -50, transformPerspective: 900 });

  // per-node fast setters (avoid per-frame gsap.set overhead)
  const set = nodes.map((n) => ({
    x: gsap.quickSetter(n, 'x', 'px'),
    y: gsap.quickSetter(n, 'y', 'px'),
    scale: gsap.quickSetter(n, 'scale'),
    rotY: gsap.quickSetter(n, 'rotationY', 'deg')
  }));

  // dynamic hub→node edges
  const lines = nodes.map(() => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('class', 'edge');
    svg.appendChild(l);
    return l;
  });

  let RX, RY, cx, cy;
  function measure() {
    const r = field.getBoundingClientRect();
    cx = r.width / 2; cy = r.height / 2;
    RX = r.width * 0.30;   // horizontal spread
    RY = r.height * 0.05;  // slight vertical arc
    svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
  }
  measure();

  let current = -1;
  const STEP = (Math.PI * 2) / N;

  function render(rotation) {
    let frontDepth = -1, frontIdx = 0;
    for (let i = 0; i < N; i++) {
      const ang = i * STEP - rotation;
      const s = Math.sin(ang);
      const c = Math.cos(ang);
      const depth = (c + 1) / 2;            // 0 (back) → 1 (front)

      const x = s * RX;
      const y = -Math.abs(s) * RY;          // arc up toward the sides
      const scale = 0.2 + depth * 0.8;      // front=1 (crisp), back=0.2
      const opacity = 0.18 + depth * 0.82;
      const blur = (1 - depth) * 5;
      const z = Math.round(depth * 100) + 1;

      set[i].x(x);
      set[i].y(y);
      set[i].scale(scale);
      set[i].rotY(-s * 38);                 // 3D card turn
      const n = nodes[i];
      n.style.opacity = opacity;
      n.style.filter = blur > 0.15 ? `blur(${blur}px)` : 'none';
      n.style.zIndex = z;

      // edge from hub to this node
      const l = lines[i];
      l.setAttribute('x1', cx); l.setAttribute('y1', cy);
      l.setAttribute('x2', cx + x); l.setAttribute('y2', cy + y);
      l.style.opacity = (0.04 + depth * 0.16) * (1 - depth); // fade out as it nears front

      if (depth > frontDepth) { frontDepth = depth; frontIdx = i; }
    }

    if (frontIdx !== current) { current = frontIdx; focus(frontIdx); ensureLoaded((frontIdx + 1) % N); }
  }

  ScrollTrigger.create({
    trigger: '.constellation',
    start: 'top top',
    end: () => '+=' + N * 75 + '%',
    pin: '.constellation',
    pinSpacing: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefreshInit: measure,
    onUpdate: (self) => render(self.progress * Math.PI * 2)
  });

  render(0);
  ensureLoaded(0);

  // intro title reveal — chars surface from the void
  const title = document.querySelector('#timeline .section-title');
  if (title) {
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120, opacity: 0, rotateX: -75, filter: 'blur(8px)',
      stagger: { each: 0.03, from: 'start' }, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: '#timeline', start: 'top 70%' }
    });
  }
}
