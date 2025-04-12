<template>
  <n-config-provider :theme="themeStore.currentTheme" :theme-overrides="themeStore.themeOverrides">
    <div class="app-container">
      <n-message-provider>
        <n-loading-bar-provider>
          <n-dialog-provider>
            <n-notification-provider>
              <div class="app">
                <div class="app-wrapper">
                  <router-view></router-view>
                </div>
              </div>
            </n-notification-provider>
          </n-dialog-provider>
        </n-loading-bar-provider>
      </n-message-provider>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from './stores/themeStore'
import { initTokenRefresh } from './services/tokenService'
import env from './config/env'

const themeStore = useThemeStore()

// Imposta il titolo dinamico dell'applicazione in base all'ambiente
onMounted(() => {
  themeStore.initTheme()
  // Inizializza il servizio di refresh del token
  if (localStorage.getItem('token')) {
    initTokenRefresh()
  }
  console.log('tema', themeStore.currentTheme)
  // Imposta il titolo del documento in base all'ambiente
  document.title = env.appTitle

  // Log dell'ambiente corrente (solo in sviluppo)
  if (env.isDevelopment) {
    console.log(`Ambiente: ${env.appEnv}`)
    console.log(`API Base URL: ${env.apiBaseUrl}`)
  }
})
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.app-container {
  flex: 1;
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
  background-color: var(--background-base);
  color: var(--text-color);
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

.app {
  min-height: 100vh;
  background-color: var(--background-base);
  color: var(--text-color);
}

.app-wrapper {
  transition: all 0.3s ease;

  &.sidebar-collapsed {
    padding-left: 0;
  }
}
</style>
