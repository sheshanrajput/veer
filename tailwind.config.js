/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057FF', // Brand Blue
          dark: '#0043C7',
        },
        secondary: {
          DEFAULT: '#FF6B00', // Brand Orange
          dark: '#D95B00',
        },
        accent: {
          DEFAULT: '#FF6B00', // Orange Accent
          dark: '#D95B00',
        },
        dark: {
          DEFAULT: '#08080C', // Brand Slate Black
          light: '#121217',
          lighter: '#1C1C24',
        },
        background: '#FFFFFF', // Clean White Background
        success: '#00B67A',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        numbers: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'card-sm': '20px',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 87, 255, 0.08)',
        'premium-hover': '0 20px 50px -10px rgba(0, 87, 255, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 87, 255, 0.03)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
    },
  },
  plugins: [],
};
