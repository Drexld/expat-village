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
        ink: {
          900: '#0b0c12',
          800: '#111422',
          700: '#15192a',
        },
        accent: {
          1: '#9aa3ff',
          2: '#c2b1d9',
          3: '#88a6d9',
        },
      },
      boxShadow: {
        glass: '0 14px 40px rgba(4, 6, 12, 0.55)',
        'glass-soft': '0 8px 24px rgba(4, 6, 12, 0.35)',
      },
    },
  },
  plugins: [],
}
