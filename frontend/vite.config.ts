// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
// other framework plugins may also be here, e.g., import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // other plugins
  ],
});
