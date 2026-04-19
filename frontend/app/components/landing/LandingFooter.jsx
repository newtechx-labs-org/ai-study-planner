"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LandingLogo from "./LandingLogo";

export default function LandingFooter() {
  return (
    <Box sx={{ pt: 1.5, pb: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: "22px",
            p: 2.4,
            border: "1px solid rgba(2,132,199,0.18)",
            background:
              "linear-gradient(165deg, rgba(255,255,255,0.86) 0%, rgba(240,249,255,0.86) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "center" }}
            justifyContent="space-between"
          >
            <LandingLogo compact />
            <Stack direction="row" spacing={2.4}>
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
              <Link
                href="/signin"
                underline="none"
                color="#334155"
                sx={{ fontWeight: 600 }}
              >
                Login
              </Link>
            </Stack>
          </Stack>
          <Typography sx={{ mt: 2, color: "#64748b", fontSize: 13 }}>
            Copyright {new Date().getFullYear()} AI Study Planner. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
