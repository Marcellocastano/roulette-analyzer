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
    // Layout
    'flex', 'flex-col', 'flex-row', 'flex-1', 'flex-2', 'flex-grow', 'flex-shrink',
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5',
    // Positioning
    'justify-center', 'justify-between', 'justify-around', 'justify-evenly', 'justify-start', 'justify-end',
    'items-center', 'items-start', 'items-end', 'items-baseline', 'items-stretch',
    'self-center', 'self-start', 'self-end',
    // Spacing
    'm-1', 'm-2', 'm-3', 'm-4', 'm-5',
    'mx-1', 'mx-2', 'mx-3', 'mx-4', 'mx-5', 'mx-auto',
    'my-1', 'my-2', 'my-3', 'my-4', 'my-5', 'my-auto',
    'p-1', 'p-2', 'p-3', 'p-4', 'p-5',
    'px-1', 'px-2', 'px-3', 'px-4', 'px-5',
    'py-1', 'py-2', 'py-3', 'py-4', 'py-5',
    // Typography
    'text-center', 'text-left', 'text-right',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
    'font-bold', 'font-semibold', 'font-medium', 'font-normal',
    // Colors
    'bg-primary', 'bg-secondary', 'bg-secondary-light', 'bg-accent', 'bg-accent-hover', 'bg-accent-dark',
    'text-primary', 'text-secondary', 'text-accent', 'text-accent-hover', 'text-text-light', 'text-text-dark',
    'border-primary', 'border-secondary', 'border-accent',
    // Display
    'block', 'inline', 'inline-block', 'hidden',
    // Sizing
    'w-full', 'w-auto', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4',
    'h-full', 'h-auto', 'h-screen', 'min-h-screen',
    // Borders
    'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
    'border', 'border-2', 'border-4',
    // Shadows
    'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl',
  ]
}
