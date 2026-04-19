"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

export default function HeroSection({ onLogin, onRegister }) {
  return (
    <Grid
      container
      spacing={4}
      alignItems="center"
      sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 9, md: 12 } }}
    >
      <Grid size={{ xs: 12, md: 6 }}>
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <Chip
            label="AI Study Planning Platform"
            sx={{
              mb: 2,
              fontWeight: 800,
              color: "#0C4A6E",
              bgcolor: "rgba(14, 165, 233, 0.14)",
              border: "1px solid rgba(14, 165, 233, 0.28)",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#0f172a",
              fontSize: { xs: "2.2rem", md: "3.65rem" },
              maxWidth: 620,
            }}
          >
            Build a study system that actually fits your life
          </Typography>
          <Typography
            sx={{
              mt: 2,
              color: "#334155",
              fontSize: { xs: 16, md: 19 },
              maxWidth: 560,
              lineHeight: 1.72,
            }}
          >
            Turn your subjects, deadlines, and weekly availability into an
            adaptive plan that you can follow, adjust, and complete with
            confidence.
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 2.4 }}
          >
            <Chip
              icon={<AccessTimeRoundedIcon />}
              label="Time-aware scheduling"
              size="small"
              sx={{
                bgcolor: "rgba(2,132,199,0.1)",
                color: "#0C4A6E",
                border: "1px solid rgba(2,132,199,0.2)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#0C4A6E" },
              }}
            />
            <Chip
              icon={<AutoGraphRoundedIcon />}
              label="Progress-driven adjustments"
              size="small"
              sx={{
                bgcolor: "rgba(16,185,129,0.1)",
                color: "#065F46",
                border: "1px solid rgba(16,185,129,0.2)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#065F46" },
              }}
            />
          </Stack>

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
                px: 3.2,
                py: 1.25,
                fontWeight: 800,
                background: "linear-gradient(90deg, #0284C7 0%, #10B981 100%)",
                boxShadow: "0 16px 30px rgba(2, 132, 199, 0.34)",
                transition: "transform 180ms ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  background:
                    "linear-gradient(90deg, #0369A1 0%, #0F766E 100%)",
                },
              }}
            >
              Start Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onLogin}
              sx={{
                borderRadius: "999px",
                px: 3,
                py: 1.25,
                fontWeight: 800,
                borderColor: "rgba(15, 23, 42, 0.2)",
                color: "#0F172A",
              }}
            >
              Sign In
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
            borderRadius: "26px",
            p: 2.5,
            background:
              "linear-gradient(162deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.9) 100%)",
            border: "1px solid rgba(2,132,199,0.18)",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{ fontWeight: 800, color: "#1e293b", fontSize: 18 }}
              >
                Weekly Plan Snapshot
              </Typography>
              <Chip
                icon={<SchoolRoundedIcon fontSize="small" />}
                label="4 subjects"
                size="small"
                sx={{
                  bgcolor: "rgba(2,132,199,0.1)",
                  color: "#0C4A6E",
                  border: "1px solid rgba(2,132,199,0.2)",
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "#0C4A6E" },
                }}
              />
            </Stack>

            <Card
              sx={{
                p: 2,
                borderRadius: "16px",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "none",
                bgcolor: "#FFFFFF",
              }}
            >
              <Stack spacing={1.3}>
                {[
                  {
                    title: "Math Revision",
                    time: "Mon • 7:00 PM - 8:30 PM",
                    status: "Planned",
                  },
                  {
                    title: "Physics Practice",
                    time: "Wed • 6:30 PM - 8:00 PM",
                    status: "Planned",
                  },
                  {
                    title: "Chemistry Quiz",
                    time: "Fri • 7:00 PM - 8:00 PM",
                    status: "Completed",
                  },
                ].map((item, index) => (
                  <Box key={item.title}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#64748B" }}>
                          {item.time}
                        </Typography>
                      </Box>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          bgcolor:
                            item.status === "Completed"
                              ? "rgba(16,185,129,0.15)"
                              : "rgba(2,132,199,0.12)",
                          color:
                            item.status === "Completed" ? "#047857" : "#0C4A6E",
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                    {index < 2 ? <Divider sx={{ mt: 1.2 }} /> : null}
                  </Box>
                ))}
              </Stack>
            </Card>

            <Stack direction="row" spacing={1.2}>
              <Card
                sx={{
                  flex: 1,
                  p: 1.5,
                  borderRadius: "14px",
                  border: "1px solid rgba(2,132,199,0.18)",
                  bgcolor: "rgba(14,165,233,0.08)",
                  boxShadow: "none",
                }}
              >
                <Typography
                  sx={{ fontSize: 12, color: "#0C4A6E", fontWeight: 700 }}
                >
                  Completion
                </Typography>
                <Typography
                  sx={{ fontWeight: 900, color: "#0F172A", fontSize: 22 }}
                >
                  72%
                </Typography>
              </Card>
              <Card
                sx={{
                  flex: 1,
                  p: 1.5,
                  borderRadius: "14px",
                  border: "1px solid rgba(16,185,129,0.18)",
                  bgcolor: "rgba(16,185,129,0.08)",
                  boxShadow: "none",
                }}
              >
                <Typography
                  sx={{ fontSize: 12, color: "#065F46", fontWeight: 700 }}
                >
                  Hours left
                </Typography>
                <Typography
                  sx={{ fontWeight: 900, color: "#0F172A", fontSize: 22 }}
                >
                  18h
                </Typography>
              </Card>
            </Stack>
          </Stack>
        </MotionCard>
      </Grid>
    </Grid>
  );
}
