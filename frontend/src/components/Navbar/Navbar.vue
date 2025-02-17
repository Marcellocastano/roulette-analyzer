<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="logo">
        <img src="/assets/images/logo.png" alt="Roulette Analyzer Logo" />
      </div>
      <n-button strong secondary type="info" class="menu-toggle" @click="toggleSidebar">
        <n-icon size="24">
          <LayoutSidebarLeftExpand v-if="isCollapsed" />
          <LayoutSidebarLeftCollapse v-else />
        </n-icon>
      </n-button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { LayoutSidebarLeftCollapse, LayoutSidebarLeftExpand } from '@vicons/tabler'
import { NButton, NIcon } from 'naive-ui'

defineProps<{
  isCollapsed: boolean
}>()

const emit = defineEmits(['toggle-sidebar'])

const toggleSidebar = () => {
  emit('toggle-sidebar')
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 85px;
  width: 100%;
  background-color: var(--sidebar-bg);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    img {
      height: 75px;
      width: auto;
      object-fit: contain;
    }
  }

  .menu-toggle {
    background: none;
    border: none;
    color: var(--text-color-light);
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--highlight-orange-color);
    }
  }
}
</style>
