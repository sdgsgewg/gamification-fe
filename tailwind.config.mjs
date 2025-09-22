/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html", // kalau pakai HTML biasa
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#556FD7", // contoh warna custom
        secondary: "#9333EA",
        background: "#F5F4FF", // warna untuk background website
        view: "#74C1FF", // untuk ocon view data
        warning: "#FFC107", // untuk icon edit data dll
        danger: "#DC3545", // untuk icon hapus data dll
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
