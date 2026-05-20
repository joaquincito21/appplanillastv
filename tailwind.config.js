/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#e8ecf4',
          100: '#c5cfe3',
          200: '#9eafd0',
          300: '#778fbd',
          400: '#5a77af',
          500: '#3d5fa1',
          600: '#2e4f8a',
          700: '#1e3b6e',
          800: '#122850',
          900: '#0a1a35',
          950: '#060f1f',
        },
        gold: {
          50: '#fdf9ed',
          100: '#faf0cc',
          200: '#f5e09a',
          300: '#f0cc62',
          400: '#e9b830',
          500: '#d4a017',
          600: '#b07e10',
          700: '#8a5f0e',
          800: '#6e4b0e',
          900: '#5c3d0f',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(212, 160, 23, 0.25)',
        card: '0 4px 24px -4px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
