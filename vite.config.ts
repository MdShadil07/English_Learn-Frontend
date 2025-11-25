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
}));
