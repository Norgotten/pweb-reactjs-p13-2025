/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#fdfaf7",
        "secondary-bg": "#f4eee9",
        "card-bg": "#ffffff",
        "brand-color": "#c4a387",
        "dark-text": "#333333",
        "light-text": "#777777",
        "border-color": "#e0e0e0",
      },
      fontFamily: {
        poppins: ["'Poppins'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
