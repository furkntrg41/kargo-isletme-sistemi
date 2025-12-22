/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Bu satır ÇOK ÖNEMLİ, yoksa stiller çalışmaz
  ],
  theme: {
    extend: {
      // Az önce bahsettiğimiz animasyon ayarları
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Admin paneli için özel renkler de ekleyebiliriz (İsteğe bağlı)
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',    // blue-800
        }
      }
    },
  },
  plugins: [],
}