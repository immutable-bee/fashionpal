/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media", // 'media' or 'class'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atlantis: "#A3CA34",
        bronze: "#5C3COC",
        mine: "#242424",
        kidnapper: "#DDE5CB",
        biblioSeafoam: "#d2e2ae",
        blbBlue: "#2eaaed",
        biblioGreen: "#A5CB4C",
      },
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
