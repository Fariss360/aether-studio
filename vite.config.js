import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: { host: true, open: true },
  build: { target: 'es2020', outDir: 'dist', assetsInlineLimit: 0 }
});
