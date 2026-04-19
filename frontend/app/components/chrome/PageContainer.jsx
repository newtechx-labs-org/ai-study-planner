"use client";

import React from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import theme from "@/app/theme/authenticatedTheme";

/**
 * PageContainer Component
 * Provides consistent spacing, max-width, and layout for all authenticated pages.
 * Handles responsive padding based on screen size.
 */
export default function PageContainer({ children }) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: 1,
        overflow: "auto",
        backgroundColor: theme.colors.neutral[50],
        // Account for mobile topbar height (no extra gap)
        pt: isMobile ? theme.topbar.height : 0,
        transition: theme.transitions.normal,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 3 },
          width: "100%",
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
