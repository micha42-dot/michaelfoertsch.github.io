import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Da dein Repo michaelfoertsch.github.io heißt, ist die Base URL '/'
  base: '/',
});
