"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Typography,
  Card,
  Divider,
  Alert,
  IconButton,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "@/app/components/primitives/CustomButton";
import theme from "@/app/theme/authenticatedTheme";
import {
  getReminder,
  setReminder,
  deleteReminder,
} from "@/services/reminderService";
import { getSubjects } from "@/services/subjectService";

const types = [
  { value: "daily", label: "Daily" },
  { value: "one_day", label: "One day" },
  { value: "weekdays", label: "Weekdays" },
  { value: "custom", label: "Custom days" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ReminderSettings() {
  const [type, setType] = useState("daily");
  const [payload, setPayload] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);

  // temporary inputs
  const [dailyTimeInput, setDailyTimeInput] = useState("");
  const [weekdayTimeInput, setWeekdayTimeInput] = useState("");
  const [customSlotInput, setCustomSlotInput] = useState("");

  useEffect(() => {
    load();
    // load subjects for test-play
    (async () => {
      try {
        const s = await getSubjects();
        setSubjectsList(s || []);
      } catch (e) {}
    })();
  }, []);

  const load = async () => {
    try {
      const res = await getReminder();
      if (res) {
        setType(res.type);
        const data = res.data || {};
        setPayload(data);
        // initialize temporary inputs
        setDailyTimeInput((data.times && data.times[0]) || "");
        setWeekdayTimeInput(data.time || "");
        setCustomSlotInput((data.slots && data.slots[0]) || "");
      }
    } catch (e) {
      // ignore not found
    }
  };

  const onSave = async () => {
    setError("");
    setSuccess("");

    // require at least one subject before saving a reminder
    try {
      const subs = await getSubjects();
      if (!subs || subs.length === 0) {
        setError(
          "Please create at least one subject before setting a reminder.",
        );
        return;
      }
    } catch (e) {
      // if subject fetch fails, allow save to proceed (server-side validation may still apply)
    }

    // auto-add any small input values so users don't have to click + explicitly
    const newPayload = { ...payload };
    if (type === "daily") {
      if (dailyTimeInput) {
        newPayload.times = Array.from(
          new Set([...(newPayload.times || []), dailyTimeInput]),
        );
        setDailyTimeInput("");
      }
      if (!newPayload.times || newPayload.times.length === 0) {
        setError("Please add at least one time for daily reminders");
        return;
      }
    }

    if (type === "one_day") {
      if (!newPayload.at && !payload.at) {
        setError("Please select date & time for one-day reminder");
        return;
      }
    }

    if (type === "weekdays") {
      if (weekdayTimeInput && !newPayload.time) {
        newPayload.time = weekdayTimeInput;
        setWeekdayTimeInput("");
      }
      if (!newPayload.days || newPayload.days.length === 0) {
        setError("Please select at least one weekday");
        return;
      }
      if (!newPayload.time) {
        setError("Please select a time for weekday reminders");
        return;
      }
    }

    if (type === "custom") {
      if (customSlotInput) {
        newPayload.slots = Array.from(
          new Set([...(newPayload.slots || []), customSlotInput]),
        );
        setCustomSlotInput("");
      }
      if (!newPayload.slots || newPayload.slots.length === 0) {
        setError("Please add at least one custom datetime slot");
        return;
      }
    }

    try {
      let data = {};
      if (type === "daily") data = { times: newPayload.times || [] };
      else if (type === "one_day") data = { at: newPayload.at || payload.at };
      else if (type === "weekdays")
        data = {
          days: newPayload.days || payload.days || [],
          time: newPayload.time || payload.time,
        };
      else if (type === "custom") data = { slots: newPayload.slots || [] };

      const body = { type, data };
      await setReminder(body);
      setPayload(newPayload);
      setSuccess("Reminder saved");
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to save reminder");
    }
  };

  const onDelete = async () => {
    setError("");
    setSuccess("");
    try {
      await deleteReminder();
      setType("daily");
      setPayload({});
      setSuccess("Reminder removed");
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to delete reminder");
    }
  };

  // Daily handlers
  const addDailyTime = () => {
    if (!dailyTimeInput) return;
    const times = Array.from(
      new Set([...(payload.times || []), dailyTimeInput]),
    );
    setPayload({ ...payload, times });
    setDailyTimeInput("");
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    // normalize payload to relevant fields only
    if (newType === "daily") {
      setPayload({ times: payload.times || [] });
    } else if (newType === "one_day") {
      setPayload({ at: payload.at || "" });
    } else if (newType === "weekdays") {
      setPayload({ days: payload.days || [], time: payload.time || "" });
    } else if (newType === "custom") {
      setPayload({ slots: payload.slots || [] });
    } else {
      setPayload({});
    }
  };

  const removeDailyTime = (idx) => {
    const times = (payload.times || []).slice();
    times.splice(idx, 1);
    setPayload({ ...payload, times });
  };

  // Weekday handlers
  const toggleWeekday = (day) => {
    const days = new Set(payload.days || []);
    if (days.has(day)) days.delete(day);
    else days.add(day);
    setPayload({ ...payload, days: Array.from(days) });
  };

  const setWeekdayTime = (val) => {
    setPayload({ ...payload, time: val });
    setWeekdayTimeInput(val);
  };

  // Custom slots
  const addCustomSlot = () => {
    if (!customSlotInput) return;
    const slots = Array.from(
      new Set([...(payload.slots || []), customSlotInput]),
    );
    setPayload({ ...payload, slots });
    setCustomSlotInput("");
  };

  const formatTimeHHMM = (hhmm) => {
    // expect hh:mm (24-hour); output like 12:51 AM
    if (!hhmm || typeof hhmm !== "string") return hhmm;
    try {
      const [hh, mm] = hhmm.split(":");
      const d = new Date();
      d.setHours(parseInt(hh, 10) || 0, parseInt(mm, 10) || 0, 0, 0);
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return hhmm;
    }
  };

  const formatDatetimeISO = (iso) => {
    if (!iso) return iso;
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return iso;
    }
  };

  const removeCustomSlot = (idx) => {
    const slots = (payload.slots || []).slice();
    slots.splice(idx, 1);
    setPayload({ ...payload, slots });
  };

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Card
        sx={{
          borderRadius: theme.borderRadius.card,
          border: `1px solid ${theme.colors.neutral[200]}`,
          p: { xs: 3, md: 4 },
          backgroundColor: "#FFFFFF",
          boxShadow: theme.shadows.sm,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Reminder Settings
          </Typography>
          <Divider />

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Stack spacing={2}>
            <TextField
              select
              label="Type"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              {types.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>

            {/* ensure switching types normalizes payload */}

            {/* Daily: multiple time inputs */}
            {type === "daily" && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Times
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    type="time"
                    value={dailyTimeInput}
                    onChange={(e) => setDailyTimeInput(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <IconButton color="primary" onClick={addDailyTime}>
                    <AddIcon />
                  </IconButton>
                </Stack>
                <List>
                  {(payload.times || []).map((t, i) => (
                    <ListItem
                      key={`${t}-${i}`}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeDailyTime(i)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={formatTimeHHMM(t)} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* One-day: single datetime */}
            {type === "one_day" && (
              <TextField
                label="Date & time"
                type="datetime-local"
                value={payload.at || ""}
                onChange={(e) => setPayload({ ...payload, at: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}

            {/* Weekdays: day checkboxes + time */}
            {type === "weekdays" && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Repeat on
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {WEEKDAYS.map((d) => (
                    <FormControlLabel
                      key={d}
                      control={
                        <Checkbox
                          checked={(payload.days || []).includes(d)}
                          onChange={() => toggleWeekday(d)}
                        />
                      }
                      label={d}
                    />
                  ))}
                </Stack>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Time</Typography>
                  <TextField
                    type="time"
                    value={payload.time || weekdayTimeInput || ""}
                    onChange={(e) => setWeekdayTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
            )}

            {/* Custom: add multiple datetime slots */}
            {type === "custom" && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Custom slots
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    type="datetime-local"
                    value={customSlotInput}
                    onChange={(e) => setCustomSlotInput(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <IconButton color="primary" onClick={addCustomSlot}>
                    <AddIcon />
                  </IconButton>
                </Stack>
                <List>
                  {(payload.slots || []).map((s, i) => (
                    <ListItem
                      key={`${s}-${i}`}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeCustomSlot(i)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={formatDatetimeISO(s)} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end" }}
            >
              <CustomButton
                variant="secondary"
                size="medium"
                onClick={onDelete}
              >
                Remove
              </CustomButton>
              <CustomButton
                variant="outlined"
                size="medium"
                onClick={() => {
                  const name =
                    (subjectsList && subjectsList[0] && subjectsList[0].name) ||
                    "Test Alarm";
                  try {
                    window.dispatchEvent(
                      new CustomEvent("alarm:test", {
                        detail: { subjectName: name },
                      }),
                    );
                  } catch (e) {}
                }}
              >
                Play Test Alarm
              </CustomButton>
              <CustomButton variant="primary" size="medium" onClick={onSave}>
                Save Reminder
              </CustomButton>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
