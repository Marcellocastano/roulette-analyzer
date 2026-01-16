<template>
  <div class="initial-stats-container">
    <n-h1 class="mb-8 text-center">{{ $t('initial_stats.title') }}</n-h1>

    <!-- Custom Tab Navigation -->
    <div class="custom-tabs-wrapper">
      <div class="custom-tabs-nav">
        <button 
          :class="['custom-tab', { 'active': activeTab === 'normal' }]"
          @click="activeTab = 'normal'"
        >
          <div class="tab-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="tab-text">{{ $t('initial_stats.normal_mode') }}</span>
        </button>
        
        <button 
          :class="['custom-tab', { 'active': activeTab === 'expert' }]"
          @click="activeTab = 'expert'"
        >
          <div class="tab-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927C9.3 2.006 10.7 2.006 10.951 2.927L11.543 5.07A1 1 0 0 0 12.454 5.816L14.597 5.224C15.518 4.973 16.027 6.373 15.224 7.176L13.65 8.75A1 1 0 0 0 13.65 10.25L15.224 11.824C16.027 12.627 15.518 14.027 14.597 13.776L12.454 13.184A1 1 0 0 0 11.543 13.93L10.951 16.073C10.7 16.994 9.3 16.994 9.049 16.073L8.457 13.93A1 1 0 0 0 7.546 13.184L5.403 13.776C4.482 14.027 3.973 12.627 4.776 11.824L6.35 10.25A1 1 0 0 0 6.35 8.75L4.776 7.176C3.973 6.373 4.482 4.973 5.403 5.224L7.546 5.816A1 1 0 0 0 8.457 5.07L9.049 2.927Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="tab-text">{{ $t('initial_stats.expert_mode') }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="custom-tab-content">
        <Transition name="tab-fade" mode="out-in">
          <div v-if="activeTab === 'normal'" key="normal" class="tab-pane">
            <InitialBeginnerStats
              :analysis="props.analysis"
              @statistics-updated="handleStatisticsUpdated"
              @statistics-reset="handleStatisticsReset"
              @proceed="handleProceed"
            />
          </div>
          
          <div v-else-if="activeTab === 'expert'" key="expert" class="tab-pane">
            <InitialAdvancedStats
              :analysis="props.analysis"
              @statistics-updated="handleStatisticsUpdated"
              @statistics-reset="handleStatisticsReset"
              @proceed="handleProceed"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NH1 } from 'naive-ui'
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

/* Custom Tabs Wrapper */
.custom-tabs-wrapper {
  margin-top: 30px;
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid var(--card-border);
}

/* Tab Navigation */
.custom-tabs-nav {
  display: flex;
  background: var(--card-bg);
  padding: 12px;
  gap: 12px;
  position: relative;
  border-bottom: 1px solid var(--card-border);
}

/* Individual Tab Button */
.custom-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border: 2px solid var(--card-border);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--card-text);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0.7;
}

.custom-tab:hover {
  opacity: 1;
  border-color: var(--primary-color);
  background: var(--card-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Active Tab */
.custom-tab.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-color: transparent;
  opacity: 1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}


/* Tab Icon */
.tab-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.custom-tab:hover .tab-icon {
  transform: scale(1.1);
}

.custom-tab.active .tab-icon {
  transform: scale(1.1);
}

/* Tab Text */
.tab-text {
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

/* Tab Content Area */
.custom-tab-content {
  padding: 32px;
  min-height: 500px;
  background: var(--card-bg);
}

.tab-pane {
  width: 100%;
}

/* Transition Animations */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .initial-stats-container {
    padding: 16px;
  }

  .custom-tabs-wrapper {
    margin-top: 20px;
    border-radius: 16px;
  }

  .custom-tabs-nav {
    padding: 10px;
    gap: 10px;
  }

  .custom-tab {
    padding: 12px 16px;
    font-size: 0.9rem;
    gap: 8px;
  }

  .tab-icon {
    width: 20px;
    height: 20px;
  }

  .custom-tab-content {
    padding: 24px 16px;
    min-height: 400px;
  }
}

@media (max-width: 480px) {
  .custom-tabs-nav {
    padding: 8px;
    gap: 8px;
  }

  .custom-tab {
    flex-direction: column;
    gap: 6px;
    padding: 10px 8px;
    font-size: 0.85rem;
  }

  .tab-text {
    font-size: 0.8rem;
  }

  .tab-icon {
    width: 18px;
    height: 18px;
  }
}

/* Accessibility */
.custom-tab:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.custom-tab:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>
