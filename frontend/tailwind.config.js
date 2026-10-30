/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanvi: {
          orange: '#FB7701', // Naranja vibrante estilo Temu
          red: '#FA2C19',    // Rojo oferta relámpago
          yellow: '#FFC800', // Amarillo llamadas a la acción
          dark: '#111827',
          gray: '#F4F4F6'
        }
      }
    },
  },
  plugins: [],
}

