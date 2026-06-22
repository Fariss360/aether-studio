// Kinetic footer: two counter-scrolling marquees whose speed reacts to
// scroll velocity (the energetic "surface break" release).
export function initFooter({ gsap, ScrollTrigger }) {
  const rows = document.querySelectorAll('.marquee-inner');
  if (!rows.length) return;

  const PHRASE = 'AETHER · MAKE SOMETHING CINEMATIC · ';

  function build() {
    rows.forEach((row, idx) => {
      // measure one phrase, then repeat enough that a single "set" exceeds the
      // viewport — then duplicate that set so a 50% loop is always covered.
      row.innerHTML = `<span>${PHRASE}</span>`;
      const unitW = row.firstChild.getBoundingClientRect().width || 600;
      const perSet = Math.max(2, Math.ceil(window.innerWidth / unitW) + 1);
      const set = `<span>${PHRASE}</span>`.repeat(perSet);
      row.innerHTML = set + set; // two identical sets → seamless -50% loop

      // kill any prior tween on this row before rebuilding
      gsap.killTweensOf(row);

      // direction: row 0 drifts right, row 1 drifts left — both stay fully
      // covered because the animated range [-50%, 0] always shows content.
      const fromX = idx % 2 === 0 ? -50 : 0;
      const toX = idx % 2 === 0 ? 0 : -50;
      gsap.set(row, { xPercent: fromX });
      const loop = gsap.to(row, { xPercent: toX, repeat: -1, duration: 24, ease: 'none' });
      row._loop = loop;
    });
  }

  build();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  addEventListener('resize', () => clearTimeout(build._t) || (build._t = setTimeout(build, 250)));

  // scroll velocity modulates speed (and direction)
  ScrollTrigger.create({
    trigger: '#footer', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      const boost = 1 + Math.abs(self.getVelocity()) / 1500;
      rows.forEach((row) => row._loop && row._loop.timeScale(self.direction * boost));
    }
  });
}
