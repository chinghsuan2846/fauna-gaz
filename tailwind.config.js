export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        window: {
          surface: '#E6DED1',
          header: '#8699A7',
          'header-hover': 'rgb(255 255 255 / 15%)',
        },
        ink: {
          primary: '#38342E',
          'primary-hover': 'rgb(56 52 46 / 20%)',
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
        sidebar: {
          active: 'rgb(125 144 158 / 40%)',
          folder: '#F2C94C',
        },
        action: {
          link: '#002BFF',
          'close-hover': '#F79685',
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
      maxWidth: {
        sidebar: '16rem',
        'viewport-tablet': '48rem',
        'viewport-mobile': '24.375rem',
      },
      minHeight: {
        'viewport-mobile': '100vh',
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
        'space-button-lg-x': '0.75rem',
        'space-button-footer-h': '2.25rem',
        'space-sidebar-icon': '1.25rem',
        'entry-line': '8rem',
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
