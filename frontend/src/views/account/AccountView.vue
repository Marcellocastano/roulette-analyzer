<template>
  <div class="account-container">
    <n-card class="account-card">
      <template #header>
        <div class="card-header">
          <n-h1>{{ $t('account.title') }}</n-h1>
        </div>
      </template>
      <n-tabs type="line">
        <n-tab-pane name="profile" :tab="$t('account.tabs.profile')">
          <n-form ref="profileFormRef" :model="profileForm" :rules="profileRules">
            <n-form-item path="name" :label="$t('account.profile.name')">
              <n-input v-model:value="profileForm.name" size="large" round :placeholder="$t('account.profile.name_placeholder')" />
            </n-form-item>
            
            <n-form-item path="email" :label="$t('account.profile.email')">
              <n-input v-model:value="profileForm.email" size="large" round :placeholder="$t('account.profile.email_placeholder')" />
            </n-form-item>
            
            <div class="submit-container">
              <n-button :loading="profileLoading" type="primary" @click="handleProfileSubmit" class="bg-accent-dark">
                {{ $t('account.profile.update_button') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>
        
        <n-tab-pane name="password" :tab="$t('account.tabs.change_password')">
          <n-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
            <n-form-item path="oldPassword" :label="$t('account.password.current')">
              <n-input
                v-model:value="passwordForm.oldPassword"
                type="password"
                show-password-on="click"
                size="large"
                round
                :placeholder="$t('account.password.current_placeholder')"
              >
                <template #password-visible-icon>
                  <n-icon :size="16" :component="Eye" />
                </template>
                <template #password-invisible-icon>
                  <n-icon :size="16" :component="EyeOff" />
                </template>
              </n-input>
            </n-form-item>
            
            <n-form-item path="newPassword" :label="$t('account.password.new')">
              <n-input
                v-model:value="passwordForm.newPassword"
                type="password"
                show-password-on="click"
                size="large"
                round
                :placeholder="$t('account.password.new_placeholder')"
              >
                <template #password-visible-icon>
                  <n-icon :size="16" :component="Eye" />
                </template>
                <template #password-invisible-icon>
                  <n-icon :size="16" :component="EyeOff" />
                </template>
              </n-input>
            </n-form-item>
            
            <n-form-item path="confirmPassword" :label="$t('account.password.confirm')">
              <n-input
                v-model:value="passwordForm.confirmPassword"
                type="password"
                show-password-on="click"
                size="large"
                round
                :placeholder="$t('account.password.confirm_placeholder')"
              >
                <template #password-visible-icon>
                  <n-icon :size="16" :component="Eye" />
                </template>
                <template #password-invisible-icon>
                  <n-icon :size="16" :component="EyeOff" />
                </template>
              </n-input>
            </n-form-item>
            
            <div class="submit-container">
              <n-button :loading="passwordLoading" type="primary" @click="handlePasswordSubmit" class="bg-accent-dark">
                {{ $t('account.password.update_button') }}
              </n-button>
            </div>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NIcon, NCard, NH1, NTabs, NTabPane } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff } from '@vicons/tabler'
import { userApi } from '@/api/user'
import { i18n } from '@/i18n'

// Riferimenti ai form
const profileFormRef = ref<FormInst | null>(null)
const passwordFormRef = ref<FormInst | null>(null)

// Stati di caricamento
const profileLoading = ref(false)
const passwordLoading = ref(false)

const message = useMessage()
const authStore = useAuthStore()

// Form per il profilo
interface ProfileForm {
  name: string
  email: string
}

const profileForm = ref<ProfileForm>({
  name: '',
  email: ''
})

// Form per la password
interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const passwordForm = ref<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Regole di validazione per il profilo
const profileRules: FormRules = {
  name: [
    { required: true, message: i18n.global.t('account.profile.errors.name_required'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: i18n.global.t('account.profile.errors.email_required'), trigger: 'blur' },
    { type: 'email', message: i18n.global.t('account.profile.errors.email_invalid'), trigger: 'blur' }
  ]
}

// Regole di validazione per la password
const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: i18n.global.t('account.password.errors.old_required'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: i18n.global.t('account.password.errors.new_required'), trigger: 'blur' },
    { min: 8, message: i18n.global.t('account.password.errors.min_length'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: i18n.global.t('account.password.errors.confirm_required'), trigger: 'blur' },
    {
      validator: (rule, value) => {
        return value === passwordForm.value.newPassword
      },
      message: i18n.global.t('common.errors.password_match'),
      trigger: 'blur'
    }
  ]
}

onMounted(async () => {
  try {
    profileLoading.value = true
    // Ottieni i dati del profilo utente
    const response = await userApi.getProfile()
    
    if (response.data.status === 'success') {
      profileForm.value.name = response.data.data.name
      profileForm.value.email = response.data.data.email
    }
  } catch (error) {
    message.error('Errore nel caricamento dei dati del profilo')
    console.error(error)
  } finally {
    profileLoading.value = false
  }
})

const handleProfileSubmit = () => {
  profileFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(i18n.global.t('account.profile.errors.form_errors'))
      return
    }
    
    try {
      profileLoading.value = true
      
      // Prepara i dati da inviare
      const updateData = {
        name: profileForm.value.name,
        email: profileForm.value.email
      }
      
      // Invia la richiesta di aggiornamento
      const response = await userApi.updateProfile(updateData)
      
      if (response.data.status === 'success') {
        message.success('Profilo aggiornato con successo')
        // Aggiorna i dati dell'utente nello store
        authStore.updateUserInfo(response.data.data)
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Errore durante l\'aggiornamento del profilo')
      console.error(error)
    } finally {
      profileLoading.value = false
    }
  })
}

const handlePasswordSubmit = () => {
  passwordFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(i18n.global.t('account.profile.errors.form_errors'))
      return
    }
    
    try {
      passwordLoading.value = true
      
      // Invia la richiesta di cambio password
      const response = await userApi.changePassword(
        passwordForm.value.oldPassword,
        passwordForm.value.newPassword
      )
      
      if (response.data.status === 'success') {
        message.success('Password aggiornata con successo')
        // Resetta il form
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Errore durante il cambio della password')
      console.error(error)
    } finally {
      passwordLoading.value = false
    }
  })
}
</script>

<style scoped>
.account-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.account-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 1rem;
  text-align: center;
}

.submit-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
</style>
