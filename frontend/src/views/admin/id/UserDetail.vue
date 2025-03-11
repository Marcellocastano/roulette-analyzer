<template>
  <div class="user-detail">
    <n-card>
      <template #header>
        <n-page-header>
          <template #title>
            Dettagli Utente
          </template>
          <template #extra>
            <n-space>
              <!-- Pulsante Rinnova (solo per utenti premium con abbonamento attivo e richiesta di rinnovo in pending) -->
              <n-button 
                v-if="user.subscription?.plan === 'premium' && 
                      user.subscription?.status === 'active' && 
                      user.subscription?.newRequest?.status === 'pending'"
                type="warning"
                @click="handleRenewalRequest"
                :loading="loading"
              >
                Rinnova Abbonamento
              </n-button>
              
              <!-- Pulsante Attiva (solo per utenti con status pending) -->
              <n-button 
                v-if="user.subscription?.status === 'pending'"
                type="success"
                @click="handleSubscriptionToggle"
                :loading="loading"
              >
                Attiva Abbonamento
              </n-button>
              
              <!-- Pulsante Disattiva (solo per utenti con abbonamento attivo) -->
              <n-button 
                v-if="user.subscription?.status === 'active'"
                type="error"
                @click="handleSubscriptionToggle"
                :loading="loading"
              >
                Disattiva Abbonamento
              </n-button>
              
              <n-button @click="router.back()">
                Indietro
              </n-button>
            </n-space>
          </template>
        </n-page-header>
      </template>

      <n-spin :show="loading">
        <n-grid :cols="2" :x-gap="12" :y-gap="8" responsive="screen">
          <n-gi :span="2">
            <n-card title="Informazioni Personali" embedded>
              <n-descriptions bordered>
                <n-descriptions-item label="ID">{{ user._id }}</n-descriptions-item>
                <n-descriptions-item label="Email">{{ user.email }}</n-descriptions-item>
                <n-descriptions-item label="Nome">{{ user.name }}</n-descriptions-item>
                <n-descriptions-item label="Ruolo">
                  <n-tag :type="user.role === 'admin' ? 'error' : 'info'">
                    {{ user.role }}
                  </n-tag>
                </n-descriptions-item>
              </n-descriptions>
            </n-card>
          </n-gi>

          <n-gi :span="2">
            <n-card title="Dettagli Abbonamento" embedded>
              <n-descriptions bordered>
                <n-descriptions-item label="Piano">
                  <n-tag :type="user.subscription?.plan === 'premium' ? 'success' : 'warning'">
                    {{ user.subscription?.plan }}
                  </n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="Stato">
                  <n-tag :type="getSubscriptionStatusType(user.subscription?.status)">
                    {{ user.subscription?.status }}
                  </n-tag>
                </n-descriptions-item>
                <n-descriptions-item label="Data Inizio">
                  {{ formatDate(user.subscription?.startDate) }}
                </n-descriptions-item>
                <n-descriptions-item label="Data Fine">
                  {{ formatDate(user.subscription?.endDate) }}
                </n-descriptions-item>
                <n-descriptions-item label="Durata">
                  {{ user.subscription?.duration || 'N/A' }}
                </n-descriptions-item>
              </n-descriptions>
            </n-card>
          </n-gi>
        </n-grid>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User } from '@/types/auth';
import { adminApi } from '@/api/admin';
import {
  NCard,
  NPageHeader,
  NButton,
  NSpace,
  NSpin,
  NGrid,
  NGi,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  useMessage
} from 'naive-ui';

const router = useRouter();
const message = useMessage();

const user = ref<User>({} as User);
const loading = ref(true);
const userId = router.currentRoute.value.params.id as string;

const formatDate = (date: string | null) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

const getSubscriptionStatusType = (status: string | undefined) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'expired':
      return 'error';
    default:
      return 'default';
  }
};

const handleRenewalRequest = async () => {
  try {
    loading.value = true;
    // Assumiamo che l'API abbia un endpoint per gestire le richieste di rinnovo
    await adminApi.activateSubscription(userId);
    message.success('Richiesta di rinnovo approvata con successo');
    
    // Ricarica i dati dell'utente
    const response = await adminApi.getUserById(userId);
    user.value = response.data.data;
  } catch (error) {
    message.error('Errore durante l\'approvazione della richiesta di rinnovo');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSubscriptionToggle = async () => {
  try {
    loading.value = true;
    if (user.value.subscription?.status === 'active') {
      await adminApi.deactivateSubscription(userId);
      message.success('Abbonamento disattivato con successo');
    } else {
      await adminApi.activateSubscription(userId);
      message.success('Abbonamento attivato con successo');
    }
    
    // Ricarica i dati dell'utente
    const response = await adminApi.getUserById(userId);
    user.value = response.data.data;
  } catch (error) {
    message.error('Errore durante la modifica dell\'abbonamento');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    const response = await adminApi.getUserById(userId);
    user.value = response.data.data;
  } catch (error) {
    message.error('Errore nel caricamento dei dati utente');
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.user-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>

<style scoped>
.n-card {
  margin: 20px;
}
</style>