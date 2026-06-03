"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Grid,
  Stack,
  Typography,
  Card,
  Divider,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  AutoGraph as AutoGraphIcon,
  TrackChangesRounded as TrackChangesRoundedIcon,
  MenuBookRounded as MenuBookRoundedIcon,
  TimelapseRounded as TimelapseRoundedIcon,
  EmojiEventsRounded as EmojiEventsRoundedIcon,
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  RocketLaunchRounded as RocketLaunchRoundedIcon,
  TodayRounded as TodayRoundedIcon,
  EventAvailableRounded as EventAvailableRoundedIcon,
} from "@mui/icons-material";

import GradientCard from "@/app/components/primitives/GradientCard";
import StatsCard from "@/app/components/primitives/StatsCard";
import CustomButton from "@/app/components/primitives/CustomButton";
import DataTable from "@/app/components/primitives/DataTable";
import SubjectForm from "@/app/components/SubjectForm";
import { createSubject, getSubjects } from "@/services/subjectService";
import { generatePlan, getPlanDetails, getPlans } from "@/services/planService";
import { getProgress } from "@/services/progressService";
import { getNextReminder } from "@/services/reminderService";
import theme from "@/app/theme/authenticatedTheme";

function in30DaysIso() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatFullDatetime(d) {
  if (!d) return "";
  const hours = d.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}, ${pad2(
    h12,
  )}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())} ${ampm}`;
}

function formatFriendlyTime(d) {
  if (!d) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [subjects, setSubjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [nextReminder, setNextReminder] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [subjectsPayload, plansPayload] = await Promise.all([
        getSubjects(),
        getPlans(),
      ]);
      setSubjects(subjectsPayload);
      setPlans(plansPayload);

      if (plansPayload.length) {
        const latestPlan = plansPayload[0];
        const [planDetails, progressPayload] = await Promise.all([
          getPlanDetails(latestPlan.id),
          getProgress(latestPlan.id),
        ]);
        setCurrentPlan(planDetails);
        setProgress(progressPayload);
      } else {
        setCurrentPlan(null);
        setProgress(null);
      }

      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadDashboardData();
    fetchNextReminder();
  }, []);

  const fetchNextReminder = async () => {
    try {
      const res = await getNextReminder();
      if (res && res.reminder) {
        const computeNextLocal = (rem) => {
          if (!rem) return null;
          const now = new Date();
          const type = rem.type;
          const data = rem.data || {};
          if (type === "daily") {
            const times = data.times || [];
            const candidates = times
              .map((t) => {
                const [hh, mm] = (t || "").split(":");
                if (hh == null) return null;
                const c = new Date(now);
                c.setHours(parseInt(hh, 10) || 0, parseInt(mm, 10) || 0, 0, 0);
                if (c <= now) c.setDate(c.getDate() + 1);
                return c;
              })
              .filter(Boolean);
            if (!candidates.length) return null;
            return candidates.reduce((a, b) => (a < b ? a : b));
          }

          if (type === "one_day") {
            const at = data.at;
            if (!at) return null;
            const d = new Date(at);
            return d > now ? d : null;
          }

          if (type === "weekdays") {
            const days = data.days || [];
            const tstr = data.time;
            if (!days || !tstr) return null;
            const tt = tstr.split(":");
            const hh = parseInt(tt[0], 10) || 0;
            const mm = parseInt(tt[1], 10) || 0;
            for (let offset = 0; offset < 14; offset++) {
              const cand = new Date(now);
              cand.setDate(now.getDate() + offset);
              if (
                days.includes(
                  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                    cand.getDay()
                  ],
                )
              ) {
                cand.setHours(hh, mm, 0, 0);
                if (cand > now) return cand;
              }
            }
            return null;
          }

          if (type === "custom") {
            const slots = data.slots || [];
            const future = slots
              .map((s) => new Date(s))
              .filter((d) => d instanceof Date && !isNaN(d) && d > new Date());
            if (!future.length) return null;
            return future.reduce((a, b) => (a < b ? a : b));
          }

          return null;
        };

        const dtLocal = computeNextLocal(res.reminder);
        const dt = dtLocal
          ? dtLocal
          : res.next_run
            ? new Date(res.next_run)
            : null;
        if (dt) {
          setNextReminder({ ...res, next_run: dt });
          const secs = Math.max(
            0,
            Math.floor((dt.getTime() - Date.now()) / 1000),
          );
          setCountdown(secs);
        } else {
          setNextReminder(null);
          setCountdown(null);
        }
      } else {
        setNextReminder(null);
        setCountdown(null);
      }
    } catch (e) {
      setNextReminder(null);
      setCountdown(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNextReminder();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown == null) return;
    const id = setInterval(() => {
      setCountdown((c) => (c == null ? c : Math.max(0, c - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleCreateSubject = async (payload) => {
    try {
      await createSubject(payload);
      setOpenSubjectDialog(false);
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create subject");
    }
  };

  const handleGeneratePlan = async () => {
    try {
      await generatePlan({ target_end_date: in30DaysIso() });
      await loadDashboardData();
      router.push("/study-plan");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate plan");
    }
  };

  const totalHours = useMemo(
    () =>
      subjects.reduce(
        (acc, subject) => acc + Number(subject.total_hours || 0),
        0,
      ),
    [subjects],
  );

  const upcomingSessions = useMemo(() => {
    const rows = currentPlan?.sessions || [];
    const now = new Date();
    return rows
      .filter((row) => new Date(row.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6);
  }, [currentPlan]);

  const completionPercentage = progress?.completion_percentage || 0;

  const nextSession = upcomingSessions[0];

  const tableColumns = [
    { id: "date", label: "Date", minWidth: 120 },
    { id: "subject_name", label: "Subject", minWidth: 150 },
    {
      id: "planned_hours",
      label: "Planned Hours",
      minWidth: 120,
      align: "center",
    },
    { id: "status", label: "Status", minWidth: 100 },
  ];

  return (
    <Stack spacing={4} sx={{ width: "100%" }}>
      {/* Error Alert */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Hero Welcome Section */}
      <GradientCard
        title={`Welcome back, ${user?.first_name || user?.username || "Learner"}`}
        subtitle="Your dashboard is ready. Review progress, launch a plan, and keep your momentum going."
        icon={<TrackChangesRoundedIcon fontSize="medium" />}
        action={
          <Chip
            label="Live Dashboard"
            size="small"
            sx={{
              background: "rgba(255, 255, 255, 0.14)",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              fontWeight: 700,
            }}
          />
        }
        sx={{
          background: theme.colors.gradient,
          p: { xs: 3, md: 4 },
        }}
      >
        <Stack spacing={2.25} sx={{ mt: 2.5 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={
                <MenuBookRoundedIcon
                  sx={{ fontSize: "16px !important", color: "#FFFFFF" }}
                />
              }
              label={`${subjects.length} subjects`}
              size="small"
              sx={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                fontWeight: 700,
                "& .MuiChip-icon": {
                  color: "#FFFFFF",
                },
              }}
            />
            <Chip
              icon={
                <TodayRoundedIcon
                  sx={{ fontSize: "16px !important", color: "#FFFFFF" }}
                />
              }
              label={`${plans.length} plans`}
              size="small"
              sx={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                fontWeight: 700,
                "& .MuiChip-icon": {
                  color: "#FFFFFF",
                },
              }}
            />
            <Chip
              icon={
                <EventAvailableRoundedIcon
                  sx={{ fontSize: "16px !important", color: "#FFFFFF" }}
                />
              }
              label={`${completionPercentage}% complete`}
              size="small"
              sx={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                fontWeight: 700,
                "& .MuiChip-icon": {
                  color: "#FFFFFF",
                },
              }}
            />
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "stretch" }}
          >
            <Card
              sx={{
                flex: 1,
                borderRadius: theme.borderRadius.xl,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "none",
                p: 2.25,
                backdropFilter: "blur(12px)",
              }}
            >
              <Stack spacing={1.75}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: "rgba(255, 255, 255, 0.16)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <RocketLaunchRoundedIcon sx={{ color: "#FFFFFF" }} />
                  </Box>
                  <Stack spacing={0.2}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.78)" }}
                    >
                      Today&apos;s focus
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "18px",
                      }}
                    >
                      Stay on track with your active plan
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.16)" }} />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.25}
                  sx={{ width: "100%" }}
                >
                  <CustomButton
                    variant="secondary"
                    size="medium"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSubjectDialog(true)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      color: "#FFFFFF",
                      borderColor: "rgba(255, 255, 255, 0.22)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.18)",
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    Add Subject
                  </CustomButton>
                  <CustomButton
                    variant="primary"
                    size="medium"
                    startIcon={<AutoGraphIcon />}
                    onClick={handleGeneratePlan}
                    sx={{
                      background: "#FFFFFF",
                      color: theme.colors.primary.main,
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.92)",
                        color: theme.colors.primary.main,
                      },
                    }}
                  >
                    Generate Plan
                  </CustomButton>
                </Stack>
              </Stack>
            </Card>

            <Card
              sx={{
                width: { xs: "100%", md: 320 },
                borderRadius: theme.borderRadius.xl,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "none",
                p: 2.25,
                backdropFilter: "blur(12px)",
              }}
            >
              <Stack spacing={1.75}>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.82)", fontWeight: 600 }}
                >
                  Next session
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "19px",
                    lineHeight: 1.2,
                  }}
                >
                  {nextSession
                    ? nextSession.subject_name
                    : "No session scheduled"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.78)" }}
                >
                  {nextSession
                    ? new Date(nextSession.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })
                    : "Generate a plan to see upcoming sessions here."}
                </Typography>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.16)" }} />
                <Box>
                  {nextReminder && nextReminder.next_run ? (
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.78)" }}
                      >
                        Next alarm: {formatFullDatetime(nextReminder.next_run)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.78)" }}
                      >
                        {countdown != null
                          ? `${Math.floor(countdown / 3600)}h ${Math.floor(
                              (countdown % 3600) / 60,
                            )}m ${countdown % 60}s`
                          : "—"}
                      </Typography>
                    </Stack>
                  ) : (
                    <a href="/settings/reminder" style={{ color: "#fff" }}>
                      <Typography variant="body2">
                        No reminder set — set one now
                      </Typography>
                    </a>
                  )}
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`${totalHours} hrs total`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={`${upcomingSessions.length} upcoming`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      fontWeight: 700,
                    }}
                  />
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </GradientCard>

      {/* KPI Stats Grid */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            icon={<MenuBookRoundedIcon fontSize="small" />}
            title="Total Subjects"
            value={subjects.length}
            subtitle="Active subjects in your plan"
            variant="gradient"
            gradient="linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            icon={<TimelapseRoundedIcon fontSize="small" />}
            title="Total Study Hours"
            value={totalHours}
            subtitle="Estimated workload"
            trend={totalHours > 0 ? "+12%" : "0%"}
            trendPositive={true}
            variant="gradient"
            gradient="linear-gradient(135deg, #0891B2 0%, #2563EB 100%)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatsCard
            icon={<EmojiEventsRoundedIcon fontSize="small" />}
            title="Completion"
            value={`${completionPercentage}%`}
            subtitle="Latest plan progress"
            progress={completionPercentage}
            variant="gradient"
            gradient="linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)"
          />
        </Grid>
      </Grid>

      {/* Quick Actions Section */}
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
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.colors.neutral[900],
            }}
          >
            Quick Actions
          </Typography>
          <Divider />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <CustomButton
              variant="primary"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => setOpenSubjectDialog(true)}
            >
              Add Subject
            </CustomButton>
            <CustomButton
              variant="secondary"
              size="medium"
              startIcon={<AutoGraphIcon />}
              onClick={handleGeneratePlan}
            >
              Generate Plan
            </CustomButton>
          </Stack>
        </Stack>
      </Card>

      {/* Upcoming Sessions Section */}
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
                    fontWeight: 700,
                    color: theme.colors.neutral[900],
                  }}
                >
                  Upcoming Study Sessions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.neutral[500],
                  }}
                >
                  Your next {upcomingSessions.length} scheduled study sessions
                </Typography>
              </Stack>
            </Stack>
            <Chip
              label={`${upcomingSessions.length} sessions`}
              size="small"
              sx={{
                background: `${theme.colors.primary.main}14`,
                color: theme.colors.primary.main,
                border: `1px solid ${theme.colors.primary.main}30`,
                fontWeight: 700,
              }}
            />
          </Stack>

          <Divider />

          <DataTable
            columns={tableColumns}
            rows={upcomingSessions.map((session) => ({
              date: new Date(session.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              subject_name: session.subject_name,
              planned_hours: `${session.planned_hours}h`,
              status: session.status === "Completed" ? "Completed" : "Upcoming",
            }))}
            emptyMessage="No upcoming study sessions. Create a plan to get started!"
            sx={{
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.neutral[200]}`,
              boxShadow: "none",
            }}
            renderCell={(columnId, value) => {
              if (columnId === "planned_hours") {
                return (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: theme.colors.neutral[800],
                    }}
                  >
                    {value}
                  </Typography>
                );
              }

              if (columnId === "status") {
                const isCompleted = value === "Completed";
                return (
                  <Chip
                    label={value}
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

              return value;
            }}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
