import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        heading: ['"Instrument Serif"', 'serif'],
        body: ['Barlow', 'sans-serif'],
        dirtyline: ['Dirtyline', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
