import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Removed duplicate export default. Only one export default is allowed.
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy API requests to the backend dev server so SSE and API calls work
    proxy: {
      // forward /api/* to backend (adjust port if backend uses different PORT)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // preserve websocket and SSE
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
  // Build optimizations: manual chunking to create predictable bundles for heavy libs
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor_framer';
            if (id.includes('recharts')) return 'vendor_charts';
            if (id.includes('@tanstack') || id.includes('react-query')) return 'vendor_query';
            if (id.includes('@supabase') || id.includes('supabase')) return 'vendor_supabase';
            if (id.includes('lucide-react')) return 'vendor_icons';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor_react';
            // default vendor chunk
            return 'vendor_misc';
          }
        }
      }
    }
  },
}));
