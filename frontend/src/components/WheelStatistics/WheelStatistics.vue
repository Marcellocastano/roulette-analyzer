<template>
    <n-p class="roulette-title">
      Replica le statistiche visive della roulette <br/>
      trascina il mouse su un cono per modificare il valore
    </n-p>
    <div class="roulette-wheel">
    <svg 
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
    >
    <g v-for="(number, index) in rouletteNumbers" :key="index">
        {{getConeAngle(index)}}
        <path
            :d="getConePath(index)"
            :class="['cone', { active: coneValues[index] > 0 }]"
            :style="{
            '--base-color': getNumberColor(number),
            '--fill-height': `${100 - (coneValues[index] / 40) * 100}%`,
            '--cone-angle': `${getConeAngle(index)}deg`
            }"
            @mousedown="startDragging(index, $event)"
            @mousemove="handleMouseMove($event, index)"
            @click="toggleCone(index)"
        />
        <text
            :x="getNumberPosition(index).x"
            :y="getNumberPosition(index).y"
            fill="white"
            text-anchor="middle"
            class="number-text"
        >
            {{ number }}
        </text>
        </g>
    </svg>
    </div>

    <div class="controls">
      <n-button @click="resetCones" type="error">
        <template #icon>
          <n-icon><Trash /></n-icon>
        </template>
        Ricomincia
      </n-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive } from 'vue'
  import { NButton } from 'naive-ui'
  import { Trash } from '@vicons/tabler'
  
  const emit = defineEmits(['update:statistics'])
  
  // Numeri della roulette in ordine (solo zona zero)
  const rouletteNumbers = [12, 35, 3, 26, 0, 32, 15]
  
  // Valori dei coni (0-40)
  const coneValues = reactive(new Array(7).fill(0))
  const isDragging = ref(false)
  const currentCone = ref(-1)
  const lastUpdatedCone = ref<number | null>(null)
  
  // Funzione per aggiornare il valore di un cono
  const updateConeValue = (index: number, value: number) => {
    coneValues[index] = value
    lastUpdatedCone.value = index
  }
  
  // Calcola il path SVG per ogni cono
  const getConePath = (index: number) => {
    // Modifichiamo l'angolo per coprire solo un settore della ruota
    const totalAngle = 120 // Angolo totale del ventaglio
    const angle = -50 + (index * totalAngle) / 7 // Partiamo da -60 gradi
    const startAngle = angle - (totalAngle / 7) / 2
    const endAngle = angle + (totalAngle / 7) / 2
    
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180
    
    const x1 = 200 + 50 * Math.cos(startRad)
    const y1 = 200 + 50 * Math.sin(startRad)
    const x2 = 200 + 190 * Math.cos(startRad)
    const y2 = 200 + 190 * Math.sin(startRad)
    const x3 = 200 + 190 * Math.cos(endRad)
    const y3 = 200 + 190 * Math.sin(endRad)
    const x4 = 200 + 50 * Math.cos(endRad)
    const y4 = 200 + 50 * Math.sin(endRad)
  
    return `M ${x1} ${y1} L ${x2} ${y2} A 190 190 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 50 50 0 0 0 ${x1} ${y1}`
  }
  
  // Calcola l'angolo del cono per il gradiente
  const getConeAngle = (index: number) => {
    const totalAngle = 120 // Angolo totale del ventaglio
    const angle = -50 + (index * totalAngle) / 7 // Stesso calcolo usato in getConePath
    // Ruotiamo l'angolo per allineare con la direzione verticale
    return angle - 180
  }
  
  // Calcola la posizione del numero
  const getNumberPosition = (index: number) => {
    const totalAngle = 120 // Angolo totale del ventaglio
    const angle = -50 + (index * totalAngle) / 7 // Partiamo da -60 gradi
    const rad = (angle - 90) * Math.PI / 180
    const r = 150 // Raggio per il posizionamento dei numeri
    
    return {
      x: 200 + r * Math.cos(rad),
      y: 200 + r * Math.sin(rad)
    }
  }
  
  // Restituisce il colore in base al numero
  const getNumberColor = (number: number) => {
    if (number === 0) return '#016D29' // Verde per lo zero
    // Mappa dei colori della roulette
    const rouletteColors: { [key: number]: string } = {
      32: '#E0080B', 15: '#000000', 19: '#E0080B', 4: '#000000',
      21: '#E0080B', 2: '#000000', 25: '#E0080B', 17: '#000000',
      34: '#E0080B', 6: '#000000', 27: '#E0080B', 13: '#000000',
      36: '#E0080B', 11: '#000000', 30: '#E0080B', 8: '#000000',
      23: '#E0080B', 10: '#000000', 5: '#E0080B', 24: '#000000',
      16: '#E0080B', 33: '#000000', 1: '#E0080B', 20: '#000000',
      14: '#E0080B', 31: '#000000', 9: '#E0080B', 22: '#000000',
      18: '#E0080B', 29: '#000000', 7: '#E0080B', 28: '#000000',
      12: '#E0080B', 35: '#000000', 3: '#E0080B', 26: '#000000'
    }
    return rouletteColors[number] || '#000000'
  }
  
  // Toggle del cono
  const toggleCone = (index: number) => {
    if (!isDragging.value) {
      updateConeValue(index, coneValues[index])
    }
  }
  
  // Inizio del drag
  const startDragging = (index: number, event: MouseEvent) => {
    isDragging.value = true
    currentCone.value = index
    handleMouseMove(event, index)
  }
  
  // Fine del drag
  const stopDragging = () => {
    isDragging.value = false
    currentCone.value = -1
    // Non resettiamo più i valori qui
  }
  
  // Gestione del movimento del mouse durante il drag
  const handleMouseMove = (event: MouseEvent, index: number) => {
    if (!isDragging.value || currentCone.value !== index) return
  
    const target = event.target as SVGPathElement
    const rect = target.getBoundingClientRect()
    const y = event.clientY - rect.top
    const height = rect.height
    const normalizedValue = Math.max(0, Math.min(1, 1 - (y / height)))
    
    // Converti il valore normalizzato (0-1) in un valore da 0 a 40
    const value = Math.round(normalizedValue * 40)
    
    // Aggiorna il valore solo se è cambiato
    if (coneValues[index] !== value) {
      updateConeValue(index, value)
    }
    confirmStatistics()
  }
  
  // Reset dei coni
  const resetCones = () => {
    for (let i = 0; i < coneValues.length; i++) {
      coneValues[i] = 0
    }
    lastUpdatedCone.value = null
    confirmStatistics()
  }
  
  // Funzione per confermare le statistiche
  const confirmStatistics = () => {
    const statistics = rouletteNumbers.reduce((acc, number, index) => {
      if (coneValues[index] > 0) {
        acc[number] = coneValues[index]
      }
      return acc
    }, {} as Record<string, number>)
    
    emit('update:statistics', { numbers: statistics })
  }
  </script>
  
  <style lang="scss" scoped>
  .roulette-title {
    margin-bottom: 10px;
  }
  .roulette-wheel {
    width: 400px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  
    & svg {
      width: 100%;
      height: 100%;
    }
  }
  
  .cone {
    cursor: pointer;
    position: relative;
    fill: var(--base-color);
    stroke: rgba(255, 255, 255, 0.8);
    stroke-width: 1;
    transition: all 0.2s ease;
  
    &.active {
      mask: linear-gradient(var(--cone-angle), #ffffff24 var(--fill-height), var(--highlight-orange-color) var(--fill-height));
      -webkit-mask: linear-gradient(var(--cone-angle), #ffffff24 var(--fill-height), var(--highlight-orange-color) var(--fill-height));
      fill: var(--highlight-orange-color);
    }
  
    &:hover {
      stroke: rgba(255, 255, 255, 0.4);
    }
  }
  
  .number-text {
    font-size: 16px;
    font-weight: bold;
    pointer-events: none;
    user-select: none;
    fill: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .debug-info {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }
  </style>