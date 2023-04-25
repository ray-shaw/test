// tailwind.config.js
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Work+Sans", "cursive"],
        text: ["Work+Sans", "sans-serif"]
      },
      colors: {
        primary: colors.sky["500"],
        secondary: colors.slate["700"],
        error: colors.red["500"]
      }
    },
    minWidth: {
      '1/2': '50%',
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
