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
import {
  NCard,
  NPageHeader,
  NDataTable,
  NButton,
  NSpace,
  NTag,
  useMessage
} from 'naive-ui';

const router = useRouter();
const message = useMessage();
const users = ref<User[]>([]);
const loading = ref(true);

const getSubscriptionStatusType = (status: string | undefined) => {
  if (!status) return 'info';
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
    render(row: User) {
      return h(NTag, {
        type: row.subscription.plan === 'premium' ? 'success' : 'warning',
      }, { default: () => row.subscription.plan });
    }
  },
  {
    title: 'Stato',
    key: 'subscription.status',
    width: 100,
    render(row: User) {
      return h(NTag, {
        type: getSubscriptionStatusType(row.subscription.status),
      }, { default: () => row.subscription.status });
    }
  },
  {
    title: 'Nuova richiesta',
    key: 'subscription.newRequest.status',
    width: 120,
    render(row: User) {
      return h(NTag, {
        type: getSubscriptionStatusType(row.subscription.newRequest?.status),
      }, { default: () => row.subscription.newRequest?.status || 'unset' });
    }
  },
  {
    title: 'Azioni',
    key: 'actions',
    width: 250,
    render(row: User) {
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
      
      // Pulsante Rinnova (solo per utenti premium con abbonamento attivo e richiesta di rinnovo in pending)
      if (row.subscription.plan === 'premium' && 
          row.subscription.status === 'active' && 
          row.subscription.newRequest?.status === 'pending') {
        buttons.push(
          h(
            NButton,
            {
              type: 'warning',
              size: 'small',
              onClick: () => handleRenewalRequest(row)
            },
            { default: () => 'Rinnova' }
          )
        );
      }
      
      // Pulsante Attiva (solo per utenti con status pending)
      if (row.subscription.status === 'pending') {
        buttons.push(
          h(
            NButton,
            {
              type: 'success',
              size: 'small',
              onClick: () => handleSubscriptionToggle(row)
            },
            { default: () => 'Attiva' }
          )
        );
      }
      
      // Pulsante Disattiva (solo per utenti con abbonamento attivo)
      if (row.subscription.status === 'active') {
        buttons.push(
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: () => handleSubscriptionToggle(row)
            },
            { default: () => 'Disattiva' }
          )
        );
      }
      
      return h(NSpace, {}, { default: () => buttons });
    }
  }
];

const pagination = {
  pageSize: 10
};

async function handleRenewalRequest(user: User) {
  try {
    loading.value = true;
    // Assumiamo che l'API abbia un endpoint per gestire le richieste di rinnovo
    await adminApi.activateSubscription(user._id);
    message.success('Richiesta di rinnovo approvata con successo');
    await loadUsers(); // Ricarica la lista utenti
  } catch (error) {
    message.error('Errore durante l\'approvazione della richiesta di rinnovo');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function handleSubscriptionToggle(user: User) {
  try {
    loading.value = true;
    if (user.subscription.status === 'active') {
      await adminApi.deactivateSubscription(user._id);
      message.success('Abbonamento disattivato con successo');
    } else {
      await adminApi.activateSubscription(user._id);
      message.success('Abbonamento attivato con successo');
    }
    await loadUsers(); // Ricarica la lista utenti
  } catch (error) {
    message.error('Errore durante la modifica dell\'abbonamento');
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