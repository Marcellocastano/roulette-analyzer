<template>
  <n-alert
    v-if="paymentInstructions && paymentInstructions.status === 'pending'"
    type="info"
    :title="$t('pricing.subscription_request.title')"
    style="margin-bottom: 20px; max-width: 1200px; margin-left: auto; margin-right: auto;"
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
    <br />
    <small v-html="$t('pricing.subscription_request.note')"></small>
  </n-alert>
  <div class="pricing-container">
    <n-card class="pricing-card">
      <template #header>
        <div class="card-header">
          <n-h1>{{ userSubscription?.active ? $t('pricing.header.titlePremium') : $t('pricing.header.title') }}</n-h1>
          <n-p>{{ $t('pricing.header.subtitle') }}</n-p>
        </div>
      </template>

      <div class="plans-container">
        <n-card v-if="!user?.isTrialUsed" class="plan-card trial">
          <div class="flex justify-between flex-col h-full">
            <div>
              <div class="plan-header">
                <n-h2>{{ $t('pricing.trial_plan.title') }}</n-h2>
              </div>

              <div class="price-container">
                <div class="price">
                  <span class="amount">{{ $t('pricing.trial_plan.price') }}</span>
                </div>
              </div>

              <div class="features">
                <div class="feature-item">
                  <n-icon size="20" color="#ffbc00">
                    <Check />
                  </n-icon>
                  <span>{{ $t('pricing.trial_plan.features.0') }}</span>
                </div>
                <div class="feature-item">
                  <n-icon size="20" color="#ffbc00">
                    <Check />
                  </n-icon>
                  <span>{{ $t('pricing.trial_plan.features.1') }}</span>
                </div>
              </div>
            </div>

            <n-button
              type="primary"
              round
              class="subscribe-button"
              @click="activateTrial()"
              :loading="isLoading"
            >
              {{ $t('pricing.trial_plan.button') }}
            </n-button>
          </div>
        </n-card>

        <n-card
          v-for="plan in filteredPlans.filter(p => p.duration === 'monthly')"
          :key="plan._id"
          class="plan-card monthly"
        >
        <div class="flex justify-between flex-col h-full">
          <div>
            <div class="plan-header">
              <n-h2>{{ $t('pricing.monthly_plan.title') }}</n-h2>
            </div>

            <div class="price-container">
              <div class="price">
                <span class="currency">
                  {{ plan.price.currency === 'EUR' ? '€' : plan.price.currency }}
                </span>
                <span class="amount">{{ plan.price.amount }}</span>
                <span class="period">
                  {{ plan.duration === 'monthly' ? t('pricing.monthly_plan.period') : 'Monthly' }}
                </span>
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
          </div>
          <n-button
            type="primary"
            round
            class="subscribe-button"
            @click="requestSubscription(plan._id)"
            :loading="isLoading"
          >
            {{ userSubscription?.active ? $t('pricing.monthly_plan.buttonPremium') : $t('pricing.monthly_plan.button') }}
          </n-button>
        </div>
        </n-card>

        <n-card
          v-for="plan in filteredPlans.filter(p => p.duration === 'annual')"
          :key="plan._id"
          class="plan-card annual"
        >
          <div class="ribbon">
            <span>{{ $t('pricing.annual_plan.recommended') }}</span>
          </div>

          <div class="flex justify-between flex-col h-full">
            <div>
              <div class="plan-header">
                <n-h2>{{ t('pricing.annual_plan.title') }}</n-h2>
              </div>
    
              <div class="price-container">
                <div class="price">
                  <span class="currency">
                    {{ plan.price.currency === 'EUR' ? '€' : plan.price.currency }}
                  </span>
                  <span class="amount">{{ plan.price.amount }}</span>
                  <span class="period">
                    {{ plan.duration === 'annual' ? t('pricing.annual_plan.period') : 'Annual' }}
                  </span>
                </div>
                <div class="original-price">
                  <span class="strikethrough">€{{ plan.price.amount * 2 }}</span>
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
              </div>
    
              <n-button
                type="primary"
                round
                class="subscribe-button premium-button"
                @click="requestSubscription(plan._id)"
                :loading="isLoading"
              >
                {{ userSubscription?.active ? $t('pricing.annual_plan.buttonPremium') : $t('pricing.annual_plan.button') }}
              </n-button>
            </div>
          </div>
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
          <strong>{{ $t('pricing.payment_modal.instructions') }}</strong>
        </n-text>
      </n-space>

      <n-divider />

      <n-text type="warning">
        <strong>{{ $t('pricing.payment_modal.important') }}</strong>
      </n-text>

      <n-space justify="end" class="mt-6">
        <n-button @click="cancelSubscriptionRequest" :loading="isLoading">
          {{ $t('pricing.payment_modal.cancel_button') }}
        </n-button>
        <n-button type="primary" @click="onConfirmPayment">
          {{ $t('pricing.payment_modal.understand_button') }}
        </n-button>
      </n-space>
    </n-space>
  </n-modal>

  <!-- Modale di conferma per l'attivazione del Trial -->
  <n-modal
    v-model:show="showTrialConfirmModal"
    preset="card"
    :title="$t('pricing.trial_modal.title')"
    style="width: 500px; max-width: 90%"
    :mask-closable="false"
  >
    <n-space vertical>
      <n-text>
        {{ $t('pricing.trial_modal.message') }}
      </n-text>

      <n-divider />

      <n-text type="info">
        <strong>{{ $t('pricing.trial_modal.details') }}</strong>
      </n-text>

      <n-space justify="end" class="mt-6">
        <n-button @click="showTrialConfirmModal = false" :loading="isLoading">
          {{ $t('pricing.trial_modal.cancel_button') }}
        </n-button>
        <n-button type="primary" @click="confirmActivateTrial" :loading="isLoading">
          {{ $t('pricing.trial_modal.confirm_button') }}
        </n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { NButton, NCard, NH1, NH2, NP, NIcon, NModal, NSpace, NText, NDivider, NAlert } from 'naive-ui'
import { Check, InfoCircle } from '@vicons/tabler'
import { ref, onMounted, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { subscriptionApi, SubscriptionRequest } from '@/api/subscription'
import { planApi, Plan } from '@/api/plan'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const message = useMessage()
const router = useRouter()
const isLoading = ref(false)
const showPaymentModal = ref(false)
const showTrialConfirmModal = ref(false)
const paymentInstructions = ref<SubscriptionRequest | null>(null)
const amount = ref(0)
const plans = ref<Plan[]>([])
const { userSubscription, user } = useAuthStore()

const filteredPlans = computed(() => {
  return plans.value.filter((plan: Plan) => plan.isActive)
})

// Controlla se ci sono informazioni di pagamento salvate nel sessionStorage
onMounted(() => {
  const savedPaymentInfo = sessionStorage.getItem('paymentInstructions')
  if (savedPaymentInfo && (userSubscription?.status === 'pending' || userSubscription?.newRequest?.status === 'pending')) {
    paymentInstructions.value = JSON.parse(savedPaymentInfo)
  }
  getPlans()
  gerRequestInPending()
})

const getPlans = async () => {
  try {
    const response = await planApi.getPlans()
    plans.value = response.data.data
  } catch (error) {
    message.error(t('pricing.messages.error_retrieving_plans'))
    console.error('Error during plan retrieval:', error)
    return []
  }
}

const gerRequestInPending = async () => {
  try {
    const response = await subscriptionApi.requestSubscriptionInPending()
    paymentInstructions.value = response.data.data
  } catch (error) {
    message.error(t('pricing.messages.error_retrieving_active_request'))
    console.error('Error during active request retrieval:', error)
    return null
  }
}

const activateTrial = async () => {
  showTrialConfirmModal.value = true
}

const confirmActivateTrial = async () => {
  try {
    isLoading.value = true
    const response = await subscriptionApi.activateTrial()
    
    // Se il backend restituisce un nuovo token, aggiornalo
    if (response?.data?.accessToken) {
      const authStore = useAuthStore()
      authStore.setToken(response.data.accessToken)
      
      // Aggiorna le informazioni dell'utente
      await authStore.checkAuthStatus()
    }
    
    message.success(t('pricing.messages.trial_activated'))
    showTrialConfirmModal.value = false
  } catch (error) {
    console.error('Error during trial activation:', error)
    message.error(t('pricing.messages.trial_error'))
  } finally {
    isLoading.value = false
  }
}

const requestSubscription = async (planId: string) => {
  if (paymentInstructions.value && paymentInstructions.value.status === 'pending') {
    message.error('C\'è già una richiesta di abbonamento in attesa. Procedi al pagamento o annulla la richiesta prima di poter avviare una nuova richiesta.')
    return
  }
  try {
    isLoading.value = true
    const response = await subscriptionApi.requestSubscription(planId)
    paymentInstructions.value = response.data.data
    showPaymentModal.value = true
  } catch (error) {
    console.error('Error during subscription request:', error)
    message.error(t('pricing.messages.subscription_error'))
  } finally {
    isLoading.value = false
  }
}

const onConfirmPayment = () => {
  if (paymentInstructions.value && paymentInstructions.value.paymentDetails && paymentInstructions.value.paymentDetails.paymentLink) {
    window.open(paymentInstructions.value.paymentDetails.paymentLink, '_blank')
  }
  closeModal()
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
    await subscriptionApi.cancelSubscriptionRequest(paymentInstructions.value?._id || '')

    // Rimuovi le informazioni dal sessionStorage
    sessionStorage.removeItem('requestId')
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
  color: var(--text-color);
  border-color: transparent;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header :deep(p) {
  font-size: 18px;
  color: var(--secondary-text-color);
  margin-bottom: 1.5rem;
}

/* Stile per il toggle mensile/annuale */
.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 10px;
  position: relative;
}

.billing-toggle span {
  font-size: 14px;
  color: var(--secondary-text-color);
  transition: color 0.3s ease, font-weight 0.3s ease;
}

.billing-toggle span.active {
  color: var(--text-color);
  font-weight: bold;
}

.billing-switch {
  margin: 0 10px;
}

.discount-badge {
  background-color: rgba(255, 0, 88, 0.1);
  color: #ff0058;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 10px;
  position: absolute;
  top: 35px;
}

.billing-info {
  font-size: 14px;
  color: var(--secondary-text-color);
  margin-top: 5px;
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
  max-width: 350px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: var(--card-color);
  color: var(--text-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.text-btn {
  color: var(--primary-color);
  font-size: 16px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.text-btn:hover {
  color: var(--primary-color-hover);
}

.plan-card :deep(h2) {
  color: var(--text-color);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Stile per il piano trial */
.trial {
  border: 1px solid var(--border-color);
}

.trial::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: #fb7d15;
  transition: height 0.3s ease;
}

.trial:hover::before {
  height: 7px;
}

.monthly {
  border: 1px solid var(--border-color);
}

.monthly::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--primary-color);
  transition: height 0.3s ease;
}

.monthly:hover::before {
  height: 7px;
}

/* Stile per il piano d'Alembert */
.annual {
  position: relative;
  border: none;
  z-index: 1;
}

.annual::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-color), #ff0058);
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
  background: var(--card-color);
  z-index: -1;
  border-radius: 20px;
  margin: 2px;
}

:deep(.n-alert-body) {
  background-color: var(--background-alt) !important;
}

.ribbon {
  position: absolute;
  top: 0;
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
  right: -60px;
  top: 35px;
  transform: rotate(45deg);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.price-container {
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
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
  color: var(--text-color);
}

.amount {
  font-size: 3.5rem;
  font-weight: bold;
  line-height: 1;
  background: linear-gradient(45deg, var(--primary-color), #ff0058);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.period {
  font-size: 1rem;
  color: var(--secondary-text-color);
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
  color: var(--secondary-text-color);
  font-size: 1.2rem;
}

.discount {
  color: #ff0058;
  font-weight: bold;
  margin-top: 0.3rem;
  font-size: 0.9rem;
  padding: 2px 8px;
  background-color: rgba(255, 0, 88, 0.1);
  border-radius: 10px;
}

.features {
  flex-grow: 1;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  transition: transform 0.2s ease;
}

.feature-item span {
  margin-left: 0.8rem;
  color: var(--text-color);
}

.subscribe-button {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: var(--primary-color);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.subscribe-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.7s ease;
}

.subscribe-button:hover::after {
  left: 100%;
}

.premium-button {
  background: linear-gradient(45deg, var(--primary-color), #ff0058);
  box-shadow: 0 4px 15px rgba(255, 0, 88, 0.3);
}



@keyframes borderGlow {
  0% {
    box-shadow: 0 0 5px rgba(var(--primary-color), 0.5);
    opacity: 0.8;
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 0, 88, 0.8);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .plans-container {
    flex-direction: column;
    align-items: center;
  }

  .plan-card {
    max-width: 100%;
    width: 100%;
  }

  .annual {
    transform: scale(1);
    margin: 1rem 0;
  }
}
</style>
