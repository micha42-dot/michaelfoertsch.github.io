import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // './' sorgt dafür, dass Pfade relativ sind. Das löst fast alle "Datei nicht gefunden" Probleme.
  base: './',
});
