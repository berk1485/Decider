import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0a0a0a',
        'surface-light': '#141414',
        'surface-lighter': '#1e1e1e',
        accent: '#e4e4e7',
        muted: '#71717a',
        primary: '#f4f4f5',
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#eab308',
      },
    },
  },
  plugins: [],
} satisfies Config
