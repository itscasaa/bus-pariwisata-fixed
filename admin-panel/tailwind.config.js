/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f1fc',
          100: '#c5d9f7',
          200: '#9bbef1',
          300: '#6da2eb',
          400: '#4488e6',
          500: '#1d6ec5',
          600: '#1558a3',
          700: '#0d4a8a',
          800: '#093a6e',
          900: '#052a52',
        },
      },
    },
  },
  plugins: [],
};
