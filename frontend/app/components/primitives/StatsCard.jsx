"use client";

import React from "react";
import { Card, Box, Typography, Stack, LinearProgress } from "@mui/material";
import theme from "@/app/theme/authenticatedTheme";

/**
 * StatsCard Component
 * Elegant card for displaying individual metrics/KPIs.
 * Supports icon, title, value, subtitle, and optional progress bar.
 */
export default function StatsCard({
  icon,
  title,
  value,
  subtitle,
  progress,
  trend,
  trendPositive = true,
  variant = "default",
  gradient,
  sx = {},
  ...props
}) {
  const isGradient = variant === "gradient";
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <Card
      sx={{
        borderRadius: theme.borderRadius.card,
        border: isGradient
          ? "1px solid rgba(255, 255, 255, 0.18)"
          : `1px solid ${theme.colors.neutral[200]}`,
        background: isGradient ? gradient || theme.colors.gradient : "#FFFFFF",
        height: "100%",
        minHeight: 192,
        display: "flex",
        flexDirection: "column",
        boxShadow: isGradient ? theme.shadows.lg : theme.shadows.sm,
        transition: theme.transitions.normal,
        "&:hover": {
          boxShadow: isGradient ? theme.shadows["2xl"] : theme.shadows.md,
          transform: "translateY(-2px)",
          borderColor: isGradient
            ? "rgba(255, 255, 255, 0.3)"
            : theme.colors.primary.main,
        },
        p: 3,
        ...sx,
      }}
      {...props}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        {/* Header with icon and trend */}
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
                backgroundColor: isGradient
                  ? "rgba(255, 255, 255, 0.16)"
                  : `${theme.colors.primary.main}12`,
                color: isGradient ? "#FFFFFF" : theme.colors.primary.main,
                fontSize: "22px",
              }}
            >
              {icon}
            </Box>
          )}

          {trend && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: isGradient
                  ? "rgba(255, 255, 255, 0.92)"
                  : trendPositive
                    ? theme.colors.success
                    : theme.colors.error,
                fontSize: "13px",
              }}
            >
              {trend}
            </Typography>
          )}
        </Box>

        {/* Title */}
        {title && (
          <Typography
            variant="body2"
            sx={{
              color: isGradient
                ? "rgba(255, 255, 255, 0.82)"
                : theme.colors.neutral[500],
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </Typography>
        )}

        {/* Value */}
        {hasValue && (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: isGradient
                ? "rgba(255, 255, 255, 0.98)"
                : theme.colors.neutral[900],
              fontSize: { xs: "28px", md: "34px" },
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </Typography>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: isGradient
                ? "rgba(255, 255, 255, 0.82)"
                : theme.colors.neutral[500],
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Progress bar (optional) */}
        <Box sx={{ mt: 1, minHeight: 34 }}>
          {progress !== undefined ? (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: isGradient
                  ? "rgba(255, 255, 255, 0.24)"
                  : theme.colors.neutral[200],
                "& .MuiLinearProgress-bar": {
                  background: isGradient ? "#FFFFFF" : theme.colors.gradient,
                  borderRadius: theme.borderRadius.sm,
                },
              }}
            />
          ) : null}
          {progress !== undefined && (
            <Typography
              variant="caption"
              sx={{
                color: isGradient
                  ? "rgba(255, 255, 255, 0.86)"
                  : theme.colors.neutral[500],
                fontSize: "12px",
                fontWeight: 600,
                display: "block",
                mt: 1,
              }}
            >
              {progress}% Complete
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
