<template>
  <div class="beginner-stats-container">
    <div class="initial-stats">
      <Card :title="$t('initial_stats.stats_50_spin')" class="statistics-card text-center">
        <template #content>
          <n-form>
            <n-form-item>
              <div class="stats-container">
                <div class="stats-input">
                  <div>
                    <n-p>
                      <strong>{{ $t('initial_stats.zero_zone') }}</strong>
                    </n-p>
                    <n-input-number
                      v-model:value="stats50.zeroNeighbors"
                      button-placement="both"
                      :placeholder="$t('initial_stats.zero_zone_placeholder')"
                    />
                  </div>
                </div>
                <WheelStatistics
                  :initial-values="stats50.numbers"
                  @update:statistics="update50Statistics"
                />
              </div>
            </n-form-item>
          </n-form>
        </template>
      </Card>
      
      <Card :title="$t('initial_stats.stats_500_spin')" class="statistics-card text-center">
        <template #content>
          <n-form>
            <n-form-item>
              <div class="stats-container">
                <div class="stats-input">
                  <div>
                    <n-p>
                      <strong>{{ $t('initial_stats.first_dozen') }}</strong>
                    </n-p>
                    <n-input-number
                      v-model:value="stats500.dozens.first"
                      button-placement="both"
                      :placeholder="$t('initial_stats.first_dozen_placeholder')"
                    />
                    <n-p>
                      <strong>{{ $t('initial_stats.third_dozen') }}</strong>
                    </n-p>
                    <n-input-number
                      v-model:value="stats500.dozens.third"
                      button-placement="both"
                      :placeholder="$t('initial_stats.third_dozen_placeholder')"
                    />
                  </div>
                  <div>
                    <n-p>
                      <strong>{{ $t('initial_stats.second_dozen') }}</strong>
                    </n-p>
                    <n-input-number
                      v-model:value="stats500.dozens.second"
                      button-placement="both"
                      :placeholder="$t('initial_stats.second_dozen_placeholder')"
                    />
                    <n-p>
                      <strong>{{ $t('initial_stats.zero_zone') }}</strong>
                    </n-p>
                    <n-input-number
                      v-model:value="stats500.zeroNeighbors"
                      button-placement="both"
                      :placeholder="$t('initial_stats.zero_zone_placeholder')"
                    />
                  </div>
                </div>
                <WheelStatistics
                  :initial-values="stats500.numbers"
                  @update:statistics="update500Statistics"
                />
              </div>
            </n-form-item>
          </n-form>
        </template>
      </Card>
    </div>
    
    <div class="text-center">
      <n-button class="submit-btn" type="primary" @click="sendData">
        {{ $t('initial_stats.check_table') }}
      </n-button>
    </div>

    <!-- Modals for table status -->
    <n-modal v-model:show="showErrorModal" preset="dialog" :mask-closable="false" :closable="false">
      <n-result
        status="error"
        :title="$t('initial_stats.modals.not_recommended.title')"
        size="large"
        :description="$t('initial_stats.modals.not_recommended.description')"
      >
        <template #footer>
          <n-button type="primary" @click="handleReset">
            {{ $t('initial_stats.modals.reset_stats') }}
          </n-button>
        </template>
      </n-result>
    </n-modal>

    <n-modal
      v-model:show="showBorderlineModal"
      preset="dialog"
      :title="$t('initial_stats.modals.borderline.dialog_title')"
      :positiveText="$t('initial_stats.modals.proceed')"
      :negativeText="$t('initial_stats.modals.change_table')"
      @positive-click="handleProceed"
      @negative-click="handleReset"
    >
      <n-result
        status="warning"
        :title="$t('initial_stats.modals.borderline.title')"
        size="large"
        :description="$t('initial_stats.modals.borderline.description')"
      />
    </n-modal>

    <n-modal
      v-model:show="showRecommendedModal"
      preset="dialog"
      :title="$t('initial_stats.modals.recommended.dialog_title')"
      :positiveText="$t('initial_stats.modals.proceed')"
      @positive-click="handleProceed"
    >
      <n-result
        status="success"
        :title="$t('initial_stats.modals.recommended.title')"
        size="large"
        :description="$t('initial_stats.modals.recommended.description')"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import WheelStatistics from '@/components/WheelStatistics/WheelStatistics.vue'
import Card from '@/components/common/Card.vue'
import { NButton, NForm, NFormItem, NInputNumber, NP, NResult, NModal } from 'naive-ui'
import type { Stats, Numbers, InitialStatsPayload, InitialStatsResponse } from '@/api/types/initialStats'

const { t } = useI18n()

const props = defineProps<{
  analysis: InitialStatsResponse | null
}>()

const emit = defineEmits<{
  (e: 'statistics-updated', data: InitialStatsPayload): void
  (e: 'statistics-reset'): void
  (e: 'proceed'): void
}>()

// Modal states
const showErrorModal = ref(false)
const showBorderlineModal = ref(false)
const showRecommendedModal = ref(false)
const hasSubmittedStats = ref(false)
const isInitialLoad = ref(true)

// Watch for analysis changes to show/hide modals
watch(
  () => props.analysis,
  newAnalysis => {
    if (newAnalysis && !isInitialLoad.value) {
      hasSubmittedStats.value = true
      const status = newAnalysis.analysis.tableStatus
      showErrorModal.value = status === 'not_recommended'
      showBorderlineModal.value = status === 'borderline'
      showRecommendedModal.value = status === 'recommended'
    }
    // After first load, set isInitialLoad to false
    isInitialLoad.value = false
  },
  { deep: true }
)

// Default stats with sample data
const stats50 = ref<Stats>({
  dozens: {
    first: 31,
    second: 31,
    third: 31,
  },
  zeroNeighbors: 20,
  numbers: {
    '0': 10,
    '3': 10,
    '12': 10,
    '15': 10,
    '32': 10,
    '35': 10,
    '26': 10,
  },
})

const stats500 = ref<Stats>({
  dozens: {
    first: 31,
    second: 31,
    third: 31,
  },
  zeroNeighbors: 20,
  numbers: {
    '0': 20,
    '3': 20,
    '12': 20,
    '15': 20,
    '32': 20,
    '35': 20,
    '26': 20,
  },
})

// Update statistics methods
const update50Statistics = (numbers: Numbers) => {
  stats50.value.numbers = numbers
}

const update500Statistics = (numbers: Numbers) => {
  stats500.value.numbers = numbers
}

// Send data to server
const sendData = () => {
  const requestBody: InitialStatsPayload = {
    stats50: stats50.value,
    stats500: stats500.value,
  }

  isInitialLoad.value = false // Make sure it's no longer considered initial load
  emit('statistics-updated', requestBody)
}

// Reset handler
const handleReset = () => {
  showErrorModal.value = false
  showBorderlineModal.value = false
  showRecommendedModal.value = false
  hasSubmittedStats.value = false
  isInitialLoad.value = true // Reset isInitialLoad as well
  emit('statistics-reset')
}

// Proceed handler for borderline conditions
const handleProceed = () => {
  showBorderlineModal.value = false
  showRecommendedModal.value = false
  emit('proceed')
}
</script>

<style scoped>
.beginner-stats-container {
  width: 100%;
}

.statistics-card {
  width: 490px;
  margin: 0 auto;
  border: 3px dashed var(--card-border);
}

.input-item {
  margin-bottom: 1rem;
  display: block;
}

.initial-stats {
  display: flex;
  width: 100%;
  gap: 50px;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.stats-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  p {
    color: var(--card-text);
  }

  & .stats-input {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 50px;
    margin-bottom: 1rem;

    & .n-input-number {
      margin: 0.5rem 0 1rem;
    }
  }
}

:deep(.n-input) {
  color: var(--card-text) !important;
  background-color: var(--card-input) !important;
}

.submit-btn {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .initial-stats {
    flex-direction: column;
    gap: 30px;
  }
  
  .statistics-card {
    width: 100%;
    max-width: 490px;
  }
}

@media (max-width: 768px) {
  .stats-container .stats-input {
    flex-direction: column;
    gap: 20px;
  }
  
  .statistics-card {
    width: 100%;
  }
}
</style>
