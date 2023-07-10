/** @type {import('tailwindcss').Config} */

export default {
  content: [],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          400: 'rgb(0, 179, 255)',
          500: 'rgb(0, 157, 255)',
          600: 'rgb(1, 118, 255)',
        },
      },
    },
  },
  plugins: [],
}

