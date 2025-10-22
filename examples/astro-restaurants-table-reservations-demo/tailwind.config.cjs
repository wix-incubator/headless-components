/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
  theme: {
    extend: {
        fontSize: {
            xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '400' }],
            sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
            base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
            lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
            xl: ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.03em', fontWeight: '400' }],
            '2xl': ['1.5rem', { lineHeight: '1.6', letterSpacing: '0.03em', fontWeight: '600' }],
            '3xl': ['1.875rem', { lineHeight: '1.6', letterSpacing: '0.03em', fontWeight: '600' }],
            '4xl': ['2.25rem', { lineHeight: '1.6', letterSpacing: '0.03em', fontWeight: '700' }],
            '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '700' }],
            '6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '700' }],
            '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '0.01em', fontWeight: '700' }],
            '8xl': ['6rem', { lineHeight: '1.1', letterSpacing: '0em', fontWeight: '700' }],
            '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0em', fontWeight: '700' }],
        },
        fontFamily: {
            heading: "playfair display",
            paragraph: "madefor-display"
        },
        colors: {
            background: '#FFFFFF',
            secondary: '#F0EDE6',
            softaccent: '#D9C6B3',
            buttonbackground: '#3B4A3A',
            buttonforeground: '#F0EDE6',
            bordersubtle: '#D9C6B3',
            foreground: '#3B4A3A',
            'secondary-foreground': '#3B4A3A',
            'primary-foreground': '#F0EDE6',
            primary: '#3B4A3A'
        },
    },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
