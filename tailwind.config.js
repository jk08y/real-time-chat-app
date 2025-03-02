/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signal's color palette
        'signal-blue': '#2C6BED',
        'signal-light-blue': '#3A76F0',
        'signal-dark': '#1B1B1B',
        'signal-gray': '#8E8E93',
        'signal-light-gray': '#E5E5EA',
        'signal-green': '#4CD964',
        'signal-red': '#FF3B30',
        'signal-bubble-sent': '#DCF8C6',
        'signal-bubble-received': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}