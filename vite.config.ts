// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // ✨ Allow any emergent.sh preview subdomain
  server: {
    allowedHosts: ['.preview.emergentagent.com'],
    // ensure HMR works over HTTPS
    hmr: { clientPort: 443 }
  }
});