import { GlobalThemeOverrides } from 'naive-ui'

const themes = {
  light: {
    common: {
      bodyColor: 'radial-gradient(circle at 10% 20%, rgb(48 127 99) 0.1%, rgb(117 187 158) 94.2%)',
    },
  },
  dark: {
    common: {
      primaryColor: '#ff7509',
      primaryColorHover: '#727D73',
      // bodyColor: 'linear-gradient( 90.1deg,  rgba(8,81,98,1) 14.5%, rgba(198,231,249,1) 135.4% )',
      // bodyColor: 'linear-gradient(to top, rgb(158 204 163) 0%, rgb(232 247 231) 100%)',
      // bodyColor: 'radial-gradient(circle at 10% 20%, #234620 0.1%, rgb(19 29 19) 94.2%)',
      bodyColor: 'var(--primary-color)',
      buttonColor: '#ffffff',
      textColor1: '#f6f5f5',
      textColor2: '#f6f5f5',
      popoverColor: '#171d35',
      alertColor: '#171d35',
      inputColor: '#171d35',
      hoverColor: '#ff7509',
      fontSize: '16px',
      modalColor: '#171d35',
      cardColor: '#171d35',
      tableColor: '#171d35',
      tableHeaderColor: '#171d35',
    },
  },
}

export const getThemeOverrides = (themeName: 'light' | 'dark'): GlobalThemeOverrides => {
  return themes[themeName]
}
