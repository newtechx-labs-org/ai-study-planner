"use client";

import { motion } from "framer-motion";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

const MotionCard = motion.create(Card);

const features = [
  {
    icon: PsychologyRoundedIcon,
    title: "AI-Powered Planning",
    desc: "Build personalized study schedules based on deadlines, difficulty, and realistic pace.",
    color: "#4F46E5",
  },
  {
    icon: AccessTimeRoundedIcon,
    title: "Smart Time Allocation",
    desc: "Distribute hours across subjects intelligently so your week feels balanced and focused.",
    color: "#06B6D4",
  },
  {
    icon: QueryStatsRoundedIcon,
    title: "Progress Tracking",
    desc: "Mark sessions complete and track completed vs remaining study hours in real time.",
    color: "#A855F7",
  },
  {
    icon: TuneRoundedIcon,
    title: "Adaptive Scheduling",
    desc: "Missed a session? Regenerate a practical plan from your remaining workload instantly.",
    color: "#7C3AED",
  },
  {
    icon: AutoGraphRoundedIcon,
    title: "Plan Versioning",
    desc: "Keep plan history with versions so you can regenerate and continue from updated schedules.",
    color: "#2563EB",
  },
  {
    icon: VerifiedRoundedIcon,
    title: "Subject & Plan Management",
    desc: "Create, edit, and delete subjects and plans directly from the dashboard when priorities change.",
    color: "#DB2777",
  },
];

export default function FeaturesSection() {
  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 11 },
        background:
          "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(236,253,245,0.55) 45%, rgba(255,255,255,0.92) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{
            textAlign: "center",
            color: "#0369A1",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            fontSize: 12,
            mb: 1,
          }}
        >
          Platform Advantages
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            textAlign: "center",
            color: "#0f172a",
            letterSpacing: "-0.02em",
            fontSize: { xs: "2rem", md: "2.8rem" },
          }}
        >
          Everything your study rhythm needs
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            textAlign: "center",
            color: "#475569",
            maxWidth: 700,
            mx: "auto",
            fontSize: { xs: 15, md: 17 },
          }}
        >
          Map goals to weekly action, recover quickly when plans shift, and keep
          momentum with a system that adapts to your real calendar.
        </Typography>

        <Grid
          container
          rowSpacing={{ xs: 5, md: 7 }}
          columnSpacing={{ xs: 4, md: 6 }}
          sx={{ mt: 3.8 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid key={feature.title} size={{ xs: 12, md: 6, lg: 4 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  sx={{
                    height: "100%",
                    p: 2.6,
                    borderRadius: "22px",
                    border: `1px solid ${alpha(feature.color, 0.19)}`,
                    background:
                      "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)",
                    boxShadow: `0 8px 22px ${alpha("#000000", 0.05)}, 0 3px 8px ${alpha("#000000", 0.04)}`,
                    backdropFilter: "blur(8px)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: `0 14px 32px ${alpha(feature.color, 0.16)}, 0 2px 8px ${alpha("#000000", 0.06)}`,
                      borderColor: alpha(feature.color, 0.32),
                    },
                  }}
                >
                  <Stack spacing={1.25} sx={{ height: "100%" }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "13px",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: alpha(feature.color, 0.18),
                        color: feature.color,
                        mb: 0.25,
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "#475569", lineHeight: 1.68 }}>
                      {feature.desc}
                    </Typography>
                  </Stack>
                </MotionCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
