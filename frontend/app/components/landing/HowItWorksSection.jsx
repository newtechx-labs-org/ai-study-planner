"use client";

import { motion } from "framer-motion";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const steps = [
  {
    icon: MenuBookRoundedIcon,
    title: "Add Subjects",
    desc: "Define subjects, difficulty, and total hours needed.",
    color: "#4F46E5",
  },
  {
    icon: CalendarMonthRoundedIcon,
    title: "Set Availability",
    desc: "Choose your weekly hours or daily study windows.",
    color: "#06B6D4",
  },
  {
    icon: BoltRoundedIcon,
    title: "Generate Study Plan",
    desc: "Get a realistic, AI-backed schedule instantly.",
    color: "#A855F7",
  },
];

const MotionCard = motion.create(Card);

export default function HowItWorksSection() {
  return (
    <Box id="how-it-works" sx={{ py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          How it works
        </Typography>
        <Grid container spacing={2.2} sx={{ mt: 3.2 }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Grid key={step.title} size={{ xs: 12, md: 4 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  sx={{
                    height: "100%",
                    borderRadius: "20px",
                    p: 2.2,
                    border: "1px solid rgba(79,70,229,0.1)",
                    boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.3}
                    alignItems="center"
                    sx={{ mb: 1.2 }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "11px",
                        display: "grid",
                        placeItems: "center",
                        color: step.color,
                        bgcolor: `${step.color}20`,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                    <Typography
                      sx={{ fontWeight: 900, color: "#0f172a" }}
                    >{`0${idx + 1}`}</Typography>
                  </Stack>
                  <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ mt: 0.6, color: "#475569" }}>
                    {step.desc}
                  </Typography>
                </MotionCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
