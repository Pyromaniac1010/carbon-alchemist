/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255,255,255,0.06)',
        accent: '#bda8ff'
      },
      fontFamily: {
        hand: ['"OceanTrace"', '"NCL-Gasdrifo"', 'cursive'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
