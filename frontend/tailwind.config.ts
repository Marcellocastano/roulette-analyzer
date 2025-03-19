import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.vue",
    "./src/**/*.js",
    "./src/**/*.ts",
    "./src/**/*.jsx",
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

