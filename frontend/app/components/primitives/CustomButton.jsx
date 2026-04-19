"use client";

import React from "react";
import { Button as MuiButton, CircularProgress, Box } from "@mui/material";
import theme from "@/app/theme/authenticatedTheme";

/**
 * CustomButton Component
 * Premium button with gradient, secondary, and tertiary variants.
 * Supports loading state and size variants.
 */
export default function CustomButton({
  variant = "primary",
  size = "medium",
  loading = false,
  startIcon,
  endIcon,
  children,
  sx = {},
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: theme.colors.gradient,
          color: "#FFFFFF",
          border: "none",
          boxShadow: theme.shadows.md,
          "&:hover": {
            boxShadow: theme.shadows.lg,
            transform: "translateY(-2px)",
            background: theme.colors.gradient,
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        };
      case "secondary":
        return {
          background: "transparent",
          color: theme.colors.primary.main,
          border: `1.5px solid ${theme.colors.primary.main}`,
          "&:hover": {
            background: `${theme.colors.primary.main}08`,
            borderColor: theme.colors.primary.light,
            color: theme.colors.primary.light,
          },
        };
      case "tertiary":
        return {
          background: theme.colors.neutral[50],
          color: theme.colors.neutral[700],
          border: `1px solid ${theme.colors.neutral[200]}`,
          "&:hover": {
            background: theme.colors.neutral[100],
            borderColor: theme.colors.neutral[300],
          },
        };
      case "danger":
        return {
          background: theme.colors.error,
          color: "#FFFFFF",
          border: "none",
          "&:hover": {
            background: theme.colors.error,
            opacity: 0.9,
            boxShadow: theme.shadows.md,
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          px: 2,
          py: 0.75,
          fontSize: "12px",
          fontWeight: 600,
        };
      case "large":
        return {
          px: 4,
          py: 1.5,
          fontSize: "16px",
          fontWeight: 600,
        };
      case "medium":
      default:
        return {
          px: 3,
          py: 1,
          fontSize: "14px",
          fontWeight: 600,
        };
    }
  };

  return (
    <MuiButton
      {...props}
      disabled={loading || props.disabled}
      startIcon={startIcon && !loading ? startIcon : undefined}
      endIcon={endIcon && !loading ? endIcon : undefined}
      sx={{
        borderRadius: theme.borderRadius.button,
        textTransform: "none",
        transition: theme.transitions.normal,
        position: "relative",
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...sx,
        "&:disabled": {
          opacity: 0.6,
          cursor: "not-allowed",
        },
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CircularProgress
            size={16}
            sx={{
              color:
                variant === "primary" ? "#FFFFFF" : theme.colors.primary.main,
            }}
          />
          {children}
        </Box>
      ) : (
        children
      )}
    </MuiButton>
  );
}
