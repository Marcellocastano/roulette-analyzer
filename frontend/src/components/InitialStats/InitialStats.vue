<template>
  <div class="initial-stats-container">
    <n-h1 class="mb-8 text-center">{{ $t('initial_stats.title') }}</n-h1>

    <n-tabs 
      v-model:value="activeTab" 
      type="card" 
      size="large"
      animated
      class="stats-tabs"
    >
      <n-tab-pane 
        name="normal" 
        :tab="$t('initial_stats.normal_mode')"
        class="tab-content"
      >
        <InitialBeginnerStats
          :analysis="props.analysis"
          @statistics-updated="handleStatisticsUpdated"
          @statistics-reset="handleStatisticsReset"
          @proceed="handleProceed"
        />
      </n-tab-pane>

      <n-tab-pane 
        name="expert" 
        :tab="$t('initial_stats.expert_mode')"
        class="tab-content"
      >
        <InitialAdvancedStats
          :analysis="props.analysis"
          @statistics-updated="handleStatisticsUpdated"
          @statistics-reset="handleStatisticsReset"
          @proceed="handleProceed"
        />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NH1, NTabs, NTabPane } from 'naive-ui'
import InitialBeginnerStats from './InitialBeginnerStats.vue'
import InitialAdvancedStats from './InitialAdvancedStats.vue'
import type { Stats, InitialStatsResponse } from '@/api/types/initialStats'

// Props
interface Props {
  analysis?: InitialStatsResponse | null
}

const props = withDefaults(defineProps<Props>(), {
  analysis: null
})

// Active tab state
const activeTab = ref<string>('normal')

// Event emitters
const emit = defineEmits<{
  (e: 'statistics-updated', data: { stats50: Stats; stats500: Stats } | { sufferingDozen: number; growingZeroNumbers: number[] }, mode: 'normal' | 'advanced'): void
  (e: 'statistics-reset'): void
  (e: 'proceed'): void
}>()

// Event handlers that forward events from child components
const handleStatisticsUpdated = (data: { stats50: Stats; stats500: Stats } | { sufferingDozen: number; growingZeroNumbers: number[] }) => {
  const mode = activeTab.value === 'normal' ? 'normal' : 'advanced'
  emit('statistics-updated', data, mode)
}

const handleStatisticsReset = () => {
  emit('statistics-reset')
}

const handleProceed = () => {
  emit('proceed')
}
</script>

<style scoped>
.initial-stats-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.stats-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px 0;
}

:deep(.n-tabs-nav) {
  background-color: var(--card-bg);
  border-radius: 12px 12px 0 0;
  border: 1px solid var(--card-border);
  border-bottom: none;
}

:deep(.n-tabs-tab) {
  padding: 15px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--card-text);
  transition: all 0.3s ease;
}

:deep(.n-tabs-tab:hover) {
  color: var(--primary-color);
}

:deep(.n-tabs-tab.n-tabs-tab--active) {
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px 8px 0 0;
}

:deep(.n-tabs-pane) {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  min-height: 400px;
}

@media (max-width: 768px) {
  .initial-stats-container {
    padding: 10px;
  }
  
  :deep(.n-tabs-tab) {
    padding: 12px 20px;
    font-size: 1rem;
  }
}
</style>
