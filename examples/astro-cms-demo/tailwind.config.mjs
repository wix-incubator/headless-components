/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(250 250 250)',
        foreground: 'rgb(23 23 23)',
        primary: 'rgb(79 70 229)',
        'primary-foreground': 'rgb(255 255 255)',
        secondary: 'rgb(156 163 175)',
        'secondary-foreground': 'rgb(23 23 23)',
        destructive: 'rgb(239 68 68)',
      },
      fontFamily: {
        heading: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        paragraph: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  darkMode: 'media',
  plugins: [],
};



