<template>
  <n-config-provider :theme-overrides="currentTheme">
    <div :style="{ background: currentTheme.common?.bodyColor }">
      <n-message-provider>
        <n-loading-bar-provider>
          <n-dialog-provider>
            <n-notification-provider>
              <div class="app">
                <!-- <Navbar @toggle-sidebar="toggleSidebar" />
                <Sidebar :is-collapsed="isSidebarCollapsed" /> -->
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
import { ref } from 'vue'
import { getThemeOverrides } from './stores/theme'

const currentTheme = ref(getThemeOverrides('dark'))
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
  // padding: 0px 40px;
  transition: all 0.3s ease;

  &.sidebar-collapsed {
    padding-left: 0;
  }

  @media (max-width: 950px) {
    padding: 80px 10px;
  }
}
</style>
