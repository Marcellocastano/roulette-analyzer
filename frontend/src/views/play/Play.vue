<template>
  <div class="play-view">
    <n-alert
      v-if="hasActiveSession && step === 1"
      type="info"
      class="alert-session mb-8"
      closable
      @close="hideActiveSessionBanner"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span>{{ $t('play.active_session.title') }}</span>
          <n-button type="primary" size="small" @click="goToActiveSession">
            {{ $t('play.active_session.continue_button') }}
          </n-button>
        </div>
      </template>
      <template #default>
        {{ $t('play.active_session.description') }}
      </template>
    </n-alert>

    <n-grid x-gap="12" y-gap="12" :cols="1" :item-responsive="true">
      <n-grid-item v-if="step === 1">
        <InitialStats
          @statistics-updated="handleStatisticsUpdate"
          @reset-stats="handleReset"
          @proceed="handleProceed"
          :analysis="statsAnalysis"
        />
      </n-grid-item>
      <n-grid-item v-if="step === 2">
        <n-h2 class="mb-8 text-center">
          {{ $t('play.resize_screen') }}
        </n-h2>
        <div class="board-container-main gap-5">
          <div class="flex mb-4 justify-center w-full items-center">
            <n-button type="danger" size="small" @click="handleReset"> {{ $t('play.reset_session') }} </n-button>
          </div>
          <Board
            :spins="spins.slice(0, 5)"
            @number-selected="handleNumberSelection"
            @delete-spin="handleSpinDelete"
          />
          <WheelPredictor
            :primary-predicted-numbers="primaryPredictedNumbers"
            :secondary-predicted-numbers="secondaryPredictedNumbers"
            :special-predicted-numbers="specialPredictedNumbers"
          />
          <BoardPredictor
            :primary-predicted-numbers="primaryPredictedNumbers"
            :secondary-predicted-numbers="secondaryPredictedNumbers"
            :special-predicted-numbers="specialPredictedNumbers"
          />
        </div>
        <TableAnalysis
          v-if="statsAnalysis"
          :analysis="statsAnalysis.analysis"
          :dozen-down="statsAnalysis.dozenDown"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import Board from '@/components/Board/Board.vue'
import WheelPredictor from '@/components/WheelPredictor/WheelPredictor.vue'
import InitialStats from '@/components/InitialStats/InitialStats.vue'
import TableAnalysis from '@/components/TableAnalysis/TableAnalysis.vue'
import type { InitialStatsPayload, InitialStatsResponse } from '@/api/types/initialStats'
import type { Spin } from '@/types/spin'
import { initialStatsApi, statsApi } from '@/api'
import BoardPredictor from '@/components/BoardPredictor/BoardPredictor.vue'

const { t } = useI18n()
const primaryPredictedNumbers = ref<number[]>([])
const secondaryPredictedNumbers = ref<number[]>([])
const specialPredictedNumbers = ref<number[]>([])
const step = ref<number>(1)
const statsAnalysis = ref<InitialStatsResponse | null>(null)
const message = useMessage()
const spins = ref<Pick<Spin, 'number'>[]>([])
const hasActiveSession = ref(false)

// Verifica sessione attiva al mounted
onMounted(async () => {
  try {
    const { data: response } = await initialStatsApi.getLatestStats()
    console.log('Latest stats:', response)
    if (response.status === 'success' && response.data.active) {
      hasActiveSession.value = true
      statsAnalysis.value = response.data
    }
  } catch (error) {
    console.error('Errore nel recupero della sessione:', error)
  }
})

const handleStatisticsUpdate = async (payload: InitialStatsPayload) => {
  try {
    const { data: response } = await initialStatsApi.submitStats(payload)
    if (response.status === 'success' && response.data) {
      statsAnalysis.value = response.data
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento delle statistiche:", error)
    message.error(t('play.messages.stats_update_error'))
  }
}

const handleReset = async () => {
  try {
    await statsApi.resetSession()
    statsAnalysis.value = null // Reset dello stato locale
    step.value = 1
    message.success(t('play.messages.stats_reset'))
  } catch (error) {
    console.error('Errore durante il reset delle statistiche:', error)
    message.error(t('play.messages.stats_reset_error'))
  }
}

const handleNumberSelection = async (number: number) => {
  try {
    const { data: response } = await statsApi.addSpin({ number })
    // Aggiungiamo il nuovo spin all'inizio dell'array usando number dalla response
    spins.value = [
      {
        number: response.data.number,
      },
      ...spins.value,
    ]
    await getPredictions()
  } catch (error) {
    console.error('Errore nel salvataggio dello spin:', error)
    message.error(t('play.messages.spin_save_error'))
  }
}

const handleSpinDelete = async () => {
  try {
    await statsApi.deleteSpin()
    spins.value.shift()
    await getPredictions()
  } catch (error) {
    console.error("Errore durante l'eliminazione dello spin:", error)
    message.error(t('play.messages.spin_delete_error'))
  }
}

const getPredictions = async () => {
  try {
    const { data: resp } = await statsApi.getPredictions()
    console.log('Predictions:', resp)
    primaryPredictedNumbers.value = resp.data.primary
    secondaryPredictedNumbers.value = resp.data.secondary
    specialPredictedNumbers.value = resp.data.special
  } catch (error) {
    console.error('Errore nel recupero delle previsioni:', error)
  }
}

const handleProceed = () => {
  message.info(t('play.proceed_message'))
  step.value = 2
}

const hideActiveSessionBanner = () => {
  hasActiveSession.value = false
}

const goToActiveSession = async () => {
  if (statsAnalysis.value) {
    try {
      const { data: response } = await statsApi.getSpinHistory()
      if (response.status === 'success' && response.data) {
        spins.value = response.data.map(spin => ({ number: spin.number }))
        await getPredictions()
        step.value = 2
        message.success(t('play.messages.session_restored'))
      }
    } catch (error) {
      console.error('Errore nel recupero degli spin:', error)
      message.error(t('play.messages.session_restore_error'))
    }
  }
}

// Watch per gestire hasActiveSession quando cambia lo step
watch(step, newStep => {
  if (newStep === 1) {
    hasActiveSession.value = false
  }
})
</script>

<style scoped>
.play-view {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}

.n-grid {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.n-grid-item {
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Contenitore per Board e WheelPredictor */
.board-container-main {
  position: relative;
  z-index: 0;
  width: 100%;
  max-width: 650px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
  background-color: #214260;
}

:deep(.n-alert-body) {
  background-color: var(--secondary-color) !important;
}

@media (min-width: 630px) {
  .board-container-main {
    border: 2px solid var(--accent-color);
    padding: 20px;
    border-radius: 20px;
  }

  .play-view {
    padding: min(20px, 3vw);
  }
}

/* Posizionamento del WheelPredictor */
:deep(.wheel-predictor) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 800px;
}
</style>
