import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist)"],
        mono: ["var(--font-geist-mono)"],
      },
      screens: {
        "toast-mobile": "600px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Shadcn UI compatibility
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // NEW 2025 DESIGN SYSTEM - Research-Backed Web3 Colors
        // Background System (No Pure Black - Eye Strain Prevention)
        'bg-primary': '#121212',      // Main canvas - comfortable dark (Linear/Stripe inspired)
        'bg-secondary': '#1E1E1E',    // Cards, panels - subtle elevation
        'bg-tertiary': '#2A2A2A',     // Modals, overlays - higher elevation

        // Text System (No Pure White - Visual Fatigue Prevention)
        'text-primary': '#E0E0E0',    // Headings, important text - optimal readability
        'text-secondary': '#B3B3B3',  // Body text, descriptions - reduced glare
        'text-tertiary': '#808080',   // Muted text, labels - secondary info
        'text-quaternary': '#5A5A5A', // Disabled, placeholders - lowest emphasis

        // Accent Colors (Web3 Palette - Used Sparingly)
        'accent-cyan': '#00E5FF',     // Primary CTA, links - trust & technology
        'accent-orange': '#FF8C42',   // Secondary CTA, highlights - energy & action
        'accent-purple': '#6D28D9',   // Brand identity - innovation & premium
        'accent-success': '#54FA9C',  // Success states - validation & confirmation
        'accent-warning': '#FFB84D',  // Warning states - caution
        'accent-error': '#F23154',    // Error states - critical attention

        // Border System (Subtle Elevation Instead of Shadows)
        'border-subtle': '#2A2A2A',   // Main borders - barely visible
        'border-emphasis': '#3A3A3A', // Hover borders - noticeable
        'border-accent': '#00E5FF',   // Active/focus borders - clear indication
      },

      // Background Images / Gradients (Refined & Professional)
      backgroundImage: {
        // Hero gradients (cyan to purple - web3 signature)
        'gradient-hero': 'linear-gradient(135deg, #00E5FF 0%, #6D28D9 100%)',
        'gradient-hero-reverse': 'linear-gradient(135deg, #6D28D9 0%, #00E5FF 100%)',
        
        // Card gradients (subtle elevation)
        'gradient-card': 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
        'gradient-card-hover': 'linear-gradient(135deg, #2A2A2A 0%, #333333 100%)',

        // Mesh gradient (ultra-subtle background texture)
        'gradient-mesh': `
          radial-gradient(at 0% 0%, rgba(0, 229, 255, 0.08) 0%, transparent 50%),
          radial-gradient(at 100% 0%, rgba(109, 40, 217, 0.08) 0%, transparent 50%),
          radial-gradient(at 100% 100%, rgba(84, 250, 156, 0.05) 0%, transparent 50%),
          radial-gradient(at 0% 100%, rgba(0, 229, 255, 0.05) 0%, transparent 50%)
        `,

        // Utility gradients
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      // Box Shadow (Refined for Dark Mode - Borders > Shadows)
      boxShadow: {
        'glow-cyan': '0 0 40px rgba(0, 229, 255, 0.3)',
        'glow-purple': '0 0 40px rgba(109, 40, 217, 0.3)',
        'glow-success': '0 0 40px rgba(84, 250, 156, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 24px rgba(0, 229, 255, 0.15)',
        'inner-glow': 'inset 0 0 20px rgba(0, 229, 255, 0.1)',
        'border-glow': '0 0 0 1px rgba(0, 229, 255, 0.3), 0 0 20px rgba(0, 229, 255, 0.15)',
      },

      // Animation - Smooth & Professional (60fps)
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'magnetic': 'magnetic 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 229, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        magnetic: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(var(--magnetic-x), var(--magnetic-y))' },
        },
      },

      // Spacing (Generous - Modern Design)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
