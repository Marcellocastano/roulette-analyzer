<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <div class="welcome-text">
        <n-h1>
          <span class="greeting">Ciao, {{ user?.name || 'Giocatore' }}!</span>
        </n-h1>
      </div>
    </div>

    <div v-if="authStore.isPremiumUser" class="dashboard-content">
      <!-- <div class="stats-grid">
        <n-card class="stat-card sessions-card" size="small">
          <div class="stat-header">
            <div class="stat-icon">
              <n-icon size="24">
                <History />
              </n-icon>
            </div>
            <div class="stat-title">Sessioni Avviate</div>
          </div>
          <div class="stat-value">{{ sessionCount }}</div>
          <div class="stat-trend">
            <n-icon size="14" color="#00b894">
              <TrendingUp />
            </n-icon>
            <span>+{{ sessionTrend }}% rispetto alla scorsa settimana</span>
          </div>
        </n-card>

        <n-card class="stat-card accuracy-card" size="small">
          <div class="stat-header">
            <div class="stat-icon">
              <n-icon size="24">
                <Target />
              </n-icon>
            </div>
            <div class="stat-title">Precisione Predizioni</div>
          </div>
          <div class="stat-value-with-chart">
            <n-progress
              type="circle"
              :percentage="accuracyRate"
              :color="accuracyColor"
              :rail-color="accuracyRailColor"
              :stroke-width="5"
              :show-indicator="true"
              :height="50"
              :width="50"
              :indicator-text-color="accuracyColor"
              :indicator-placement="'inside'"
              unit="%"
            />
          </div>
        </n-card>

        <n-card class="stat-card balance-card" size="small">
          <div class="stat-header">
            <div class="stat-icon">
              <n-icon size="24">
                <Coin />
              </n-icon>
            </div>
            <div class="stat-title">Bilancio Stimato</div>
          </div>
          <div class="stat-value">{{ formattedBalance }}</div>
          <div class="stat-trend">
            <n-icon size="14" :color="balanceTrendColor">
              <component :is="balanceTrendIcon" />
            </n-icon>
            <span>{{ balanceTrend > 0 ? '+' : '' }}{{ balanceTrend }}% questo mese</span>
          </div>
        </n-card>
      </div> -->

      <!-- Sezione Tutorial -->
      <div class="flex w-full justify-center">
        <n-card class="tutorial-card" size="small">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <n-icon size="20">
                  <Book />
                </n-icon>
                <span>Leggi il Tutorial</span>
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
              <p class="tutorial-title">Prima di iniziare a giocare</p>
              <p class="tutorial-description">
                È
                <strong>fondamentale</strong>
                leggere attentamente il tutorial per comprendere il metodo statistico utilizzato dal
                software. Solo così potrai sfruttare al massimo le potenzialità dell'analisi e
                aumentare le probabilità di successo.
              </p>
              <router-link to="/tutorial" class="tutorial-link">
                <span>Vai al Tutorial</span>
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
        <n-card class="lucky-numbers-card" size="small">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <n-icon size="20">
                  <BuildingCarousel />
                </n-icon>
                <span>I tuoi numeri fortunati</span>
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
            <span>Questi numeri sono generati casualmente.</span>
          </div>
        </n-card>
      </div>
    </div>
    <div v-else class="tutorial">
      <div class="text-center mb-6">
        <n-h2 class="mb-0">Concetti Base in sintesi</n-h2>
        <n-p class="mb-0 fontSizeHuge">
          Per scoprire la strategia in dettaglio, acquista un abbonamento.
        </n-p>
      </div>
      <section class="three-column-section">
        <n-card class="feature-card">
          <n-h3>Legge dei grandi numeri</n-h3>
          <n-p>
            Nel contesto della roulette, questo significa che, su un numero molto alto di spin,
            <strong
              >le probabilità di uscita dei vari numeri e delle diverse zone del tavolo
              <u>tenderanno ad equilibrarsi</u> </strong
            >. Questo ovviamente non significa andare a constatare la dozzina "in difetto" e puntare
            su quei numeri. Ma questo insieme agli altri concetti forma le fondamenta della
            strategia.
          </n-p>
        </n-card>
        <n-card class="feature-card">
          <n-h3>Zona Zero</n-h3>
          <n-p>
            La strategia è sviluppata per funzionare al meglio sfruttando la zona ZERO della
            roulette, cioè quei numeri che vanno da 12 al 15. Se la percentuale di uscita della zona
            zero è
            <strong>inferiore alla media (20%)</strong>
            sia a 50 che a 500 spin, si considera che la zona sia "
            <strong>in difetto</strong>
            ". Questo suggerisce che la zona è in ritardo e che potrebbe essere il momento di
            puntare sui suoi numeri.
          </n-p>
        </n-card>
        <n-card class="feature-card">
          <n-h3>Crescita dei numeri</n-h3>
          <n-p>
            Si confrontano le statistiche a 50 spin con quelle a 500 spin per individuare i numeri
            che mostrano una
            <strong>tendenza positiva</strong>
            . I numeri in crescita sono quelli che a 50 spin, mostrano un
            <strong>aumento della frequenza di uscita</strong>
            nel tempo e giocano un ruolo fondamentale per l'applicazione della strategia.
          </n-p>
        </n-card>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NCard, NIcon, NH1, NP, NProgress, NButton } from 'naive-ui'
import {
  Calendar,
  History,
  Target,
  Coin,
  BuildingCarousel,
  Refresh,
  InfoCircle,
  ChevronRight,
  Book,
  TrendingUp,
  TrendingDown,
  UserCircle,
  Bolt,
  AlertCircle,
  ArrowRight,
} from '@vicons/tabler'
import { useAuthStore } from '@/stores/auth'
import RouletteIcon from '@/components/icons/RouletteIcon.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Verifica se la sottoscrizione è in attesa
const subscriptionPending = computed(() => {
  // return user.value?.subscription?.status === 'pending'
})

// Statistiche (dati di esempio)
const sessionCount = ref(24)
const sessionTrend = ref(12)
const accuracyRate = ref(68)
const balance = ref(320)
const balanceTrend = ref(15)

// Colori per la precisione
const accuracyColor = computed(() => {
  if (accuracyRate.value >= 70) return '#00b894'
  if (accuracyRate.value >= 50) return '#f1c40f'
  return '#e74c3c'
})

const accuracyRailColor = computed(() => {
  if (accuracyRate.value >= 70) return 'rgba(0, 184, 148, 0.2)'
  if (accuracyRate.value >= 50) return 'rgba(241, 196, 15, 0.2)'
  return 'rgba(231, 76, 60, 0.2)'
})

// Formattazione del bilancio
const formattedBalance = computed(() => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(balance.value)
})

// Icona per il trend del bilancio
const balanceTrendIcon = computed(() => {
  return balanceTrend.value >= 0 ? TrendingUp : TrendingDown
})

const balanceTrendColor = computed(() => {
  return balanceTrend.value >= 0 ? '#00b894' : '#e74c3c'
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
      background: linear-gradient(45deg, #14660c, var(--secondary-color-light));
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
  color: #777;
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
  color: #0099ff;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #4db8ff;
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
