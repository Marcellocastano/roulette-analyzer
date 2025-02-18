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
      bodyColor: '#ffffff',  // Colore di sfondo del body
    },
  },
  dark: {
    common: {
      primaryColor: '#fea82f',
      primaryColorHover: '#ff6700',
      // bodyColor: 'linear-gradient( 90.1deg,  rgba(8,81,98,1) 14.5%, rgba(198,231,249,1) 135.4% )',
      // bodyColor: 'linear-gradient(to top, rgb(158 204 163) 0%, rgb(232 247 231) 100%)',
      bodyColor: 'radial-gradient(circle at 10% 20%, rgb(48 127 99) 0.1%, rgb(117 187 158) 94.2%)',
      buttonColor: '#ffffff',
    },
  },
};

export const getThemeOverrides = (themeName: 'light' | 'dark'): GlobalThemeOverrides => {
  return themes[themeName];
};
