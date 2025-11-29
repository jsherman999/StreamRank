import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Expose env vars to client
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});