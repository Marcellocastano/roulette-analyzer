export default {
  plugins: {
    // Aggiungi il plugin per il nesting CSS prima di Tailwind
    'postcss-nested': {},
    // Il plugin di nesting di Tailwind deve venire dopo postcss-nested ma prima di tailwindcss
    'tailwindcss/nesting': 'postcss-nested',
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          // Disabilitiamo la rimozione delle regole duplicate per evitare problemi con Tailwind
          mergeLonghand: false,
          mergeRules: false,
        }],
      }
    } : {})
  },
}
