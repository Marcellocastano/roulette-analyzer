import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import it from '@/i18n/locales/it.json'
import es from '@/i18n/locales/es.json'
import de from '@/i18n/locales/de.json'

type MessageSchema = typeof en

export const defaultLocale = 'it'

export const i18n = createI18n<[MessageSchema], 'en' | 'it' | 'es' | 'de'>({
  legacy: false,
  locale: localStorage.getItem('locale') || defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    en,
    it,
    es,
    de,
  },
})

export function setLocale(locale: 'en' | 'it' | 'es' | 'de') {
  // @ts-ignore
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.querySelector('html')?.setAttribute('lang', locale)
}
