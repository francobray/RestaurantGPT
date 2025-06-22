/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25d366',
          dark: '#075e54',
          teal: '#128c7e',
          light: '#dcf8c6',
          gray: '#ece5dd',
          darkgray: '#667781',
        }
      }
    },
  },
  plugins: [],
} 