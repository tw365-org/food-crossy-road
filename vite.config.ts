import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // 支援 GitHub Pages (子路徑) 與 Cloudflare Pages (根路徑)
  server: {
    port: 8888,
    strictPort: true,
    open: false,
    host: true
  }
});
