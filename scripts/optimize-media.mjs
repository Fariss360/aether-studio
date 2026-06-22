/**
 * Media pipeline for the AETHER portfolio.
 *
 * For each source clip it produces, into /public/media:
 *   <id>.mp4        web-optimized H.264 + faststart (full quality, for lightbox)
 *   <id>.webm       VP9 alternative for full quality
 *   <id>.proxy.mp4  small, muted, low-bitrate hover-preview proxy
 *   <id>.poster.jpg first good frame as poster
 *
 * Usage: npm run media
 * Requires ffmpeg + ffprobe on PATH.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const run = promisify(execFile);
const WANT_WEBM = process.argv.includes('--webm'); // VP9 is slow; opt-in

const SRC_DIR = 'C:/Users/faris/Downloads/AI Portfolio-20260617T125502Z-3-001/AI Portfolio';
const OUT_DIR = path.resolve('public/media');

// map source filename (without ext) -> output id (mirrors src/data/portfolio.js)
const MAP = {
  'paradise diner 71': 'paradise-diner',
  'Porche':            'porsche',
  'A7 space scene-1':  'a7-space',
  'cola preview':      'cola',
  'AI-skincare':       'ai-skincare',
  'Auraglow UGC':      'auraglow',
  'Penguin Voyd':      'penguin-voyd'
};

async function ffmpeg(args) {
  await run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
}

async function processClip(srcPath, id) {
  const mp4   = path.join(OUT_DIR, `${id}.mp4`);
  const webm  = path.join(OUT_DIR, `${id}.webm`);
  const proxy = path.join(OUT_DIR, `${id}.proxy.mp4`);
  const poster= path.join(OUT_DIR, `${id}.poster.jpg`);

  console.log(`\n▸ ${id}`);

  // full quality mp4 (faststart so it streams before fully downloaded)
  console.log('  · mp4 (faststart)');
  await ffmpeg(['-i', srcPath, '-c:v', 'libx264', '-crf', '21', '-preset', 'slow',
                '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
                '-c:a', 'aac', '-b:a', '128k', mp4]);

  // vp9 webm alternative (opt-in via --webm; slow encode)
  if (WANT_WEBM) {
    console.log('  · webm (vp9)');
    await ffmpeg(['-i', srcPath, '-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0',
                  '-row-mt', '1', '-c:a', 'libopus', '-b:a', '96k', webm]);
  }

  // tiny muted hover proxy: 720px wide, lower bitrate, no audio
  console.log('  · proxy (muted preview)');
  await ffmpeg(['-i', srcPath, '-an', '-vf', "scale='min(1280,iw)':-2",
                '-c:v', 'libx264', '-crf', '30', '-preset', 'fast',
                '-pix_fmt', 'yuv420p', '-movflags', '+faststart', proxy]);

  // poster — grab a frame ~1s in
  console.log('  · poster');
  await ffmpeg(['-ss', '1', '-i', srcPath, '-frames:v', '1',
                '-vf', "scale='min(1600,iw)':-2", '-q:v', '3', poster]);
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source dir not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const files = await readdir(SRC_DIR);
  for (const f of files) {
    const base = path.parse(f).name;
    const id = MAP[base];
    if (!id) continue;
    await processClip(path.join(SRC_DIR, f), id);
  }
  console.log('\n✓ Media pipeline complete →', OUT_DIR);
}

main().catch(e => { console.error(e); process.exit(1); });
