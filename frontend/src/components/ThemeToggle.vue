<template>
  <v-btn @click="toggleTheme" :icon="icon" color="primary" />
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { computed } from 'vue'

const theme = useTheme()

const icon = computed(() => 
  theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'
)

function toggleTheme(): void {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
