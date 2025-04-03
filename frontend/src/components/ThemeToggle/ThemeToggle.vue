<template>
  <div class="theme-switcher">
    <n-switch
      v-model:value="isDarkMode"
      @update:value="themeStore.toggleTheme"
      size="large"
      class="theme-switch"
    >
      <template #checked>
        <n-icon size="16" color="var(--n-text-color)">
          <Moon />
        </n-icon>
      </template>
      <template #unchecked>
        <n-icon size="16" color="var(--n-text-color)">
          <Sun />
        </n-icon>
      </template>
    </n-switch>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NSwitch, NIcon } from 'naive-ui'
import { useThemeStore } from '@/stores/themeStore'
import { Moon, Sun } from '@vicons/tabler'

const themeStore = useThemeStore()

// Create a computed property that can be used with v-model
const isDarkMode = computed({
  get: () => themeStore.isDarkMode,
  set: () => themeStore.toggleDarkMode()
})
</script>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  width: 4rem;
}

.theme-switch {
  border: 1px solid var(--navbar-button-active);
  border-radius: 20px;

  i {
    color: var(--navbar-toggle-icon) !important;
    font-size: 20px !important;
  }
}

/* Custom styling for the switch */
:deep(.n-switch) {
  --switch-width: 20px;
  --switch-height: 30px;
  min-width: var(--switch-width);
  height: var(--switch-height);
}

:deep(.n-switch--active .n-switch__rail) {
  background-color: var(--n-primary-color);
}

:deep(.n-switch__button) {
  top: 2px;
  left: 2px;
  background-color: var(--navbar-toggle-icon) !important;
}

:deep(.n-switch--active .n-switch__button) {
  left: calc(var(--switch-width) - var(--switch-height) + 2px);
}

:deep(.n-switch__checked, .n-switch__unchecked) {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
}

:deep(.n-switch__checked) {
  right: 17px;
}

:deep(.n-switch__unchecked) {
  left: 4px;
}
</style>
