import './styles/tokens.css';
import './styles/base.css';
import './styles/blocks.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initCursor } from './js/cursor.js';
import { initBackground } from './js/bg.js';
import { initNav } from './js/nav.js';
import { buildClips } from './js/clips.js';
import { initHero } from './js/hero.js';
import { initTimeline } from './js/timeline.js';
import { initPipeline } from './js/pipeline.js';
import { initFooter } from './js/footer.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ——— smooth scroll (Lenis drives ScrollTrigger) ———
let lenis;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ——— build DOM that depends on data ———
buildClips();

// ——— interactions ———
initBackground({ reduced });
initCursor({ reduced });
initNav({ gsap, ScrollTrigger });

// ——— scroll-bound blocks ———
if (!reduced) {
  initHero({ gsap, ScrollTrigger });
  initTimeline({ gsap, ScrollTrigger });
  initPipeline({ gsap, ScrollTrigger });
  initFooter({ gsap, ScrollTrigger });
}

// recalc after fonts/layout settle
window.addEventListener('load', () => ScrollTrigger.refresh());

export { lenis };
