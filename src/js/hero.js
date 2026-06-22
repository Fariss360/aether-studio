import { scramble } from './util.js';
import { portfolio } from '../data/portfolio.js';

const PROMPT = 'a cinematic short — a girl drives down a sunset highway to a roadside diner to meet her date; she slides into the booth, then the waiter delivers his milkshake to the table. warm 35mm grain, neon glow, slow push-in...';

// Hero: scroll-scrubbed prompt-to-video sequence.
export function initHero({ gsap, ScrollTrigger }) {
  const typed = document.querySelector('.prompt-box .typed');
  const reelHost = document.querySelector('.hero-reel');

  // populate background kinetic marquee — stacked counter-scrolling rows
  // that fill the section (duplicated content for a seamless 50% loop).
  const hmWrap = document.querySelector('.hero-marquee');
  if (hmWrap) {
    const unit = '<span>MAKE SOMETHING CINEMATIC&nbsp;·&nbsp;</span>';
    const ROWS = 7;
    for (let i = 0; i < ROWS; i++) {
      const row = document.createElement('div');
      row.className = 'hm-row' + (i % 2 ? ' fill' : '');
      const dir = i % 2 ? 'right' : 'left';
      const dur = 30 + (i % 4) * 6;          // varied speed → parallax
      row.innerHTML = `<div class="hm-track" style="animation: hm-${dir} ${dur}s linear infinite; animation-delay: -${i * 3}s">${unit.repeat(8)}</div>`;
      hmWrap.appendChild(row);
    }
  }

  // inject hero showreel (first portfolio clip's proxy, autoplay muted loop)
  const hero = portfolio[0];
  reelHost.innerHTML = `<video src="/media/${hero.id}.proxy.mp4" muted loop autoplay playsinline
                                poster="/media/${hero.id}.poster.jpg"></video>`;

  const proxy = { chars: 0 };

  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=250%', pin: true, scrub: 1 }
  });

  // beat 1 — type the prompt (with occasional glitch scramble)
  tl.to(proxy, {
    chars: PROMPT.length, duration: 35, ease: 'none',
    onUpdate: () => {
      const n = Math.floor(proxy.chars);
      let slice = PROMPT.slice(0, n);
      if (Math.random() < 0.08 && n > 3) {
        slice = slice.slice(0, -3) + `<span class="glitch">${scramble(slice.slice(-3))}</span>`;
        typed.innerHTML = slice;
      } else {
        typed.textContent = slice;
      }
    }
  }, 0);

  // beat 2 — "submit": prompt box energizes orange, render bars cascade, mesh blooms
  tl.to('.prompt-box', { borderColor: 'var(--voltage)', boxShadow: '0 0 60px -10px var(--voltage)', duration: 5 }, 35)
    .fromTo('.render-skeleton .bar',
      { scaleX: 0 },
      { scaleX: 1, stagger: { each: 1.2, from: 'start' }, ease: 'power2.out', duration: 4 }, 38)
    .fromTo('.hero-mesh',
      { opacity: 0, scale: 0.6, filter: 'blur(40px)' },
      { opacity: 0.7, scale: 1, filter: 'blur(0px)', duration: 25, ease: 'sine.out' }, 40);

  // beat 3 — bars resolve to showreel, camera dives (compress → handoff)
  tl.to('.render-skeleton', { opacity: 0, duration: 6 }, 70)
    .fromTo('.hero-reel',
      { clipPath: 'inset(50% 50% 50% 50%)', scale: 1.15 },
      { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 18, ease: 'power3.inOut' }, 70)
    .to('.hero-stage', { scale: 0.92, filter: 'brightness(0.45)', duration: 14 }, 85);
}
