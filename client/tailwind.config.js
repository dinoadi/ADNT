/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005596', // Bank Jateng Blue
          light: '#006bbd',
          dark: '#003f70',
        },
        secondary: {
          DEFAULT: '#FDB913', // Bank Jateng Yellow/Gold
          light: '#fec942',
          dark: '#dfa002',
        },
        danger: {
          DEFAULT: '#E31E24', // Bank Jateng Red Accent
          light: '#ea4c51',
          dark: '#b9151a',
        },
        dark: '#1F2937', // Gray 800
        light: '#F3F4F6', // Gray 100
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
