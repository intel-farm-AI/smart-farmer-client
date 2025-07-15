/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <- ini penting untuk class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { opacity: 1, transform: 'translateX(0)' },
          '100%': { opacity: 0, transform: 'translateX(100%)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.4s ease-out',
        'slide-out': 'slide-out 0.4s ease-in',
      },
    },
  },
  plugins: [],
}
