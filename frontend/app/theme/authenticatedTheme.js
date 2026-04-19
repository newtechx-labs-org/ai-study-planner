/**
 * Centralized theme tokens for the authenticated dashboard area.
 * Preserves the premium SaaS aesthetic from the landing and auth pages.
 * Export these styles and use in all authenticated components.
 */

// ============================================================================
// Color Palette
// ============================================================================
export const colors = {
  // Primary gradient (Indigo → Blue → Purple)
  gradient: "linear-gradient(135deg, #4F46E5 0%, #2563EB 48%, #A855F7 100%)",
  gradientAlt: "linear-gradient(135deg, #A855F7 0%, #4F46E5 48%, #2563EB 100%)",

  // Base colors
  primary: {
    main: "#4F46E5", // Indigo
    light: "#6366F1",
    dark: "#4338CA",
  },
  secondary: {
    main: "#2563EB", // Blue
    light: "#3B82F6",
    dark: "#1D4ED8",
  },
  accent: {
    main: "#A855F7", // Purple
    light: "#C084FC",
    dark: "#9333EA",
  },

  // Neutrals
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Semantic colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Glass effect overlays
  glass: {
    light: "rgba(255, 255, 255, 0.8)",
    lighter: "rgba(255, 255, 255, 0.9)",
    dark: "rgba(15, 23, 42, 0.6)",
    darker: "rgba(15, 23, 42, 0.8)",
  },
};

// ============================================================================
// Border Radius
// ============================================================================
export const borderRadius = {
  xs: "8px",
  sm: "12px",
  md: "14px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "28px",
  icon: "14px",
  button: "18px",
  card: "28px",
};

// ============================================================================
// Shadows
// ============================================================================
export const shadows = {
  // Soft drop shadows (premium aesthetic)
  sm: "0 4px 16px rgba(15, 23, 42, 0.08)",
  md: "0 8px 24px rgba(15, 23, 42, 0.10)",
  lg: "0 12px 32px rgba(15, 23, 42, 0.12)",
  xl: "0 24px 70px rgba(15, 23, 42, 0.12)",
  "2xl": "0 32px 96px rgba(15, 23, 42, 0.14)",

  // Inset shadows for glass effects
  inset: "inset 0 1px 3px rgba(255, 255, 255, 0.2)",

  // Gradient border glow
  glow: "0 0 30px rgba(79, 70, 229, 0.15)",
  glowAccent: "0 0 30px rgba(168, 85, 247, 0.15)",
};

// ============================================================================
// Glass Morphism
// ============================================================================
export const glass = {
  light: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "backdrop-filter: blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  dark: {
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "backdrop-filter: blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
};

// ============================================================================
// Spacing System
// ============================================================================
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
};

// ============================================================================
// Typography
// ============================================================================
export const typography = {
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  fontFamilyMono: "'Fira Code', 'Courier New', monospace",

  h1: {
    fontSize: "32px",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
  },
  h2: {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.3px",
  },
  h3: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1.4,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
};

// ============================================================================
// Transition & Animation
// ============================================================================
export const transitions = {
  fast: "150ms ease-out",
  normal: "250ms ease-out",
  slow: "350ms ease-out",
  verySlow: "500ms ease-out",
};

// ============================================================================
// Sidebar Configuration
// ============================================================================
export const sidebar = {
  width: "280px", // Slightly wider for premium feel
  backgroundColor: "#FFFFFF",
  borderColor: "rgba(0, 0, 0, 0.05)",
  itemHeight: "48px",
  itemIconSize: "20px",
  collapsedWidth: "80px",
};

// ============================================================================
// Topbar Configuration
// ============================================================================
export const topbar = {
  height: "64px",
  backgroundColor: "#FFFFFF",
  borderColor: "rgba(0, 0, 0, 0.05)",
};

// ============================================================================
// Component-Specific Overrides
// ============================================================================

// Card styles
export const cardStyles = {
  elevation0: {
    background: colors.neutral[50],
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.sm,
  },
  gradient: {
    background: colors.gradient,
    color: "#FFFFFF",
    boxShadow: shadows.lg,
  },
  glass: {
    background: colors.glass.light.background,
    backdropFilter: "blur(18px)",
    border: colors.glass.light.border,
    boxShadow: shadows.md,
  },
};

// Button styles
export const buttonStyles = {
  primary: {
    background: colors.gradient,
    color: "#FFFFFF",
    boxShadow: shadows.md,
    "&:hover": {
      boxShadow: shadows.lg,
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0px)",
    },
  },
  secondary: {
    background: "transparent",
    color: colors.primary.main,
    border: `1.5px solid ${colors.primary.main}`,
    "&:hover": {
      background: colors.primary.light,
      color: "#FFFFFF",
      border: `1.5px solid ${colors.primary.light}`,
    },
  },
  tertiary: {
    background: colors.neutral[50],
    color: colors.neutral[700],
    border: `1px solid ${colors.neutral[200]}`,
    "&:hover": {
      background: colors.neutral[100],
    },
  },
};

// Input styles
export const inputStyles = {
  borderColor: colors.neutral[300],
  backgroundColor: colors.neutral[50],
  focusBorderColor: colors.primary.main,
  focusBoxShadow: `0 0 0 3px ${colors.primary.main}22`,
};

// Chip/Badge styles
export const badgeStyles = {
  default: {
    backgroundColor: colors.neutral[100],
    color: colors.neutral[700],
  },
  primary: {
    backgroundColor: colors.primary.light,
    color: "#FFFFFF",
  },
  success: {
    backgroundColor: colors.success,
    color: "#FFFFFF",
  },
  warning: {
    backgroundColor: colors.warning,
    color: "#FFFFFF",
  },
  error: {
    backgroundColor: colors.error,
    color: "#FFFFFF",
  },
};

// ============================================================================
// Difficulty Badge Styles
// ============================================================================
export const difficultyBadgeStyles = {
  Easy: {
    background: colors.success,
    color: "#FFFFFF",
  },
  Medium: {
    background: colors.warning,
    color: "#FFFFFF",
  },
  Hard: {
    background: colors.error,
    color: "#FFFFFF",
  },
};

// ============================================================================
// MUI Theme Overrides
// ============================================================================
export const muiThemeOverrides = {
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      disabled: colors.neutral[400],
    },
    divider: colors.neutral[200],
  },
  typography: {
    fontFamily: typography.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.button,
          textTransform: "none",
          fontWeight: 600,
          transition: transitions.normal,
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          boxShadow: shadows.md,
          "&:hover": {
            boxShadow: shadows.lg,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.card,
          boxShadow: shadows.sm,
          border: `1px solid ${colors.neutral[200]}`,
          transition: transitions.normal,
          "&:hover": {
            boxShadow: shadows.md,
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: borderRadius.md,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(15, 23, 42, 0.4)",
          },
        },
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: `1px solid ${colors.neutral[200]}`,
        },
      },
    },
  },
};

const authenticatedTheme = {
  colors,
  borderRadius,
  shadows,
  glass,
  spacing,
  typography,
  transitions,
  sidebar,
  topbar,
  cardStyles,
  buttonStyles,
  inputStyles,
  badgeStyles,
  difficultyBadgeStyles,
  muiThemeOverrides,
};

export default authenticatedTheme;
