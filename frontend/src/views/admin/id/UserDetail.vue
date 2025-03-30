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

              <n-button @click="router.back()">Indietro</n-button>
            </n-space>
          </template>
        </n-page-header>
      </template>

      <n-spin :show="loading">
        <div class="user-info-container">
          <!-- Sezione Informazioni Personali -->
          <n-card title="Informazioni Personali" embedded class="info-card">
            <div class="subscription-section">
              <div class="subscription-grid">
                <div class="subscription-column">
                  <div class="info-row">
                    <div class="info-label">ID:</div>
                    <div class="info-value id-value">{{ user._id }}</div>
                  </div>

                  <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ user.email }}</div>
                  </div>
                </div>
                <div class="subscription-column">
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
              </div>
            </div>
          </n-card>

          <!-- Sezione Abbonamento -->
          <n-card title="Abbonamento" embedded class="info-card">
            <div v-if="user.activeSubscription" class="subscription-section">
              <div class="subscription-grid">
                <div class="subscription-column">
                  <div class="subscription-item">
                    <div class="subscription-label">Piano:</div>
                    <div class="subscription-value">
                      <n-tag
                        :type="subscription?.plan === 'premium' ? 'success' : 'warning'"
                        class="plan-tag"
                      >
                        {{ subscription?.plan }}
                      </n-tag>
                    </div>
                  </div>

                  <div class="subscription-item">
                    <div class="subscription-label">Stato:</div>
                    <div class="subscription-value">
                      <n-tag
                        :type="getSubscriptionStatusType(subscription?.status)"
                        class="status-tag"
                      >
                        {{ subscription?.status }}
                      </n-tag>
                    </div>
                  </div>

                  <div class="subscription-item">
                    <div class="subscription-label">Durata:</div>
                    <div class="subscription-value">
                      {{ subscription?.duration || 'N/A' }}
                    </div>
                  </div>
                </div>
                <div class="subscription-column">
                  <div class="subscription-item">
                    <div class="subscription-label">Data Inizio:</div>
                    <div class="subscription-value">
                      {{ formatDate(subscription?.startDate) }}
                    </div>
                  </div>

                  <div class="subscription-item">
                    <div class="subscription-label">Data Fine:</div>
                    <div class="subscription-value">
                      {{ formatDate(subscription?.endDate) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pulsanti di azione per l'abbonamento -->
              <div class="action-buttons">
                <n-button
                  v-if="subscription?.status === 'active'"
                  type="error"
                  size="small"
                  @click="handleDeactivateSubscription"
                  :loading="actionLoading"
                >
                  Disattiva Abbonamento
                </n-button>
                <n-button
                  v-else
                  type="success"
                  size="small"
                  @click="handleActivateSubscription"
                  :loading="actionLoading"
                >
                  Attiva Abbonamento
                </n-button>
              </div>
            </div>

            <!-- Sezione Nuova Richiesta -->
            <div v-if="pendingRequest" class="new-request-section">
              <div class="section-divider"></div>
              <div class="section-title">Nuova Richiesta</div>

              <div class="subscription-grid">
                <div class="subscription-column">
                  <div class="subscription-item">
                    <div class="subscription-label">Stato:</div>
                    <div class="subscription-value">
                      <n-tag
                        :type="getSubscriptionStatusType(pendingRequest?.status)"
                        class="status-tag"
                      >
                        {{ pendingRequest?.status || 'unset' }}
                      </n-tag>
                    </div>
                  </div>
                </div>

                <div class="subscription-column">
                  <div class="subscription-item" v-if="pendingRequest?.status === 'pending'">
                    <div class="subscription-label">Nome:</div>
                    <div class="subscription-value">
                      {{ pendingRequest?.name || 'N/A' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pulsanti di azione per la richiesta pendente -->
              <div v-if="pendingRequest?.status === 'pending'" class="action-buttons">
                <n-button
                  type="success"
                  size="small"
                  @click="handleApproveRequest"
                  :loading="actionLoading"
                >
                  Approva Richiesta
                </n-button>
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
import { NCard, NTag, NSpin, NButton, useMessage } from 'naive-ui';
import { User } from '@/types/auth';
import { adminApi } from '@/api/admin';
import { adminSubscriptionApi } from '@/api/adminSubscription';
import { UserSubscription } from '@/api/user';

const router = useRouter();
const message = useMessage();

const user = ref<User>({} as User);
const subscription = ref<UserSubscription>({} as UserSubscription);
const pendingRequest = ref<any>(null);
const loading = ref(true);
const actionLoading = ref(false);
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

const handleActivateSubscription = async () => {
  try {
    actionLoading.value = true;

    // Utilizziamo l'API dell'admin per attivare l'abbonamento
    await adminApi.activateSubscription(userId);
    message.success('Abbonamento attivato con successo');

    // Ricarica i dati dell'utente e dell'abbonamento
    await loadUserData();
  } catch (error) {
    message.error('Errore durante l\'attivazione dell\'abbonamento');
    console.error(error);
  } finally {
    actionLoading.value = false;
  }
};

const handleDeactivateSubscription = async () => {
  try {
    actionLoading.value = true;

    if (!user.value.activeSubscription) {
      message.error('Nessun abbonamento attivo da disattivare');
      return;
    }

    // Utilizziamo l'API dell'admin per disattivare l'abbonamento
    await adminSubscriptionApi.deactivateSubscription(user.value.activeSubscription);
    message.success('Abbonamento disattivato con successo');

    // Ricarica i dati dell'utente e dell'abbonamento
    await loadUserData();
  } catch (error) {
    message.error('Errore durante la disattivazione dell\'abbonamento');
    console.error(error);
  } finally {
    actionLoading.value = false;
  }
};

const handleApproveRequest = async () => {
  try {
    actionLoading.value = true;
    if (!pendingRequest.value?._id) {
      message.error('ID della richiesta non disponibile');
      return;
    }

    await adminSubscriptionApi.activateSubscription(pendingRequest.value._id);
    message.success('Richiesta approvata con successo');

    // Ricarica i dati dell'utente e dell'abbonamento
    await loadUserData();
  } catch (error) {
    message.error('Errore durante l\'approvazione della richiesta');
    console.error(error);
  } finally {
    actionLoading.value = false;
  }
};

const handleRejectRequest = async () => {
  try {
    actionLoading.value = true;
    if (!pendingRequest.value?._id) {
      message.error('ID della richiesta non disponibile');
      return;
    }

    await adminSubscriptionApi.rejectSubscriptionRequest(pendingRequest.value._id);
    message.success('Richiesta rifiutata con successo');

    // Ricarica i dati dell'utente e dell'abbonamento
    await loadUserData();
  } catch (error) {
    message.error('Errore durante il rifiuto della richiesta');
    console.error(error);
  } finally {
    actionLoading.value = false;
  }
};

const getUserSubscription = async () => {
  try {
    if (!user.value.activeSubscription) return;
    const response = await adminSubscriptionApi.getUserSubscriptionById(user.value.activeSubscription);
    subscription.value = response.data.data;
  } catch (error) {
    message.error('Errore durante il recupero dell\'abbonamento');
    console.error(error);
  }
};

const getPendingRequest = async () => {
  try {
    const response = await adminApi.getUserRequestPending(userId);

    pendingRequest.value = response.data.data[0];
  } catch (error) {
    message.error('Errore durante il recupero della richiesta in pending');
    console.error(error);
  }
};

const loadUserData = async () => {
  try {
    const response = await adminApi.getUserById(userId);
    user.value = response.data.data;
    getUserSubscription();
    getPendingRequest();
  } catch (error) {
    message.error('Errore nel caricamento dei dati utente');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    await loadUserData();
  } catch (error) {
    message.error('Errore nel caricamento dei dati utente');
    console.error(error);
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

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
