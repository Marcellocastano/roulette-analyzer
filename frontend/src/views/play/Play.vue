<template>
  <div class="play-view">
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
        <TableAnalysis
          v-if="statsAnalysis"
          :analysis="statsAnalysis.analysis"
          :dozen-down="statsAnalysis.dozenDown"
        />
        <div class="board-container">
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
        </div>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import Board from '@/components/Board/Board.vue'
import WheelPredictor from '@/components/WheelPredictor/WheelPredictor.vue'
import InitialStats from '@/components/InitialStats/InitialStats.vue'
import TableAnalysis from '@/components/TableAnalysis/TableAnalysis.vue'
import type { InitialStatsPayload, InitialStatsResponse } from '@/api/types/initialStats'
import type { Spin } from '@/types/spin'
import { initialStatsApi, spinsApi, statsApi } from '@/api'

const primaryPredictedNumbers = ref<number[]>([])
const secondaryPredictedNumbers = ref<number[]>([])
const specialPredictedNumbers = ref<number[]>([])
const step = ref<number>(1)
const statsAnalysis = ref<InitialStatsResponse | null>(null)
const message = useMessage()
const spins = ref<Pick<Spin, '_id' | 'number'>[]>([])

const handleStatisticsUpdate = async (payload: InitialStatsPayload) => {
  try {
    const response = await initialStatsApi.submitStats(payload)
    statsAnalysis.value = response.data.data

    if (statsAnalysis.value.analysis.tableStatus === 'not_recommended') {
      message.error('Le statistiche attuali non sono favorevoli per il gioco')
    } else if (statsAnalysis.value.analysis.tableStatus === 'borderline') {
      message.warning('Le statistiche attuali mostrano condizioni al limite')
    } else {
      message.success('Statistiche inviate con successo')
      step.value = 2
    }
  } catch (error) {
    console.error("Errore durante l'invio delle statistiche:", error)
    message.error("Si è verificato un errore durante l'invio delle statistiche")
  }
}

const handleReset = async () => {
  try {
    await statsApi.resetSession()
    statsAnalysis.value = null // Reset dello stato locale
    message.success('Statistiche resettate con successo')
  } catch (error) {
    console.error('Errore durante il reset delle statistiche:', error)
    message.error('Si è verificato un errore durante il reset delle statistiche')
  }
}

const handleNumberSelection = async (number: number) => {
  try {
    const response = await spinsApi.addSpin({ number })
    // Aggiungiamo il nuovo spin all'inizio dell'array usando _id e number dalla response
    spins.value = [{ 
      _id: response.data.data._id, 
      number: response.data.data.number 
    }, ...spins.value].slice(0, 5)
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
    console.error('Errore durante l\'eliminazione dello spin:', error)
    message.error('Errore durante l\'eliminazione dello spin')
  }
}

const getPredictions = async () => {
  try {
    const resp = await statsApi.getPredictions()
    console.log('Predictions:', resp.data)
    primaryPredictedNumbers.value = resp.data.data.primary
    secondaryPredictedNumbers.value = resp.data.data.secondary
    specialPredictedNumbers.value = resp.data.data.special
  } catch (error) {
    console.error('Errore nel recupero delle previsioni:', error)
  }
}

const handleProceed = () => {
  message.info('Procedi con cautela')
  step.value = 2
}
</script>

<style scoped>
.play-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.n-grid-item {
  position: relative;
}

/* Contenitore per Board e WheelPredictor */
.n-grid-item:has(> .board-container) {
  position: relative;
  z-index: 0;
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
