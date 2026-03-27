/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Manrope", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(21, 37, 16, 0.45)",
      },
    },
  },
  plugins: [],
};
