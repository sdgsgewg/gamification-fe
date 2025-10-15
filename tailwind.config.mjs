/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html", // kalau pakai HTML biasa
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: "#556FD7", // contoh warna custom
        secondary: "#9333EA",
        background: "#F5F4FF", // warna untuk background website
        border: "#BCB4FF", // warna untuk border
        view: "#74C1FF", // untuk icon view data
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
