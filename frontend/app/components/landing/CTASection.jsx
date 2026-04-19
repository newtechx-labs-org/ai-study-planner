"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const MotionBox = motion.create(Box);

export default function CTASection({ onRegister }) {
  return (
    <Box sx={{ py: { xs: 8, md: 11 } }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "28px",
            textAlign: "center",
            background:
              "linear-gradient(120deg, #0369A1 0%, #0F766E 46%, #B45309 100%)",
            boxShadow: "0 22px 44px rgba(3,105,161,0.35)",
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.82)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: 12,
            }}
          >
            Ready to launch?
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              fontSize: { xs: "2rem", md: "2.7rem" },
            }}
          >
            Plan your next exam season with confidence
          </Typography>
          <Typography
            sx={{
              mt: 1.4,
              color: "rgba(255,255,255,0.92)",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Create your account and generate your first adaptive study plan in
            less than five minutes.
          </Typography>
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <Button
              onClick={onRegister}
              variant="contained"
              sx={{
                color: "#0f172a",
                bgcolor: "#fff",
                borderRadius: "999px",
                px: 3,
                py: 1.2,
                fontWeight: 800,
                boxShadow: "0 14px 30px rgba(15,23,42,0.18)",
                "&:hover": { bgcolor: "#e2e8f0" },
              }}
            >
              Register Now
            </Button>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
}
