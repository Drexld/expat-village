/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        terra: {
          bg: '#FDFBF8',
          cream: '#F6F1EA',
          primary: '#C76B55',
          sage: '#75997C',
          taupe: '#A89A8F',
          ink: '#4D302A',
          inkSoft: '#6A4A42',
          'ink-soft': '#6A4A42',
        },
      },
      boxShadow: {
        glass: '0 16px 36px rgba(77, 48, 42, 0.16)',
        'glass-soft': '0 10px 24px rgba(77, 48, 42, 0.12)',
      },
    },
  },
  plugins: [],
}
