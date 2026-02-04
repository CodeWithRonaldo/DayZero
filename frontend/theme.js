// Professional Design System for Recovery Agent
// Desktop-first, senior-level quality

export const COLORS = {
  // Primary
  primary: "#5B21B6", // Deep purple
  primaryLight: "#7C3AED", // Vibrant purple
  primaryDark: "#4C1D95", // Dark purple
  primaryGhost: "#EDE9FE", // Light purple background

  // Secondary
  secondary: "#06B6D4", // Cyan
  secondaryLight: "#22D3EE",
  secondaryGhost: "#ECFDF5",

  // Status
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Neutral
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    mono: "'Menlo', 'Monaco', 'Courier New', monospace",
  },

  // Font sizes (desktop-first)
  fontSize: {
    xs: "12px",
    sm: "13px",
    base: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px",
    "3xl": "24px",
    "4xl": "28px",
    "5xl": "32px",
    "6xl": "40px",
  },

  // Font weights
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
};

export const RADIUS = {
  none: "0px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  full: "9999px",
};

export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};

export const BREAKPOINTS = {
  mobile: "640px",
  tablet: "1024px",
  desktop: "1280px",
};

// Reusable button styles
export const buttonStyles = {
  base: {
    fontFamily: TYPOGRAPHY.fontFamily.sans,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    padding: `${SPACING[2]} ${SPACING[4]}`,
    borderRadius: RADIUS.md,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "inline-flex",
    alignItems: "center",
    gap: SPACING[2],
    outline: "none",
  },
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    "&:hover": {
      backgroundColor: COLORS.primaryDark,
      boxShadow: SHADOWS.lg,
    },
    "&:active": {
      transform: "scale(0.98)",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  secondary: {
    backgroundColor: COLORS.gray[100],
    color: COLORS.gray[800],
    border: `1px solid ${COLORS.gray[300]}`,
    "&:hover": {
      backgroundColor: COLORS.gray[50],
    },
  },
};

// Input styles
export const inputStyles = {
  base: {
    fontFamily: TYPOGRAPHY.fontFamily.sans,
    fontSize: TYPOGRAPHY.fontSize.base,
    padding: `${SPACING[2]} ${SPACING[3]}`,
    borderRadius: RADIUS.md,
    border: `1px solid ${COLORS.gray[300]}`,
    transition: "all 0.2s",
    backgroundColor: COLORS.white,
    "&:focus": {
      outline: "none",
      borderColor: COLORS.primary,
      boxShadow: `0 0 0 3px ${COLORS.primaryGhost}`,
    },
    "&:disabled": {
      backgroundColor: COLORS.gray[50],
      color: COLORS.gray[500],
      cursor: "not-allowed",
    },
  },
};

// Card styles
export const cardStyles = {
  base: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    boxShadow: SHADOWS.base,
    border: `1px solid ${COLORS.gray[200]}`,
    padding: SPACING[6],
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: SHADOWS.lg,
      borderColor: COLORS.gray[300],
    },
  },
};
