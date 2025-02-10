<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-card class="elevation-12 mx-auto px-4 py-4" max-width="500">
      <v-card-title class="text-h5 text-center py-4">
        Login
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            prepend-icon="mdi-email"
            label="Email"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            prepend-icon="mdi-lock"
            label="Password"
            type="password"
            required
          />
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              type="submit"
              block
              :loading="loading"
            >
              Accedi
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    // TODO: Implementare la logica di login
    console.log('Login attempt:', { email: email.value, password: password.value })
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>
