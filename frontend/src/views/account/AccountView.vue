<template>
  <div class="account-container">
    <n-card class="account-card">
      <template #header>
        <div class="card-header">
          <n-h1>{{ $t('account.title') }}</n-h1>
        </div>
      </template>
      <n-tabs type="line">
        <n-tab-pane name="profile" :tab="$t('account.tabs.profile')">
          <n-form ref="profileFormRef" :model="profileForm" :rules="profileRules">
            <n-form-item path="name" :label="$t('account.profile.name')">
              <n-input
                v-model:value="profileForm.name"
                size="large"
                round
                :placeholder="$t('account.profile.name_placeholder')"
              />
            </n-form-item>

            <div class="submit-container">
              <n-button
                :loading="profileLoading"
                type="primary"
                @click="handleProfileSubmit"
                class="bg-accent-dark"
              >
                {{ $t('account.profile.update_button') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>

        <n-tab-pane name="subscription" :tab="$t('account.tabs.subscription')">
          <div class="subscription-container">
            <n-h3>{{ $t('account.subscription.title') }}</n-h3>
            <div class="subscription-info">
              <n-card class="subscription-card">
                <div class="subscription-grid">
                  <div class="subscription-item">
                    <div class="item-label">{{ $t('account.profile.email') }}:</div>
                    <div class="item-value">{{ profileForm.email }}</div>
                  </div>
                  <div class="subscription-item">
                    <div class="item-label">{{ $t('account.subscription.plan') }}:</div>
                    <div class="item-value">
                      {{ userSubscription.plan ? userSubscription.plan.toUpperCase() : '-' }}
                    </div>
                  </div>

                  <div class="subscription-item">
                    <div class="item-label">{{ $t('account.subscription.status') }}:</div>
                    <div class="item-value">
                      <n-tag :type="getStatusType(userSubscription.status)" size="small">
                        {{ getStatusText(userSubscription.status) }}
                      </n-tag>
                    </div>
                  </div>

                  <div class="subscription-item">
                    <div class="item-label">{{ $t('account.subscription.start_date') }}:</div>
                    <div class="item-value">{{ formatDate(userSubscription.startDate || '') }}</div>
                  </div>

                  <div class="subscription-item">
                    <div class="item-label">{{ $t('account.subscription.end_date') }}:</div>
                    <div class="item-value">{{ formatDate(userSubscription.endDate || '') }}</div>
                  </div>

                  <div class="subscription-item">
                    <div class="item-label">{{ $t('account.subscription.duration') }}:</div>
                    <div class="item-value">
                      {{ getDurationText(userSubscription.duration || '') }}
                    </div>
                  </div>
                </div>
              </n-card>
            </div>
            <div class="last-login-section">
              <n-h3>{{ $t('account.subscription.last_login') }}</n-h3>
              <n-card class="subscription-card">
                <div class="last-login-value">{{ formatDate(lastLogin, true) }}</div>
              </n-card>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="password" :tab="$t('account.tabs.change_password')">
          <n-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
            <n-form-item path="oldPassword" :label="$t('account.password.current')">
              <n-input
                v-model:value="passwordForm.oldPassword"
                type="password"
                show-password-on="click"
                size="large"
                round
                :placeholder="$t('account.password.current_placeholder')"
              >
                <template #password-visible-icon>
                  <n-icon :size="16" :component="Eye" />
                </template>
                <template #password-invisible-icon>
                  <n-icon :size="16" :component="EyeOff" />
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="newPassword" :label="$t('account.password.new')">
              <n-input
                v-model:value="passwordForm.newPassword"
                type="password"
                show-password-on="click"
                size="large"
                round
                :placeholder="$t('account.password.new_placeholder')"
              >
                <template #password-visible-icon>
                  <n-icon :size="16" :component="Eye" />
                </template>
                <template #password-invisible-icon>
                  <n-icon :size="16" :component="EyeOff" />
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="confirmPassword" :label="$t('account.password.confirm')">
              <n-input
                v-model:value="passwordForm.confirmPassword"
                type="password"
                show-password-on="click"
                size="large"
                round
                :placeholder="$t('account.password.confirm_placeholder')"
              >
                <template #password-visible-icon>
                  <n-icon :size="16" :component="Eye" />
                </template>
                <template #password-invisible-icon>
                  <n-icon :size="16" :component="EyeOff" />
                </template>
              </n-input>
            </n-form-item>

            <div class="submit-container">
              <n-button
                :loading="passwordLoading"
                type="primary"
                @click="handlePasswordSubmit"
                class="bg-accent-dark"
              >
                {{ $t('account.password.update_button') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NIcon, NCard, NH1, NH3, NTabs, NTabPane, NTag } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff } from '@vicons/tabler'
import { userApi, UserSubscription } from '@/api/user'
import { subscriptionApi, SubscriptionRequest } from '@/api/subscription'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Riferimenti ai form
const profileFormRef = ref<FormInst | null>(null)
const passwordFormRef = ref<FormInst | null>(null)

// Stati di caricamento
const profileLoading = ref(false)
const passwordLoading = ref(false)

const message = useMessage()
const authStore = useAuthStore()

// Form per il profilo
interface ProfileForm {
  name: string
  email: string
}

const profileForm = ref<ProfileForm>({
  name: '',
  email: ''
})

// Form per la password
interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const passwordForm = ref<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Dati dell'abbonamento
const userSubscription = ref<UserSubscription>({
  plan: 'free',
  status: 'unset',
  endDate: '',
  startDate: '',
  duration: null,
  sessions: {
    count: 0,
    lastReset: ''
  },
  name: '',
})

// Richieste di sottoscrizione
const pendingRequest = ref<SubscriptionRequest | null>(null)
const approvedRequest = ref<SubscriptionRequest | null>(null)

const lastLogin = ref<string>('')

// Regole di validazione per il profilo
const profileRules: FormRules = {
  name: [
    { required: true, message: t('account.profile.errors.name_required'), trigger: 'blur' }
  ]
}

// Regole di validazione per la password
const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: t('account.password.errors.old_required'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('account.password.errors.new_required'), trigger: 'blur' },
    { min: 8, message: t('account.password.errors.min_length'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('account.password.errors.confirm_required'), trigger: 'blur' },
    {
      validator: (rule, value) => {
        return value === passwordForm.value.newPassword
      },
      message: t('common.errors.password_match'),
      trigger: 'blur'
    }
  ]
}

// Funzioni di utilità per la formattazione
const formatDate = (dateString: string | Date | null, withTime = false) => {
  if (!dateString) return '-'

  const date = dateString instanceof Date ? dateString : new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  if (withTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return date.toLocaleDateString(undefined, options)
}

const getStatusText = (status: string) => {
  if (!status) return '-'

  switch (status.toLowerCase()) {
    case 'active':
      return t('account.subscription.status_active')
    case 'inactive':
      return t('account.subscription.status_inactive')
    case 'pending':
      return t('account.subscription.status_pending')
    case 'approved':
      return t('account.subscription.status_approved')
    case 'canceled':
      return t('account.subscription.status_canceled')
    case 'rejected':
      return t('account.subscription.status_rejected')
    default:
      return status
  }
}

const getStatusType = (status: string) => {
  if (!status) return 'default'

  switch (status.toLowerCase()) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'error'
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'canceled':
      return 'error'
    case 'rejected':
      return 'error'
    default:
      return 'default'
  }
}

const getDurationText = (duration: string) => {
  if (!duration) return '-'

  switch (duration.toLowerCase()) {
    case 'monthly':
      return t('account.subscription.duration_monthly')
    case 'annual':
      return t('account.subscription.duration_annual')
    default:
      return duration
  }
}

onMounted(async () => {
  try {
    profileLoading.value = true
    // Ottieni i dati del profilo utente
    const profileResponse = await userApi.getProfile()

    if (profileResponse.data.status === 'success') {
      profileForm.value.name = profileResponse.data.data.name
      profileForm.value.email = profileResponse.data.data.email

      // Imposta l'ultimo accesso
      if (profileResponse.data.data.lastLogin) {
        lastLogin.value = profileResponse.data.data.lastLogin
      }
    }

    // Carica i dati dell'abbonamento corrente
    const subscriptionResponse = await subscriptionApi.getUserSubscription()
    if (subscriptionResponse.data.data) {
      userSubscription.value = subscriptionResponse.data.data
    }
  } catch (error) {
    message.error(t('account.profile.errors.loading_error'))
    console.error(error)
  } finally {
    profileLoading.value = false
  }
})

const handleProfileSubmit = () => {
  profileFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(t('account.profile.errors.form_errors'))
      return
    }

    try {
      profileLoading.value = true

      // Prepara i dati da inviare (solo il nome, non l'email)
      const updateData = {
        name: profileForm.value.name
      }

      // Invia la richiesta di aggiornamento
      const response = await userApi.updateProfile(updateData)

      if (response.data.status === 'success') {
        message.success('Profilo aggiornato con successo')
        // Aggiorna i dati dell'utente nello store
        authStore.updateUserInfo(response.data.data)
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Errore durante l\'aggiornamento del profilo')
      console.error(error)
    } finally {
      profileLoading.value = false
    }
  })
}

const handlePasswordSubmit = () => {
  passwordFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(t('account.profile.errors.form_errors'))
      return
    }

    try {
      passwordLoading.value = true

      // Invia la richiesta di cambio password
      const response = await userApi.changePassword(
        passwordForm.value.oldPassword,
        passwordForm.value.newPassword
      )

      if (response.data.status === 'success') {
        message.success('Password aggiornata con successo')
        // Resetta il form
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Errore durante il cambio della password')
      console.error(error)
    } finally {
      passwordLoading.value = false
    }
  })
}
</script>

<style scoped>
.account-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.account-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.bg-accent-dark {
  background-color: var(--accent-dark);
}

.subscription-container {
  padding: 10px 0;
}

.subscription-info, .new-request-section, .last-login-section {
  margin-bottom: 20px;
}

.subscription-card {
  margin-top: 10px;
}

.subscription-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.subscription-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-label {
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.item-value {
  font-size: 1rem;
}

.last-login-value {
  font-size: 1rem;
  padding: 5px 0;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 600px) {
  .subscription-grid {
    grid-template-columns: 1fr;
  }
}
</style>
