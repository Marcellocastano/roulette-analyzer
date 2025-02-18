<template>
  <div class="dashboard">
    <n-grid x-gap="12" y-gap="12" :cols="1" :item-responsive="true">
      <n-grid-item v-if="step === 1">
        <InitialStats @statisticsUpdated="handleStatisticsUpdate" />
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
import { initialStatsApi, spinsApi, statsApi } from '@/api'
import { InitialStatsPayload } from '@/api/types/initialStats'

const primaryPredictedNumbers = ref<number[]>([])
const secondaryPredictedNumbers = ref<number[]>([])
const specialPredictedNumbers = ref<number[]>([])
const step = ref<number>(1)
const message = useMessage()

const handleStatisticsUpdate = async (statistics: InitialStatsPayload) => {
  console.log('Received statistics:', statistics)
  try {
    await initialStatsApi.addInitialStats(statistics)
    message.success('Statistiche iniziali salvate con successo')
    // step.value = 2 // Passa allo step successivo
  } catch (error) {
    console.error('Errore nel salvataggio delle statistiche:', error)
    message.error('Errore nel salvataggio delle statistiche')
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

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>