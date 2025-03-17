<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <div class="welcome-text">
        <n-h1>
          <span class="greeting">{{ $t('dashboard.greeting', { name: user?.name || $t('dashboard.default_name') }) }}</span>
        </n-h1>
      </div>
    </div>

    <div v-if="authStore.isPremiumUser" class="dashboard-content">
      <!-- Sezione Tutorial -->
      <div class="flex w-full justify-center">
        <n-card class="feature-card" size="small">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <n-icon size="20">
                  <Book />
                </n-icon>
                <span>{{ $t('dashboard.tutorial_card.header') }}</span>
              </div>
            </div>
          </template>

          <div class="tutorial-content">
            <div class="tutorial-icon">
              <n-icon size="40" color="#ffbc00">
                <AlertCircle />
              </n-icon>
            </div>
            <div class="tutorial-text">
              <p class="tutorial-title">{{ $t('dashboard.tutorial_card.title') }}</p>
              <p class="tutorial-description" v-html="$t('dashboard.tutorial_card.description')"></p>
              <router-link to="/tutorial" class="tutorial-link">
                <span>{{ $t('dashboard.tutorial_card.link') }}</span>
                <n-icon size="16">
                  <ArrowRight />
                </n-icon>
              </router-link>
            </div>
          </div>
        </n-card>
      </div>

      <div class="flex w-full justify-center">
        <!-- Numeri fortunati -->
        <n-card class="feature-card" size="small">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <n-icon size="20">
                  <BuildingCarousel />
                </n-icon>
                <span>{{ $t('dashboard.lucky_numbers.title') }}</span>
              </div>
              <n-button
                quaternary
                circle
                size="small"
                @click="generateLuckyNumbers"
                class="refresh-button"
              >
                <n-icon>
                  <Refresh />
                </n-icon>
              </n-button>
            </div>
          </template>

          <div class="lucky-numbers-container">
            <div
              v-for="(number, index) in luckyNumbers"
              :key="index"
              class="lucky-number"
              :class="getNumberClass(number)"
            >
              {{ number }}
            </div>
          </div>

          <div class="lucky-numbers-message">
            <n-icon size="16">
              <InfoCircle />
            </n-icon>
            <span>{{ $t('dashboard.lucky_numbers.message') }}</span>
          </div>
        </n-card>
      </div>
    </div>
    <div v-else class="tutorial">
      <div class="text-center mb-6">
        <n-h2 class="mb-0">{{ $t('dashboard.free_user.title') }}</n-h2>
        <n-p class="mb-0 fontSizeHuge">
          {{ $t('dashboard.free_user.subtitle') }}
        </n-p>
      </div>
      <section class="three-column-section">
        <n-card class="feature-card">
          <n-h3>{{ $t('dashboard.free_user.law_title') }}</n-h3>
          <n-p v-html="$t('dashboard.free_user.law_content')"></n-p>
        </n-card>
        <n-card class="feature-card">
          <n-h3>{{ $t('dashboard.free_user.zero_title') }}</n-h3>
          <n-p v-html="$t('dashboard.free_user.zero_content')"></n-p>
        </n-card>
        <n-card class="feature-card">
          <n-h3>{{ $t('dashboard.free_user.growth_title') }}</n-h3>
          <n-p v-html="$t('dashboard.free_user.growth_content')"></n-p>
        </n-card>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NCard, NIcon, NH1, NP, NButton } from 'naive-ui'
import {
  BuildingCarousel,
  Refresh,
  InfoCircle,
  Book,
  AlertCircle,
  ArrowRight,
} from '@vicons/tabler'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Statistiche (dati di esempio)
const accuracyRate = ref(68)

// Colori per la precisione
const accuracyColor = computed(() => {
  if (accuracyRate.value >= 70) return '#00b894'
  if (accuracyRate.value >= 50) return '#f1c40f'
  return '#e74c3c'
})

// Numeri fortunati
const luckyNumbers = ref<number[]>([])

const generateLuckyNumbers = () => {
  const numbers: number[] = []
  const usedNumbers = new Set<number>()

  while (numbers.length < 4) {
    const randomNum = Math.floor(Math.random() * 37) // 0-36 per la roulette europea
    if (!usedNumbers.has(randomNum)) {
      numbers.push(randomNum)
      usedNumbers.add(randomNum)
    }
  }

  luckyNumbers.value = numbers
}

// Classi CSS per i numeri della roulette
const getNumberClass = (number: number) => {
  if (number === 0) return 'zero'
  if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)) {
    return 'red'
  }
  return 'black'
}

// Inizializzazione
onMounted(() => {
  generateLuckyNumbers()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  .welcome-text {
    .greeting {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(45deg, #FF615A, #ffcf00);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .date-info {
    display: flex;
    align-items: center;
    color: #777;
    font-size: 0.8rem;

    .calendar-icon {
      margin-right: 0.5rem;
    }
  }
}

.dashboard-content {
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// Nuova griglia per le statistiche
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

// Nuova griglia per i contenuti principali
.content-grid {
  display: flex;
  justify-content: center;
  max-width: 600px;
  gap: 2rem;
}

.stat-card {
  border-radius: 12px;
  padding: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background: #2a2a2a;
  border-color: #2a2a2a;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
  }

  .stat-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.9rem;

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      margin-right: 0.8rem;
    }

    .stat-title {
      font-size: 1.3rem;
      color: #f4f4f4;
    }
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    margin-top: 2rem;
    text-align: center;
  }

  .stat-value-with-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;

    .stat-value {
      margin-bottom: 0;
    }
  }

  .stat-trend {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #f4f4f4;

    svg {
      margin-right: 0.3rem;
    }
  }
}

.sessions-card {
  .stat-icon {
    background-color: rgba(255, 136, 0, 0.15);
    color: #ff8000;
  }

  .stat-value {
    color: #ff8000;
  }
}

.accuracy-card {
  .stat-icon {
    background-color: rgb(71 128 240 / 36%);
    color: #0099ff;
  }

  .stat-value {
    color: v-bind(accuracyColor);
  }
}

.balance-card {
  .stat-icon {
    background-color: rgba(0, 255, 17, 0.15);
    color: #5daa56;
  }

  .stat-value {
    color: #5daa56;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;

  .header-title {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    font-weight: 600;
    gap: 5px;

    svg {
      margin-right: 0.5rem;
      color: #ffbc00;
    }
  }

  .refresh-button {
    &:hover {
      background-color: rgba(255, 188, 0, 0.1);
    }
  }
}

.lucky-numbers-card,
.quick-actions-card {
  border-radius: 12px;
  height: 100%;
  max-width: 600px;
}

.lucky-numbers-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.lucky-number {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);

  &.red {
    background-color: #e74c3c;
  }

  &.black {
    background-color: #2c3e50;
  }

  &.zero {
    background-color: #00b894;
  }
}

.lucky-numbers-message {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #ffcf00;
  margin-top: 0.5rem;
  justify-content: center;
  gap: 3px;

  svg {
    margin-right: 0.3rem;
    flex-shrink: 0;
  }
}

.quick-actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .action-icon {
    margin-right: 0.8rem;
    color: #555;
  }

  span {
    flex: 1;
    font-size: 0.9rem;
  }

  .action-arrow {
    color: #999;
  }
}

.tutorial-card {
  border-radius: 12px;
  height: 100%;
  max-width: 600px;
}

.tutorial-content {
  display: flex;
  padding: 0.5rem;
  gap: 1rem;
}

.tutorial-icon {
  display: flex;
  align-items: flex-start;
  padding-top: 0.5rem;
}

.tutorial-text {
  flex: 1;

  .tutorial-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .tutorial-description {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.5;

    strong {
      color: var(--accent-color-dark);
    }
  }
}

.tutorial-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffcf00;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #FF615A;
  }
}

.three-column-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease;
  border-radius: 20px;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.5rem;
    text-align: center;
  }
}

.tutorial {
  p {
    font-size: 1rem;
  }
  .fontSizeHuge {
    font-size: 1.7rem;
  }
  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
}
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;

    .date-info {
      margin-top: 0.5rem;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .lucky-number {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
