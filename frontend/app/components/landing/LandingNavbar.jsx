"use client";

import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";

import LandingLogo from "./LandingLogo";

export default function LandingNavbar({ onLogin, onRegister }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: scrolled
          ? "rgba(255, 255, 255, 0.9)"
          : "linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.22) 100%)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid",
        borderColor: scrolled ? "rgba(14, 165, 233, 0.2)" : "transparent",
        transition: "all 220ms ease",
      }}
    >
      <Toolbar
        sx={{ minHeight: 74, mx: "auto", width: "100%", maxWidth: 1280 }}
      >
        <LandingLogo />
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Link
            href="#features"
            underline="none"
            color="#0F172A"
            sx={{
              fontWeight: 700,
              fontSize: 14,
              px: 1.3,
              py: 0.85,
              borderRadius: "999px",
              transition: "all 180ms ease",
              "&:hover": {
                backgroundColor: "rgba(14,165,233,0.11)",
                color: "#0C4A6E",
              },
            }}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            underline="none"
            color="#0F172A"
            sx={{
              fontWeight: 700,
              fontSize: 14,
              px: 1.3,
              py: 0.85,
              borderRadius: "999px",
              transition: "all 180ms ease",
              "&:hover": {
                backgroundColor: "rgba(14,165,233,0.11)",
                color: "#0C4A6E",
              },
            }}
          >
            How it Works
          </Link>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1.5 }}>
          <Button
            variant="text"
            onClick={onLogin}
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              borderRadius: "999px",
              px: { xs: 1.6, md: 2.2 },
              py: 0.75,
              "&:hover": {
                backgroundColor: "rgba(15,23,42,0.06)",
              },
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            onClick={onRegister}
            sx={{
              fontWeight: 700,
              borderRadius: "999px",
              px: { xs: 1.8, md: 2.4 },
              background: "linear-gradient(90deg, #0284C7 0%, #10B981 100%)",
              boxShadow: "0 10px 24px rgba(2,132,199,0.34)",
              "&:hover": {
                background: "linear-gradient(90deg, #0369A1 0%, #0F766E 100%)",
              },
            }}
          >
            Register
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
