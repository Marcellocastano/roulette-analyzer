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
          <n-h1>{{ $t('pricing.header.title') }}</n-h1>
          <n-p>{{ $t('pricing.header.subtitle') }}</n-p>
          <!-- Switch per scegliere tra mensile e annuale -->
          <div class="billing-toggle">
            <span :class="{ 'active': !isAnnualBilling }">Mensile</span>
            <n-switch v-model:value="isAnnualBilling" class="billing-switch" />
            <span :class="{ 'active': isAnnualBilling }">Annuale</span>
            <span v-if="isAnnualBilling" class="discount-badge">Sconto 50%</span>
          </div>
        </div>
      </template>

      <div class="plans-container">
        <!-- Piano di prova -->
        <n-card v-if="!user?.isTrialUsed" class="plan-card trial">
          <div class="plan-header">
            <n-h2>{{ $t('pricing.trial_plan.title') }}</n-h2>
          </div>

          <div class="price-container">
            <div class="price">
              <span class="amount">{{ $t('pricing.trial_plan.price') }}</span>
            </div>
          </div>

          <div class="features">
            <div v-for="index in 3" :key="index" class="feature-item">
              <n-icon size="20" color="#ffbc00">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.trial_plan.features.' + (index - 1)) }}</span>
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
        </n-card>

        <!-- Piano Starter (Base) -->
        <n-card class="plan-card starter">
          <div class="plan-header">
            <n-h2>{{ getStarterPlan()?.name || 'Piano Starter' }}</n-h2>
          </div>

          <div class="price-container">
            <div class="price">
              <span class="currency">€</span>
              <span class="amount">{{ getStarterPlanPrice() }}</span>
              <span class="period">
                {{ isAnnualBilling ? '/mese' : '/mese' }}
              </span>
            </div>
            <div v-if="isAnnualBilling" class="billing-info">
              Fatturato annualmente (€{{ getStarterPlan(true)?.price?.amount || 299 }}/anno)
            </div>
          </div>

          <div class="features">
            <div class="feature-item">
              <n-icon size="20" color="var(--primary-color)">
                <Check />
              </n-icon>
              <span>{{ getStarterPlan()?.rules?.sessions || 5 }} {{ $t('pricing.starter_plan.features.0') }}</span>
            </div>
            <div class="feature-item">
              <n-icon size="20" color="var(--primary-color)">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.starter_plan.features.1') }}</span>
            </div>
          </div>

          <n-button
            type="primary"
            round
            class="subscribe-button"
            @click="requestSubscription(getStarterPlanId())"
            :loading="isLoading"
          >
            {{ $t('pricing.starter_plan.button') }}
          </n-button>
        </n-card>

        <!-- Piano d'Alembert (Premium) -->
        <n-card class="plan-card pro">
          <div class="ribbon">
            <span>{{ $t('pricing.pro_plan.recommended') }}</span>
          </div>
          <div class="plan-header">
            <n-h2>{{ getProPlan()?.name || 'Piano Pro' }}</n-h2>
          </div>

          <div class="price-container">
            <div class="price">
              <span class="currency">€</span>
              <span class="amount">{{ getProPlanPrice() }}</span>
              <span class="period">
                {{ isAnnualBilling ? '/mese' : '/mese' }}
              </span>
            </div>
            <div v-if="isAnnualBilling" class="billing-info">
              Fatturato annualmente (€{{ getProPlanPrice() * 12 || 1188 }}/anno)
            </div>
            <div v-if="isAnnualBilling" class="original-price">
              <span class="strikethrough">€{{ getProPlanPrice() * 12 * 2 || 1188 }}</span>
              <span class="discount">{{ $t('pricing.pro_plan.discount') }}</span>
            </div>
          </div>

          <div class="features">
            <div v-for="index in 3" :key="index" class="feature-item">
              <n-icon size="20" color="#ff0058">
                <Check />
              </n-icon>
              <span>{{ $t('pricing.pro_plan.features.' + (index - 1)) }}</span>
            </div>
          </div>

          <n-button
            type="primary"
            round
            class="subscribe-button premium-button"
            @click="requestSubscription(getProPlanId())"
            :loading="isLoading"
          >
            {{ $t('pricing.pro_plan.button') }}
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
      <n-text>{{ $t('pricing.payment_modal.instructions') }}</n-text>
      <n-divider />
      <n-text>{{ paymentInstructions?.message }}</n-text>
      <n-divider />
      <n-text>{{ $t('pricing.payment_modal.confirmation') }}</n-text>
      <n-space justify="end">
        <n-button @click="closeModal">
          {{ $t('pricing.payment_modal.cancel_button') }}
        </n-button>
        <n-button type="primary" @click="onConfirmPayment">
          {{ $t('pricing.payment_modal.understand_button') }}
        </n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { NButton, NCard, NH1, NH2, NP, NIcon, NModal, NSpace, NText, NDivider, NAlert, NSwitch } from 'naive-ui'
import { Check, InfoCircle } from '@vicons/tabler'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { planApi, Plan } from '@/api/plan'
import type { UserSubscription, UserProfile } from '@/api/user'
import { subscriptionApi, SubscriptionRequest } from '@/api/subscription'

const { t } = useI18n()
const message = useMessage()
const isLoading = ref(false)
const plans = ref<Plan[]>([])
const showPaymentModal = ref(false)
const paymentInstructions = ref<{
  status: string;
  [key: string]: any;
} | null>(null)
const isAnnualBilling = ref(false)
const { userSubscription, user } = useAuthStore()

const filteredPlans = computed(() => {
  return plans.value.filter((plan: Plan) => plan.isActive)
})

// Funzioni per ottenere gli ID dei piani in base alla durata selezionata
const getStarterPlanId = () => {
  const plan = filteredPlans.value.find(
    (p: Plan) => 
      p.name.toLowerCase().includes('starter') && 
      p.duration.type === (isAnnualBilling.value ? 'annual' : 'monthly')
  )
  return plan?._id || ''
}

const getProPlanId = () => {
  const plan = filteredPlans.value.find(
    (p: Plan) => 
      p.name.toLowerCase().includes('pro') && 
      p.duration.type === (isAnnualBilling.value ? 'annual' : 'monthly')
  )
  return plan?._id || ''
}

// Funzioni per ottenere i piani
const getStarterPlan = (annual = false) => {
  return filteredPlans.value.find(
    (p: Plan) => 
      p.name.toLowerCase().includes('starter') && 
      p.duration.type === (annual ? 'annual' : 'monthly')
  )
}

const getProPlan = (annual = false) => {
  return filteredPlans.value.find(
    (p: Plan) => 
      p.name.toLowerCase().includes('pro') && 
      p.duration.type === (annual ? 'annual' : 'monthly')
  )
}

// Funzioni per ottenere i prezzi
const getStarterPlanPrice = () => {
  const plan = getStarterPlan(isAnnualBilling.value)
  if (!plan?.price?.amount) return 25
  if (isAnnualBilling.value) {
    // Mostra il prezzo mensile per il piano annuale (diviso per 12)
    return Math.round(plan?.price?.amount / 12) || 25
  }
  return plan?.price?.amount || 49
}

const getProPlanPrice = () => {
  const plan = getProPlan(isAnnualBilling.value)
  if (!plan?.price?.amount) return 50
  if (isAnnualBilling.value) {
    // Mostra il prezzo mensile per il piano annuale (diviso per 12)
    return Math.round(plan?.price?.amount / 12) || 50
  }
  return plan?.price?.amount || 99
}

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
  try {
    isLoading.value = true
    await subscriptionApi.activateTrial()
    message.success(t('pricing.messages.trial_activated'))
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
  background: #ffbc00;
  transition: height 0.3s ease;
}

.trial:hover::before {
  height: 7px;
}

/* Stile per il piano Starter */
.starter {
  border: 1px solid var(--border-color);
}

.starter::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--primary-color);
  transition: height 0.3s ease;
}

.starter:hover::before {
  height: 7px;
}

/* Stile per il piano d'Alembert */
.pro {
  position: relative;
  border: none;
  z-index: 1;
  transform: scale(1.05);
}

.pro::before {
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

.pro::after {
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
  margin-bottom: 2rem;
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
  
  .pro {
    transform: scale(1);
    margin: 1rem 0;
  }
}
</style>
