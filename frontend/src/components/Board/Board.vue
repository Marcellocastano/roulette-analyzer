<template>
  <div class="board-container">
    <div class="history-container">
      <div class="number-balls">
        <div 
          v-for="(spin, index) in spins" 
          :key="spin._id"
          class="number-ball"
          :class="[getNumberColor(spin.number), { 'deletable': index === 0 }]"
          @click="index === 0 ? handleDelete(spin._id) : null"
        >
          {{ spin.number }}
        </div>
      </div>
    </div>

    <div class="roulette-board">
      <div 
        class="number-cell zero"
        @click="handleNumberClick(0)"
      >
        0
      </div>
      <div
        v-for="number in gridNumbers"
        :key="number"
        :class="['number-cell', getNumberColor(number)]"
        @click="handleNumberClick(number)"
      >
        {{ number }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Spin } from '@/types/spin'

// Define emits
const emit = defineEmits<{
  (e: 'numberSelected', value: number): void
  (e: 'delete-spin', id: string): void
}>()

// Define props
defineProps<{
  spins: Pick<Spin, '_id' | 'number'>[]
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

const handleNumberClick = (number: number): void => {
  emit('numberSelected', number)
}

const handleDelete = (id: string) => {
  if (id) {
    emit('delete-spin', id)
  }
}
</script>

<style scoped>
.board-container {
  display: grid;
  gap: min(20px, 3vw);
  padding: min(20px, 3vw);
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
}

.history-container {
  width: 100%;
  padding: min(10px, 2vw);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-sizing: border-box;
}

.number-balls {
  display: flex;
  justify-content: center;
  gap: min(10px, 1.5vw);
  padding: min(10px, 1.5vw);
  flex-wrap: wrap;
}

.number-ball {
  width: min(40px, 8vw);
  height: min(40px, 8vw);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: min(1.2em, 4vw);
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.number-ball.red {
  background-color: #DC3545;
}

.number-ball.black {
  background-color: #212529;
}

.number-ball.green {
  background-color: #198754;
}

.deletable {
  cursor: pointer;
  position: relative;
}

.deletable:hover::after {
  content: '×';
  position: absolute;
  top: -5px;
  right: -5px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  width: min(20px, 4vw);
  height: min(20px, 4vw);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: min(14px, 3vw);
  font-weight: bold;
}

.roulette-board {
  display: grid;
  width: 100%;
  grid-template-columns: min(60px, 8vw) repeat(12, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: min(10px, 1.5vw);
  padding: min(20px, 3vw);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  box-sizing: border-box;
}

.number-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: min(1.2em, 3vw);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.number-cell.zero {
  grid-row: 1 / span 3;
  grid-column: 1;
  aspect-ratio: auto;
  background: rgba(0, 128, 0, 0.5);
}

.red {
  background: rgba(220, 53, 69, 0.5);
}

.black {
  background: rgba(33, 37, 41, 0.5);
}

.number-cell:hover {
  opacity: 0.8;
}
</style>
