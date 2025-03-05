<template>
  <n-alert v-if="show" type="warning" style="margin-bottom: 20px;" closable @close="closeAlert">
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <n-icon style="margin-right: 8px;">
          <AlertCircle />
        </n-icon>
        <span>
          Questa funzionalità è disponibile solo per gli utenti con abbonamento Premium attivo.
        </span>
      </div>
    </div>
  </n-alert>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AlertCircle } from '@vicons/tabler'
import { useRoute } from 'vue-router'

const route = useRoute()
const show = ref(false)

const closeAlert = () => {
  show.value = false
}

onMounted(() => {
  const redirectedFrom = route.query.from
  if (redirectedFrom === 'premium') {
    show.value = true
  }
})
</script>
