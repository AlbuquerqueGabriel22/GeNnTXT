/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefcf3',
          100: '#fbf6e2',
          200: '#f5ebbe',
          300: '#ebd98e',
          400: '#dec05e',
          500: '#d4af37',
          600: '#b8860b',
          700: '#94670c',
          800: '#795210',
          900: '#644312',
          950: '#3a2406',
        },
        obsidian: {
          700: '#272930',
          800: '#1d1e24',
          850: '#15161b',
          900: '#0e0f13',
          950: '#08080b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
