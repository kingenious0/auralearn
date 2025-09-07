/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./components/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'aura-purple': '#8B5CF6',
        'aura-blue': '#3B82F6',
        'aura-gray': '#6B7280',
      }
    },
  },
  plugins: [],
}
