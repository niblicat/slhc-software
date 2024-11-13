/** @type {import('tailwindcss').Config} */
const flowbitePlugin = require('flowbite/plugin');

module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  darkMode: 'selector',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'funky': '#FF5500',
      'dark-red': '#a60528',
      'dark-blue': '#0a5180',
      'light-red': '#ff6385',
      'light-blue': '#36a3eb',
      'light-bluegreen': '#4bc0c0',
      'dark-bluegreen': '#0a5c5c',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    }
  },
  plugins: [flowbitePlugin],
};
