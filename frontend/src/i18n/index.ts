import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import it from '@/locales/it.json'

type MessageSchema = typeof en

export const defaultLocale = 'it'

export const i18n = createI18n<[MessageSchema], 'en' | 'it'>({
  legacy: false,
  locale: localStorage.getItem('locale') || defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    en,
    it
  }
})

export function setLocale(locale: 'en' | 'it') {
  // @ts-ignore
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.querySelector('html')?.setAttribute('lang', locale)
}