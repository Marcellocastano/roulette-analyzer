<template>
  <div class="dashboard">
    <n-grid x-gap="12" y-gap="12" :cols="1" :item-responsive="true">
      <n-grid-item v-if="step === 1">
        <InitialStats @statisticsUpdated="handleStatisticsUpdate" />
      </n-grid-item>
      <n-grid-item v-if="step === 2">
        <WheelPredictor :predicted-numbers="predictedNumbers"/>
        <Board @numberSelected="handleNumberSelection"/>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NGrid, NGridItem } from 'naive-ui'
import WheelStatistics from '@/components/WheelStatistics/WheelStatistics.vue'
import Board from '@/components/Board/Board.vue'
import WheelPredictor from '@/components/WheelPredictor/WheelPredictor.vue'
import InitialStats from '@/components/InitialStats/InitialStats.vue'

interface Statistics {
  numbers: Record<string, number>
}

const wheelStatistics = ref<Statistics | null>(null)
const predictedNumbers = ref<number[]>([])
const step = ref<number>(1)

const handleStatisticsUpdate = (statistics: Statistics) => {
  wheelStatistics.value = statistics
  console.log('Received statistics:', statistics)
  // Aggiorna l'analisi statistica quando cambiano i dati della ruota
}

const selectedNumber = ref<number | null>(null)

const handleNumberSelection = (number: number) => {
  selectedNumber.value = number
  predictedNumbers.value = [...predictedNumbers.value, number]
  // Qui puoi aggiungere la logica per gestire la selezione del numero
  console.log(`Numero selezionato: ${number}`)
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