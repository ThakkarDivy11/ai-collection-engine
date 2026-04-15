/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
      },
      keyframes: {
        'star-btn': {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
      animation: {
        'star-btn': 'star-btn calc(var(--duration)*1s) linear infinite',
      },
    },
  },
  plugins: [],
};