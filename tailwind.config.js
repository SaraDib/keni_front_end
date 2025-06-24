/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontSize: {
        '1.5xl': '1.25rem', // Entre xl et 2xl
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      transitionProperty: {
        'width': 'width',
        'transform': 'transform'
      },
      fontFamily: {
        sans: ['DM Sans', 'DM Sans Fallback', 'sans-serif'],
		body: ['Source Sans Pro', 'sans-serif']
      },
      width: {
        '100': '25rem', // 400px
        '104': '26rem', // 416px
        '108': '27rem', // 432px
        '112': '28rem', // 448px
        '116': '29rem', // 464px
        '120': '30rem', // 480px
        '15/16': '99%',
      },
      colors: {
        customGreen: '#9FB873',
        customGray:'#A6A9AA',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};
