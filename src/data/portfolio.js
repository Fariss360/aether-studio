// Portfolio manifest. `src`/`proxy`/`poster` paths are filled in by the
// media pipeline (scripts/optimize-media.mjs) which writes web-ready files
// into /public/media. Update titles/categories here freely.
export const portfolio = [
  {
    id: 'paradise-diner',
    title: 'Paradise Diner',
    category: 'Mini-Drama',
    file: 'paradise diner 71',
    accent: '--voltage',
    span: 'wide',     // layout weight on the timeline
    offset: 0.0       // vertical float offset (0..1)
  },
  {
    id: 'porsche',
    title: 'Porsche',
    category: 'Automotive Film',
    file: 'Porche',
    accent: '--cyan',
    span: 'tall',
    offset: 0.35
  },
  {
    id: 'a7-space',
    title: 'A7 // Space Scene',
    category: 'Cinematic SciFi',
    file: 'A7 space scene-1',
    accent: '--teal',
    span: 'wide',
    offset: 0.12
  },
  {
    id: 'cola',
    title: 'Cola',
    category: 'Beverage Spot',
    file: 'cola preview',
    accent: '--voltage',
    span: 'std',
    offset: 0.5
  },
  {
    id: 'ai-skincare',
    title: 'AI Skincare',
    category: 'Beauty Ad',
    file: 'AI-skincare',
    accent: '--cyan',
    span: 'std',
    offset: 0.08
  },
  {
    id: 'auraglow',
    title: 'Auraglow',
    category: 'UGC Ad',
    file: 'Auraglow UGC',
    accent: '--teal',
    span: 'std',
    offset: 0.42
  },
  {
    id: 'penguin-voyd',
    title: 'Penguin Voyd',
    category: 'Character Short',
    file: 'Penguin Voyd',
    accent: '--voltage',
    span: 'tall',
    offset: 0.2
  }
];

// Studio pipeline stages for the process conduit (block 03)
export const pipeline = [
  { id: 'prompt',    label: 'Prompt',    desc: 'Intent becomes language' },
  { id: 'model',     label: 'Model',     desc: 'Latent space, summoned' },
  { id: 'direction', label: 'Direction', desc: 'Framing, motion & beat' },
  { id: 'render',    label: 'Render',    desc: 'Frames materialise' },
  { id: 'grade',     label: 'Grade',     desc: 'Colour & mood locked' },
  { id: 'master',    label: 'Master',    desc: 'Delivered broadcast-ready' }
];
