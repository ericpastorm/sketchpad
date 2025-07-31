/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    ".src/main.js" 
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow': 'rgb(251, 208, 74)', 
      }
    },
  },
  plugins: [],
}