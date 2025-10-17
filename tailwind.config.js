/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#007bff',
        'emerald-green': '#00c49a',
        'royal-purple': '#6c63ff',
        'soft-teal': '#2abca7',
        'warm-beige': '#f5e8d0',
        'coral-peach': '#ff7f6b',
        'charcoal': '#333333',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'lifted': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'warm': '0 3px 10px rgba(255, 127, 107, 0.15)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
