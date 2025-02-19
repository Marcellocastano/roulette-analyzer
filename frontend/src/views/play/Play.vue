<template>
  <div class="play-view">
    <n-grid x-gap="12" y-gap="12" :cols="1" :item-responsive="true">
      <n-grid-item v-if="step === 1">
        <InitialStats 
          @statistics-updated="handleStatisticsUpdate" 
          @reset-stats="handleReset"
          :analysis="statsAnalysis" 
        />
      </n-grid-item>
      <n-grid-item v-if="step === 2">
        <WheelPredictor
          :primary-predicted-numbers="primaryPredictedNumbers"
          :secondary-predicted-numbers="secondaryPredictedNumbers"
          :special-predicted-numbers="specialPredictedNumbers"
        />
        <Board @numberSelected="handleNumberSelection"/>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NGrid, NGridItem, useMessage } from 'naive-ui'
import Board from '@/components/Board/Board.vue'
import WheelPredictor from '@/components/WheelPredictor/WheelPredictor.vue'
import InitialStats from '@/components/InitialStats/InitialStats.vue'
import type { InitialStatsPayload, InitialStatsResponse } from '@/api/types/initialStats'
import { initialStatsApi, spinsApi, statsApi } from '@/api'

const primaryPredictedNumbers = ref<number[]>([])
const secondaryPredictedNumbers = ref<number[]>([])
const specialPredictedNumbers = ref<number[]>([])
const step = ref<number>(1)
const statsAnalysis = ref<InitialStatsResponse | null>(null)
const message = useMessage()

const handleStatisticsUpdate = async (payload: InitialStatsPayload) => {
  try {
    const response = await initialStatsApi.submitStats(payload)
    statsAnalysis.value = response.data.data
    
    if (statsAnalysis.value.analysis.tableStatus === 'not_recommended') {
      message.error('Le statistiche attuali non sono favorevoli per il gioco')
    } else {
      message.success('Statistiche aggiornate con successo')
      step.value = 2
    }
  } catch (error) {
    console.error('Errore durante l\'invio delle statistiche:', error)
    message.error('Si è verificato un errore durante l\'invio delle statistiche')
  }
}

const handleReset = async () => {
  try {
    statsAnalysis.value = null
    message.success('Statistiche resettate con successo')
  } catch (error) {
    console.error('Errore durante il reset delle statistiche:', error)
    message.error('Si è verificato un errore durante il reset delle statistiche')
  }
}

const selectedNumber = ref<number | null>(null)

const handleNumberSelection = async (number: number) => {
  try {
    await spinsApi.addSpin({ number })
    await getPredictions()
  } catch (error) {
    console.error('Errore nel salvataggio del spin:', error)
    message.error('Errore nel salvataggio del spin')
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

</script>

<style scoped>
.play-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>