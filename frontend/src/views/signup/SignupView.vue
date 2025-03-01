<template>
  <div class="login-container">
    <div class="overlay"></div>
    <n-gradient-text type="warning">
      <!-- <h1 class="mb-4">Roulette Destroyer</h1> -->
    </n-gradient-text>
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
    <Card class="login-card max-w-[400px]">
      <template #title>
        <n-h1 class="login-title">Registrati</n-h1>
      </template>
      <template #content>
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
            <n-input
              v-model:value="formValue.email"
              size="large"
              round
              placeholder="Inserisci email"
            />
          </n-form-item>
          <n-form-item path="password" label="Password">
            <n-input
              v-model:value="formValue.password"
              type="password"
              size="large"
              round
              placeholder="Inserisci password"
              @keyup.enter="handleSubmit"
            />
          </n-form-item>
          <div class="submit-container text-center">
            <n-button :loading="loading" type="primary" @click="handleSubmit">
              Registrati
            </n-button>
          </div>
          <div class="mt-4 text-center">
            <n-button text @click="router.push('/login')">Hai già un account? Accedi</n-button>
          </div>
        </n-form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NCard, NButton, NForm, NFormItem, NInput } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/Card/Card.vue'

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

interface FormValue {
  name: string
  email: string
  password: string
}

const formValue = ref<FormValue>({
  name: '',
  email: '',
  password: '',
})

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
      message: 'Inserisci la password',
      trigger: ['blur', 'input'],
    },
  ],
}

const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate(async errors => {
    if (errors) {
      return
    }

    try {
      loading.value = true
      await authStore.register({
        name: formValue.value.name,
        email: formValue.value.email,
        password: formValue.value.password,
      })
      message.success('Registrazione effettuata con successo')
      router.push('/login')
    } catch (error: any) {
      message.error(error.message || 'Errore durante la registrazione')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('/assets/images/rl-bg1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.85) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 25px;
  position: relative;
  z-index: 2;
  animation: fadeIn 0.8s ease-out forwards;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-title {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  z-index: 3;
  font-weight: 600;
}

:deep(.n-card) {
  background-color: var(--n-card-color);
}

:deep(.n-card-header) {
  padding-bottom: 0;
}

:deep(.n-form-item-label) {
}

:deep(.n-input) {
  background-color: var(--n-input-color-focus);
  border: 1px solid var(--secondary-color);
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
  margin-bottom: 20px;
  position: relative;
  z-index: 2;

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
