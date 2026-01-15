<template>
  <div class="roulette-wheel">
    <svg>
      <g v-for="(number, index) in rouletteNumbers" :key="index">
        <path
          :d="getConePath(index)"
          :class="['cone', { active: coneValues[index] > 0 }]"
          :style="{
            '--base-color': getNumberColor(number),
            '--cone-angle': `${getConeAngle(index)}deg`,
          }"
          @click="toggleCone(index)"
        />
        <text
          :x="getNumberPosition(index).x"
          :y="getNumberPosition(index).y"
          text-anchor="middle"
          class="number-text"
        >
          {{ number }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
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
const updateConeValue = (index: number, value: number | null) => {
  if (value !== null) {
    coneValues[index] = value
  }

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
  // Se il valore è già > 0, lo azzeriamo, altrimenti impostiamo a 40 (100%)
  const newValue = coneValues[index] > 0 ? 0 : 40
  updateConeValue(index, newValue)
}

// Nessuna funzione di dragging necessaria

</script>

<style lang="scss" scoped>
.roulette-title {
  margin-bottom: 10px;
  color: var(--card-text);
}
.roulette-wheel {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  & svg {
    width: 72%;
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
  fill: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.text-accent {
  color: var(--accent-color);
}

.controls {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.ml-2 {
  margin-left: 8px;
}

.manual-settings {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--card-background);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.settings-header {
  margin-bottom: 15px;
  text-align: center;

  h3 {
    margin-bottom: 5px;
    color: var(--card-text);
  }

  p {
    font-size: 0.9rem;
    color: var(--card-text-secondary);
  }
}

.number-controls {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
}

.number-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
}

.number-label {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-bottom: 10px;
}

.slider-container {
  height: 150px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.vertical-slider {
  position: relative;
  width: 8px;
  height: 100%;
  background-color: var(--card-background-secondary);
  border-radius: 4px;
  border: 1px solid var(--border-color, rgba(100, 100, 100, 0.3));
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: var(--card-background-secondary);
}

.slider-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: var(--fill-wheel);
  border-radius: 4px;
  box-shadow: 0 0 4px var(--fill-wheel);
}

.slider-thumb {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background-color: var(--gold-accent);
  border: 2px solid var(--card-text);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
