"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

export default function HeroSection({ onLogin, onRegister }) {
  return (
    <Grid
      container
      spacing={4}
      alignItems="center"
      sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 } }}
    >
      <Grid size={{ xs: 12, md: 6 }}>
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <Chip
            label="AI-Powered Study Workflow"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#3730A3",
              bgcolor: "rgba(79, 70, 229, 0.12)",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#0f172a",
              fontSize: { xs: "2.2rem", md: "3.4rem" },
            }}
          >
            Plan Smarter. Study Better with AI
          </Typography>
          <Typography
            sx={{
              mt: 2,
              color: "#334155",
              fontSize: { xs: 16, md: 19 },
              maxWidth: 560,
            }}
          >
            Generate personalized study schedules based on your time and
            subjects. Turn scattered prep into focused momentum with adaptive
            planning.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onRegister}
              sx={{
                borderRadius: "999px",
                px: 3,
                py: 1.3,
                fontWeight: 700,
                background: "linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%)",
                boxShadow: "0 16px 30px rgba(79, 70, 229, 0.35)",
                transition: "transform 180ms ease",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onLogin}
              sx={{ borderRadius: "999px", px: 3, py: 1.3, fontWeight: 700 }}
            >
              Learn More
            </Button>
          </Stack>
        </MotionBox>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MotionCard
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
          sx={{
            borderRadius: "24px",
            p: 2.5,
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(245,248,255,0.88) 100%)",
            border: "1px solid rgba(79, 70, 229, 0.14)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
          }}
        >
          <Typography sx={{ fontWeight: 800, mb: 1.8, color: "#1e293b" }}>
            Weekly Plan Preview
          </Typography>
          <Stack spacing={1.2}>
            {[
              {
                icon: <MenuBookRoundedIcon fontSize="small" />,
                title: "Math Revision",
                time: "Mon 7:00 PM",
                color: "#4F46E5",
              },
              {
                icon: <EventAvailableRoundedIcon fontSize="small" />,
                title: "Physics Practice",
                time: "Wed 6:30 PM",
                color: "#06B6D4",
              },
              {
                icon: <InsightsRoundedIcon fontSize="small" />,
                title: "Progress Tracking",
                time: "Sat 10:00 AM",
                color: "#A855F7",
              },
            ].map((item, idx) => (
              <MotionBox
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.08, duration: 0.35 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.4,
                  borderRadius: "14px",
                  bgcolor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(15, 23, 42, 0.06)",
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: `${item.color}1A`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                      {item.time}
                    </Typography>
                  </Box>
                </Stack>
                <Chip
                  label="Planned"
                  size="small"
                  sx={{
                    bgcolor: "rgba(79,70,229,0.1)",
                    color: "#4338CA",
                    fontWeight: 700,
                  }}
                />
              </MotionBox>
            ))}
          </Stack>
        </MotionCard>
      </Grid>
    </Grid>
  );
}
