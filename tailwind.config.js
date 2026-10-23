/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#fbf7ee',
          200: '#f5ebcf',
          300: '#edd9a5',
          400: '#e1bd6c',
          500: '#d4a23d',
          600: '#b8812e',
          700: '#946126',
          800: '#794d24',
          900: '#644021',
        },
        royal: {
          800: '#1a1f2c',
          900: '#0f141f',
          950: '#090c14',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
