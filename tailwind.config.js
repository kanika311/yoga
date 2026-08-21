/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1E3A2B",
          deep: "#13251C",
          mid: "#2F5340",
          leaf: "#5C7C5A",
        },
        gold: {
          DEFAULT: "#C9A227",
          soft: "#E8C96A",
          deep: "#9A7A16",
        },
        cream: {
          DEFAULT: "#F6F1E8",
          dark: "#EBE3D4",
        },
        ink: "#1A1A18",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        script: ["var(--font-vibes)", "cursive"],
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(30, 58, 43, 0.25)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
