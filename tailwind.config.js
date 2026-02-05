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
          1: '#8fa4ff',
          2: '#bfa3ff',
          3: '#7ee9d4',
          4: '#f2c879',
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
