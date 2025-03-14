<template>
  <n-alert
    v-if="paymentInstructions"
    type="info"
    :title="$t('pricing.subscription_request.title')"
    style="margin-bottom: 20px; max-width: 1200px; margin-left: auto; margin-right: auto;"
    closable
  >
    <template #icon>
      <n-icon>
        <InfoCircle />
      </n-icon>
    </template>
    {{ $t('pricing.subscription_request.message') }}
    <n-button text class="text-btn" @click="showSavedPaymentInstructions">
      {{ $t('pricing.subscription_request.view_details') }}
    </n-button>
  </n-alert>
  <div class="pricing-container">
    <n-card class="pricing-card">
      <template #header>
        <div class="card-header">
          <n-h1>{{ $t('pricing.header.title') }}</n-h1>
          <n-p>{{ $t('pricing.header.subtitle') }}</n-p>
        </div>
      </template>

      <div class="plans-container">
        <n-card class="plan-card monthly">
          <div class="plan-header">
            <n-h2>{{ $t('pricing.monthly_plan.title') }}</n-h2>
            <!-- <div class="badge">Flessibile</div> -->
          </div>

          <div class="price-container">
            <div class="price">
              <span class="currency">€</span>
              <span class="amount">{{ $t('pricing.monthly_plan.price') }}</span>
              <span class="period">{{ $t('pricing.monthly_plan.period') }}</span>
            </div>
          </div>

          <div class="features">
            <div class="feature-item">
              <n-icon size="20" color="#ffbc00">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.monthly_plan.features.0') }}</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ffbc00">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.monthly_plan.features.1') }}</span>
            </div>
          </div>

          <n-button
            type="primary"
            round
            class="subscribe-button"
            @click="requestSubscription('premium', 'monthly')"
          >
            {{ $t('pricing.monthly_plan.button') }}
          </n-button>
        </n-card>

        <n-card class="plan-card annual">
          <div class="ribbon">
            <span>{{ $t('pricing.annual_plan.recommended') }}</span>
          </div>
          <div class="plan-header">
            <n-h2>{{ $t('pricing.annual_plan.title') }}</n-h2>
            <!-- <div class="badge best-value">Miglior Valore</div> -->
          </div>

          <div class="price-container">
            <div class="price">
              <span class="currency">€</span>
              <span class="amount">{{ $t('pricing.annual_plan.price') }}</span>
              <span class="period">{{ $t('pricing.annual_plan.period') }}</span>
            </div>
            <div class="original-price">
              <span class="strikethrough">€{{ $t('pricing.annual_plan.original_price') }}</span>
              <span class="discount">{{ $t('pricing.annual_plan.discount') }}</span>
            </div>
          </div>

          <div class="features">
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.annual_plan.features.0') }}</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.annual_plan.features.1') }}</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.annual_plan.features.2') }}</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.annual_plan.features.3') }}</span>
            </div>
          </div>

          <n-button
            type="primary"
            round
            class="subscribe-button premium-button"
            @click="requestSubscription('premium', 'annual')"
          >
            {{ $t('pricing.annual_plan.button') }}
          </n-button>
        </n-card>
      </div>
    </n-card>
  </div>

  <!-- Modale per le istruzioni di pagamento -->
  <n-modal
    v-model:show="showPaymentModal"
    preset="card"
    :title="$t('pricing.payment_modal.title')"
    style="width: 500px; max-width: 90%"
    :mask-closable="false"
  >
    <n-space vertical>
      <n-text>
        {{ $t('pricing.payment_modal.thank_you') }}
      </n-text>

      <n-divider />

      <n-space vertical>
        <n-text>
          <strong>{{ $t('pricing.payment_modal.paypal_email') }}</strong>
          {{ paymentInstructions?.paypalEmail }}
        </n-text>
        <n-text>
          <strong>{{ $t('pricing.payment_modal.amount') }}</strong>
          {{ paymentInstructions?.amount }} {{ paymentInstructions?.currency }}
        </n-text>
        <n-text>
          <strong>{{ $t('pricing.payment_modal.reference') }}</strong>
          {{ paymentInstructions?.reference }}
        </n-text>
      </n-space>

      <n-divider />

      <n-text type="warning">
        {{ $t('pricing.payment_modal.important') }}
      </n-text>

      <n-space justify="end">
        <n-button @click="cancelSubscriptionRequest" :loading="isLoading">
          {{ $t('pricing.payment_modal.cancel_button') }}
        </n-button>
        <n-button type="primary" @click="closeModal">{{ $t('pricing.payment_modal.understand_button') }}</n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { NButton, NCard, NH1, NH2, NP, NIcon, NModal, NSpace, NText, NDivider, NAlert } from 'naive-ui'
import { Check, InfoCircle } from '@vicons/tabler'
import { ref, onMounted } from 'vue'
import { h } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/user'
import type { PaymentInstructions } from '@/api/user'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const message = useMessage()
const router = useRouter()
const isLoading = ref(false)
const showPaymentModal = ref(false)
const paymentInstructions = ref<PaymentInstructions | null>(null)

// Controlla se ci sono informazioni di pagamento salvate nel sessionStorage
onMounted(() => {
  const savedPaymentInfo = sessionStorage.getItem('paymentInstructions')
  if (savedPaymentInfo) {
    paymentInstructions.value = JSON.parse(savedPaymentInfo)
  }
})

const requestSubscription = async (plan: string, duration: string) => {
  try {
    isLoading.value = true

    const response = await userApi.requestSubscription(plan, duration)

    message.success(t('pricing.messages.subscription_success'))

    // Salva le istruzioni di pagamento e mostra la modale
    paymentInstructions.value = response.data.data.paymentInstructions

    // Salva le informazioni nel sessionStorage
    sessionStorage.setItem('paymentInstructions', JSON.stringify(paymentInstructions.value))

    showPaymentModal.value = true

  } catch (error) {
    console.error('Error during subscription request:', error)
    message.error(t('pricing.messages.subscription_error'))
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  showPaymentModal.value = false
}

const showSavedPaymentInstructions = () => {
  if (paymentInstructions.value) {
    showPaymentModal.value = true
  }
}

const cancelSubscriptionRequest = async () => {
  try {
    isLoading.value = true

    // Chiamata API per annullare la richiesta di sottoscrizione
    await userApi.cancelSubscriptionRequest()

    // Rimuovi le informazioni dal sessionStorage
    sessionStorage.removeItem('paymentInstructions')
    paymentInstructions.value = null
    showPaymentModal.value = false

    message.success(t('pricing.messages.cancel_success'))

  } catch (error) {
    console.error('Error during request cancellation:', error)
    message.error(t('pricing.messages.cancel_error'))
  } finally {
    isLoading.value = false
  }
}
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

.text-btn {
  color: var(--accent-color-dark);
  font-size: 16px;
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
