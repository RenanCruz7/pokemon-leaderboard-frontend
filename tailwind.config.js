/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}' ,
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FBCB0A',
        'background-light': '#f0f2f5',
        'background-dark': '#0f1724',
        'component-dark': '#1f2937',
        'component-light': '#ffffff',
        'text-light': '#0f1724',
        'text-dark': '#E6EEF8',
        'text-secondary-light': '#4A5568',
        'text-secondary-dark': '#9CA3AF',
        'border-light': '#E6EDF4',
        'border-dark': '#374151',
        'accent-red': '#FF1F1F',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
