import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			bai: [
  				'Bai Jamjuree',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			DEFAULT: 'var(--radius)',
  			lg: 'calc(var(--radius) + 2px)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			DEFAULT: 'var(--shadow)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			},
  			sidebar: {
  				DEFAULT: 'var(--sidebar)',
  				foreground: 'var(--sidebar-foreground)',
  				primary: 'var(--sidebar-primary)',
  				'primary-foreground': 'var(--sidebar-primary-foreground)',
  				accent: 'var(--sidebar-accent)',
  				'accent-foreground': 'var(--sidebar-accent-foreground)',
  				border: 'var(--sidebar-border)',
  				ring: 'var(--sidebar-ring)'
  			}
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					p: {
  						marginTop: '1.5rem',
  						marginBottom: '1.5rem'
  					},
  					'p:first-child': {
  						marginTop: '0'
  					},
  					'p:last-child': {
  						marginBottom: '0'
  					},
  					h1: {
  						marginTop: '2rem',
  						marginBottom: '1.5rem'
  					},
  					'h1:first-child': {
  						marginTop: '0'
  					},
  					h2: {
  						marginTop: '2rem',
  						marginBottom: '1.5rem'
  					},
  					'h2:first-child': {
  						marginTop: '0'
  					},
  					h3: {
  						marginTop: '1.75rem',
  						marginBottom: '1.25rem'
  					},
  					'h3:first-child': {
  						marginTop: '0'
  					},
  					ul: {
  						marginTop: '1.5rem',
  						marginBottom: '1.5rem'
  					},
  					ol: {
  						marginTop: '1.5rem',
  						marginBottom: '1.5rem'
  					},
  					li: {
  						marginTop: '0.75rem',
  						marginBottom: '0.75rem'
  					}
  				}
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
