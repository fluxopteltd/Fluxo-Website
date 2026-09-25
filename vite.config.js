import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import prerenderBlog from './scripts/prerender-blog.js';

export default defineConfig({
  plugins: [react(), prerenderBlog()],
  server: {
    port: 3000,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
