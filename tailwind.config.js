/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--background)',
        'bg-secondary': 'var(--card)',
        'text-primary': 'var(--foreground)',
        'text-secondary': 'var(--muted-foreground)',
        'border-primary': 'var(--border)',
        'accent': 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        'primary': 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'secondary': 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        'muted': 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        'destructive': 'var(--destructive)',
        'ring': 'var(--ring)',
        'input': 'var(--input)',
        'popover': 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        'card': 'var(--card)',
        'card-foreground': 'var(--card-foreground)'
      }
    }
  },
  plugins: []
};
