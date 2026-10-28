/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#C85A32",
          "orange-hover": "#B04B26",
          "orange-light": "#FDF4EF",
          green: "#547359",
          "green-dark": "#446048",
          "green-light": "#F2F7F4",
          "green-badge": "#E8F3EB",
          "green-badge-text": "#3D6946",
          bg: "#FAF8F5",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
