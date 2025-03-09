import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import type { UserConfig, ConfigEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  // Carica le variabili d'ambiente in base alla modalità (development, production)
  const env = loadEnv(mode, process.cwd())
  
  // Configurazione di base comune a tutti gli ambienti
  const config: UserConfig = {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Definisce le variabili d'ambiente accessibili nell'app
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      // Aumenta il limite di avviso per i chunk
      chunkSizeWarningLimit: 600,
      // Ottimizza la build con esbuild (predefinito)
      minify: 'esbuild',
      // Abilita o disabilita sourcemap in base all'ambiente
      sourcemap: mode === 'development',
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
  };
  
  // Configurazione specifica per ambiente di sviluppo
  if (mode === 'development') {
    config.server = {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    };
  }
  
  return config;
})
