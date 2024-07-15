/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customPrimary: '#154890',
        customSecondary: '#6699FF',
        customBg: '#6699FF',
      },
    },
  },
  plugins: [],
}
