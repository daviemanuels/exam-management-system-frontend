/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1976D2",
        primaryDark: "#0D47A1",
        background: "#F1F5F9",
        text: "#1E293B",
      },
    },
  },
  plugins: [],
};
