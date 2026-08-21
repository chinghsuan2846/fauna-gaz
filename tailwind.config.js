export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        window: {
          surface: '#E6DED1',
          header: '#8699A7',
        },
        ink: {
          primary: '#38342E',
          secondary: '#988F7F',
          muted: '#A49D93',
          inverse: '#FFFFFF',
        },
        line: {
          DEFAULT: '#38342E',
          strong: '#988F7F',
          subtle: '#A49D93',
        },
        scrollbar: {
          track: '#F3ECE1',
          highlight: '#FFFFFF',
          shadow: '#D8CDBA',
        },
        action: {
          link: '#002BFF',
        },
      },
      fontFamily: {
        ui: ['"Cubic 11"', 'ui-monospace', 'monospace'],
        body: ['"Source Han Mono TC"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        caption: ['0.75rem', { lineHeight: '1rem' }],
        small: ['0.875rem', { lineHeight: '1.25rem' }],
        body: ['1rem', { lineHeight: '1.75rem' }],
        lead: ['1.125rem', { lineHeight: '1.75rem' }],
        button: ['1.375rem', { lineHeight: '1.75rem' }],
        title: ['1.5rem', { lineHeight: '2rem' }],
        headline: ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.05' }],
        display: ['clamp(2.75rem, 6.5vw, 5rem)', { lineHeight: '1' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
      },
      letterSpacing: {
        display: '0.12em',
      },
      lineHeight: {
        compact: '1rem',
        body: '1.75rem',
        lead: '2rem',
        display: '1.05',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        'space-3xl': '4rem',
        'space-4xl': '6rem',
        'entry-line': '6.875rem',
      },
      boxShadow: {
        window: '0 0.25rem 0.5rem rgb(0 0 0 / 25%)',
      },
      borderWidth: {
        thin: '1px',
        regular: '2px',
      },
    },
  },
  plugins: [],
}
