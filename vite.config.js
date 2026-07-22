import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so the build works from any path — GitHub Pages subpath
  // (/taskip/) and host roots like Netlify alike. Safe because we use HashRouter.
  base: './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
