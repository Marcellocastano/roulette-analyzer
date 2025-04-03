// stores/themeStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'
import { getThemeOverrides } from './theme'
import { extractThemeColors } from './theme'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

  // Getters
  const currentTheme = computed(() => (isDarkMode.value ? darkTheme : lightTheme))
  const themeOverrides = computed(() => getThemeOverrides(isDarkMode.value ? 'dark' : 'light'))

  // Actions
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
    applyThemeColors()
  }

  // Initialize theme based on system preference
  function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && prefersDark)
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    applyThemeColors()
  }

  function applyThemeColors() {
    const colors = extractThemeColors(isDarkMode.value ? 'dark' : 'light')
    Object.entries(colors).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value)
    })
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    applyThemeColors()
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === null) {
      isDarkMode.value = e.matches
      applyTheme()
    }
  })

  return {
    isDarkMode,
    currentTheme,
    themeOverrides,
    toggleDarkMode,
    initTheme,
    applyThemeColors,
  }
})
