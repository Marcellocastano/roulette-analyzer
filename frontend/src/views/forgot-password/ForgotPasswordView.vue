<template>
  <AuthLayout>
    <template #title>{{ $t('forgot_password.title') }}</template>
    <n-form ref="formRef" :model="formValue" :rules="rules">
      <p class="text-center mb-4">{{ $t('forgot_password.description') }}</p>
      <n-form-item path="email" :label="$t('forgot_password.email')">
        <n-input
          v-model:value="formValue.email"
          size="large"
          round
          :placeholder="$t('forgot_password.email')"
          class="bg-white"
        />
      </n-form-item>
      <div class="submit-container text-center">
        <n-button :loading="loading" type="primary" @click="handleSubmit" class="bg-accent-dark">
          {{ $t('forgot_password.submit') }}
        </n-button>
      </div>
      <div class="mt-4 text-center">
        <n-button class="text-blue-900" text @click="router.push('/login')">
          {{ $t('forgot_password.back_to_login') }}
        </n-button>
      </div>
    </n-form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import AuthLayout from '@/components/Layout/AuthLayout.vue'
import { useI18n } from 'vue-i18n'
import { authApi } from '@/api/auth'

const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const router = useRouter()
const message = useMessage()

interface FormValue {
  email: string
}

const formValue = ref<FormValue>({
  email: '',
})

const rules: FormRules = {
  email: [
    {
      required: true,
      message: t('forgot_password.errors.email_required'),
      trigger: ['blur', 'input'],
    },
    {
      type: 'email',
      message: t('forgot_password.errors.email_invalid'),
      trigger: ['blur', 'input'],
    },
  ],
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    await authApi.forgotPassword({
      email: formValue.value.email
    })

    message.success(t('forgot_password.messages.success'))

    // Reindirizza alla pagina di login dopo un breve ritardo
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    console.error('Password reset error:', error)

    // Mostra comunque un messaggio di successo per motivi di sicurezza
    // Questo evita attacchi di enumerazione degli account
    message.success(t('forgot_password.messages.success'))

    // Reindirizza alla pagina di login dopo un breve ritardo
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } finally {
    loading.value = false
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
