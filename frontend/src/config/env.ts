/**
 * Configurazione delle variabili d'ambiente
 * Questo file centralizza l'accesso alle variabili d'ambiente dell'applicazione
 */

// Interfaccia per le variabili d'ambiente
interface EnvConfig {
  // URL base per le chiamate API
  apiBaseUrl: string
  // Titolo dell'applicazione
  appTitle: string
  // Ambiente corrente (development, production)
  appEnv: string
  // Flag per indicare se siamo in ambiente di sviluppo
  isDevelopment: boolean
  // Flag per indicare se siamo in ambiente di produzione
  isProduction: boolean
}

// Valori di default per le variabili d'ambiente
const defaultConfig: EnvConfig = {
  apiBaseUrl: '/api',
  appTitle: 'RoulettePro AI',
  appEnv: 'production',
  isDevelopment: false,
  isProduction: true,
}

// Carica le variabili d'ambiente da Vite
const env: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || defaultConfig.apiBaseUrl,
  appTitle: import.meta.env.VITE_APP_TITLE || defaultConfig.appTitle,
  appEnv: import.meta.env.VITE_APP_ENV || defaultConfig.appEnv,
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
}

export default env
