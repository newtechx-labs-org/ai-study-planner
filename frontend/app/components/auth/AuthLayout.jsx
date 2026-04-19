"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";

import LandingLogo from "../landing/LandingLogo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const leftHighlights = [
  {
    icon: <ScheduleRoundedIcon fontSize="small" />,
    title: "Adaptive scheduling",
    copy: "Plans shift with your workload and availability.",
  },
  {
    icon: <TrackChangesRoundedIcon fontSize="small" />,
    title: "Focus tracking",
    copy: "See what matters next and stay on pace.",
  },
  {
    icon: <TrendingUpRoundedIcon fontSize="small" />,
    title: "Progress visibility",
    copy: "Measure momentum without noisy dashboards.",
  },
];

const BackgroundLayer = styled(Box)(() => ({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
}));

export default function AuthLayout({ children }) {
  return (
    <Box
      className={jakarta.className}
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        background:
          "radial-gradient(1400px 800px at 0% 0%, rgba(79,70,229,0.24) 0%, rgba(79,70,229,0.12) 20%, transparent 55%), radial-gradient(1000px 700px at 100% 0%, rgba(168,85,247,0.18) 0%, transparent 42%), linear-gradient(180deg, #F8FAFF 0%, #F4F7FF 46%, #FFFFFF 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", md: "46%" },
          minHeight: { xs: "42vh", md: "100dvh" },
          color: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #1E1B4B 0%, #312E81 36%, #4338CA 68%, #0F172A 100%)",
        }}
      >
        <BackgroundLayer>
          <MotionBox
            animate={{ y: [0, -16, 0], x: [0, 6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            sx={{
              position: "absolute",
              top: 54,
              left: 40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              filter: "blur(8px)",
            }}
          />
          <MotionBox
            animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            sx={{
              position: "absolute",
              bottom: -30,
              right: -8,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(168,85,247,0.38) 0%, rgba(79,70,229,0.08) 52%, transparent 72%)",
              filter: "blur(6px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 45%, rgba(255,255,255,0.06) 100%)",
            }}
          />
        </BackgroundLayer>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 560,
            px: { xs: 3, sm: 5, md: 6 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <Stack spacing={3.5}>
              <LandingLogo inverse />

              <Box>
                <Typography
                  className={sora.className}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.7,
                    mb: 2,
                    borderRadius: "999px",
                    bgcolor: alpha("#FFFFFF", 0.12),
                    border: `1px solid ${alpha("#FFFFFF", 0.14)}`,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
                  Smart study planning
                </Typography>

                <Typography
                  component="h1"
                  className={sora.className}
                  sx={{
                    fontSize: { xs: "2.1rem", sm: "2.9rem", md: "3.35rem" },
                    lineHeight: 1.02,
                    letterSpacing: "-0.05em",
                    fontWeight: 800,
                    maxWidth: 460,
                    mb: 2,
                  }}
                >
                  Plan Smarter.
                  <Box component="span" sx={{ display: "block" }}>
                    Study Better.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(248,250,252,0.84)",
                    fontSize: { xs: "0.98rem", md: "1.04rem" },
                    lineHeight: 1.7,
                    maxWidth: 500,
                  }}
                >
                  A premium study workspace that turns deadlines, subjects, and
                  free time into a polished schedule you can actually follow.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.2} useFlexGap flexWrap="wrap">
                {[
                  "AI-guided plans",
                  "Progress visibility",
                  "Calm, focused workflow",
                ].map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    sx={{
                      bgcolor: alpha("#FFFFFF", 0.1),
                      color: "#FFFFFF",
                      border: `1px solid ${alpha("#FFFFFF", 0.12)}`,
                      fontWeight: 700,
                      px: 0.4,
                    }}
                  />
                ))}
              </Stack>

              <Stack spacing={1.25} sx={{ mt: 0.5 }}>
                {leftHighlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.08, duration: 0.45 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.6,
                        p: 1.8,
                        borderRadius: 3,
                        background: alpha("#FFFFFF", 0.08),
                        border: `1px solid ${alpha("#FFFFFF", 0.1)}`,
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "14px",
                          display: "grid",
                          placeItems: "center",
                          color: "#F8FAFC",
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
                          border: `1px solid ${alpha("#FFFFFF", 0.08)}`,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#FFFFFF" }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ color: "rgba(248,250,252,0.76)" }}>
                          {item.copy}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Stack>
          </motion.div>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "54%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MotionCard
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          whileHover={{ y: -3 }}
          sx={{
            width: "100%",
            maxWidth: 560,
            mx: { xs: 2, sm: 4, md: 5 },
            borderRadius: "28px",
            border: `1px solid ${alpha("#4F46E5", 0.12)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(247,249,255,0.95) 100%)",
            boxShadow:
              "0 24px 70px rgba(15,23,42,0.12), 0 8px 24px rgba(79,70,229,0.08)",
            backdropFilter: "blur(18px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, sm: 4.5 },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at top right, rgba(168,85,247,0.08), transparent 30%), radial-gradient(circle at bottom left, rgba(6,182,212,0.06), transparent 26%)",
                pointerEvents: "none",
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
          </Box>
        </MotionCard>
      </Box>
    </Box>
  );
}
