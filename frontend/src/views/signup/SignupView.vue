<template>
  <AuthLayout>
    <template #title>Registrazione</template>
    <n-form ref="formRef" :model="formValue" :rules="rules">
      <n-form-item path="name" label="Nome">
        <n-input
          v-model:value="formValue.name"
          size="large"
          round
          placeholder="Inserisci il tuo nome"
        />
      </n-form-item>
      <n-form-item path="email" label="Email">
        <n-input v-model:value="formValue.email" size="large" round placeholder="Inserisci email" />
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input
          v-model:value="formValue.password"
          type="password"
          show-password-on="click"
          size="large"
          round
          placeholder="Inserisci password"
        >
          <template #password-visible-icon>
            <n-icon :size="16" :component="Eye" />
          </template>
          <template #password-invisible-icon>
            <n-icon :size="16" :component="EyeOff" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="confirmPassword" label="Conferma Password">
        <n-input
          v-model:value="formValue.confirmPassword"
          type="password"
          show-password-on="click"
          size="large"
          round
          placeholder="Conferma password"
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
        <n-button :loading="loading" type="primary" @click="handleSubmit"> Registrati </n-button>
      </div>
      <div class="mt-4 text-center">
        <n-button text @click="router.push('/login')">Hai già un account? Accedi</n-button>
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

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

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
  return value === formValue.value.password ? true : new Error('Le password non corrispondono')
}

const rules: FormRules = {
  name: [
    {
      required: true,
      message: 'Inserisci il tuo nome',
      trigger: ['blur', 'input'],
    },
  ],
  email: [
    {
      required: true,
      message: 'Inserisci la tua email',
      trigger: ['blur', 'input'],
    },
    {
      type: 'email',
      message: 'Email non valida',
      trigger: ['blur', 'input'],
    },
  ],
  password: [
    {
      required: true,
      message: 'Inserisci la tua password',
      trigger: ['blur', 'input'],
    },
    {
      min: 8,
      message: 'La password deve contenere almeno 8 caratteri',
      trigger: ['blur', 'input'],
    },
    {
      validator: (rule: any, value: string) => {
        const hasUpperCase = /[A-Z]/.test(value)
        const hasLowerCase = /[a-z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)

        if (!hasUpperCase) {
          return new Error('La password deve contenere almeno un carattere maiuscolo')
        }
        if (!hasLowerCase) {
          return new Error('La password deve contenere almeno un carattere minuscolo')
        }
        if (!hasNumber) {
          return new Error('La password deve contenere almeno un numero')
        }
        if (!hasSpecial) {
          return new Error('La password deve contenere almeno un carattere speciale')
        }

        return true
      },
      trigger: ['blur', 'input'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: 'Conferma la tua password',
      trigger: ['blur', 'input'],
    },
    {
      validator: validatePasswordMatch,
      message: 'Le password non corrispondono',
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

    message.success('Registrazione completata con successo')
    // Aspetta un momento prima di reindirizzare
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (error) {
    console.error('Errore durante la registrazione:', error)
    message.error('Errore durante la registrazione. Riprova più tardi.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.submit-container {
  margin-top: 1rem;
}
</style>
