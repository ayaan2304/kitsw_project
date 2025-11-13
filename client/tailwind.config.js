/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#22d3ee',
        accent: '#fbbf24',
        surface: 'rgba(15, 23, 42, 0.55)',
        'surface-muted': 'rgba(30, 41, 59, 0.45)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem'
      },
      boxShadow: {
        'soft-lg': '0 30px 60px -25px rgba(15, 23, 42, 0.35)',
        'soft-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      },
      backdropBlur: {
        xs: '2px'
      },
      transitionTimingFunction: {
        'out-back': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
      }
    }
  },
  plugins: [forms, typography]
};

