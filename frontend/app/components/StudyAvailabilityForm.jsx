"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

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
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Study Availability
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Set your weekly hours or daily schedule to personalize study planning.
      </Typography>

      <Card variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          {availabilitySuccess ? (
            <Alert severity="success">{availabilitySuccess}</Alert>
          ) : null}
          {availabilityError ? (
            <Alert severity="error">{availabilityError}</Alert>
          ) : null}

          <ToggleButtonGroup
            color="primary"
            exclusive
            value={availabilityType}
            onChange={(_, value) => value && setAvailabilityType(value)}
          >
            <ToggleButton value="weekly">Weekly Hours</ToggleButton>
            <ToggleButton value="daily">Daily Schedule</ToggleButton>
          </ToggleButtonGroup>

          {availabilityType === "weekly" ? (
            <TextField
              label="Weekly Hours"
              type="number"
              value={weeklyHours}
              onChange={(event) => setWeeklyHours(event.target.value)}
              inputProps={{ min: 1, step: 1 }}
              sx={{ maxWidth: 260 }}
            />
          ) : (
            <Grid container spacing={1.5}>
              {dailySlots.map((slot, index) => (
                <Grid key={slot.day} size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ p: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography sx={{ minWidth: 36 }}>{slot.day}</Typography>
                      <TextField
                        type="time"
                        size="small"
                        value={slot.start}
                        onChange={(event) =>
                          updateSlot(index, "start", event.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        type="time"
                        size="small"
                        value={slot.end}
                        onChange={(event) =>
                          updateSlot(index, "end", event.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box>
            <Button variant="contained" onClick={onAvailabilitySubmit}>
              Save Availability
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}
