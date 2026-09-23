/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sxs: "256px",
      xs: "384px",
      sm: "512px", //previously 640px
      md: "768px",
      sd: "896px",
      lg: "1024px",
      "2lg": "1152px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        "fg-muted": "rgb(var(--color-fg-muted) / <alpha-value>)",

        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          fg: "rgb(var(--color-primary-fg) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          fg: "rgb(var(--color-accent-fg) / <alpha-value>)",
        },

        // Severity tokens
        sev: {
          critical: "rgb(var(--sev-critical) / <alpha-value>)",
          high: "rgb(var(--sev-high) / <alpha-value>)",
          medium: "rgb(var(--sev-medium) / <alpha-value>)",
          low: "rgb(var(--sev-low) / <alpha-value>)",
        },

        fontSize: {
          h1: "36", // Adjust as needed
          h2: "2rem", // Adjust as needed
          h3: "1.75rem", // Adjust as needed
          h4: "1.5rem", // Adjust as needed
          h5: "1.25rem", // Adjust as needed
          h6: "1rem", // Adjust as needed
        },

        // Status tokens
        status: {
          resolved: "rgb(var(--st-resolved) / <alpha-value>)",
          partial: "rgb(var(--st-partial) / <alpha-value>)",
          unresolved: "rgb(var(--st-unresolved) / <alpha-value>)",
          workaround: "rgb(var(--st-workaround) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.06)",
        ring: "0 0 0 1px rgb(var(--color-border))",
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(0.2, 0.9, 0.25, 1)",
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
};
