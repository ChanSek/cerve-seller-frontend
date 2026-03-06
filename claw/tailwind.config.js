/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        claw: {
          bg: '#0a0a0f',
          card: '#12121a',
          elevated: '#1a1a2e',
          primary: '#6c5ce7',
          secondary: '#00d2ff',
          text: '#e0e0e0',
          muted: '#8888aa',
          success: '#2EB086',
          danger: '#FF5959',
          cerve: '#1c75bc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'claw-gradient': 'linear-gradient(135deg, #6c5ce7, #00d2ff)',
        'claw-gradient-hover': 'linear-gradient(135deg, #7d6ff0, #1adbff)',
      },
    },
  },
  plugins: [],
};
