<template>
  <AuthLayout>
    <template #title>{{ $t('signup.title') }}</template>
    <n-form ref="formRef" :model="formValue" :rules="rules">
      <n-form-item path="name" :label="$t('signup.name')">
        <n-input
          v-model:value="formValue.name"
          size="large"
          round
          :placeholder="$t('signup.name')"
        />
      </n-form-item>
      <n-form-item path="email" :label="$t('signup.email')">
        <n-input
          v-model:value="formValue.email"
          size="large"
          round
          :placeholder="$t('signup.email')"
        />
      </n-form-item>
      <n-form-item path="password" :label="$t('signup.password')">
        <n-input
          v-model:value="formValue.password"
          type="password"
          show-password-on="click"
          size="large"
          round
          :placeholder="$t('signup.password')"
        >
          <template #password-visible-icon>
            <n-icon :size="16" :component="Eye" />
          </template>
          <template #password-invisible-icon>
            <n-icon :size="16" :component="EyeOff" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="confirmPassword" :label="$t('signup.confirm_password')">
        <n-input
          v-model:value="formValue.confirmPassword"
          type="password"
          show-password-on="click"
          size="large"
          round
          :placeholder="$t('signup.confirm_password')"
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
        <n-button :loading="loading" type="primary" @click="handleSubmit">
          {{ $t('signup.submit') }}
        </n-button>
      </div>
      <div class="mt-4 text-center">
        <n-button class="link-button" text @click="router.push('/login')">
          {{ $t('signup.login_link') }}
        </n-button>
      </div>
    </n-form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NIcon } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/Layout/AuthLayout.vue'
import { Eye, EyeOff } from '@vicons/tabler'
import { useI18n } from 'vue-i18n'

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()
const { t } = useI18n()

interface FormValue {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const formValue = ref<FormValue>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validatePasswordMatch = (rule: any, value: string) => {
  return value === formValue.value.password ? true : new Error(t('common.errors.password_match'))
}

const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('signup.errors.name_required'),
      trigger: ['blur', 'input'],
    },
  ],
  email: [
    {
      required: true,
      message: t('signup.errors.email_required'),
      trigger: ['blur', 'input'],
    },
    {
      type: 'email',
      message: t('signup.errors.email_invalid'),
      trigger: ['blur', 'input'],
    },
  ],
  password: [
    {
      required: true,
      message: t('signup.errors.password_required'),
      trigger: ['blur', 'input'],
    },
    {
      min: 8,
      message: t('signup.errors.password_min_length'),
      trigger: ['blur', 'input'],
    },
    {
      validator: (rule: any, value: string) => {
        const hasUpperCase = /[A-Z]/.test(value)
        const hasLowerCase = /[a-z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)

        if (!hasUpperCase) {
          return new Error(t('signup.errors.password_uppercase'))
        }
        if (!hasLowerCase) {
          return new Error(t('signup.errors.password_lowercase'))
        }
        if (!hasNumber) {
          return new Error(t('signup.errors.password_number'))
        }
        if (!hasSpecial) {
          return new Error(t('signup.errors.password_special'))
        }

        return true
      },
      trigger: ['blur', 'input'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: t('signup.errors.confirm_password_required'),
      trigger: ['blur', 'input'],
    },
    {
      validator: validatePasswordMatch,
      message: t('common.errors.password_match'),
      trigger: ['blur', 'input'],
    },
  ],
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    await authStore.register({
      name: formValue.value.name,
      email: formValue.value.email,
      password: formValue.value.password,
    })

    message.success(t('signup.messages.success'))
    // Aspetta un momento prima di reindirizzare
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (error) {
    console.error('Errore durante la registrazione:', error)
    message.error(t('signup.messages.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.submit-container {
  margin-top: 1rem;
}

:deep(.n-form-item-label__text) {
  color: var(--card-text);
}
:deep(.n-input__input-el) {
  color: black;
}
:deep(.n-input__eye) {
  i {
    color: black;
  }
}
:deep(.n-input__placeholder) {
  span {
    color: gray;
  }
}

.link-button {
  color: var(--card-text);

  &:hover {
    color: var(--orange-accent);
  }
}
</style>
