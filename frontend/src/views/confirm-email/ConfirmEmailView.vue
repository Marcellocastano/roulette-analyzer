<template>
  <AuthLayout>
    <template #title>{{ error ? $t('confirmEmail.errorTitle') : $t('confirmEmail.successTitle') }}</template>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ $t('confirmEmail.verifying') }}</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <i class="fas fa-times-circle error-icon"></i>
      <p>{{ $t(error) }} asd</p>
      <div class="actions">
        <n-button type="primary" @click="router.push('/login')" class="bg-accent-dark">
          {{ $t('confirmEmail.loginButton') }}
        </n-button>
      </div>
    </div>
    
    <div v-else class="success-container">
      <i class="fas fa-check-circle success-icon"></i>
      <p>{{ $t('confirmEmail.successMessage') }}</p>
      <div class="actions">
        <n-button type="primary" @click="router.push('/login')" class="bg-accent-dark">
          {{ $t('confirmEmail.loginButton') }}
        </n-button>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import axios from 'axios';
import env from '@/config/env';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NButton } from 'naive-ui';
import AuthLayout from '@/components/Layout/AuthLayout.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const token = route.params.token;
  
  if (!token) {
    error.value = t('confirmEmail.errors.invalidToken');
    loading.value = false;
    return;
  }

  try {
    // Chiamata all'API per confermare l'email
    await axios.get(`${env.apiBaseUrl}/v1/auth/confirm-email/${token}`);
    
    // Successo
    loading.value = false;
  } catch (err) {
    console.error('Errore nella conferma dell\'email:', err);
    error.value = t('confirmEmail.errors.invalidToken');
    loading.value = false;
  }
});
</script>

<style scoped>
.loading-container, .error-container, .success-container {
  text-align: center;
  padding: 20px;
  animation: fadeIn 0.5s ease-out;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--accent-color-dark);
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

.error-icon, .success-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.error-icon {
  color: #e53935;
}

.success-icon {
  color: #43a047;
}

.actions {
  margin-top: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
