<template>
  <!-- reCAPTCHA v3 non ha un elemento visibile -->
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  sitekey: {
    type: String,
    required: true
  },
  action: {
    type: String,
    default: 'submit'
  }
})

const emit = defineEmits(['verify', 'error'])
const token = ref('')

// Metodo per eseguire reCAPTCHA v3
const execute = async (customAction = null) => {
  if (!window.grecaptcha || !window.grecaptcha.execute) {
    console.error('reCAPTCHA non è caricato correttamente')
    emit('error')
    return null
  }

  try {
    const actionName = customAction || props.action
    const result = await window.grecaptcha.execute(props.sitekey, { action: actionName })
    token.value = result
    emit('verify', result)
    return result
  } catch (error) {
    console.error('Errore durante l\'esecuzione di reCAPTCHA:', error)
    emit('error')
    return null
  }
}

// Reset del token
const reset = () => {
  token.value = ''
}

// Esponi metodi al componente padre
defineExpose({
  execute,
  reset,
  token
})
</script>

<style scoped>
/* Nessuno stile necessario per reCAPTCHA v3 */
</style>
