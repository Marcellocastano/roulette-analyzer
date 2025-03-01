<template>
  <AuthLayout>
    <template #title>Login</template>
    <n-form ref="formRef" :model="formValue" :rules="rules">
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
          Accedi
        </n-button>
      </div>
      <div class="mt-4 text-center">
        <n-button text @click="router.push('/signup')">Non hai un account? Registrati</n-button>
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
  ],
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    await authStore.login({
      email: formValue.value.email,
      password: formValue.value.password,
    })

    // Verifica che l'autenticazione sia riuscita
    if (authStore.isAuthenticated) {
      message.success('Login effettuato con successo')
      // Aspetta un momento prima di reindirizzare
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } else {
      message.error('Errore di autenticazione')
    }
  } catch (error) {
    console.error('Errore durante il login:', error)
    message.error('Errore durante il login. Verifica le tue credenziali.')
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
