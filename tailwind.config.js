/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      colors: {
        cream: {
          50: '#FDFCF8',
          100: '#F9F6EE',
          200: '#F5EED6',
          300: '#EDE4C4',
          400: '#E0D4A8',
          500: '#D4C48E',
        },
        navy: {
          50: '#e8ecf4',
          100: '#c5cfe3',
          200: '#9eafd0',
          300: '#778fbd',
          400: '#5a77af',
          500: '#3d5fa1',
          600: '#2e4f8a',
          700: '#1e3b6e',
          800: '#1A1A2E',
          900: '#141428',
          950: '#0F0F1A',
        },
        gold: {
          50: '#fdf9ed',
          100: '#faf0cc',
          200: '#f5e09a',
          300: '#f0cc62',
          400: '#C9A227',
          500: '#B8941F',
          600: '#9A7B18',
          700: '#7C6213',
          800: '#5E4A0E',
          900: '#40320A',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(201, 162, 39, 0.3)',
        card: '0 8px 32px -8px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 12px 40px -8px rgba(0, 0, 0, 0.2)',
        input: '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
