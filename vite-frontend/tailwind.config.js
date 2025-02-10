/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        pulseCustom: 'pulseCustom 1.5s infinite ease-in-out',
      },
      keyframes: {
        pulseCustom: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        }
      },
      colors: {
        'custom-green': 'rgba(28, 80, 9, 1)',
        'progress-bar-custom-green': '#1f6156',
        'custom-violet': '#3B1EBC',
        'custom-blue': 'rgba(90, 115, 177, 1)',
      }
    },
  },
  plugins: [],
}