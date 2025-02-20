<template>
  <div class="login-container">
    <div class="roulette">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-370 248.3 100 125">
        <path
          class="table"
          stroke-width="1"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-miterlimit="100"
          stroke-dasharray="4"
          stroke-dashoffset="1000"
          fill="none"
          d="M-274.8 305.4c0-10.1-17.5-18.4-39.9-19.3v.3l.3 2c11.8.7 21.9 3.6 27.4 7.7 2.9 2.2 4.6 4.6 4.6 7.3 0 1.1-.3 2.1-.8 3.1-.8 1.5-2.1 2.9-3.9 4.2-6.3 4.6-18.4 7.7-32.3 7.7s-26-3.1-32.3-7.7c-1.8-1.3-3.1-2.7-3.9-4.2-.5-1-.8-2.1-.8-3.1 0-2.1 1.1-4.1 3-6 5-4.8 15.9-8.3 29-9l.3-2.2c-21.6 1.2-38.4 9.3-38.4 19.2 0 .5.1 1 .1 1.5.2 1.3.7 2.5 1.5 3.7 0 0 0 .1.1.1 5.2 8.1 22.1 14 42.1 14 15.3 0 28.7-3.4 36.5-8.7-7.4 6.6-22.2 11-39.3 11-19.1 0-35.3-5.6-41.5-13.4 2.3 11.2 21.1 19.9 43.9 19.9 24.4 0 44.2-9.9 44.2-22.2v-4.9h-.1c.2-.2.2-.6.2-1z"
        />
        <path
          class="ball"
          d="M-289.3 301.2c-1.7 0-3.2 1.4-3.2 3.2 0 .9.3 1.6.9 2.2.6.6 1.4 1 2.3 1s1.7-.4 2.3-1c.6-.6.9-1.3.9-2.2 0-1.8-1.4-3.2-3.2-3.2z"
        />
        <path
          class="gold"
          d="M-313.9 291.1l1.5 10.4c0 2.2-5.7 3.3-6.9 3.3-1.2 0-6.9-1.1-6.9-3.2l1.5-10.5c-10.7 1-18.7 5-18.7 9.7 0 2.1 1.6 4.1 4.4 5.7 4.4 2.5 11.6 4.2 19.7 4.2s15.3-1.7 19.7-4.2c2.8-1.6 4.4-3.6 4.4-5.7 0-4.7-8-8.7-18.7-9.7z"
        />
        <path
          class="gold"
          d="M-334.1 284.5c1 0 1.8-.4 2.5-1h9l-.4 2.7-.3 2.2-.1.9-.3 1.8-1.5 10.7c0 .8 4.1 2.1 5.9 2.1 1.8 0 5.9-1.3 5.9-2.2l-1.5-10.6-.3-1.8-.1-.9-.3-2v-.2l-.4-2.6h10c.7.6 1.5 1 2.5 1 2 0 3.7-1.7 3.7-3.7s-1.7-3.7-3.7-3.7c-1 0-1.8.4-2.5 1h-10.8l-.2-1.4c.2-.1.3-.1.5-.2s.3-.1.5-.2c2.3-1.2 3.8-3.5 3.8-6.3 0-3.9-3.2-7.1-7.1-7.1-3.9 0-7.1 3.2-7.1 7.1 0 2.7 1.6 5.1 3.8 6.3.2.1.3.2.5.2.2.1.3.1.5.2l-.2 1.4h-9.8c-.7-.6-1.5-1-2.5-1-2 0-3.7 1.7-3.7 3.7 0 1.9 1.7 3.6 3.7 3.6zm19.4-15.1s-.4-.9-2.1-2.4c-.9-.9-2.5-1.8-2.5-1.8 4.5.2 4.6 4.2 4.6 4.2z"
        />
      </svg>
    </div>
    <n-gradient-text type="warning">
      <h1>Roulette Analyzer</h1>
    </n-gradient-text>
    <n-card class="login-card">
      <template #header>
        <h1 class="login-title">Login</h1>
      </template>
      <n-form ref="formRef" :model="formValue" :rules="rules">
        <n-form-item path="email" label="Email">
          <n-input v-model:value="formValue.email" placeholder="Inserisci email" />
        </n-form-item>
        <n-form-item path="password" label="Password">
          <n-input
            v-model:value="formValue.password"
            type="password"
            placeholder="Inserisci password"
            @keyup.enter="handleSubmit"
          />
        </n-form-item>
        <div class="submit-container">
          <n-button :loading="loading" type="primary" @click="handleSubmit"> Accedi </n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NCard, NButton, NForm, NFormItem, NInput } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

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
      message: 'Inserisci la password',
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
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: var(--n-color);
  color: var(--n-text-color);
  transition: all 0.3s ease;
}

.login-card {
  width: 100%;
  max-width: 400px;
  margin: 0 20px;
}

.login-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--n-text-color);
  text-align: center;
}

:deep(.n-card) {
  background-color: var(--n-card-color);
}

:deep(.n-card-header) {
  padding-bottom: 0;
}

:deep(.n-form-item-label) {
  color: var(--n-text-color);
}

:deep(.n-input) {
  background-color: var(--n-input-color-focus);
}

:deep(.n-button) {
  margin-top: 1rem;
}

.container {
  align-items: center;
  background-color: #202027;
  display: flex;
  justify-content: center;
  height: 300px;
  width: 300px;
}

.table {
  animation: draw 11s linear infinite;
  stroke: #ca9d76;
}

.ball {
  animation: levitate 0.5s alternate ease-in-out infinite;
  fill: #fff;
}

.gold {
  fill: #f3c620;
}

.roulette {
  display: flex;
  justify-content: center;
  max-width: 500px;

  svg {
    fill: #b2ab46;
    font-size: 32px;
    height: 150px;
    width: 150px;
  }
}

@keyframes draw {
  from {
    stroke-dashoffset: 0;
  }
}

@keyframes levitate {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(0, 2px);
  }
}
</style>
