<template>
  <div class="pricing-container">
    <n-card class="pricing-card">
      <template #header>
        <div class="card-header">
          <n-h1>Scegli il tuo Abbonamento</n-h1>
          <n-p>Accedi a tutte le funzionalità premium di Roulette Destroyer</n-p>
        </div>
      </template>

      <div class="plans-container">
        <n-card class="plan-card monthly">
          <div class="plan-header">
            <n-h2>Piano Mensile</n-h2>
            <!-- <div class="badge">Flessibile</div> -->
          </div>

          <div class="price-container">
            <div class="price">
              <span class="currency">€</span>
              <span class="amount">50</span>
              <span class="period">/mese</span>
            </div>
          </div>

          <div class="features">
            <div class="feature-item">
              <n-icon size="20" color="#ffbc00">
                <Check />
              </n-icon>
              <span>Accesso completo alle statistiche</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ffbc00">
                <Check />
              </n-icon>
              <span>Predizioni illimitate</span>
            </div>
          </div>

          <n-button type="primary" round class="subscribe-button">Acquista</n-button>
        </n-card>

        <n-card class="plan-card annual">
          <div class="ribbon">
            <span>Consigliato</span>
          </div>
          <div class="plan-header">
            <n-h2>Piano Annuale</n-h2>
            <!-- <div class="badge best-value">Miglior Valore</div> -->
          </div>

          <div class="price-container">
            <div class="price">
              <span class="currency">€</span>
              <span class="amount">300</span>
              <span class="period">/anno</span>
            </div>
            <div class="original-price">
              <span class="strikethrough">€600</span>
              <span class="discount">50% di sconto</span>
            </div>
          </div>

          <div class="features">
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>Accesso completo alle statistiche</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>Predizioni illimitate</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>Supporto prioritario</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>Risparmio di €300 rispetto al piano mensile</span>
            </div>
          </div>

          <n-button type="primary" round class="subscribe-button premium-button">
            Risparmia il 50%
          </n-button>
        </n-card>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard, NH1, NH2, NP, NIcon } from 'naive-ui'
import { Check } from '@vicons/tabler'
</script>

<style scoped>
.pricing-container {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 85px);
}

.pricing-card {
  width: 100%;
  max-width: 1200px;
  padding: 20px 0;
  background-color: transparent;
  color: #e0e0e0;
  border-color: transparent;
}

.card-header {
  text-align: center;
  margin-bottom: 1rem;
}

.card-header :deep(p) {
  font-size: 18px;
}

.plans-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
}

.plan-card {
  flex: 1;
  min-width: 300px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #2a2a2a;
  color: #e0e0e0;
}

.plan-card :deep(h2) {
  color: #e0e0e0;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.monthly {
  border: 1px solid #333333;
}

.annual {
  position: relative;
  border: none;
  z-index: 1;
  background: linear-gradient(135deg, #2a2a2a, #333333);
  transform: scale(1.05);
}

.annual::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ffbc00, #ff0058);
  z-index: -1;
  border-radius: 22px;
  animation: borderGlow 3s infinite alternate;
}

.annual::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #2a2a2a, #333333);
  z-index: -1;
  border-radius: 20px;
  margin: 2px;
}

.ribbon {
  position: absolute;
  top: 1px;
  right: 0;
  z-index: 1;
  overflow: hidden;
  width: 150px;
  height: 150px;
}

.ribbon span {
  position: absolute;
  display: block;
  width: 225px;
  padding: 8px 0;
  background-color: #ff0058;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  text-align: center;
  right: -45px;
  top: 37px;
  transform: rotate(45deg);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.price-container {
  margin-bottom: 2rem;
  text-align: center;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 0.2rem;
}

.amount {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}

.period {
  font-size: 1rem;
  color: #999;
  margin-left: 0.2rem;
}

.original-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
}

.strikethrough {
  text-decoration: line-through;
  color: #999;
  font-size: 1.2rem;
}

.discount {
  color: #ff0058;
  font-weight: bold;
  margin-top: 0.3rem;
}

.features {
  flex-grow: 1;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.feature-item span {
  margin-left: 0.8rem;
}

.subscribe-button {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #ffbc00;
  border: none;
}

.premium-button {
  background: linear-gradient(45deg, #ffbc00, #ff0058);
  box-shadow: 0 4px 15px rgba(255, 0, 88, 0.3);
}

@keyframes borderGlow {
  0% {
    box-shadow: 0 0 5px rgba(255, 188, 0, 0.5);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 0, 88, 0.8);
  }
}
</style>
