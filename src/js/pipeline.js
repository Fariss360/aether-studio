import { pipeline } from '../data/portfolio.js';
import { splitChars } from './util.js';

// Process conduit: 6 stages on a glowing rail. Scroll drives an orange
// progress fill + a travelling energy packet; each stage ignites as the
// packet reaches it.
export function initPipeline({ gsap, ScrollTrigger }) {
  const wrap = document.querySelector('.pipe-stages');
  const fill = document.querySelector('.pipe-fill');
  const packet = document.querySelector('.pipe-packet');
  if (!wrap) return;

  // build stages
  const stages = pipeline.map((s, i) => {
    const el = document.createElement('div');
    el.className = 'pstage';
    el.dataset.magnetic = '';
    el.innerHTML = `
      <span class="pnum">0${i + 1}</span>
      <span class="dot"></span>
      <span class="plabel">${s.label}</span>
      <span class="pdesc">${s.desc}</span>`;
    wrap.appendChild(el);
    return el;
  });
  const N = stages.length;

  // scrub: fill grows, packet travels, stages ignite in sequence
  gsap.timeline({
    scrollTrigger: {
      trigger: '#pipeline',
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(fill, { scaleX: p });
        gsap.set(packet, { left: p * 100 + '%' });
        stages.forEach((el, i) => {
          const threshold = i / (N - 1);
          el.classList.toggle('is-on', p >= threshold - 0.02);
        });
      }
    }
  });

  // title reveal
  const title = document.querySelector('#pipeline .section-title');
  if (title) {
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120, opacity: 0, rotateX: -75, filter: 'blur(8px)',
      stagger: { each: 0.03 }, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: '#pipeline', start: 'top 70%' }
    });
  }
}
