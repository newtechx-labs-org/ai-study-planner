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
              "linear-gradient(120deg, #4F46E5 0%, #06B6D4 45%, #DB2777 100%)",
            boxShadow: "0 20px 42px rgba(79,70,229,0.35)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              fontSize: { xs: "2rem", md: "2.7rem" },
            }}
          >
            Start Your Smart Study Journey Today
          </Typography>
          <Typography
            sx={{
              mt: 1.4,
              color: "rgba(255,255,255,0.92)",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Create your account in minutes and let AI design a study roadmap
            that matches your time, goals, and pace.
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
