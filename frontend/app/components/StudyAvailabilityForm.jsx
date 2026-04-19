"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  EditCalendarRounded as EditCalendarRoundedIcon,
  EventAvailableRounded as EventAvailableRoundedIcon,
  ScheduleRounded as ScheduleRoundedIcon,
  TimerRounded as TimerRoundedIcon,
} from "@mui/icons-material";

import {
  getAvailability,
  setAvailability,
} from "@/services/availabilityService";

const defaultDailySlots = [
  { day: "Mon", start: "18:00", end: "21:00" },
  { day: "Tue", start: "18:00", end: "21:00" },
  { day: "Wed", start: "18:00", end: "21:00" },
  { day: "Thu", start: "18:00", end: "21:00" },
  { day: "Fri", start: "18:00", end: "21:00" },
  { day: "Sat", start: "09:00", end: "12:00" },
  { day: "Sun", start: "09:00", end: "12:00" },
];

export default function StudyAvailabilityForm() {
  const [availabilitySuccess, setAvailabilitySuccess] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityType, setAvailabilityType] = useState("weekly");
  const [weeklyHours, setWeeklyHours] = useState("20");
  const [dailySlots, setDailySlots] = useState(defaultDailySlots);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const payload = await getAvailability();
        setAvailabilityType(payload.type);
        if (payload.type === "weekly") {
          setWeeklyHours(String(payload.data.weekly_hours || 20));
        } else {
          setDailySlots(payload.data.slots || defaultDailySlots);
        }
      } catch (error) {
        // Keep defaults if availability does not exist yet.
      }
    };

    fetchAvailability();
  }, []);

  const updateSlot = (index, field, value) => {
    setDailySlots((prev) =>
      prev.map((slot, currentIndex) =>
        currentIndex === index ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const onAvailabilitySubmit = async () => {
    setAvailabilityError("");
    setAvailabilitySuccess("");

    const payload =
      availabilityType === "weekly"
        ? {
            type: "weekly",
            data: { weekly_hours: Number(weeklyHours) },
          }
        : {
            type: "daily",
            data: { slots: dailySlots },
          };

    try {
      await setAvailability(payload);
      setAvailabilitySuccess("Availability saved.");
    } catch (error) {
      setAvailabilityError(
        error.response?.data?.detail || "Failed to save availability.",
      );
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        p: { xs: 2.5, md: 3 },
        border: "1px solid rgba(226, 232, 240, 0.9)",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                color: "#FFFFFF",
                boxShadow: "0 12px 24px rgba(37, 99, 235, 0.25)",
                flexShrink: 0,
              }}
            >
              <ScheduleRoundedIcon />
            </Stack>
            <Stack spacing={0.25}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0F172A" }}
              >
                Study Availability
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Set your weekly hours or daily schedule to personalize study
                planning.
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<TimerRoundedIcon />}
              label="Weekly hours"
              size="small"
              sx={{
                backgroundColor: "#EFF6FF",
                color: "#1D4ED8",
                border: "1px solid #BFDBFE",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#1D4ED8" },
              }}
            />
            <Chip
              icon={<CalendarMonthRoundedIcon />}
              label="Daily schedule"
              size="small"
              sx={{
                backgroundColor: "#F5F3FF",
                color: "#7C3AED",
                border: "1px solid #DDD6FE",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#7C3AED" },
              }}
            />
            <Chip
              icon={<EventAvailableRoundedIcon />}
              label="Update anytime"
              size="small"
              sx={{
                backgroundColor: "#ECFDF5",
                color: "#047857",
                border: "1px solid #A7F3D0",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#047857" },
              }}
            />
          </Stack>
        </Stack>

        {availabilitySuccess ? (
          <Alert severity="success" sx={{ borderRadius: 3 }}>
            {availabilitySuccess}
          </Alert>
        ) : null}
        {availabilityError ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {availabilityError}
          </Alert>
        ) : null}

        <Card
          variant="outlined"
          sx={{
            p: 1,
            borderRadius: 3,
            borderColor: "#E2E8F0",
            backgroundColor: "#F8FAFC",
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={availabilityType}
            onChange={(_, value) => value && setAvailabilityType(value)}
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1,
              "& .MuiToggleButtonGroup-grouped": {
                border: "1px solid #CBD5E1 !important",
                borderRadius: 3,
                m: 0,
                py: 1.25,
                px: 2,
                textTransform: "none",
                fontWeight: 700,
              },
            }}
          >
            <ToggleButton
              value="weekly"
              sx={{
                backgroundColor:
                  availabilityType === "weekly" ? "#DBEAFE" : "#FFFFFF",
                color: availabilityType === "weekly" ? "#1D4ED8" : "#334155",
                "&.Mui-selected": {
                  backgroundColor: "#DBEAFE",
                  color: "#1D4ED8",
                },
              }}
            >
              Weekly Hours
            </ToggleButton>
            <ToggleButton
              value="daily"
              sx={{
                backgroundColor:
                  availabilityType === "daily" ? "#EDE9FE" : "#FFFFFF",
                color: availabilityType === "daily" ? "#7C3AED" : "#334155",
                "&.Mui-selected": {
                  backgroundColor: "#EDE9FE",
                  color: "#7C3AED",
                },
              }}
            >
              Daily Schedule
            </ToggleButton>
          </ToggleButtonGroup>
        </Card>

        {availabilityType === "weekly" ? (
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              borderColor: "#E2E8F0",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "10px",
                    backgroundColor: "#DBEAFE",
                    color: "#1D4ED8",
                    flexShrink: 0,
                  }}
                >
                  <TimerRoundedIcon fontSize="small" />
                </Stack>
                <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>
                  Weekly target
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Use a simple weekly estimate when you want the planner to spread
                sessions automatically.
              </Typography>
              <TextField
                label="Weekly Hours"
                type="number"
                value={weeklyHours}
                onChange={(event) => setWeeklyHours(event.target.value)}
                inputProps={{ min: 1, step: 1 }}
                sx={{ maxWidth: 320 }}
              />
            </Stack>
          </Card>
        ) : (
          <Card
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              borderColor: "#E2E8F0",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "10px",
                    backgroundColor: "#F5F3FF",
                    color: "#7C3AED",
                    flexShrink: 0,
                  }}
                >
                  <EditCalendarRoundedIcon fontSize="small" />
                </Stack>
                <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>
                  Weekly schedule
                </Typography>
              </Stack>
              <Grid container spacing={1.5}>
                {dailySlots.map((slot, index) => (
                  <Grid key={slot.day} size={{ xs: 12, sm: 6 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        borderColor: "#E2E8F0",
                        backgroundColor: "#F8FAFC",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            sx={{ fontWeight: 800, color: "#0F172A" }}
                          >
                            {slot.day}
                          </Typography>
                          <Chip
                            label="Available"
                            size="small"
                            sx={{
                              backgroundColor: "#ECFDF5",
                              color: "#047857",
                              border: "1px solid #A7F3D0",
                              fontWeight: 700,
                            }}
                          />
                        </Stack>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1.5}
                        >
                          <TextField
                            label="Start"
                            type="time"
                            size="small"
                            fullWidth
                            value={slot.start}
                            onChange={(event) =>
                              updateSlot(index, "start", event.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            label="End"
                            type="time"
                            size="small"
                            fullWidth
                            value={slot.end}
                            onChange={(event) =>
                              updateSlot(index, "end", event.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Card>
        )}

        <Divider />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={onAvailabilitySubmit}
            sx={{
              borderRadius: 999,
              px: 3,
              py: 1.25,
              textTransform: "none",
              fontWeight: 800,
              boxShadow: "0 14px 28px rgba(37, 99, 235, 0.24)",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
            }}
          >
            Save Availability
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
