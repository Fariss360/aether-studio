# AETHER — Cinematic site for an AI production studio

A dark, asymmetric, scroll-driven site that treats the viewport as a camera
lens moving through a fluid medium. Palette: obsidian black, tiger-orange
accents (`#FF7A00`), aquatic teal/cyan midtones.

## Stack
- **Vite** — dev server / bundler
- **GSAP** + ScrollTrigger + Flip — scroll-bound timelines & lightbox morph
- **Lenis** — smooth inertia scroll driving ScrollTrigger
- **hls.js** — (wired in package for adaptive streaming upgrade)
- **ffmpeg** — media optimization pipeline

## Structure
```
index.html                 4-block markup shell
src/
  main.js                  bootstraps Lenis + all modules
  data/portfolio.js        clip manifest + pipeline stages (edit me)
  styles/                  tokens.css (palette) / base.css / blocks.css
  js/
    cursor.js              magnetic cursor + ripple trail
    nav.js                 floating nav island
    clips.js               video frames + hover scrub + FLIP lightbox
    hero.js                prompt-to-video scrub sequence
    timeline.js            horizontal pinned portfolio
    pipeline.js            node graph
    footer.js              kinetic marquee
    util.js                char splitter, scramble
scripts/optimize-media.mjs ffmpeg pipeline → public/media
```

## Setup
```bash
npm install
npm run media        # transcode the 7 clips → public/media (mp4 + proxy + poster)
npm run media -- --webm   # optional: also emit VP9 .webm (slow)
npm run dev          # http://localhost:5173
```

The media pipeline reads from the hard-coded `SRC_DIR` in
`scripts/optimize-media.mjs`. Update that path if the portfolio moves.

## The 4 blocks
1. **Hero** — scroll-scrubbed AI prompt that types (with glitch), "submits"
   into cascading orange render bars, resolves to the showreel, dives.
2. **Timeline** — vertical scroll remapped to a horizontal editing-timeline
   of floating, asymmetric video frames; velocity-reactive skew.
3. **Pipeline** — node graph (Prompt→Model→…→Master) flown through on scroll.
4. **Footer** — counter-scrolling tiger-orange kinetic marquee.

## Notes
- Color tokens live in `src/styles/tokens.css` — re-sample from the client's
  reference JPEG and update there; everything inherits.
- `prefers-reduced-motion` disables smooth scroll, scrubbing, and the custom
  cursor; layout + palette remain intact.
