<template>
  <n-dropdown trigger="click" :options="languageOptions" @select="handleLanguageChange">
    <div class="language-selector">
      <n-icon size="20" color="#fff">
        <Language />
      </n-icon>
      <span class="language-text">{{ $t(`common.language.${currentLocale}`) }}</span>
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { NIcon } from 'naive-ui'
import { Language } from '@vicons/tabler'
import { i18n, setLocale } from '@/i18n'
// @ts-ignore
const currentLocale = computed(() => i18n.global.locale.value)

const languageOptions = [
  {
    label: () => h('div', {}, [
      h(NIcon, { size: 16 }, { default: () => h(Language) }),
      h('span', { style: 'margin-left: 8px' }, 'Italiano')
    ]),
    key: 'it'
  },
  {
    label: () => h('div', {}, [
      h(NIcon, { size: 16 }, { default: () => h(Language) }),
      h('span', { style: 'margin-left: 8px' }, 'English')
    ]),
    key: 'en'
  }
]

const handleLanguageChange = (key: string) => {
  if (key === 'en' || key === 'it') {
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