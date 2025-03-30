<template>
  <n-h1 class="mb-8 text-center">{{ $t('initial_stats.title') }}</n-h1>
  
  <div class="initial-stats">
    <Card :title="$t('initial_stats.stats_50_spin')" class="statistics-card text-center">
      <template #content>
        <n-form>
          <n-form-item>
            <div class="stats-container">
              <div class="stats-input">
                <div>
                  <n-p><strong>{{ $t('initial_stats.first_dozen') }}</strong></n-p>
                  <n-input-number
                    v-model:value="stats50.dozens.first"
                    button-placement="both"
                    :placeholder="$t('initial_stats.first_dozen_placeholder')"
                  />
                  <n-p><strong>{{ $t('initial_stats.third_dozen') }}</strong></n-p>
                  <n-input-number
                    v-model:value="stats50.dozens.third"
                    button-placement="both"
                    :placeholder="$t('initial_stats.third_dozen_placeholder')"
                  />
                </div>
                <div>
                  <n-p><strong>{{ $t('initial_stats.second_dozen') }}</strong></n-p>
                  <n-input-number
                    v-model:value="stats50.dozens.second"
                    button-placement="both"
                    :placeholder="$t('initial_stats.second_dozen_placeholder')"
                  />
                  <n-p><strong>{{ $t('initial_stats.zero_zone') }}</strong></n-p>
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
                  <n-p><strong>{{ $t('initial_stats.first_dozen') }}</strong></n-p>
                  <n-input-number
                    v-model:value="stats500.dozens.first"
                    button-placement="both"
                    :placeholder="$t('initial_stats.first_dozen_placeholder')"
                  />
                  <n-p><strong>{{ $t('initial_stats.third_dozen') }}</strong></n-p>
                  <n-input-number
                    v-model:value="stats500.dozens.third"
                    button-placement="both"
                    :placeholder="$t('initial_stats.third_dozen_placeholder')"
                  />
                </div>
                <div>
                  <n-p><strong>{{ $t('initial_stats.second_dozen') }}</strong></n-p>
                  <n-input-number
                    v-model:value="stats500.dozens.second"
                    button-placement="both"
                    :placeholder="$t('initial_stats.second_dozen_placeholder')"
                  />
                  <n-p><strong>{{ $t('initial_stats.zero_zone') }}</strong></n-p>
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
    <n-button class="submit-btn" type="primary" @click="sendData">{{ $t('initial_stats.check_table') }}</n-button>
  </div>

  <n-modal v-model:show="showErrorModal" preset="dialog" :mask-closable="false" :closable="false">
    <n-result
      status="error"
      :title="$t('initial_stats.modals.not_recommended.title')"
      size="large"
      :description="$t('initial_stats.modals.not_recommended.description')"
    >
      <template #footer>
        <n-button type="primary" @click="handleReset">{{ $t('initial_stats.modals.reset_stats') }}</n-button>
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import WheelStatistics from '@/components/WheelStatistics/WheelStatistics.vue'
import Card from '@/components/Card/Card.vue'
import { NButton, NForm, NFormItem, NInputNumber, NP, NResult, NModal } from 'naive-ui'
import * as InitialStats from '@/api/types/initialStats'

const { t } = useI18n()

const props = defineProps<{
  analysis: InitialStats.InitialStatsResponse | null
}>()

const showErrorModal = ref(false)
const showBorderlineModal = ref(false)
const showRecommendedModal = ref(false)
const hasSubmittedStats = ref(false)
const isInitialLoad = ref(true)

// Osserva i cambiamenti dell'analisi per mostrare/nascondere le modali
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
    // Dopo il primo caricamento, imposta isInitialLoad a false
    isInitialLoad.value = false
  },
  { deep: true }
)

const emit = defineEmits(['statistics-updated', 'reset-stats', 'proceed'])

const stats50 = ref<InitialStats.Stats>({
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

const stats500 = ref<InitialStats.Stats>({
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

// Aggiorna i numeri nei dati delle statistiche per 50 spin
const update50Statistics = (numbers: InitialStats.Numbers) => {
  stats50.value.numbers = numbers
}

// Aggiorna i numeri nei dati delle statistiche per 500 spin
const update500Statistics = (numbers: InitialStats.Numbers) => {
  stats500.value.numbers = numbers
}

// Handler per inviare i dati al server
const sendData = () => {
  const requestBody: InitialStats.InitialStatsPayload = {
    stats50: stats50.value,
    stats500: stats500.value,
  }

  isInitialLoad.value = false // Assicuriamoci che non sia più considerato caricamento iniziale
  emit('statistics-updated', requestBody)
}

const handleReset = () => {
  showErrorModal.value = false
  showBorderlineModal.value = false
  showRecommendedModal.value = false
  hasSubmittedStats.value = false
  isInitialLoad.value = true // Resettiamo anche isInitialLoad
  emit('reset-stats')
}

// Handler per procedere nonostante le condizioni borderline
const handleProceed = () => {
  showBorderlineModal.value = false
  showRecommendedModal.value = false
  emit('proceed')
}
</script>

<style scoped>
.statistics-card {
  width: 440px;
  margin: 0 auto;
  background-color: #ff625a9b;
  border: 3px dashed var(--accent-color);
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
  background-color: var(--secondary-color) !important;
}

.not-recommended {
  text-align: center;
}
</style>
