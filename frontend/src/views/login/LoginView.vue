<template>
  <AuthLayout>
    <template #title>{{ $t('login.title') }}</template>
    <n-form ref="formRef" :model="formValue" :rules="rules" @submit.prevent>
      <n-form-item path="email" :label="$t('login.email')">
        <n-input
          v-model:value="formValue.email"
          size="large"
          round
          :placeholder="$t('login.email')"
          class="bg-white"
        />
      </n-form-item>
      <n-form-item path="password" :label="$t('login.password')">
        <n-input
          v-model:value="formValue.password"
          type="password"
          show-password-on="click"
          size="large"
          round
          :placeholder="$t('login.password')"
          class="bg-white"
          @keyup.enter.prevent="handleSubmit"
        >
          <template #password-visible-icon>
            <n-icon :size="16" :component="Eye" />
          </template>
          <template #password-invisible-icon>
            <n-icon :size="16" :component="EyeOff" />
          </template>
        </n-input>
      </n-form-item>
      <div class="mb-4">
        <n-button class="text-blue-900" text size="small" @click="router.push('/forgot-password')">
          {{ $t('login.forgot_password') }}
        </n-button>
      </div>
      <div class="submit-container text-center">
        <n-button :loading="loading" type="primary" @click.prevent="handleSubmit" class="bg-accent-dark">
          {{ $t('login.submit') }}
        </n-button>
      </div>
      <div class="mt-4 text-center">
        <n-button class="text-blue-900" text @click="router.push('/signup')">
          {{ $t('login.signup_link') }}
        </n-button>
      </div>
    </n-form>

    <!-- Modal per account non attivato -->
    <n-modal v-model:show="showActivationModal">
      <n-card
        style="width: 450px"
        :title="$t('login.account_not_activated.title')"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <p>{{ $t('login.account_not_activated.message') }}</p>
        <template #footer>
          <div class="flex justify-between">
            <n-button @click="showActivationModal = false">
              {{ $t('common.cancel') }}
            </n-button>
            <n-button type="primary" :loading="resendingEmail" @click="resendConfirmationEmail">
              {{ $t('login.account_not_activated.resend_button') }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NIcon, NModal, NCard } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/Layout/AuthLayout.vue'
import { Eye, EyeOff } from '@vicons/tabler'
import { useI18n } from 'vue-i18n'
import { authApi } from '@/api/auth'

const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

// Stato per il modal di attivazione account
const showActivationModal = ref(false)
const resendingEmail = ref(false)

interface FormValue {
  email: string
  password: string
}

const formValue = ref<FormValue>({
  email: '',
  password: '',
})

const rules: FormRules = {
  email: [
    {
      required: true,
      message: t('login.errors.email_required'),
      trigger: ['blur', 'input'],
    },
    {
      type: 'email',
      message: t('login.errors.email_invalid'),
      trigger: ['blur', 'input'],
    },
  ],
  password: [
    {
      required: true,
      message: t('login.errors.password_required'),
      trigger: ['blur', 'input'],
    },
  ],
}

const handleSubmit = async (e: Event) => {
  e?.preventDefault()
  try {
    await formRef.value?.validate()
    loading.value = true
    
    try {
      await authStore.login({
        email: formValue.value.email,
        password: formValue.value.password,
      })

      // Verifica che l'autenticazione sia riuscita
      if (authStore.isAuthenticated) {
        message.success(t('login.messages.success'))
        // Aspetta un momento prima di reindirizzare
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      }
    } catch (error: any) {
      console.error('Errore durante il login:', error)
      
      // Gestione specifica per account non attivato
      if (error.response?.data?.message === 'account_not_activated' || 
          error.response?.status === 403 && error.response?.data?.message === 'account_not_activated') {
        console.log('1')
        message.error(t('login.messages.account_not_activated'))
        showActivationModal.value = true
      } else if (error.response?.status === 401) {
        // Credenziali errate
        console.log('2')
        message.error(t('login.messages.invalid_credentials'))
      } else {
        console.log('3')
        message.error(t('login.messages.login_error'))
      }
    }
  } catch (formError) {
    // Errore di validazione del form
    console.log('4')
    console.error('Errore di validazione:', formError)
  } finally {
    loading.value = false
  }
}

const resendConfirmationEmail = async () => {
  try {
    resendingEmail.value = true
    await authApi.resendConfirmationEmail(formValue.value.email)
    message.success(t('login.messages.resend_confirmation_success'))
    showActivationModal.value = false
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email di conferma:', error)
    message.error(t('login.messages.resend_confirmation_error'))
  } finally {
    resendingEmail.value = false
  }
}
</script>

<style scoped>
.submit-container {
  margin-top: 1rem;
}
:deep(.n-form-item-label__text),
:deep(.n-input__input-el) {
  color: var(--text-color-dark);
}
</style>
