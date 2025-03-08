import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  build: {
    // Aumenta il limite di avviso per i chunk
    chunkSizeWarningLimit: 600,
    // Ottimizza la build con esbuild (predefinito)
    minify: 'esbuild',
    // Configurazione per la suddivisione dei chunk
    rollupOptions: {
      output: {
        // Strategia di chunking per ridurre la dimensione del bundle principale
        manualChunks: (id) => {
          // Chunk per UI framework
          if (id.includes('node_modules/naive-ui')) {
            return 'naive-ui';
          }
          
          // Chunk per librerie di routing e state management
          if (id.includes('node_modules/vue-router') || 
              id.includes('node_modules/pinia')) {
            return 'framework';
          }
          
          // Chunk per axios
          if (id.includes('node_modules/axios')) {
            return 'api';
          }
          
          // Chunk per vueuse e altre utility
          if (id.includes('node_modules/@vueuse')) {
            return 'utils';
          }
          
          // Raggruppa tutti gli altri moduli di node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
