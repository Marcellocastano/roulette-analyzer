<template>
  <div class="roulette-instructions">
    <n-p class="roulette-title">
      {{ $t('wheel_statistics.instructions') }}
      <router-link class="underline text-accent" to="/tutorial#statistics" target="_blank">
        {{ $t('wheel_statistics.tutorial_link') }}
      </router-link>
    </n-p>
  </div>
  <div class="roulette-wheel">
    <svg @mouseup="stopDragging" @mouseleave="stopDragging">
      <g v-for="(number, index) in rouletteNumbers" :key="index">
        {{ getConeAngle(index) }}
        <path
          :d="getConePath(index)"
          :class="['cone', { active: coneValues[index] > 0 }]"
          :style="{
            '--base-color': getNumberColor(number),
            '--fill-height': `${100 - (coneValues[index] / 40) * 100}%`,
            '--cone-angle': `${getConeAngle(index)}deg`,
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

  <!-- <div class="controls">
    <n-button @click="resetCones" type="error">
      <template #icon>
        <n-icon><Refresh /></n-icon>
      </template>
      {{ $t('wheel_statistics.reset_button') }}
    </n-button>
  </div> -->
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { NButton } from 'naive-ui'
import { Refresh } from '@vicons/tabler'
import * as InitialStats from '@/api/types/initialStats'
import { useI18n } from 'vue-i18n'

// Initialize i18n
const { t } = useI18n()

interface InitialValues {
  [key: number]: number
}

const props = defineProps<{
  initialValues?: InitialValues
}>()

const emit = defineEmits(['update:statistics'])

// Numeri della roulette in ordine (solo zona zero)
const rouletteNumbers = InitialStats.ZERO_ZONE_NUMBERS.map(Number)

// Valori dei coni (0-40)
const coneValues = reactive(new Array(7).fill(0))
const isDragging = ref(false)
const currentCone = ref(-1)
const lastUpdatedCone = ref<number | null>(null)

// Inizializza i valori dei coni quando cambiano gli initialValues
watch(
  () => props.initialValues,
  newValues => {
    if (newValues) {
      rouletteNumbers.forEach((number, index) => {
        coneValues[index] = newValues[number] || 0
      })
    }
  },
  { immediate: true }
)

// Funzione per aggiornare il valore di un cono
const updateConeValue = (index: number, value: number) => {
  coneValues[index] = value
  lastUpdatedCone.value = index

  // Emetti l'evento con i valori aggiornati
  const statistics: InitialValues = {}
  rouletteNumbers.forEach((number, i) => {
    statistics[number] = coneValues[i]
  })
  emit('update:statistics', statistics)
}

// Calcola il path SVG per ogni cono
const getConePath = (index: number) => {
  // Modifichiamo l'angolo per coprire solo un settore della ruota
  const totalAngle = 120 // Angolo totale del ventaglio
  const angle = -50 + (index * totalAngle) / 7 // Partiamo da -60 gradi
  const startAngle = angle - totalAngle / 7 / 2
  const endAngle = angle + totalAngle / 7 / 2

  const startRad = ((startAngle - 90) * Math.PI) / 180
  const endRad = ((endAngle - 90) * Math.PI) / 180

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
  const rad = ((angle - 90) * Math.PI) / 180
  const r = 150 // Raggio per il posizionamento dei numeri

  return {
    x: 200 + r * Math.cos(rad),
    y: 200 + r * Math.sin(rad),
  }
}

// Restituisce il colore in base al numero
const getNumberColor = (number: number) => {
  if (number === 0) return '#016D29' // Verde per lo zero
  // Mappa dei colori della roulette
  const rouletteColors: { [key: number]: string } = {
    32: '#E0080B',
    15: '#000000',
    12: '#E0080B',
    35: '#000000',
    3: '#E0080B',
    26: '#000000',
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
  const normalizedValue = Math.max(0, Math.min(1, 1 - y / height))

  // Converti il valore normalizzato (0-1) in un valore da 0 a 40
  const value = Math.round(normalizedValue * 40)

  // Aggiorna il valore solo se è cambiato
  if (coneValues[index] !== value) {
    updateConeValue(index, value)
  }
}

// Reset dei coni
const resetCones = () => {
  rouletteNumbers.forEach((_, index) => {
    coneValues[index] = 0
  })
  emit('update:statistics', {})
}
</script>

<style lang="scss" scoped>
.roulette-title {
  margin-bottom: 10px;
  color: var(--card-text);
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
    mask: linear-gradient(
      var(--cone-angle),
      #ffffff24 var(--fill-height),
      var(--fill-wheel) var(--fill-height)
    );
    -webkit-mask: linear-gradient(
      var(--cone-angle),
      #ffffff24 var(--fill-height),
      var(--fill-wheel) var(--fill-height)
    );
    fill: var(--fill-wheel);
  }

  &:hover {
    stroke: var(--accent-hover-color);
  }
}

.number-text {
  font-size: 16px;
  font-weight: bold;
  pointer-events: none;
  user-select: none;
  fill: var(--card-text);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.text-accent {
  color: var(--accent-color);
}
</style>
