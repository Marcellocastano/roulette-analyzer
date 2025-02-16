<template>
    <div class="roulette-grid">
      <div class="zero-cell" @click="handleNumberClick(0)">0</div>
      <div class="numbers-grid">
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
  
  // Define emits
  const emit = defineEmits<{
    (e: 'numberSelected', value: number): void
  }>()
  
  // Numbers configuration
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  const gridNumbers = [
    3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36,
    2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35,
    1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34
  ]
  
  // Methods
  const getNumberColor = (number: number): string => {
    return redNumbers.includes(number) ? 'red' : 'black'
  }
  
  const handleNumberClick = (number: number): void => {
    emit('numberSelected', number)
  }
  </script>
  
  <style scoped>
  .roulette-grid {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    gap: 2px;
  }
  
  .zero-cell {
    background-color: #008000;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    width: 60px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .zero-cell:hover {
    background-color: #006600;
  }
  
  .numbers-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 2px;
    flex: 1;
  }
  
  .number-cell {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  
  .number-cell:hover {
    opacity: 0.8;
  }
  
  .red {
    background-color: #DC3545;
  }
  
  .black {
    background-color: #000000;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .number-cell {
      font-size: 18px;
    }
    
    .zero-cell {
      font-size: 18px;
      width: 40px;
    }
  }
  
  @media (max-width: 480px) {
    .number-cell {
      font-size: 14px;
    }
    
    .zero-cell {
      font-size: 14px;
      width: 30px;
    }
  }
  </style>
  