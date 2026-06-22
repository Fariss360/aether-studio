import { portfolio } from '../data/portfolio.js';

const MEDIA = '/media';

// Build the video constellation: small video nodes orbiting a central hub.
// timeline.js drives the scroll-focus; this module owns DOM + video control.
export function buildClips() {
  const field = document.querySelector('.constellation');
  if (!field) return;

  const total = portfolio.length;

  portfolio.forEach((item, i) => {
    const el = document.createElement('article');
    el.className = 'vnode';
    el.dataset.id = item.id;
    el.dataset.index = i;
    el.innerHTML = `
      <div class="vnode-frame">
        <video class="vnode-video" muted loop playsinline preload="none"
               poster="${MEDIA}/${item.id}.poster.jpg"
               data-full="${MEDIA}/${item.id}.mp4"></video>
        <div class="vnode-grade"></div>
      </div>
      <div class="vnode-meta">
        <span class="vnode-index">${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
        <h3>${item.title}</h3>
        <span class="vnode-cat">${item.category}</span>
      </div>`;
    field.appendChild(el);
  });
}

// Video control surface used by timeline.js: load + autoplay the focused node.
export function videoController() {
  const nodes = [...document.querySelectorAll('.vnode')];
  const videoAt = (i) => nodes[i]?.querySelector('video');

  function ensureLoaded(i) {
    const v = videoAt(i);
    if (v && !v.src) { v.preload = 'auto'; v.src = v.dataset.full; v.load(); }
  }

  function focus(i) {
    nodes.forEach((n, j) => {
      const v = n.querySelector('video');
      if (j === i) {
        ensureLoaded(i);
        v.play().catch(() => {});
        n.classList.add('is-focused');
      } else {
        v.pause();
        n.classList.remove('is-focused');
      }
    });
  }

  return { ensureLoaded, focus, nodes };
}
