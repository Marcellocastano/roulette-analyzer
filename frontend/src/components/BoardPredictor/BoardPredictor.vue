<template>
  <div class="board-container">
    <div class="roulette-board mb-8">
      <div
        class="number-cell zero"
        :class="{
          'highlighted-special': specialPredictedNumbers.includes(0),
          'highlighted-primary': primaryPredictedNumbers.includes(0),
          'highlighted-secondary': secondaryPredictedNumbers.includes(0),
        }"
      >
        <span
          v-if="
            specialPredictedNumbers.includes(0) ||
            primaryPredictedNumbers.includes(0) ||
            secondaryPredictedNumbers.includes(0)
          "
          >0</span
        >
      </div>
      <div
        v-for="number in gridNumbers"
        :key="number"
        :class="[
          'number-cell',
          getNumberColor(number),
          { 'highlighted-special': specialPredictedNumbers.includes(number) },
          { 'highlighted-primary': primaryPredictedNumbers.includes(number) },
          { 'highlighted-secondary': secondaryPredictedNumbers.includes(number) },
        ]"
      >
        <span
          v-if="
            specialPredictedNumbers.includes(number) ||
            primaryPredictedNumbers.includes(number) ||
            secondaryPredictedNumbers.includes(number)
          "
          >{{ number }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Define props
defineProps<{
  primaryPredictedNumbers: number[]
  secondaryPredictedNumbers: number[]
  specialPredictedNumbers: number[]
}>()

// Numbers configuration
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
const gridNumbers = [
  3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 1, 4, 7,
  10, 13, 16, 19, 22, 25, 28, 31, 34,
]

// Methods
const getNumberColor = (number: number): string => {
  return redNumbers.includes(number) ? 'red' : 'black'
}
</script>

<style scoped>
.board-container {
  display: grid;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.roulette-board {
  display: grid;
  width: 100%;
  grid-template-columns: min(60px, 8vw) repeat(12, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: min(3px, 1.5vw);
  padding: min(12px, 3vw);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  box-sizing: border-box;
  aspect-ratio: 4/1;
  max-width: 100%;
}

.number-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: min(1.2em, 3vw);
  color: white;
  border-radius: 5px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(33, 37, 41, 0.3); /* Colore di sfondo più scuro per le celle vuote */
}

.number-cell.zero {
  grid-row: 1 / span 3;
  grid-column: 1;
  aspect-ratio: auto;
  background: rgba(0, 128, 0, 0.3); /* Verde scuro per lo zero vuoto */
}

.red {
  background: rgba(220, 53, 69, 0.3); /* Rosso scuro per le celle vuote */
}

.black {
  background: rgba(33, 37, 41, 0.3); /* Nero scuro per le celle vuote */
}

/* Stili per i numeri evidenziati */
.highlighted-special {
  background-color: #f73f2f !important; /* Rosso intenso per i numeri speciali */
  color: black;
  font-weight: bold;
  border: 2px solid white;
  z-index: 3;
}

.highlighted-primary {
  background-color: #f78d60 !important; /* Arancione per i numeri primari */
  color: black;
  font-weight: bold;
  border: 2px solid white;
  z-index: 2;
}

.highlighted-secondary {
  background-color: #dec958 !important; /* Giallo per i numeri secondari */
  color: black;
  font-weight: bold;
  border: 2px solid white;
  z-index: 1;
}
</style>
