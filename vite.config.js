import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub user site: https://a-prasatharumugam.github.io/
  base: '/',
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    modulePreload: {
      resolveDependencies(filename, deps) {
        return deps.filter(
          (dep) => !dep.includes('vendor-three') && !dep.includes('vendor-motion'),
        );
      },
    },
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
