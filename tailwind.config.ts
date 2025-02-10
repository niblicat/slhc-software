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
      // 700 is the default for button colors
      primary: {
        '50': '#f2fbfa',
        '100': '#d2f5f1',
        '200': '#a6e9e4',
        '300': '#71d7d4',
        '400': '#4bc0c0',
        '500': '#2aa0a2',
        '600': '#1f7f82',
        '700': '#1d6568',
        '800': '#1b5154',
        '900': '#1b4446',
        '950': '#0a2629',
      },
      'dark-red': '#a60528',
      'dark-blue': '#0a5180',
      'light-red': '#ff6385',
      'light-blue': '#36a3eb',
      'light-bluegreen': '#4bc0c0',
      'dark-bluegreen': '#369696',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    }
  },
  plugins: [flowbitePlugin],
};
