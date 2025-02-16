// import { defineStore } from 'pinia'
// import { darkTheme } from 'naive-ui'
// import type { GlobalThemeOverrides } from 'naive-ui'

// const lightThemeOverrides: GlobalThemeOverrides = {
//   common: {
//     primaryColor: '#2080f0'
//   }
// }

// const darkThemeOverrides: GlobalThemeOverrides = {
//   common: {
//     primaryColor: '#63e2b7'
//   }
// }

// export const useThemeStore = defineStore('theme', {
//   state: () => ({
//     isDark: localStorage.getItem('theme') === 'dark'
//   }),
//   getters: {
//     theme: (state) => state.isDark ? darkTheme : null,
//     themeOverrides: (state) => state.isDark ? darkThemeOverrides : lightThemeOverrides
//   },
//   actions: {
//     toggleTheme() {
//       this.isDark = !this.isDark
//       localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
//     }
//   }
// })

import { GlobalThemeOverrides } from 'naive-ui';

const themes = {
  light: {
    common: {
      primaryColor: '#ff6700',
      bodyColor: '#ffffff',  // Colore di sfondo del body
      textColor1: '#000000',  // Colore del testo principale
      textColor2: '#555555',  // Colore del testo secondario
      textColor3: '#999999',  // Colore di supporto del testo
    },
  },
  dark: {
    common: {
      bodyColor: '#26533d',  // Colore di sfondo del body
      textColor1: '#ffffff',  // Colore del testo principale
      textColor2: '#171717',  // Colore del testo secondario
      textColor3: '#999999',  // Colore di supporto del testo
    },
  },
};

export const getThemeOverrides = (themeName: 'light' | 'dark'): GlobalThemeOverrides => {
  return themes[themeName];
};