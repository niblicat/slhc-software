import flowbitePlugin from 'flowbite/plugin'

import type { Config } from 'tailwindcss';

export default {
    content: ['./src//*.{html,js,svelte,ts}', './node_modules/flowbite-svelte//*.{html,js,svelte,ts}'],
  darkMode: 'selector',
    theme: {
        extend: {
          colors: {
            // flowbite-svelte
            funky: '#FF5500',
            'dark_red': '#a60528',
            'dark_blue': '#0a5180',
            'light_red': '#ff6385',
            'light_blue': '#36a3eb',
            'light_bluegreen': '#4bc0c0',
            'dark_bluegreen': '#0a5c5c',
            //'button': ''
            // 'baseline': ''
            // 'change': ''
          }
        }
    },

    plugins: [flowbitePlugin]
} as Config;
