/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        'secondary-light': 'var(--secondary-color-light)',
        'text-dark': 'var(--text-color-dark)',
        'text-light': 'var(--text-color-light)',
        'n-color': 'var(--n-color)',
        accent: 'var(--accent-color)',
        'accent-hover': 'var(--accent-hover-color)',
        'accent-dark': 'var(--accent-color-dark)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-primary',
    'bg-secondary',
    'bg-secondary-light',
    'text-primary',
    'text-secondary',
    'text-accent',
    'border-primary',
    'border-secondary',
    'border-accent',
    'flex',
    'flex-col',
    'flex-row',
    'flex-1',
    'flex-2',
    'justify-center',
    'justify-between',
    'justify-around',
    'justify-evenly',
    'justify-start',
    'justify-end',
    'items-center',
    'items-start',
    'items-end',
    'items-baseline',
    'items-stretch',
    'text-center'
  ]
}
