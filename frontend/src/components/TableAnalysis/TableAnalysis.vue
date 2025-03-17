<template>
  <div class="my-8">
    <n-collapse arrow-placement="right">
      <n-collapse-item class="text-center">
        <template #header>
          <n-h2 class="mb-0">{{ $t('table_analysis.title') }}</n-h2>
        </template>
        <div class="analysis-content">
          <Card class="table-analysis" :title="$t('table_analysis.dozen_suffering')">
            <template #content>
              <div class="section">
                <n-gradient-text
                  :gradient="{
                    from: '#FF615A',
                    to: '#ffcf00',
                  }"
                >
                  {{ getDozenDescription(dozenDown) }}
                </n-gradient-text>
              </div>
            </template>
          </Card>

          <Card class="table-analysis" :title="$t('table_analysis.favorable_reasons')">
            <template #content>
              <div class="section">
                <n-gradient-text
                  v-for="reason in analysis.reasonCodes"
                  :gradient="{
                    from: '#FF615A',
                    to: '#ffcf00',
                  }"
                  class="mb-2"
                  :key="reason"
                >
                  {{ getReasonDescription(reason) }}
                </n-gradient-text>
              </div>
            </template>
          </Card>

          <Card class="table-analysis" :title="$t('table_analysis.increasing_numbers')">
            <template #content>
              <div class="section">
                <div class="numbers-grid">
                  <div v-if="analysis.increasingNumbers?.length === 0" class="text-center w-full">
                    <n-gradient-text
                      :gradient="{
                        from: '#FF615A',
                        to: '#ffcf00',
                      }"
                    >
                      {{ $t('table_analysis.none') }}
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
interface Props {
  analysis: Analysis
  dozenDown: number
}

const props = defineProps<Props>()

// Funzione per ottenere la descrizione di un reasonCode
const getReasonDescription = (code: string) => {
  return code ? t(`table_analysis.reasons.${code}`) : code
}

// Funzione per determinare il tipo di tag per i numeri
const getNumberType = (number: number) => {
  if (number === 0) return 'success'
  return number % 2 === 0 ? 'error' : 'info'
}

// Funzione per ottenere la descrizione della dozzina
const getDozenDescription = (dozen: number) => {
  return dozen ? t(`table_analysis.dozens.${dozen}`) : t('table_analysis.dozens.unknown')
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
