import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050505',
          app: '#0a0a0a',
        },
        muse: {
          bg: '#faf7f2',
          app: '#f5f1ea',
          text: '#2d241e',
          subtext: '#7d6d5e',
          border: '#e0d6c5',
        },
        pop: {
          bg: '#fff952',
          app: '#fefce8',
        }
      },
      fontFamily: {
        'loved-by-the-king': ['"Loved by the King"', 'cursive'],
        'rock-salt': ['"Rock Salt"', 'cursive'],
        'zeyada': ['"Zeyada"', 'cursive'],
        'gloria-hallelujah': ['"Gloria Hallelujah"', 'cursive'],
        'jetbrains-mono': ['"JetBrains Mono"', 'monospace'],
        'fraunces': ['"Fraunces"', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;

