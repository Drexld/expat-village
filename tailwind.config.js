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
          900: '#070a14',
          800: '#0d1222',
          700: '#151b2f',
        },
        accent: {
          1: '#f2a65a',
          2: '#f6c38f',
          3: '#f28f7b',
          4: '#f7d9b5',
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
