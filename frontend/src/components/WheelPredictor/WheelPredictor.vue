<template>
  <div class="flex w-full flex-col items-center">
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color special"></div>
        <span>Special</span>
      </div>
      <div class="legend-item">
        <div class="legend-color primary"></div>
        <span>Primary</span>
      </div>
      <div class="legend-item">
        <div class="legend-color secondary"></div>
        <span>Secondary</span>
      </div>
    </div>
    <div class="roulette-container">
      <svg viewBox="0 0 500 500" class="roulette-wheel">
        <!-- Bordo esterno -->
        <circle cx="250" cy="250" r="240" class="outer-rim" />

        <!-- Settori della ruota -->
        <g id="sectors">
          <path
            v-for="(number, index) in numbers"
            :key="number"
            :d="createSectorPath(index)"
            :class="[
              'sector',
              `number-${number}`,
              { green: number === 0 },
              { 'highlighted-primary': primaryPredictedNumbers.includes(number) },
              { 'highlighted-secondary': secondaryPredictedNumbers.includes(number) },
              { 'highlighted-special': specialPredictedNumbers.includes(number) },
            ]"
          />
        </g>

        <!-- Numeri -->
        <g id="numbers">
          <text
            v-for="(number, index) in numbers"
            :key="number"
            :transform="getNumberPosition(index)"
            :class="[
              'number-text',
              {
                'highlighted-text':
                  primaryPredictedNumbers.includes(number) ||
                  secondaryPredictedNumbers.includes(number) ||
                  specialPredictedNumbers.includes(number),
              },
            ]"
            text-anchor="middle"
            alignment-baseline="middle"
          >
            {{ number }}
          </text>
        </g>

        <!-- Centro decorativo -->
        <g id="center-decoration">
          <!-- Cerchio centrale -->
          <circle cx="250" cy="250" r="100" class="center-circle" />
          <!-- Decorazione raggiata -->
          <g id="spokes">
            <line
              v-for="i in 8"
              :key="i"
              :transform="`rotate(${i * 45} 250 250)`"
              x1="250"
              y1="150"
              x2="250"
              y2="350"
              class="spoke"
            />
          </g>
          <!-- Cerchio interno dorato -->
          <circle cx="250" cy="250" r="30" class="inner-circle" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '../common/Card.vue'

interface Props {
  primaryPredictedNumbers: number[]
  secondaryPredictedNumbers: number[]
  specialPredictedNumbers: number[]
}

const props = defineProps<Props>()

// Ordine corretto dei numeri nella roulette
const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14,
  31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
]

// Funzione createSectorPath corretta
const createSectorPath = (index: number): string => {
  const anglePerSector = 360 / numbers.length
  // Sottraiamo mezzo settore invece di aggiungerlo per allineare correttamente
  const startAngle = index * anglePerSector - 90 - anglePerSector / 2
  const endAngle = startAngle + anglePerSector

  const start = polarToCartesian(250, 250, 240, startAngle)
  const end = polarToCartesian(250, 250, 240, endAngle)
  const innerStart = polarToCartesian(250, 250, 150, startAngle)
  const innerEnd = polarToCartesian(250, 250, 150, endAngle)

  return `
      M ${start.x} ${start.y}
      A 240 240 0 0 1 ${end.x} ${end.y}
      L ${innerEnd.x} ${innerEnd.y}
      A 150 150 0 0 0 ${innerStart.x} ${innerStart.y}
      Z
    `
}

// getNumberPosition rimane invariata
const getNumberPosition = (index: number): string => {
  const anglePerSector = 360 / numbers.length
  const angle = index * anglePerSector - 90
  const radius = 210 // Aumentato da 195 a 225 per avvicinare i numeri al bordo
  const point = polarToCartesian(250, 250, radius, angle)
  return `translate(${point.x} ${point.y}) rotate(${angle + 90})`
}

// Utility per convertire coordinate polari in cartesiane
const polarToCartesian = (centerX: number, centerY: number, radius: number, angle: number) => {
  const angleInRadians = (angle * Math.PI) / 180
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}
</script>

<style scoped>
.roulette-container {
  width: 75%;
  max-width: min(100%, 500px);
  background: #3a3a3a;
  border-radius: 16rem;
  padding: 5px;
}

.roulette-wheel {
  width: 100%;
  height: 100%;
  transform: rotate(135deg);
  pointer-events: none;
  max-width: 100%;
  max-height: 100%;
}

.outer-rim {
  fill: none;
  stroke: #ffb707;
  stroke-width: 10px;
}

.sector {
  stroke: #444;
  stroke-width: 1;
}

.green {
  fill: #007f00;
}

.highlighted-secondary {
  fill: #dec958;
}

.highlighted-primary {
  fill: #f78d60;
}

.highlighted-special {
  fill: #f73f2f;
}
.number-text {
  fill: white;
  font-family: Arial, sans-serif;
  font-size: 22px;
  font-weight: bold;
}

.highlighted-text {
  fill: black;
}

.center-circle {
  fill: #2b2b2b;
  stroke: #720909;
  stroke-width: 4;
}

.spoke {
  stroke: #ffb707;
  stroke-width: 4;
}

.inner-circle {
  fill: #720909;
  stroke: #ffb707;
  stroke-width: 2px;
}

/* Effetto sfumato per i settori */
.sector {
  filter: url(#shadow);
}

/* Effetto lucido */
.sector:hover {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

/* Legenda */
.legend {
  display: flex;
  justify-content: center;
  gap: min(20px, 3vw);
  margin-top: min(10px, 2vw);
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  border: 1px solid white;
}

.legend-color.special {
  background-color: #f73f2f;
}

.legend-color.primary {
  background-color: #f78d60;
}

.legend-color.secondary {
  background-color: #dec958;
}
</style>
