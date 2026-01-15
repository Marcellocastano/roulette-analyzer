<template>
  <Card>
    <template #content>
      <!-- Suffering Dozen Selection -->
      <div class="input-section">
        <n-h3 class="section-title">
          {{ $t('initial_stats.suffering_dozen') }}
        </n-h3>
        <div class="dozen-selector">
          <div 
            v-for="dozen in dozenOptions" 
            :key="dozen.value"
            class="dozen-option"
            :class="{ 'active': selectedDozen === dozen.value }"
            @click="selectedDozen = dozen.value"
          >
            <div class="dozen-number">{{ dozen.value }}</div>
            <div class="dozen-range">{{ dozen.range }}</div>
          </div>
        </div>
      </div>

      <!-- Growing Zero Zone Numbers Selection -->
      <div class="input-section">
        <n-h3 class="section-title">
          {{ $t('initial_stats.growing_zero_zone_numbers') }}
        </n-h3>
        <ZeroZoneSelector
          :initial-values="zeroZoneStats"
          @update:statistics="updateZeroZoneStats"
          class="zone-selector"
        />
        <div class="selected-info">
          <n-text depth="3">
            {{ $t('initial_stats.selected_numbers') }}: 
            {{ selectedZeroNumbers.length > 0 ? selectedZeroNumbers.join(', ') : $t('initial_stats.no_numbers_selected') }}
          </n-text>
        </div>
      </div>
    </template>

    <template #actions>
      <n-space justify="end" style="width: 100%">
        <n-button 
          @click="submitData"
          type="primary"
          size="large"
          :disabled="!canSubmit"
          :loading="isLoading"
        >
          {{ $t('initial_stats.proceed') }}
        </n-button>
      </n-space>
    </template>
  </Card>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  NH3, NText, NButton, NSpace
} from 'naive-ui'
import Card from '@/components/common/Card.vue'
import ZeroZoneSelector from './ZeroZoneSelector.vue'
import type { InitialStatsResponse } from '@/api/types/initialStats'

// Props
interface Props {
  analysis?: InitialStatsResponse | null
}

const props = withDefaults(defineProps<Props>(), {
  analysis: null
})

// Emits
const emit = defineEmits<{
  (e: 'statistics-updated', data: { sufferingDozen: number; growingZeroNumbers: number[] }): void
  (e: 'statistics-reset'): void
  (e: 'proceed'): void
}>()

// Composables
const { t } = useI18n()

// State
const selectedDozen = ref<number | null>(null)
const selectedZeroNumbers = ref<number[]>([])
const zeroZoneStats = ref<{ [key: number]: number }>({})
const isLoading = ref(false)

// Watch for analysis changes - go directly to game screen
watch(
  () => props.analysis,
  newAnalysis => {
    if (newAnalysis && isLoading.value) {
      isLoading.value = false
      // Modalità avanzata: vai direttamente alla schermata di gioco
      emit('proceed')
    }
  },
  { deep: true }
)

// Dozen options
const dozenOptions = computed(() => [
  {
    value: 1,
    label: t('initial_stats.first_dozen_label'),
    range: '1-12'
  },
  {
    value: 2,
    label: t('initial_stats.second_dozen_label'),
    range: '13-24'
  },
  {
    value: 3,
    label: t('initial_stats.third_dozen_label'),
    range: '25-36'
  }
])

// Computed
const canSubmit = computed(() => {
  return selectedDozen.value !== null && selectedZeroNumbers.value.length > 0
})

// Methods
const updateZeroZoneStats = (stats: { [key: number]: number }) => {
  zeroZoneStats.value = stats
  // Aggiorna anche selectedZeroNumbers per compatibilità con la visualizzazione
  selectedZeroNumbers.value = Object.keys(stats)
    .map(Number)
    .filter(num => stats[num] > 0)
}

const submitData = async () => {
  if (!canSubmit.value) return

  isLoading.value = true
  
  const data = {
    sufferingDozen: selectedDozen.value!,
    growingZeroNumbers: [...selectedZeroNumbers.value]
  }
  
  emit('statistics-updated', data)
}

const handleReset = () => {
  selectedDozen.value = null
  selectedZeroNumbers.value = []
  zeroZoneStats.value = {}
  emit('statistics-reset')
}
</script>

<style scoped>
.input-section {
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 20px 0;
  color: var(--card-text);
  font-weight: 600;
}

/* Dozen Selector Styles */
.dozen-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.dozen-option {
  background: var(--card-background-secondary);
  border: 2px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dozen-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--fill-wheel), transparent);
  transition: left 0.5s ease;
}

.dozen-option:hover {
  box-shadow: 0 8px 25px var(--fill-wheel-shadow);
  transform: translateY(-2px);
}

.dozen-option.active {
  background: var(--fill-wheel);
  border-color: var(--primary-color);
  box-shadow: 0 12px 30px var(--primary-color-shadow);
  transform: translateY(-3px);
}

.dozen-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--card-text);
  margin-bottom: 8px;
}

.dozen-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--card-text);
  margin-bottom: 4px;
}

.dozen-range {
  font-size: 0.9rem;
  color: var(--card-text);
  font-style: italic;
}

/* Zone Selector Styles */
.zone-selector {
  margin-bottom: 16px;
}

.selected-info {
  padding: 12px;
  background: var(--card-background-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.selected-info .n-text {
  color: var(--card-text) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dozen-selector {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .dozen-option {
    padding: 16px;
  }
  
  .dozen-number {
    font-size: 1.5rem;
  }
  
  .input-section {
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  .dozen-option {
    padding: 12px;
  }
  
  .dozen-number {
    font-size: 1.3rem;
  }
  
  .dozen-label {
    font-size: 1rem;
  }
  
  .dozen-range {
    font-size: 0.8rem;
  }
}
</style>
