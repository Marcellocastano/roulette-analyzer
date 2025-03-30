<template>
  <div class="admin-container">
    <router-view v-if="$route.name !== 'admin'" />
    <div v-else>
      <n-card>
        <n-page-header>
          <template #title>
            Gestione Utenti
          </template>
        </n-page-header>

        <n-data-table
          :loading="loading"
          :columns="columns"
          :data="users"
          :pagination="pagination"
          :bordered="false"
          striped
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User } from '@/types/auth';
import { adminApi } from '@/api/admin';
import { adminSubscriptionApi } from '@/api/adminSubscription';
import {
  NCard,
  NPageHeader,
  NDataTable,
  NButton,
  NSpace,
  NTag,
  useMessage,
  NPopconfirm
} from 'naive-ui';

const router = useRouter();
const message = useMessage();
const users = ref<User[]>([]);
const loading = ref(true);

// Funzione per ottenere il tipo di tag in base allo stato della sottoscrizione
const getSubscriptionStatusType = (status: string | undefined) => {
  if (!status) return 'info';
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'expired':
      return 'error';
    case 'unset':
      return 'info';
    default:
      return 'info';
  }
};

// Funzione per renderizzare il piano di sottoscrizione
const renderSubscriptionPlan = (row: User) => {
  if (!row.subscription) {
    return h(NTag, { type: 'info' }, { default: () => 'free' });
  }
  return h(NTag, {
    type: row.subscription.plan === 'premium' ? 'success' : 'info',
  }, { default: () => row.subscription.plan });
};

// Funzione per renderizzare lo stato della sottoscrizione
const renderSubscriptionStatus = (row: User) => {
  if (!row.subscription) {
    return h(NTag, { type: 'info' }, { default: () => 'unset' });
  }
  return h(NTag, {
    type: getSubscriptionStatusType(row.subscription.status),
  }, { default: () => row.subscription.status });
};

// Funzione per renderizzare lo stato della richiesta in attesa
const renderPendingRequest = (row: User) => {
  if (!row.pendingRequest) {
    return h(NTag, { type: 'info' }, { default: () => 'Nessuna' });
  }
  
  return h('div', [
    h(NTag, {
      type: 'warning',
      style: 'margin-right: 8px;'
    }, { default: () => 'In attesa' }),
    h('span', `${row.pendingRequest.plan} (${row.pendingRequest.duration})`)
  ]);
};

// Funzione per renderizzare lo stato della richiesta approvata
const renderApprovedRequest = (row: User) => {
  if (!row.approvedRequest) {
    return h(NTag, { type: 'info' }, { default: () => 'Nessuna' });
  }
  
  return h('div', [
    h(NTag, {
      type: 'success',
      style: 'margin-right: 8px;'
    }, { default: () => 'Approvata' }),
    h('span', `${row.approvedRequest.plan} (${row.approvedRequest.duration})`)
  ]);
};

// Funzione per renderizzare le azioni disponibili
const renderActions = (row: User) => {
  const buttons: any[] = [];
  
  // Pulsante Dettagli (sempre presente)
  buttons.push(
    h(
      NButton,
      {
        type: 'info',
        secondary: true,
        size: 'small',
        onClick: () => router.push(`/admin/user/${row._id}`)
      },
      { default: () => 'Dettagli' }
    )
  );
  
  // Verifica se l'utente ha una richiesta pendente
  if (row.pendingRequest) {
    buttons.push(
      h(
        NPopconfirm,
        {
          onPositiveClick: () => handleApproveRequest(row),
          positiveText: 'Conferma',
          negativeText: 'Annulla'
        },
        {
          trigger: () => h(
            NButton,
            {
              type: 'success',
              size: 'small'
            },
            { default: () => 'Approva richiesta' }
          ),
          default: () => `Confermi l'approvazione della richiesta di ${row.pendingRequest?.type === 'upgrade' ? 'upgrade' : 'nuovo abbonamento'} al piano ${row.pendingRequest?.plan} (${row.pendingRequest?.duration})?`
        }
      )
    );
  }
  
  // Verifica se l'utente ha una sottoscrizione attiva
  if (row.subscription && row.subscription.status === 'active') {
    // Pulsante Disattiva
    buttons.push(
      h(
        NPopconfirm,
        {
          onPositiveClick: () => handleDeactivateSubscription(row),
          positiveText: 'Conferma',
          negativeText: 'Annulla'
        },
        {
          trigger: () => h(
            NButton,
            {
              type: 'error',
              size: 'small'
            },
            { default: () => 'Disattiva' }
          ),
          default: () => 'Confermi la disattivazione dell\'abbonamento?'
        }
      )
    );
  }
  
  return h(NSpace, { size: 'small' }, { default: () => buttons });
};

// Definizione delle colonne della tabella
const columns = [
  {
    title: 'Email',
    key: 'email',
    width: 250
  },
  {
    title: 'Nome',
    key: 'name',
    width: 120
  },
  {
    title: 'Ruolo',
    key: 'role',
    width: 100,
    render(row: User) {
      return h(NTag, {
        type: row.role === 'admin' ? 'error' : 'info',
      }, { default: () => row.role });
    }
  },
  {
    title: 'Piano',
    key: 'subscription.plan',
    width: 100,
    render: renderSubscriptionPlan
  },
  {
    title: 'Stato',
    key: 'subscription.status',
    width: 100,
    render: renderSubscriptionStatus
  },
  {
    title: 'Richiesta in attesa',
    key: 'pendingRequest',
    width: 150,
    render: renderPendingRequest
  },
  {
    title: 'Richiesta approvata',
    key: 'approvedRequest',
    width: 150,
    render: renderApprovedRequest
  },
  {
    title: 'Azioni',
    key: 'actions',
    width: 250,
    render: renderActions
  }
];

const pagination = {
  pageSize: 10
};

async function handleRenewalRequest(user: User) {
  try {
    loading.value = true;
    // Utilizziamo la nuova API per gestire le richieste di rinnovo
    if (user.subscription && user.subscription.newRequest && 'status' in user.subscription.newRequest) {
      // Otteniamo l'ID della richiesta
      const requestId = user.subscription.newRequest._id;
      if (requestId) {
        await adminSubscriptionApi.activateSubscription(requestId);
        message.success('Richiesta di rinnovo approvata con successo');
      } else {
        message.error('ID richiesta non trovato');
      }
    } else {
      message.error('Richiesta di rinnovo non valida');
    }
    await loadUsers(); // Ricarica la lista utenti
  } catch (error) {
    message.error('Errore durante l\'approvazione della richiesta di rinnovo');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function handleActivateSubscription(user: User) {
  try {
    loading.value = true;
    
    if (!user.subscription) {
      message.error('Informazioni di sottoscrizione non disponibili');
      loading.value = false;
      return;
    }
    
    // Utilizziamo la nuova API per attivare l'abbonamento
    // Cerchiamo l'ID della richiesta
    const requestId = user.subscription.requestId;
    if (requestId) {
      await adminSubscriptionApi.activateSubscription(requestId);
      message.success('Abbonamento attivato con successo');
    } else {
      // Fallback: proviamo a usare l'ID utente
      await adminApi.activateSubscription(user._id);
      message.success('Abbonamento attivato con successo');
    }
    await loadUsers(); // Ricarica la lista utenti
  } catch (error) {
    message.error('Errore durante l\'attivazione dell\'abbonamento');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function handleDeactivateSubscription(user: User) {
  try {
    loading.value = true;
    
    if (!user.subscription) {
      message.error('Informazioni di sottoscrizione non disponibili');
      loading.value = false;
      return;
    }
    
    // Utilizziamo la nuova API per disattivare l'abbonamento
    // Cerchiamo l'ID dell'abbonamento
    const subscriptionId = user.subscription._id;
    if (subscriptionId) {
      await adminSubscriptionApi.deactivateSubscription(subscriptionId);
      message.success('Abbonamento disattivato con successo');
    } else {
      // Fallback: proviamo a usare l'ID utente
      await adminApi.deactivateSubscription(user._id);
      message.success('Abbonamento disattivato con successo');
    }
    await loadUsers(); // Ricarica la lista utenti
  } catch (error) {
    message.error('Errore durante la disattivazione dell\'abbonamento');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function handleApproveRequest(user: User) {
  try {
    loading.value = true;
    
    if (!user.pendingRequest) {
      message.error('Richiesta pendente non disponibile');
      loading.value = false;
      return;
    }
    
    // Utilizziamo la nuova API per approvare la richiesta
    // Cerchiamo l'ID della richiesta
    const requestId = user.pendingRequest._id;
    if (requestId) {
      await adminSubscriptionApi.activateSubscription(requestId);
      message.success('Richiesta approvata con successo');
    } else {
      message.error('ID richiesta non trovato');
    }
    await loadUsers(); // Ricarica la lista utenti
  } catch (error) {
    message.error('Errore durante l\'approvazione della richiesta');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function loadUsers() {
  try {
    const response = await adminApi.getUsers();
    users.value = response.data.data;
  } catch (error) {
    message.error('Errore durante il caricamento degli utenti');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(loadUsers);
</script>

<style scoped>
.admin-container {
  max-width: 1350px;
  margin: 0 auto;
  padding: 20px;
}
</style>