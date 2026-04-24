/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'state-red':       '#ef4444',
        'state-yellow':    '#eab308',
        'state-green':     '#22c55e',
        'state-flashing':  '#f59e0b',
        'state-emergency': '#dc2626',
        'state-oos':       '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
