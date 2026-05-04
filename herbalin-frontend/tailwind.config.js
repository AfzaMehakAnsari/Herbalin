/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
 theme: {
  extend: {
    fontFamily: {
      righteous: ["Righteous", "sans-serif"],
      poppins: ["Poppins", "sans-serif"], // add this line
    },
  },
},

  plugins: [],

  theme: {
  extend: {
    keyframes: {
      'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } }
    },
    animation: { 'fade-in': 'fade-in 0.25s ease' }
  }
}
}

