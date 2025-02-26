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
          <span>Hai una sessione attiva</span>
          <n-button type="primary" size="small" @click="goToActiveSession">
            Continua sessione
          </n-button>
        </div>
      </template>
      <template #default>
        È stata rilevata una sessione di analisi attiva. Puoi continuare da dove ti eri fermato o
        iniziare una nuova sessione.
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
        <div class="board-container gap-5">
          <div class="flex mb-4 justify-between w-full items-center">
            <n-h2 class="mb-0">Inserisci i numeri</n-h2>
            <n-button type="primary" size="small" @click="handleReset"> Resetta </n-button>
          </div>
          <Board
            :spins="spins"
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
import Board from '@/components/Board/Board.vue'
import WheelPredictor from '@/components/WheelPredictor/WheelPredictor.vue'
import InitialStats from '@/components/InitialStats/InitialStats.vue'
import TableAnalysis from '@/components/TableAnalysis/TableAnalysis.vue'
import type { InitialStatsPayload, InitialStatsResponse } from '@/api/types/initialStats'
import type { Spin } from '@/types/spin'
import { initialStatsApi, spinsApi, statsApi } from '@/api'
import BoardPredictor from '@/components/BoardPredictor/BoardPredictor.vue'

const primaryPredictedNumbers = ref<number[]>([])
const secondaryPredictedNumbers = ref<number[]>([])
const specialPredictedNumbers = ref<number[]>([])
const step = ref<number>(1)
const statsAnalysis = ref<InitialStatsResponse | null>(null)
const message = useMessage()
const spins = ref<Pick<Spin, '_id' | 'number'>[]>([])
const hasActiveSession = ref(false)

// Verifica sessione attiva al mounted
onMounted(async () => {
  try {
    const { data: response } = await initialStatsApi.getLatestStats()
    if (response.status === 'success' && response.data) {
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
      if (response.data.analysis.tableStatus === 'recommended') {
        step.value = 2
      }
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento delle statistiche:", error)
    message.error("Errore durante l'aggiornamento delle statistiche")
  }
}

const handleReset = async () => {
  try {
    await statsApi.resetSession()
    statsAnalysis.value = null // Reset dello stato locale
    step.value = 1
    message.success('Statistiche resettate con successo')
  } catch (error) {
    console.error('Errore durante il reset delle statistiche:', error)
    message.error('Si è verificato un errore durante il reset delle statistiche')
  }
}

const handleNumberSelection = async (number: number) => {
  try {
    const { data: response } = await spinsApi.addSpin({ number })
    // Aggiungiamo il nuovo spin all'inizio dell'array usando _id e number dalla response
    spins.value = [
      {
        _id: response.data._id,
        number: response.data.number,
      },
      ...spins.value,
    ].slice(0, 5)
    await getPredictions()
  } catch (error) {
    console.error('Errore nel salvataggio dello spin:', error)
    message.error('Errore nel salvataggio dello spin')
  }
}

const handleSpinDelete = async (spinId: string) => {
  try {
    console.log('Deleting spin with id:', spinId)
    if (!spinId) {
      console.error('SpinId is undefined')
      return
    }
    await spinsApi.deleteSpin(spinId)
    spins.value = spins.value.filter(spin => spin._id !== spinId)
    await getPredictions()
  } catch (error) {
    console.error("Errore durante l'eliminazione dello spin:", error)
    message.error("Errore durante l'eliminazione dello spin")
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
  message.info('Procedi con cautela')
  step.value = 2
}

const hideActiveSessionBanner = () => {
  hasActiveSession.value = false
}

const goToActiveSession = async () => {
  if (statsAnalysis.value) {
    try {
      const { data: response } = await spinsApi.getSpinHistory()
      if (response.status === 'success' && response.data) {
        spins.value = response.data.map(spin => ({ _id: spin._id, number: spin.number }))
        await getPredictions()
        step.value = 2
        message.success('Sessione ripristinata con successo')
      }
    } catch (error) {
      console.error('Errore nel recupero degli spin:', error)
      message.error('Errore nel ripristino della sessione')
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
  padding: min(20px, 3vw);
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
.board-container {
  position: relative;
  z-index: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
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
