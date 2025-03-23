<template>
  <AuthLayout>
    <template #title>{{ $t('reset_password.title') }}</template>
    <n-form ref="formRef" :model="formValue" :rules="rules">
      <p class="text-center mb-4">{{ $t('reset_password.description') }}</p>
      <n-form-item path="password" :label="$t('reset_password.password')">
        <n-input
          v-model:value="formValue.password"
          type="password"
          show-password-on="click"
          size="large"
          round
          :placeholder="$t('reset_password.password')"
          class="bg-white"
        >
          <template #password-visible-icon>
            <n-icon :size="16" :component="Eye" />
          </template>
          <template #password-invisible-icon>
            <n-icon :size="16" :component="EyeOff" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="confirmPassword" :label="$t('reset_password.confirm_password')">
        <n-input
          v-model:value="formValue.confirmPassword"
          type="password"
          show-password-on="click"
          size="large"
          round
          :placeholder="$t('reset_password.confirm_password')"
          class="bg-white"
          @keyup.enter="handleSubmit"
        >
          <template #password-visible-icon>
            <n-icon :size="16" :component="Eye" />
          </template>
          <template #password-invisible-icon>
            <n-icon :size="16" :component="EyeOff" />
          </template>
        </n-input>
      </n-form-item>
      <div class="submit-container text-center">
        <n-button :loading="loading" type="primary" @click="handleSubmit" class="bg-accent-dark">
          {{ $t('reset_password.submit') }}
        </n-button>
      </div>
      <div class="mt-4 text-center">
        <n-button class="text-blue-900" text @click="router.push('/login')">{{ $t('reset_password.back_to_login') }}</n-button>
      </div>
    </n-form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NIcon } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import AuthLayout from '@/components/Layout/AuthLayout.vue'
import { Eye, EyeOff } from '@vicons/tabler'
import { useI18n } from 'vue-i18n'
import { authApi } from '@/api/auth'

const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const message = useMessage()
const token = ref('')

interface FormValue {
  password: string
  confirmPassword: string
}

const formValue = ref<FormValue>({
  password: '',
  confirmPassword: '',
})

onMounted(() => {
  // Ottieni il token dall'URL
  token.value = route.params.token as string
  
  if (!token.value) {
    message.error(t('reset_password.messages.invalid_token'))
    router.push('/login')
  }
})

const validatePasswordMatch = (rule: any, value: string) => {
  return value === formValue.value.password
    ? true
    : new Error(t('reset_password.errors.passwords_not_match'))
}

const rules: FormRules = {
  password: [
    {
      required: true,
      message: t('reset_password.errors.password_required'),
      trigger: ['blur', 'input'],
    },
    {
      min: 8,
      message: t('reset_password.errors.password_length'),
      trigger: ['blur', 'input'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: t('reset_password.errors.confirm_password_required'),
      trigger: ['blur', 'input'],
    },
    {
      validator: validatePasswordMatch,
      trigger: ['blur', 'input'],
    },
  ],
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    await authApi.resetPassword(token.value, {
      password: formValue.value.password
    })
    
    message.success(t('reset_password.messages.success'))
    // Reindirizza alla pagina di login dopo un breve ritardo
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    console.error('Errore durante il reset della password:', error)
    message.error(t('reset_password.messages.error'))
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
