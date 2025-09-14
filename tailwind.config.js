/** @type {import('tailwindcss').Config} */
/* eslint-disable */

module.exports = {
  prefix: 'bw-',
  presets: [require('./tailwindconfig/baseStyle')],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    require('tailwindcss-inner-border'),
    require('@tailwindcss/container-queries'),
  ],
  theme: {
    fontFamily: {
      serif: ['Noto Serif', 'Noto Serif TC', 'ui-serif', 'serif'],
      round: ['Quicksand', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shakeY: {
          '0%, 25%': { transform: 'translate3d(0, 0, 0)' },
          '10%, 20%': { transform: 'translate3d(0, -10px, 0)' },
          '15%': { transform: 'translate3d(0, 10px, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        slide: 'slide 2s infinite',
        shakeY: 'shakeY 3s ease-in-out infinite',
      },
      containers: {
        xl: '1650px',
        lg: '1400px',
        md: '768px',
        sm: '576px',
      },
    },
  },
}
