"use client";

import { Card, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import {
  AccessTimeRounded as AccessTimeRoundedIcon,
  AutoAwesomeRounded as AutoAwesomeRoundedIcon,
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  EventAvailableRounded as EventAvailableRoundedIcon,
  QueryBuilderRounded as QueryBuilderRoundedIcon,
} from "@mui/icons-material";
import StudyAvailabilityForm from "@/app/components/StudyAvailabilityForm";
import GradientCard from "@/app/components/primitives/GradientCard";
import theme from "@/app/theme/authenticatedTheme";

export default function AvailabilityPage() {
  return (
    <Stack spacing={4} sx={{ width: "100%" }}>
      <GradientCard
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: theme.borderRadius.xl,
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(29, 78, 216, 0.9) 45%, rgba(124, 58, 237, 0.9) 100%)",
        }}
      >
        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack
              spacing={2}
              sx={{ height: "100%", justifyContent: "center" }}
            >
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label="Availability setup"
                size="small"
                sx={{
                  width: "fit-content",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  fontWeight: 700,
                  "& .MuiChip-icon": {
                    color: "#FFFFFF",
                  },
                }}
              />
              <Stack spacing={1}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "-0.03em",
                    fontSize: { xs: "2rem", md: "2.6rem" },
                  }}
                >
                  Shape your study rhythm
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.82)",
                    maxWidth: 640,
                  }}
                >
                  Tell the planner when you are available so it can create a
                  realistic study schedule around your actual routine.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<AccessTimeRoundedIcon />}
                  label="Weekly hours or daily blocks"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "#FFFFFF" },
                  }}
                />
                <Chip
                  icon={<CalendarMonthRoundedIcon />}
                  label="Plan around your calendar"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "#FFFFFF" },
                  }}
                />
                <Chip
                  icon={<EventAvailableRoundedIcon />}
                  label="Update anytime"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    fontWeight: 700,
                    "& .MuiChip-icon": { color: "#FFFFFF" },
                  }}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: theme.borderRadius.card,
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(20px)",
                boxShadow: theme.shadows.lg,
              }}
            >
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Stack spacing={0.75}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      letterSpacing: "0.12em",
                      fontWeight: 700,
                    }}
                  >
                    Why it matters
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#FFFFFF" }}
                  >
                    Better availability means better study plans.
                  </Typography>
                </Stack>
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.16)" }} />
                <Stack spacing={2}>
                  {[
                    {
                      icon: <QueryBuilderRoundedIcon fontSize="small" />,
                      title: "More accurate sessions",
                      text: "The planner can distribute subjects into realistic time blocks.",
                    },
                    {
                      icon: <AutoAwesomeRoundedIcon fontSize="small" />,
                      title: "Smarter recommendations",
                      text: "Availability data improves the AI suggestions for each study plan.",
                    },
                  ].map((item, index) => (
                    <Stack
                      key={item.title}
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.14)",
                          color: "#FFFFFF",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Stack>
                      <Stack spacing={0.25}>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#FFFFFF", fontWeight: 700 }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.78)" }}
                        >
                          {item.text}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </GradientCard>

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: theme.borderRadius.card,
              p: 3,
              border: `1px solid ${theme.colors.neutral[200]}`,
              backgroundColor: "#FFFFFF",
              boxShadow: theme.shadows.sm,
            }}
          >
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography
                  variant="overline"
                  sx={{ color: theme.colors.primary[600], fontWeight: 700 }}
                >
                  Setup guide
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: theme.colors.neutral[900] }}
                >
                  Keep your schedule realistic.
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: theme.colors.neutral[600], lineHeight: 1.75 }}
              >
                Use weekly hours if you prefer a simple target. Switch to daily
                slots when you want the planner to respect specific windows in
                your week.
              </Typography>
              <Divider />
              <Stack spacing={1.5}>
                {[
                  "Start with your most reliable study time.",
                  "Choose daily slots when your week changes often.",
                  "Update availability whenever your routine shifts.",
                ].map((item, index) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1.25}
                    alignItems="flex-start"
                  >
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "999px",
                        backgroundColor: theme.colors.primary[50],
                        color: theme.colors.primary[700],
                        fontSize: 12,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.neutral[700], lineHeight: 1.6 }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <StudyAvailabilityForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
