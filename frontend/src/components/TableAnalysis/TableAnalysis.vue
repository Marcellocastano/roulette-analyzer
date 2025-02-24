<template>
  <div class="my-8">
    <n-collapse arrow-placement="right">
      <n-collapse-item class="text-center">
        <template #header>
          <n-h2 class="mb-0">Analisi del Tavolo</n-h2>
        </template>
        <div class="analysis-content">
          <Card class="table-analysis" title="Dozzina in Sofferenza">
            <template #content>
              <div class="section">
                <n-gradient-text
                  :gradient="{
                    from: 'var(--secondary-color)',
                    to: '#13215a',
                  }"
                >
                  {{ getDozenDescription(dozenDown) }}
                </n-gradient-text>
              </div>
            </template>
          </Card>
      
          <Card class="table-analysis" title="Motivi Favorevoli">
            <template #content>
              <div class="section">
                <n-gradient-text
                  v-for="reason in analysis.reasonCodes"
                  :gradient="{
                    from: 'var(--secondary-color)',
                    to: '#13215a',
                  }"
                  class="mb-2"
                  :key="reason"
                >
                  {{ getReasonDescription(reason) }}
                </n-gradient-text>
              </div>
            </template>
          </Card>
      
          <Card class="table-analysis" title="Numeri in Crescita">
            <template #content>
              <div class="section">
                <div class="numbers-grid">
                  <div v-if="analysis.increasingNumbers?.length === 0" class="text-center w-full">
                    <n-gradient-text
                      :gradient="{
                        from: 'var(--secondary-color)',
                        to: '#13215a',
                      }"
                    >
                      Nessuno
                    </n-gradient-text>
                  </div>
                  <n-tag
                    v-else
                    v-for="number in analysis.increasingNumbers"
                    :key="number"
                    :type="getNumberType(number)"
                    size="large"
                    round
                  >
                    {{ number }}
                  </n-tag>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card/Card.vue'
import type { Analysis } from '@/api/types/initialStats'

interface Props {
  analysis: Analysis
  dozenDown: number
}

const props = defineProps<Props>()

// Mappa delle descrizioni per i reasonCodes
const reasonDescriptions: { [key: string]: string } = {
  DOZEN_SUFFERING: 'Dozzina in forte sofferenza',
  ZERO_ZONE_SUFFERING: 'Zona zero in sofferenza',
  NUMBERS_INCREASING: 'Numeri in crescita nella zona di interesse',
  BALANCED_DISTRIBUTION: 'Distribuzione bilanciata dei numeri',
}

// Funzione per ottenere la descrizione di un reasonCode
const getReasonDescription = (code: string) => {
  return reasonDescriptions[code] || code
}

// Funzione per determinare il tipo di tag per i numeri
const getNumberType = (number: number) => {
  if (number === 0) return 'success'
  return number % 2 === 0 ? 'error' : 'info'
}

// Funzione per ottenere la descrizione della dozzina
const getDozenDescription = (dozen: number) => {
  const dozenMap = {
    1: 'Prima dozzina (1-12)',
    2: 'Seconda dozzina (13-24)',
    3: 'Terza dozzina (25-36)',
  }
  return dozenMap[dozen as keyof typeof dozenMap] || 'Dozzina sconosciuta'
}
</script>

<style scoped>
.table-analysis {
  margin: 20px 0;
  max-width: 300px;
}

.analysis-content {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.section {
  margin-bottom: 15px;
}

.numbers-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

:deep(.n-tag) {
  font-size: 1.1em;
  font-weight: bold;
}
</style>
