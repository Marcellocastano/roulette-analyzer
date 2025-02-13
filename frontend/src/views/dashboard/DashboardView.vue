<template>
  <Sidebar />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { rouletteApi } from '@/api'
import Sidebar from '@/components/Sidebar.vue'

const authStore = useAuthStore()
const isShrinkView = ref(false)

onMounted(async () => {
})
</script>

<style scoped>

</style>