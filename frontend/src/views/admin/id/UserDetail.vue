<template>
  <div class="user-detail">
    <n-card>
      <template #header>
        <n-page-header>
          <template #title>
            <div class="header-title">Dettagli Utente</div>
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
        <div class="user-info-container">
          <!-- Sezione Informazioni Personali -->
          <n-card title="Informazioni Personali" embedded class="info-card">
            <div class="info-section">
              <div class="info-row">
                <div class="info-label">ID:</div>
                <div class="info-value id-value">{{ user._id }}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ user.email }}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">Nome:</div>
                <div class="info-value">{{ user.name }}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">Ruolo:</div>
                <div class="info-value">
                  <n-tag :type="user.role === 'admin' ? 'error' : 'info'" class="role-tag">
                    {{ user.role }}
                  </n-tag>
                </div>
              </div>
            </div>
          </n-card>

          <!-- Sezione Dettagli Abbonamento -->
          <n-card title="Dettagli Abbonamento" embedded class="subscription-card">
            <div class="subscription-section">
              <div class="subscription-grid">
                <div class="subscription-column">
                  <div class="subscription-item">
                    <div class="subscription-label">Piano:</div>
                    <div class="subscription-value">
                      <n-tag :type="user.subscription?.plan === 'premium' ? 'success' : 'warning'" class="plan-tag">
                        {{ user.subscription?.plan }}
                      </n-tag>
                    </div>
                  </div>
                  
                  <div class="subscription-item">
                    <div class="subscription-label">Stato:</div>
                    <div class="subscription-value">
                      <n-tag :type="getSubscriptionStatusType(user.subscription?.status)" class="status-tag">
                        {{ user.subscription?.status }}
                      </n-tag>
                    </div>
                  </div>
                  
                  <div class="subscription-item">
                    <div class="subscription-label">Durata:</div>
                    <div class="subscription-value">
                      {{ user.subscription?.duration || 'N/A' }}
                    </div>
                  </div>
                </div>
                
                <div class="subscription-column">
                  <div class="subscription-item">
                    <div class="subscription-label">Data Inizio:</div>
                    <div class="subscription-value">
                      {{ formatDate(user.subscription?.startDate) }}
                    </div>
                  </div>
                  
                  <div class="subscription-item">
                    <div class="subscription-label">Data Fine:</div>
                    <div class="subscription-value">
                      {{ formatDate(user.subscription?.endDate) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Sezione Nuova Richiesta -->
              <div v-if="user.subscription?.newRequest" class="new-request-section">
                <div class="section-divider"></div>
                <div class="section-title">Nuova Richiesta</div>
                
                <div class="subscription-grid">
                  <div class="subscription-column">
                    <div class="subscription-item">
                      <div class="subscription-label">Stato:</div>
                      <div class="subscription-value">
                        <n-tag :type="getSubscriptionStatusType(user.subscription?.newRequest?.status)" class="status-tag">
                          {{ user.subscription?.newRequest?.status || 'unset' }}
                        </n-tag>
                      </div>
                    </div>
                  </div>
                  
                  <div class="subscription-column">
                    <div class="subscription-item" v-if="user.subscription?.newRequest?.status === 'pending'">
                      <div class="subscription-label">Durata:</div>
                      <div class="subscription-value">
                        {{ user.subscription?.newRequest?.duration || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>
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
      return 'info';
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

<style>
.user-detail {
  max-width: 1350px;
  margin: 0 auto;
  padding: 20px;
}

.n-card.n-card--embedded {
  background-color: #171d35;
  border-color: transparent;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffcf00;
}

.user-info-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card, .subscription-card {
  margin-bottom: 20px;
}

.info-section, .subscription-section {
  padding: 10px;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.info-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-label, .subscription-label {
  font-weight: 600;
  width: 120px;
  color: #9ecaff;
}

.info-value, .subscription-value {
  flex: 1;
}

.id-value {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.subscription-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.subscription-column {
  flex: 1;
  min-width: 250px;
}

.subscription-item {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.subscription-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 20px 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #FF615A;
}

.new-request-section {
  margin-top: 10px;
}

.role-tag, .plan-tag, .status-tag {
  font-weight: 600;
}
</style>