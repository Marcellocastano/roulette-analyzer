<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <div class="welcome-text">
        <n-h1>
          <span class="greeting">
            {{ $t('dashboard.greeting', { name: user?.name || $t('dashboard.default_name') }) }}
          </span>
        </n-h1>
      </div>
    </div>
    <div class="promo-banner-container" v-if="!authStore.isPremiumUser || user?.subscription?.plan === 'trial'">
      <div class="promo-banner">
        <div class="promo-content">
          <div class="promo-header">
            <div class="neon-icon">
              <n-icon size="32" color="#FFD700">
                <BoltIcon />
              </n-icon>
            </div>
            <h2 class="neon-text cyan">{{ $t('dashboard.promo_banner.title') }}</h2>
          </div>
          
          <p class="promo-message">{{ $t('dashboard.promo_banner.message') }}</p>
          
          <div class="promo-offers">
            <div class="offer-item">
              <div class="offer-badge">
                <span class="neon-text pink">{{ $t('dashboard.promo_banner.monthly_offer') }}</span>
              </div>
            </div>
            <div class="offer-item">
              <div class="offer-badge">
                <span class="neon-text yellow">{{ $t('dashboard.promo_banner.annual_offer') }}</span>
              </div>
            </div>
          </div>
          
          <div class="promo-decorations">
            <span class="decoration circle pink"></span>
            <span class="decoration circle pink bigger"></span>
            <span class="decoration circle yellow"></span>
            <span class="decoration circle yellow bigger"></span>
            <span class="decoration circle cyan"></span>
            <span class="decoration circle cyan bigger"></span>
            <span class="decoration circle purple"></span>
            <span class="decoration circle purple bigger"></span>
            <span class="decoration circle red"></span>
            <span class="decoration circle red bigger"></span>

            <span class="decoration diamond cyan"></span>
            <span class="decoration diamond cyan bigger"></span>
            <span class="decoration diamond pink"></span>
            <span class="decoration diamond pink bigger"></span>
            <span class="decoration diamond yellow"></span>
            <span class="decoration diamond yellow bigger"></span>
            <span class="decoration diamond purple"></span>
            <span class="decoration diamond purple bigger"></span>
            <span class="decoration diamond red"></span>
            <span class="decoration diamond red bigger"></span>

            <!-- <span class="decoration wave cyan"></span>
            <span class="decoration wave pink"></span>
            <span class="decoration wave yellow"></span>
            <span class="decoration wave purple"></span>
            <span class="decoration wave red"></span> -->
          </div>
          
          <div class="promo-footer">
            <div class="promo-info">
              <span class="promo-validity neon-text-small">{{ $t('dashboard.promo_banner.valid_until') }}</span>
              <span class="promo-condition neon-text-small">{{ $t('dashboard.promo_banner.first_purchase') }}</span>
            </div>
            <n-button class="promo-button" @click="goToPricingPage">
              {{ $t('dashboard.promo_banner.button') }}
            </n-button>
          </div>
        </div>
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
              <p
                class="tutorial-description"
                v-html="$t('dashboard.tutorial_card.description')"
              ></p>
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
import { NCard, NIcon, NH1, NP, NButton, NH2, NH3 } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  BuildingCarousel,
  Refresh,
  InfoCircle,
  Book,
  AlertCircle,
  ArrowRight,
  Gift,
  Calendar,
  Bolt as BoltIcon
} from '@vicons/tabler'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Tasso di precisione (esempio)
const accuracyRate = ref(65)

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
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 37)
    if (!usedNumbers.has(num)) {
      usedNumbers.add(num)
      numbers.push(num)
    }
  }

  luckyNumbers.value = numbers
}

// Funzione per navigare alla pagina dei prezzi
function goToPricingPage() {
  router.push('/pricing')
}

function getNumberClass(number: number) {
  if (number === 0) return 'zero'
  return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)
    ? 'red'
    : 'black'
}

// Inizializzazione
onMounted(() => {
  generateLuckyNumbers()
  
  // Inizializza le decorazioni con movimento
  initDecorations()
})

// Funzione per inizializzare le decorazioni con movimento
function initDecorations() {
  const decorations = document.querySelectorAll('.decoration')
  const container = document.querySelector('.promo-banner') as HTMLElement
  
  if (!container) return
  
  const containerRect = container.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerHeight = containerRect.height
  
  decorations.forEach((decoration) => {
    const el = decoration as HTMLElement
    
    // Dimensioni dell'elemento
    const width = el.offsetWidth
    const height = el.offsetHeight
    
    // Posizione iniziale casuale all'interno del container
    const startX = Math.floor(Math.random() * (containerWidth - width))
    const startY = Math.floor(Math.random() * (containerHeight - height))
    
    // Velocità e direzione iniziale casuale
    const speedX = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1)
    const speedY = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1)
    
    // Imposta posizione iniziale
    el.style.left = `${startX}px`
    el.style.top = `${startY}px`
    
    // Salva velocità e direzione come attributi dell'elemento
    el.dataset.speedX = speedX.toString()
    el.dataset.speedY = speedY.toString()
    el.dataset.posX = startX.toString()
    el.dataset.posY = startY.toString()
    
    // Aggiungi rotazione casuale per alcuni elementi
    if (el.classList.contains('diamond')) {
      const rotateSpeed = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1)
      el.dataset.rotateSpeed = rotateSpeed.toString()
      el.dataset.rotate = '0'
    }
  })
  
  // Avvia l'animazione
  requestAnimationFrame(moveDecorations)
}

// Funzione per muovere le decorazioni
function moveDecorations() {
  const decorations = document.querySelectorAll('.decoration')
  const container = document.querySelector('.promo-banner') as HTMLElement
  
  if (!container) return
  
  const containerRect = container.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerHeight = containerRect.height
  
  decorations.forEach((decoration) => {
    const el = decoration as HTMLElement
    
    // Dimensioni dell'elemento
    const width = el.offsetWidth
    const height = el.offsetHeight
    
    // Recupera posizione e velocità correnti
    let posX = parseFloat(el.dataset.posX || '0')
    let posY = parseFloat(el.dataset.posY || '0')
    let speedX = parseFloat(el.dataset.speedX || '0')
    let speedY = parseFloat(el.dataset.speedY || '0')
    
    // Aggiorna posizione
    posX += speedX
    posY += speedY
    
    // Controlla collisioni con i bordi
    if (posX <= 0 || posX >= containerWidth - width) {
      speedX = -speedX * 0.95 // Inverti direzione con leggero smorzamento
      
      // Correggi posizione se fuori dai limiti
      if (posX < 0) posX = 0
      if (posX > containerWidth - width) posX = containerWidth - width
    }
    
    if (posY <= 0 || posY >= containerHeight - height) {
      speedY = -speedY * 0.95 // Inverti direzione con leggero smorzamento
      
      // Correggi posizione se fuori dai limiti
      if (posY < 0) posY = 0
      if (posY > containerHeight - height) posY = containerHeight - height
    }
    
    // Salva nuova posizione e velocità
    el.dataset.posX = posX.toString()
    el.dataset.posY = posY.toString()
    el.dataset.speedX = speedX.toString()
    el.dataset.speedY = speedY.toString()
    
    // Applica nuova posizione
    el.style.left = `${posX}px`
    el.style.top = `${posY}px`
    
    // Gestisci rotazione per elementi diamond
    if (el.classList.contains('diamond')) {
      let rotate = parseFloat(el.dataset.rotate || '0')
      const rotateSpeed = parseFloat(el.dataset.rotateSpeed || '0')
      
      rotate += rotateSpeed
      el.dataset.rotate = rotate.toString()
      
      // Applica rotazione aggiuntiva oltre alla trasformazione base
      el.style.transform = `rotate(${45 + rotate}deg)`
    }
  })
  
  // Continua l'animazione
  requestAnimationFrame(moveDecorations)
}
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
  margin-bottom: 2rem;
}

.welcome-text {
  .greeting {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(45deg, #FF615A, var(--card-background));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.promo-banner-container {
  position: relative;
  margin-bottom: 2rem;
  height: 100%;
}

.promo-banner {
  position: relative;
  background: linear-gradient(180deg, #1a1a2e, #16213e);
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #00b894;
  box-shadow: 0 0 15px rgba(0, 184, 148, 0.4), 0 0 30px rgba(0, 184, 148, 0.2);
  height: 100%;
}

.promo-content {
  padding: 2rem;
  position: relative;
  z-index: 1;
  height: 100%;
}

.promo-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;

  .neon-icon {
    margin-right: 0.5rem;
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
  }
}

.neon-text {
  font-size: 1.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  &.cyan {
    color: #00b894;
    text-shadow: 0 0 10px rgba(0, 184, 148, 0.8), 0 0 20px rgba(0, 184, 148, 0.5);
  }

  &.pink {
    color: #FF69B4;
    text-shadow: 0 0 10px rgba(255, 105, 180, 0.8), 0 0 20px rgba(255, 105, 180, 0.5);
  }
  
  
  &.yellow {
    color: #F7DC6F;
    text-shadow: 0 0 10px rgba(247, 220, 111, 0.8), 0 0 20px rgba(247, 220, 111, 0.5);
  }
}

.promo-message {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: white;
  text-align: center;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.promo-offers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.offer-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
}

.offer-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 10px rgba(0, 184, 148, 0.3);
  border: 1px solid rgba(0, 184, 148, 0.5);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(0, 184, 148, 0.5);
  }
}

.promo-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.decoration {
  position: absolute;
  opacity: 0.6;
  transition: none; /* Rimuovi transizioni per movimento fluido */
  
  &.circle {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  
  &.diamond {
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
  }
  
  &.wave {
    width: 50px;
    height: 5px;
    border-radius: 10px;
  }

  &.bigger {
    width: 50px;
    height: 50px;
  }
  
  &.pink {
    background-color: rgb(255, 105, 180, 0.5);
    box-shadow: 0 0 10px rgba(255, 105, 180, 0.2);
  }
  
  &.cyan {
    background-color: rgb(0, 184, 148, 0.5);
    box-shadow: 0 0 10px rgba(0, 184, 148, 0.2);
  }
  
  &.yellow {
    background-color: rgb(247, 220, 111, 0.5);
    box-shadow: 0 0 10px rgba(247, 220, 111, 0.2);
  }

  &.purple {
    background-color: rgb(101, 29, 255, 0.5);
    box-shadow: 0 0 10px rgba(101, 22, 255, 0.2);
  }

  &.red {
    background-color: rgba(218, 0, 109, 0.5);
    box-shadow: 0 0 10px rgba(218, 0, 109, 0.2);
  }
}

.promo-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(0, 184, 148, 0.3);
  padding-top: 1.5rem;
  z-index: 1;
  flex-wrap: wrap;
}

.promo-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.promo-validity, .promo-condition {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.promo-button {
  font-weight: 600;
  background: linear-gradient(135deg, #00b894, #00cec9);
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 184, 148, 0.5);
  
  &:hover {
    background: linear-gradient(135deg, #00cec9, #00b894);
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(0, 184, 148, 0.8);
  }
}

.neon-text-small {
  font-size: 0.8rem;
  color: white;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

.dashboard-content {
  margin-top: 2rem;
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

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
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    .stat-title {
      font-size: 0.9rem;
      color: #999;
    }
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .stat-trend {
    font-size: 0.85rem;
    color: #999;
    display: flex;
    align-items: center;
    gap: 0.3rem;

    &.positive {
      color: #00b894;
    }

    &.negative {
      color: #e74c3c;
    }
  }
}

.sessions-card {
  .stat-icon {
    background-color: rgba(255, 97, 90, 0.15);
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
  color: var(--card-text);

  .header-title {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    font-weight: 600;
    gap: 5px;
    color: var(--card-text);

    svg {
      margin-right: 0.5rem;
      color: var(--fill-wheel);
    }
  }

  .refresh-button {
    color: var(--fill-wheel);
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
    background-color: #181e23;
  }

  &.zero {
    background-color: #00b894;
  }
}

.lucky-numbers-message {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--fill-wheel);
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

  svg {
    color: var(--fill-wheel);
  }
}

.tutorial-text {
  flex: 1;

  .tutorial-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--card-text);
  }

  .tutorial-description {
    color: var(--card-text);
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
  color: var(--fill-wheel);
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
  background: var(--card-background);
  transition:
    transform 0.3s ease;
  border-radius: 20px;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.5rem;
    text-align: center;
    color: var(--card-text);
  }

  p {
    color: var(--card-text);
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
