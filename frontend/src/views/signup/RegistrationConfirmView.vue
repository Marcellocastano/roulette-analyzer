<template>
  <AuthLayout>
    <template #title>{{ $t('registration_confirm.title') }}</template>
    
    <div class="registration-confirm">
      <div class="icon-container">
        <n-icon size="48" color="#18A058">
          <Mailbox />
        </n-icon>
      </div>
      
      <div class="message">
        <p>{{ $t('registration_confirm.message') }}</p>
        <p class="spam-note">{{ $t('registration_confirm.spam_note') }}</p>
      </div>
      
      <div class="actions">
        <n-button
          type="primary"
          size="large"
          @click="goToLogin"
        >
          {{ $t('registration_confirm.login_button') }}
        </n-button>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Mailbox } from '@vicons/tabler'
import AuthLayout from '@/components/Layout/AuthLayout.vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.registration-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
}

.icon-container {
  margin-bottom: 1.5rem;
}

.message {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.spam-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.actions {
  margin-top: 1rem;
}
</style>
