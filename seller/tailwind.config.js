/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        seller: {
          bg: "#0a0a0f",
          card: "#12121a",
          elevated: "#1a1a2e",
          text: "#e0e0e0",
          muted: "#8888aa",
          accent: "#6c5ce7",
          cyan: "#00d2ff",
          error: "#FF5959",
          success: "#2EB086",
          warning: "#F9C132",
        },
      },
      fontFamily: {
        sans: ["Inter", "Fira Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
