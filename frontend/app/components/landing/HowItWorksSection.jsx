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
          sx={{
            textAlign: "center",
            color: "#0F766E",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            fontSize: 12,
            mb: 1,
          }}
        >
          Three Steps
        </Typography>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            fontSize: { xs: "2rem", md: "2.7rem" },
          }}
        >
          Simple setup, serious outcomes
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
                    borderRadius: "22px",
                    p: 2.2,
                    border: "1px solid rgba(15,23,42,0.1)",
                    background:
                      "linear-gradient(165deg, rgba(255,255,255,1) 0%, rgba(240,253,250,0.5) 100%)",
                    boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
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
                        width: 40,
                        height: 40,
                        borderRadius: "11px",
                        display: "grid",
                        placeItems: "center",
                        color: step.color,
                        bgcolor: `${step.color}1F`,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: "#0f172a",
                        letterSpacing: "0.04em",
                      }}
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
