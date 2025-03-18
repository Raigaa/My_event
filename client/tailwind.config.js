/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    screens: {
      'md': '320px',
      'lg': '1024px',
    }
  },
  plugins: [
    require('tailwind-children'),
    require('@tailwindcss/line-clamp'),
  ],
}