"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import {
  EmojiEventsRounded as EmojiEventsRoundedIcon,
  CheckCircleRounded as CheckCircleRoundedIcon,
  HourglassBottomRounded as HourglassBottomRoundedIcon,
  TimelineRounded as TimelineRoundedIcon,
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  InsightsRounded as InsightsRoundedIcon,
  RocketLaunchRounded as RocketLaunchRoundedIcon,
  TaskAltRounded as TaskAltRoundedIcon,
  ScheduleRounded as ScheduleRoundedIcon,
} from "@mui/icons-material";

import GradientCard from "@/app/components/primitives/GradientCard";
import CustomButton from "@/app/components/primitives/CustomButton";
import StatsCard from "@/app/components/primitives/StatsCard";
import DataTable from "@/app/components/primitives/DataTable";
import { getPlanDetails, getPlans } from "@/services/planService";
import { getProgress, markComplete } from "@/services/progressService";
import theme from "@/app/theme/authenticatedTheme";

export default function ProgressPage() {
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState("");
  const [planDetails, setPlanDetails] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingSessionId, setSavingSessionId] = useState(null);
  const [hoursBySession, setHoursBySession] = useState({});

  const loadPlanIndex = async () => {
    const payload = await getPlans();
    setPlans(payload);
    if (payload.length) {
      setPlanId(String(payload[0].id));
    }
  };

  const loadPlanData = async (selectedPlanId) => {
    if (!selectedPlanId) return;

    setLoading(true);
    try {
      const [progressPayload, planPayload] = await Promise.all([
        getProgress(selectedPlanId),
        getPlanDetails(selectedPlanId),
      ]);
      setProgress(progressPayload);
      setPlanDetails(planPayload);
      setHoursBySession(
        (planPayload?.sessions || []).reduce((accumulator, session) => {
          accumulator[session.id] = String(
            session.completed_hours ?? session.planned_hours ?? 0,
          );
          return accumulator;
        }, {}),
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadPlanIndex();
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load plans");
      }
    })();
  }, []);

  useEffect(() => {
    if (planId) loadPlanData(planId);
  }, [planId]);

  const handleMarkComplete = async (sessionId, completedHours) => {
    try {
      setSavingSessionId(sessionId);
      await markComplete(sessionId, completedHours);
      await loadPlanData(planId);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to mark session complete");
    } finally {
      setSavingSessionId(null);
    }
  };

  const handleHoursChange = (sessionId, value) => {
    setHoursBySession((current) => ({
      ...current,
      [sessionId]: value,
    }));
  };

  const sessions = useMemo(() => planDetails?.sessions || [], [planDetails]);
  const completionPercentage = progress?.completion_percentage || 0;
  const currentPlan = plans.find((plan) => String(plan.id) === planId);
  const nextSession = sessions.find((session) => !session.completed);

  const tableColumns = [
    { id: "date", label: "Date", minWidth: 120 },
    { id: "subject_name", label: "Subject", minWidth: 150 },
    {
      id: "planned_hours",
      label: "Planned Hours",
      minWidth: 120,
      align: "center",
    },
    {
      id: "completed_hours",
      label: "Hours Done",
      minWidth: 180,
      align: "center",
    },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "actions", label: "Actions", minWidth: 280, align: "right" },
  ];

  return (
    <Stack spacing={4} sx={{ width: "100%" }}>
      <GradientCard
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: theme.borderRadius.xl,
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(37, 99, 235, 0.92) 48%, rgba(168, 85, 247, 0.92) 100%)",
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ md: "stretch" }}
          >
            <Stack spacing={2} sx={{ flex: 1, justifyContent: "center" }}>
              <Chip
                icon={<TaskAltRoundedIcon />}
                label="Progress tracking"
                size="small"
                sx={{
                  width: "fit-content",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "#FFFFFF" },
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
                  Track every study session with clarity
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.82)", maxWidth: 720 }}
                >
                  Review plan progress, update hours completed, and keep your
                  study momentum visible in one focused dashboard.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<CalendarMonthRoundedIcon />}
                  label={`${plans.length} plans available`}
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
                  icon={<ScheduleRoundedIcon />}
                  label={`${sessions.length} sessions in view`}
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
                  icon={<RocketLaunchRoundedIcon />}
                  label={`${completionPercentage}% complete`}
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

            <Card
              sx={{
                width: { xs: "100%", md: 320 },
                borderRadius: theme.borderRadius.card,
                p: 2.5,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(18px)",
                boxShadow: theme.shadows.lg,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: "rgba(255, 255, 255, 0.14)",
                      display: "grid",
                      placeItems: "center",
                      color: "#FFFFFF",
                    }}
                  >
                    <InsightsRoundedIcon />
                  </Box>
                  <Stack spacing={0.2}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.78)" }}
                    >
                      Active plan
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#FFFFFF", fontWeight: 800 }}
                    >
                      {currentPlan
                        ? `Plan v${currentPlan.version}`
                        : "No plan selected"}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.16)" }} />

                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.76)" }}>
                      Completed hours
                    </Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 800 }}>
                      {progress?.completed_hours ?? 0}h
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.76)" }}>
                      Remaining hours
                    </Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 800 }}>
                      {progress?.remaining_hours ?? 0}h
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.76)" }}>
                      Next session
                    </Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 800 }}>
                      {nextSession
                        ? new Date(nextSession.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "None"}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </GradientCard>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Plan Selector */}
      {plans.length > 0 && (
        <Card
          sx={{
            borderRadius: theme.borderRadius.card,
            border: `1px solid ${theme.colors.neutral[200]}`,
            p: 3,
            backgroundColor: "#FFFFFF",
            boxShadow: theme.shadows.sm,
          }}
        >
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: theme.borderRadius.md,
                    background: `${theme.colors.primary.main}14`,
                    color: theme.colors.primary.main,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <InsightsRoundedIcon fontSize="small" />
                </Box>
                <Stack spacing={0.2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: theme.colors.neutral[900],
                    }}
                  >
                    Progress Scope
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.neutral[500] }}
                  >
                    Select the plan you want to track and update.
                  </Typography>
                </Stack>
              </Stack>
              <Chip
                label={`${sessions.length} sessions loaded`}
                size="small"
                sx={{
                  background: `${theme.colors.primary.main}14`,
                  color: theme.colors.primary.main,
                  border: `1px solid ${theme.colors.primary.main}30`,
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Select plan"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                fullWidth
                sx={{
                  maxWidth: { md: 420 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: theme.borderRadius.md,
                  },
                }}
              >
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={String(plan.id)}>
                    Plan v{plan.version} -{" "}
                    {new Date(plan.created_at).toLocaleDateString()}
                  </MenuItem>
                ))}
              </TextField>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                alignItems={{ sm: "center" }}
                sx={{ flex: 1 }}
              >
                <Chip
                  label={`Completion ${completionPercentage}%`}
                  size="small"
                  sx={{
                    background: `${theme.colors.secondary.main}14`,
                    color: theme.colors.secondary.main,
                    border: `1px solid ${theme.colors.secondary.main}30`,
                    fontWeight: 700,
                  }}
                />
                <CustomButton
                  variant="secondary"
                  size="small"
                  onClick={() => loadPlanData(planId)}
                  disabled={!planId || loading}
                >
                  Refresh Data
                </CustomButton>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      )}

      {/* Progress Stats Grid */}
      {progress && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              icon={<EmojiEventsRoundedIcon fontSize="small" />}
              title="Completion"
              value={`${completionPercentage}%`}
              progress={completionPercentage}
              variant="gradient"
              gradient="linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              icon={<CheckCircleRoundedIcon fontSize="small" />}
              title="Completed Hours"
              value={String(progress?.completed_hours ?? 0)}
              subtitle="of total planned hours"
              variant="gradient"
              gradient="linear-gradient(135deg, #0891B2 0%, #2563EB 100%)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              icon={<HourglassBottomRoundedIcon fontSize="small" />}
              title="Remaining Hours"
              value={String(progress?.remaining_hours ?? 0)}
              subtitle="left to complete"
              variant="gradient"
              gradient="linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              icon={<TimelineRoundedIcon fontSize="small" />}
              title="Sessions"
              value={String(sessions.length)}
              subtitle="in this plan"
              variant="gradient"
              gradient="linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)"
            />
          </Grid>
        </Grid>
      )}

      {/* Sessions Table */}
      {planId && (
        <Card
          sx={{
            borderRadius: theme.borderRadius.card,
            border: `1px solid ${theme.colors.neutral[200]}`,
            p: 3,
            backgroundColor: "#FFFFFF",
            boxShadow: theme.shadows.sm,
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: theme.borderRadius.md,
                    background: `${theme.colors.primary.main}14`,
                    color: theme.colors.primary.main,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CalendarMonthRoundedIcon fontSize="small" />
                </Box>
                <Stack spacing={0.3}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: theme.colors.neutral[900],
                    }}
                  >
                    Study Sessions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.colors.neutral[500],
                    }}
                  >
                    All sessions for this plan
                  </Typography>
                </Stack>
              </Stack>
              <Chip
                label={`${sessions.length} sessions`}
                size="small"
                sx={{
                  background: `${theme.colors.primary.main}14`,
                  color: theme.colors.primary.main,
                  border: `1px solid ${theme.colors.primary.main}30`,
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Typography
              variant="body2"
              sx={{ color: theme.colors.neutral[500] }}
            >
              Update hours directly in the table, then save each row to mark it
              complete.
            </Typography>

            <Divider />

            <DataTable
              columns={tableColumns}
              rows={sessions.map((session) => ({
                session_id: session.id,
                completed: Boolean(session.completed),
                date: new Date(session.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }),
                subject_name: session.subject_name,
                planned_hours: session.planned_hours,
                completed_hours: session.completed_hours ?? 0,
                status: session.completed ? "Completed" : "Upcoming",
              }))}
              loading={loading}
              emptyMessage="No sessions in this plan."
              sx={{
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.neutral[200]}`,
                boxShadow: "none",
                overflow: "hidden",
              }}
              statusMap={{
                Completed: { label: "Completed", color: theme.colors.success },
                Upcoming: { label: "Upcoming", color: theme.colors.info },
              }}
              renderCell={(columnId, value, row) => {
                if (columnId === "completed_hours") {
                  const currentHours = Number.parseFloat(
                    hoursBySession[row.session_id] ?? value ?? 0,
                  );
                  const isZeroHours =
                    !Number.isFinite(currentHours) || currentHours === 0;

                  return (
                    <TextField
                      type="number"
                      size="small"
                      value={hoursBySession[row.session_id] ?? value}
                      onChange={(event) =>
                        handleHoursChange(row.session_id, event.target.value)
                      }
                      inputProps={{
                        min: 0,
                        step: 0.5,
                        max: Number.parseFloat(row.planned_hours),
                        style: { textAlign: "center" },
                      }}
                      sx={{
                        width: 110,
                        "& .MuiOutlinedInput-input": {
                          py: 1,
                          color: isZeroHours
                            ? theme.colors.neutral[400]
                            : theme.colors.neutral[800],
                          fontWeight: isZeroHours ? 500 : 700,
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: theme.borderRadius.sm,
                          backgroundColor: isZeroHours
                            ? theme.colors.neutral[50]
                            : "#FFFFFF",
                        },
                      }}
                    />
                  );
                }

                if (columnId === "planned_hours") {
                  return (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.colors.neutral[800],
                      }}
                    >
                      {value}h
                    </Typography>
                  );
                }

                if (columnId === "status") {
                  const isCompleted = row.completed;
                  return (
                    <Chip
                      label={isCompleted ? "Completed" : "Upcoming"}
                      size="small"
                      sx={{
                        backgroundColor: isCompleted
                          ? theme.colors.success
                          : theme.colors.info,
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "11px",
                        borderRadius: "999px",
                      }}
                    />
                  );
                }

                if (columnId === "actions") {
                  const completedHours = Number.parseFloat(
                    hoursBySession[row.session_id] ?? row.completed_hours ?? 0,
                  );
                  const plannedHours = Number.parseFloat(row.planned_hours);
                  const isSaved = row.completed;
                  const buttonColor = isSaved
                    ? theme.colors.success
                    : theme.colors.info;

                  return (
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <CustomButton
                        variant={isSaved ? "secondary" : "primary"}
                        size="small"
                        loading={savingSessionId === row.session_id}
                        sx={{
                          minWidth: 142,
                          ...(isSaved
                            ? {
                                borderColor: `${theme.colors.success}40`,
                                color: theme.colors.success,
                                backgroundColor: `${theme.colors.success}10`,
                                boxShadow: "none",
                                "&:hover": {
                                  backgroundColor: `${theme.colors.success}14`,
                                  borderColor: `${theme.colors.success}60`,
                                  color: theme.colors.success,
                                },
                              }
                            : {
                                background: buttonColor,
                                boxShadow: `0 8px 20px ${buttonColor}33`,
                                "&:hover": {
                                  background: buttonColor,
                                  boxShadow: `0 10px 24px ${buttonColor}40`,
                                },
                              }),
                        }}
                        onClick={() =>
                          handleMarkComplete(
                            row.session_id,
                            Math.min(
                              Number.isFinite(completedHours)
                                ? completedHours
                                : 0,
                              plannedHours,
                            ),
                          )
                        }
                      >
                        {isSaved ? "Update Hours" : "Mark Complete"}
                      </CustomButton>
                    </Stack>
                  );
                }

                return value;
              }}
            />
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
