<template>
  <div class="abbonamento-container">
    <n-card class="abbonamento-card">
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
            <div class="badge">Flessibile</div>
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
              <n-icon size="20" color="#00b894">
                <Check />
              </n-icon>
              <span>Accesso completo alle statistiche</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#00b894">
                <Check />
              </n-icon>
              <span>Predizioni illimitate</span>
            </div>
          </div>

          <n-button type="primary" class="subscribe-button bg-accent-dark">Abbonati Ora</n-button>
        </n-card>

        <n-card class="plan-card annual">
          <div class="plan-header">
            <n-h2>Piano Annuale</n-h2>
            <div class="badge best-value">Miglior Valore</div>
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
              <n-icon size="20" color="#00b894">
                <Check />
              </n-icon>
              <span>Accesso completo alle statistiche</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#00b894">
                <Check />
              </n-icon>
              <span>Predizioni illimitate</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#00b894">
                <Check />
              </n-icon>
              <span>Supporto prioritario</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#00b894">
                <Check />
              </n-icon>
              <span>Risparmio di €300 rispetto al piano mensile</span>
            </div>
          </div>

          <n-button type="primary" class="subscribe-button bg-accent-dark">
            Risparmia il 50%
          </n-button>
        </n-card>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard, NH1, NH2, NP, NIcon } from 'naive-ui'
import { Check, ShieldCheck } from '@vicons/tabler'
</script>

<style scoped>
.abbonamento-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.abbonamento-card {
  width: 100%;
  max-width: 1200px;
}

.card-header {
  text-align: center;
  margin-bottom: 1rem;
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
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.annual {
  border: 2px solid #00b894;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.badge {
  background-color: #e9f7ef;
  color: #00b894;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.best-value {
  background-color: #00b894;
  color: white;
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
  color: #666;
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
  color: #e74c3c;
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
}

.guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  color: #666;
}

.guarantee span {
  margin-left: 0.8rem;
}

.bg-accent-dark {
  background-color: #00b894;
}
</style>
