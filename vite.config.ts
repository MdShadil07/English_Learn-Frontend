import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Use esbuild for faster, smaller minification
    minify: 'esbuild',
    // Split CSS per-chunk to avoid one giant CSS file
    cssCodeSplit: true,
    // Increase chunk warning threshold (we're splitting deliberately)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── 3D / WebGL libs — only used in Dashboard/PronunciationStudio ──
          if (
            id.includes('three') ||
            id.includes('@react-three') ||
            id.includes('react-globe')
          ) {
            return 'vendor-three';
          }

          // ── Mediasoup + Socket.io — only Practice Room ───────────────────
          if (
            id.includes('mediasoup-client') ||
            id.includes('socket.io-client')
          ) {
            return 'vendor-media';
          }

          // ── Framer Motion — used in many places, but keep it separate ────
          if (id.includes('framer-motion')) {
            return 'vendor-framer';
          }

          // ── Charts (recharts) — only Dashboard ───────────────────────────
          if (id.includes('recharts') || id.includes('victory')) {
            return 'vendor-charts';
          }

          // ── Supabase client ───────────────────────────────────────────────
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }

          // ── Radix UI primitives ───────────────────────────────────────────
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }

          // ── React core ────────────────────────────────────────────────────
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }

          // ── React Router ──────────────────────────────────────────────────
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
        },
      },
    },
  },
}));
