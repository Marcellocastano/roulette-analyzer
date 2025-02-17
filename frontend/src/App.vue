<template>
  <n-config-provider :theme-overrides="currentTheme">
    <div :style="{ background: currentTheme.common?.bodyColor }">
      <n-message-provider>
        <n-loading-bar-provider>
          <n-dialog-provider>
            <n-notification-provider>
              <div class="app">
                <div class="app-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
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
import { ref } from 'vue';
import { getThemeOverrides } from './stores/theme'; // Importa la logica del tema

const isSidebarCollapsed = ref(false)
const currentTheme = ref(getThemeOverrides('dark'));
</script>

<style>
:root {
  --background-light: #ffffff;
  --background-dark: #18181c;
  --text-color-light: #333333;
  --text-color-dark: #343434;
}

html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  flex: 1;
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
  background-color: inherit;
  color: inherit;
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

.app {
  min-height: 100vh;
  background-color: var(--app-bg);
  color: var(--text-color-dark);
}

.app-wrapper {
  min-height: 100vh;
  padding-left: 250px;
  transition: padding-left 0.3s ease;

  &.sidebar-collapsed {
    padding-left: 80px;
  }
}
</style>
