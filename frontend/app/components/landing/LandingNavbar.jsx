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
          ? "rgba(255, 255, 255, 0.82)"
          : "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 100%)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: scrolled ? "rgba(79, 70, 229, 0.18)" : "transparent",
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
          spacing={2.5}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Link
            href="#features"
            underline="none"
            color="#334155"
            sx={{ fontWeight: 600 }}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            underline="none"
            color="#334155"
            sx={{ fontWeight: 600 }}
          >
            How it Works
          </Link>
          <Button variant="text" onClick={onLogin} sx={{ fontWeight: 700 }}>
            Login
          </Button>
          <Button
            variant="contained"
            onClick={onRegister}
            sx={{
              fontWeight: 700,
              borderRadius: "999px",
              px: 2.25,
              background: "linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%)",
              boxShadow: "0 10px 24px rgba(79, 70, 229, 0.35)",
            }}
          >
            Register
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
