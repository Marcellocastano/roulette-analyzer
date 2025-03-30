<template>
  <div class="contact-container">
    <n-card class="contact-card">
      <template #header>
        <div class="card-header">
          <n-h1>{{ $t('contact.title') }}</n-h1>
        </div>
      </template>

      <n-form ref="contactFormRef" :model="contactForm" :rules="contactRules">
        <n-form-item path="category" :label="$t('contact.category')">
          <n-select
            v-model:value="contactForm.category"
            :options="categoryOptions"
            size="large"
            :placeholder="$t('contact.category_placeholder')"
          />
        </n-form-item>

        <n-form-item path="message" :label="$t('contact.message')">
          <n-input
            v-model:value="contactForm.message"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            size="large"
            :placeholder="$t('contact.message_placeholder')"
          />
        </n-form-item>

        <div class="submit-container">
          <n-button
            :loading="submitting"
            type="primary"
            @click="handleSubmit"
            class="bg-accent-dark"
          >
            {{ $t('contact.submit_button') }}
          </n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NSelect, NCard, NH1 } from 'naive-ui'
import type { FormInst, FormRules, SelectOption } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { contactApi } from '@/api/contact'

const { t } = useI18n()
const message = useMessage()
const authStore = useAuthStore()

// Riferimento al form
const contactFormRef = ref<FormInst | null>(null)

// Stato di caricamento
const submitting = ref(false)

// Form per il contatto
interface ContactForm {
  category: string
  message: string
}

const contactForm = ref<ContactForm>({
  category: '',
  message: ''
})

// Opzioni per la select delle categorie
const categoryOptions = computed<SelectOption[]>(() => [
  { label: t('contact.categories.bug_report'), value: 'bug_report' },
  { label: t('contact.categories.payment_issue'), value: 'payment_issue' },
  { label: t('contact.categories.feature_request'), value: 'feature_request' },
  { label: t('contact.categories.general_inquiry'), value: 'general_inquiry' },
  { label: t('contact.categories.other'), value: 'other' }
])

// Regole di validazione
const contactRules: FormRules = {
  category: [
    { required: true, message: t('contact.errors.category_required'), trigger: 'blur' }
  ],
  message: [
    { required: true, message: t('contact.errors.message_required'), trigger: 'blur' },
    { min: 10, message: t('contact.errors.message_min_length'), trigger: 'blur' }
  ]
}

// Gestione dell'invio del form
const handleSubmit = () => {
  contactFormRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(t('contact.errors.form_errors'))
      return
    }

    try {
      submitting.value = true

      // Prepara i dati da inviare
      const requestData = {
        category: contactForm.value.category,
        message: contactForm.value.message
      }

      // Invia la richiesta
      const { data: response } = await contactApi.addFeedback(requestData)

      if (response.status === 'success') {
        message.success(t('contact.messages.submit_success'))

        // Resetta il form
        contactForm.value = {
          category: '',
          message: ''
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || t('contact.errors.submit_error'))
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.contact-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.bg-accent-dark {
  background-color: var(--accent-dark);
}
</style>
