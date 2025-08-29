/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html", // kalau pakai HTML biasa
    "./src/**/*.{js,ts,jsx,tsx}", // kalau pakai React/Vite/Next
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // contoh warna custom
        secondary: "#9333EA",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
  important: true,
};

export default config;
