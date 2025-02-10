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
        "50": "#f2fbfa",
        "100": "#d2f5f1",
        "200": "#a6e9e4",
        "300": "#71d7d4",
        "400": "#4bc0c0",
        "500": "#2aa0a2",
        "600": "#1f7f82",
        "700": "#1d6568",
        "800": "#1b5154",
        "900": "#1b4446",
        "950": "#0a2629",
      },
      deny: {
        "50":"#fef2f2",
        "100":"#fee2e2",
        "200":"#fecaca",
        "300":"#fca5a5",
        "400":"#f87171",
        "500":"#ef4444",
        "600":"#dc2626",
        "700":"#b91c1c",
        "800":"#991b1b",
        "900":"#7f1d1d"
      },
      accept: {
        "50":"#ecfeff",
        "100":"#cffafe",
        "200":"#a5f3fc",
        "300":"#67e8f9",
        "400":"#22d3ee",
        "500":"#06b6d4",
        "600":"#0891b2",
        "700":"#0e7490",
        "800":"#155e75",
        "900":"#164e63"
      }
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    }
  },
  plugins: [flowbitePlugin],
};
