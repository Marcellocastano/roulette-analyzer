<template>
  <div class="layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar/Navbar.vue'
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 50px;
  padding: 4rem 1rem;
  background-color: var(--bg-color);
  min-height: calc(100vh - 85px);
  width: 100%;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}
</style>
