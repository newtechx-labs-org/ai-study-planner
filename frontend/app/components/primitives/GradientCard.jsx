"use client";

import React from "react";
import { Card, Box, Typography, Stack } from "@mui/material";
import theme from "@/app/theme/authenticatedTheme";

/**
 * GradientCard Component
 * Premium card with gradient background and white text.
 * Used for hero sections, featured metrics, and call-to-action areas.
 */
export default function GradientCard({
  title,
  subtitle,
  value,
  icon,
  action,
  children,
  gradient = "default",
  sx = {},
  ...props
}) {
  const getGradient = () => {
    switch (gradient) {
      case "alt":
        return theme.colors.gradientAlt;
      default:
        return theme.colors.gradient;
    }
  };

  return (
    <Card
      sx={{
        background: getGradient(),
        color: "#FFFFFF",
        border: "none",
        borderRadius: theme.borderRadius.card,
        boxShadow: theme.shadows.lg,
        overflow: "hidden",
        position: "relative",
        transition: theme.transitions.normal,
        "&:hover": {
          boxShadow: theme.shadows["2xl"],
          transform: "translateY(-4px)",
        },
        p: 3,
        ...sx,
      }}
      {...props}
    >
      {/* Optional icon background */}
      {icon && (
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            zIndex: 0,
          }}
        />
      )}

      <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
        {/* Header with icon and title */}
        {(icon || title) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            {icon && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  fontSize: "24px",
                }}
              >
                {icon}
              </Box>
            )}
            {action && <Box>{action}</Box>}
          </Box>
        )}

        {/* Title */}
        {title && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#FFFFFF",
              fontSize: { xs: "16px", md: "18px" },
            }}
          >
            {title}
          </Typography>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Value */}
        {value && (
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: { xs: "24px", md: "32px" },
              mt: 1,
            }}
          >
            {value}
          </Typography>
        )}

        {/* Custom children content */}
        {children}
      </Stack>
    </Card>
  );
}
