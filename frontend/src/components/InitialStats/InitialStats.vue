<template>
    <n-h1 class="mb-6">Statistiche iniziali</n-h1>
    <div class="initial-stats">
        <Card title="Statistiche a 50 spin" class="statistics-card">
            <template #content>
                <n-form @submit.prevent="handleSubmit">
                <!-- Statistiche per 50 spin -->
                <n-form-item>
                    <div class="stats-container">
                        <div class="stats-input">
                            <div>
                                <!-- Dozzine per 50 spin -->
                                <n-p>1° dozzina %</n-p>
                                <n-input-number
                                    v-model:value="stats50.dozens.first"
                                    button-placement="both"
                                    placeholder="Prima Dozzina"
                                />
                                <n-p>2° dozzina %</n-p>
                                <n-input-number
                                    v-model:value="stats50.dozens.second"
                                    button-placement="both"
                                    placeholder="Seconda Dozzina"
                                />
                            </div>
                            <div>
                                <n-p>3° dozzina %</n-p>
                                <n-input-number
                                    v-model:value="stats50.dozens.third"
                                    button-placement="both"
                                    placeholder="Terza Dozzina"
                                />
                                <n-p>Zona ZERO %</n-p>
                                <n-input-number
                                    v-model:value="stats50.zeroNeighbors"
                                    button-placement="both"
                                    placeholder="Zona Zero"
                                />
                            </div>
                        </div>
                        <!-- Raccolta numeri con WheelStatistics -->
                        <WheelStatistics @update:statistics="update50Statistics" />

                    </div>
                </n-form-item>
                </n-form>

            </template>
        </Card>
        <Card title="Statistiche a 500 spin" class="statistics-card">
            <template #content>
                <n-form @submit.prevent="handleSubmit">
                <n-form-item>
                    <div class="stats-container">
                        <div class="stats-input">
                            <div>
                                <!-- Dozzine per 500 spin -->
                                <n-p>1° dozzina %</n-p>
                                <n-input-number
                                    v-model:value="stats500.dozens.first"
                                    button-placement="both"
                                    placeholder="Prima Dozzina"
                                />
                                <n-p>2° dozzina %</n-p>
                                <n-input-number
                                    v-model:value="stats500.dozens.second"
                                    button-placement="both"
                                    placeholder="Seconda Dozzina"
                                />
                            </div>
                            <div>
                                <n-p>3° dozzina %</n-p>
                                <n-input-number
                                    v-model:value="stats500.dozens.third"
                                    button-placement="both"
                                    placeholder="Terza Dozzina"
                                />
                                <n-p>Zona ZERO %</n-p>
                                <n-input-number
                                    v-model:value="stats500.zeroNeighbors"
                                    button-placement="both"
                                    placeholder="Zona Zero"
                                />
                            </div>
                        </div>
                        <!-- Raccolta numeri con WheelStatistics -->
                        <WheelStatistics @update:statistics="update500Statistics" />
                    </div>
                </n-form-item>
                </n-form>
            </template>
        </Card>
    </div>
    <div>
        <n-button type="primary" @click="sendData">Invia Dati</n-button>
    </div>
  </template>
  
<script setup lang="ts">
import { ref } from "vue";
import WheelStatistics from "@/components/WheelStatistics/WheelStatistics.vue";
import Card from "../Card/Card.vue";
import * as InitialStats from "@/api/types/initialStats";

  const emit = defineEmits(['statistics-updated']);
  interface DozenResults {
    first: number;
    second: number;
    third: number;
  }
  
  const stats50 = ref<InitialStats.Stats>({
    dozens: {
      first: 31,
      second: 31,
      third: 31,
    },
    zeroNeighbors: 20,
    numbers: {
        0: 0,
        3: 0,
        12: 0,
        15: 0,
        32: 0,
        35: 0,
        26: 0,
    },
  });
  
  const stats500 = ref<InitialStats.Stats>({
    dozens: {
      first: 31,
      second: 31,
      third: 31,
    },
    zeroNeighbors: 20,
    numbers: {
        0: 0,
        3: 0,
        12: 0,
        15: 0,
        32: 0,
        35: 0,
        26: 0,
    },
  });
  
  // Aggiorna i numeri nei dati delle statistiche per 50 spin
  const update50Statistics = (numbers: InitialStats.Numbers) => {
    stats50.value.numbers = numbers;
  };
  
  // Aggiorna i numeri nei dati delle statistiche per 500 spin
  const update500Statistics = (numbers: InitialStats.Numbers) => {
    stats500.value.numbers = numbers;
  };

  const handleSubmit = () => {
    console.log("Statistiche per 50 spin:", stats50.value);
    console.log("Statistiche per 500 spin:", stats500.value);
  };
  
  // Handler per inviare i dati al server
  const sendData = () => {
    const requestBody: InitialStats.InitialStatsPayload = {
      stats50: stats50.value,
      stats500: stats500.value,
    };
  
    emit('statistics-updated', requestBody);
  };
</script>
  
<style scoped>
.statistics-card {
    width: 440px;
    margin: 0 auto;
}

.input-item {
    margin-bottom: 1rem;
    display: block;
}

.initial-stats {
    display: flex;
    width: 100%;
    gap: 50px;
    align-items: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.stats-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;

    & .stats-input {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 50px;
        margin-bottom: 1rem;

        & .n-input-number {
            margin: 0.5rem 0 1rem;
        }
    }
}
</style>
  