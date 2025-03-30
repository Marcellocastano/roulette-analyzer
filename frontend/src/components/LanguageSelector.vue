<template>
  <n-dropdown trigger="click" :options="languageOptions" @select="handleLanguageChange">
    <div class="language-selector">
      <div class="flag-icon" style="width: 20px; height: 15px">
        <ItalyFlag v-if="currentLocale === 'it'" />
        <UKFlag v-else-if="currentLocale === 'en'" />
        <SpainFlag v-else-if="currentLocale === 'es'" />
        <GermanyFlag v-else-if="currentLocale === 'de'" />
      </div>
      <span class="language-text">{{ $t(`common.language.${currentLocale}`) }}</span>
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import ItalyFlag from './icons/ItalyFlag.vue'
import UKFlag from './icons/UKFlag.vue'
import SpainFlag from './icons/SpainFlag.vue'
import GermanyFlag from './icons/GermanyFlag.vue'
import { i18n, setLocale } from '@/i18n'
// @ts-ignore
const currentLocale = computed(() => i18n.global.locale.value)

const languageOptions = [
  {
    label: () => h('div', { style: 'display: flex; align-items: center;' }, [
      h('div', { style: 'width: 16px; height: 12px;' }, [h(ItalyFlag)]),
      h('span', { style: 'margin-left: 8px' }, 'Italiano')
    ]),
    key: 'it'
  },
  {
    label: () => h('div', { style: 'display: flex; align-items: center;' }, [
      h('div', { style: 'width: 16px; height: 12px;' }, [h(UKFlag)]),
      h('span', { style: 'margin-left: 8px' }, 'English')
    ]),
    key: 'en'
  },
  {
    label: () => h('div', { style: 'display: flex; align-items: center;' }, [
      h('div', { style: 'width: 16px; height: 12px;' }, [h(SpainFlag)]),
      h('span', { style: 'margin-left: 8px' }, 'Español')
    ]),
    key: 'es'
  },
  {
    label: () => h('div', { style: 'display: flex; align-items: center;' }, [
      h('div', { style: 'width: 16px; height: 12px;' }, [h(GermanyFlag)]),
      h('span', { style: 'margin-left: 8px' }, 'Deutsch')
    ]),
    key: 'de'
  }
]

const handleLanguageChange = (key: string) => {
  if (key === 'en' || key === 'it' || key === 'es' || key === 'de') {
    setLocale(key)
  }
}
</script>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: var(--text-color-light);
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.language-selector:hover {
  background-color: var(--primary-color);
}

.language-text {
  display: none;
}

@media (min-width: 768px) {
  .language-text {
    display: inline;
  }
}
</style>
