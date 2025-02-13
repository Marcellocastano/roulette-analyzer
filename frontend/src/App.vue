<template>
  <n-config-provider :theme-overrides="currentTheme">
    <div :style="{ backgroundColor: currentTheme.common?.bodyColor }">
      <n-message-provider>
        <n-loading-bar-provider>
          <n-dialog-provider>
            <n-notification-provider>
              <router-view></router-view>
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

const currentTheme = ref(getThemeOverrides('dark'));
</script>

<style>
:root {
  --background-light: #ffffff;
  --background-dark: #18181c;
  --text-color-light: #333333;
  --text-color-dark: #ffffff;
}

html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: var(--text-color-light);
  background-color: var(--background-light);
}

body.dark-theme {
  color: var(--text-color-dark);
  background-color: var(--background-dark);
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
</style>
