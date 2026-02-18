/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414',
          dark: '#181818',
          light: '#b3b3b3',
          white: '#ffffff',
          start_black: '#000000' // Darker black for gradients
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Keep Inter for now, maybe switch to something bolder later if needed
      }
    },
  },
  plugins: [],
} 