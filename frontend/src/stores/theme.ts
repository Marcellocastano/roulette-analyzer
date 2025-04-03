import { GlobalThemeOverrides } from 'naive-ui'

const lightThemeOverrides = {
  common: {
    // Base settings
    primaryColor: '#1b2c4a',
    primaryColorHover: '#24426a',
    primaryColorPressed: '#152238',
    
    // Backgrounds
    baseColor: '#ffffff',
    bodyColor: '#d5d5d5',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    
    // Text
    textColor1: '#1b2c4a',
    textColor2: '#24426a',
    textColor3: '#4d4d4d',
    
    // Borders
    borderColor: '#d0d0d0',
    
    // Info colors
    infoColor: '#24426a',
    successColor: '#2a6148',
    warningColor: '#b99144',
    errorColor: '#ab3232'
  },
  Button: {
    textColorPrimary: '#ffffff',
    colorPrimary: '#1b2c4a',
    borderHover: '#e9cc8c'
  },
  Menu: {
    itemTextColor: '#1b2c4a',
    itemTextColorHover: '#e9cc8c'
  },
  Card: {
    borderColor: '#e1e1e1'
  }
}

const darkThemeOverrides = {
  common: {
    // Base settings
    primaryColor: '#e9cc8c',
    primaryColorHover: '#f3daa0',
    primaryColorPressed: '#d9bc7c',
    
    // Backgrounds
    baseColor: '#1b2c4a',
    bodyColor: '#24426a',
    cardColor: '#24426a',
    modalColor: '#24426a',
    
    // Text
    textColor1: '#ffffff',
    textColor2: '#e1e1e1',
    textColor3: '#e9cc8c',
    
    // Borders
    borderColor: '#364b6b',
    
    // Info colors
    infoColor: '#81a3d0',
    successColor: '#7ab992',
    warningColor: '#e9cc8c',
    errorColor: '#e88e8e'
  },
  Button: {
    textColorPrimary: '#1b2c4a',
    colorPrimary: '#e9cc8c',
    borderHover: '#ffffff'
  },
  Menu: {
    itemTextColor: '#ffffff',
    itemTextColorHover: '#e9cc8c'
  },
  Card: {
    borderColor: '#1b2c4a',
    color: '#24426a'
  }
}


// const themes = {
//   light: {
//     common: {
//       bodyColor: 'radial-gradient(circle at 10% 20%, rgb(48 127 99) 0.1%, rgb(117 187 158) 94.2%)',
//     },
//   },
//   dark: {
//     common: {
//       primaryColor: '#ff7509',
//       primaryColorHover: '#727D73',
//       bodyColor: 'var(--primary-color)',
//       buttonColor: '#ffffff',
//       textColor1: '#f6f5f5',
//       textColor2: '#f6f5f5',
//       popoverColor: '#171d35',
//       alertColor: '#171d35',
//       inputColor: '#171d35',
//       hoverColor: '#ff7509',
//       fontSize: '16px',
//       modalColor: '#171d35',
//       cardColor: '#171d35',
//       tableColor: '#171d35',
//       tableHeaderColor: '#171d35',
//     },
//   },
// }

export const getThemeOverrides = (themeName: 'light' | 'dark'): GlobalThemeOverrides => {
  return themeName === 'light' ? lightThemeOverrides : darkThemeOverrides
}

export const extractThemeColors = (themeName: 'light' | 'dark') => {
  const theme = themeName === 'light' ? lightThemeOverrides : darkThemeOverrides
  
  return {
    '--primary-color': theme.common.primaryColor,
    '--primary-color-hover': theme.common.primaryColorHover,
    '--background-base': theme.common.baseColor,
    '--background-alt': theme.common.bodyColor,
    '--text-color': theme.common.textColor1,
    '--secondary-text-color': theme.common.textColor2,
    '--border-color': theme.common.borderColor,
    '--card-color': theme.common.cardColor,
    // Add other colors as needed
  }
}