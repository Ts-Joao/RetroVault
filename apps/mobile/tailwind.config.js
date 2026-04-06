/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F2EFDC",
          dark: "#1e1e1e"
        },
        primary: '#BF372A'
      }
    },
  },
  plugins: [],
}