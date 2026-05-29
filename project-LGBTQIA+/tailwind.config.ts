/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FFF0F3',
          100: '#FFD9E2',
          200: '#FFB3C6',
          300: '#FF8DA9',
          400: '#E94E77',
          500: '#D43D66',
          600: '#B82D52',
          700: '#932140',
        },
        secondary: {
          50: '#FFF8E7',
          100: '#FFEFC2',
          200: '#FFE095',
          300: '#FFD16A',
          400: '#F2A900',
          500: '#D99600',
          600: '#B37D00',
        },
        accent: {
          50: '#E8F5EE',
          100: '#C5E8D5',
          200: '#9DD4B5',
          300: '#75C095',
          400: '#2E8B57',
          500: '#267A4C',
          600: '#1E663D',
        },
        dark: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#A8A8A8',
          400: '#6B6B6B',
          500: '#4A4A4A',
          600: '#2D2D2D',
          700: '#1A1A1A',
        },
        surface: {
          DEFAULT: '#FAFAF8',
          warm: '#FFF8F0',
          cream: '#FFFDF8',
        },
      },
    },
  },
  plugins: [],
}