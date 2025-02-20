<template>
  <div class="layout">
    <Navbar @toggle-sidebar="toggleSidebar" :is-collapsed="isSidebarCollapsed" />
    <Sidebar :is-collapsed="isSidebarCollapsed" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { ref } from 'vue'

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0px;
  }
}
</style>
