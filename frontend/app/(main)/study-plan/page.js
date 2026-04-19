"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  AutoGraph as AutoGraphIcon,
  CalendarMonthRounded as CalendarMonthRoundedIcon,
  Delete as DeleteIcon,
  EventAvailableRounded as EventAvailableRoundedIcon,
  EventRepeatRounded as EventRepeatRoundedIcon,
  InsightsRounded as InsightsRoundedIcon,
  MenuBookRounded as MenuBookRoundedIcon,
  Refresh as RefreshIcon,
  RocketLaunchRounded as RocketLaunchRoundedIcon,
  TaskAltRounded as TaskAltRoundedIcon,
  TuneRounded as TuneRoundedIcon,
} from "@mui/icons-material";

import SubjectForm from "@/app/components/SubjectForm";
import GradientCard from "@/app/components/primitives/GradientCard";
import CustomButton from "@/app/components/primitives/CustomButton";
import DataTable from "@/app/components/primitives/DataTable";
import { createSubject, getSubjects } from "@/services/subjectService";
import {
  adjustPlan,
  deleteAllPlans,
  deletePlan,
  generatePlan,
  getPlanDetails,
  getPlans,
} from "@/services/planService";
import theme from "@/app/theme/authenticatedTheme";

function defaultTargetDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 16);
}

export default function StudyPlanPage() {
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const subjectsInitializedRef = useRef(false);
  const [planId, setPlanId] = useState("");
  const [planDetails, setPlanDetails] = useState(null);
  const [openSubjectForm, setOpenSubjectForm] = useState(false);
  const [subjectSubmitting, setSubjectSubmitting] = useState(false);
  const [targetDate, setTargetDate] = useState(defaultTargetDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmType, setConfirmType] = useState(null);

  const loadPlans = useCallback(async () => {
    try {
      const payload = await getPlans();
      setPlans(payload);
      if (payload.length) {
        setPlanId(String(payload[0].id));
      } else {
        setPlanId("");
        setPlanDetails(null);
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load plans");
    }
  }, []);

  const loadPlanDetails = useCallback(async (selectedPlanId) => {
    if (!selectedPlanId) {
      setPlanDetails(null);
      return;
    }

    setLoading(true);
    try {
      const payload = await getPlanDetails(selectedPlanId);
      setPlanDetails(payload);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load plan details");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubjects = useCallback(async () => {
    try {
      const payload = await getSubjects();
      const validIds = new Set(payload.map((item) => String(item.id)));
      setSubjects(payload);
      setSelectedSubjectIds((prev) => {
        if (!subjectsInitializedRef.current) {
          return payload.map((item) => String(item.id));
        }
        return prev.filter((item) => validIds.has(item));
      });
      subjectsInitializedRef.current = true;
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load subjects");
    }
  }, []);

  useEffect(() => {
    loadPlans();
    loadSubjects();
  }, [loadPlans, loadSubjects]);

  useEffect(() => {
    if (planId) loadPlanDetails(planId);
  }, [planId, loadPlanDetails]);

  const handleGeneratePlan = async () => {
    if (!selectedSubjectIds.length) {
      setError("Select at least one subject to generate a plan");
      return;
    }

    setLoading(true);
    try {
      await generatePlan({
        target_end_date: new Date(targetDate).toISOString(),
        subject_ids: selectedSubjectIds.map(Number),
      });
      await loadPlans();
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!planId) return;
    setLoading(true);
    try {
      await adjustPlan(planId);
      await loadPlans();
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to adjust plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!planId) return;
    setConfirmType("single");
  };

  const handleDeleteAllPlans = async () => {
    setConfirmType("all");
  };

  const handleConfirmDelete = async () => {
    if (!confirmType) return;

    setLoading(true);
    try {
      if (confirmType === "single") {
        await deletePlan(planId);
        await loadPlans();
      } else {
        await deleteAllPlans();
        setPlans([]);
        setPlanId("");
        setPlanDetails(null);
      }
      setError("");
    } catch (err) {
      if (confirmType === "single") {
        setError(
          err.response?.data?.detail || "Failed to delete selected plan",
        );
      } else {
        setError(err.response?.data?.detail || "Failed to delete all plans");
      }
    } finally {
      setConfirmType(null);
      setLoading(false);
    }
  };

  const sessions = useMemo(() => planDetails?.sessions || [], [planDetails]);
  const currentPlan = plans.find((item) => String(item.id) === planId);
  const nextSession = sessions.find(
    (session) => session.status !== "Completed",
  );

  const handleSubjectSubmit = async (payload) => {
    setSubjectSubmitting(true);
    try {
      const created = await createSubject(payload);
      await loadSubjects();
      setSelectedSubjectIds((prev) =>
        Array.from(new Set([...prev, String(created.id)])),
      );
      setOpenSubjectForm(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create subject");
    } finally {
      setSubjectSubmitting(false);
    }
  };

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
                icon={<RocketLaunchRoundedIcon />}
                label="Study plan studio"
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
                  Build a plan that feels doable every day
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.82)", maxWidth: 760 }}
                >
                  Select your subjects, set a target date, and generate a
                  focused study schedule you can refine, adjust, and track over
                  time.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<MenuBookRoundedIcon />}
                  label={`${subjects.length} subjects ready`}
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
                  icon={<TuneRoundedIcon />}
                  label={`${selectedSubjectIds.length} selected`}
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
                  label={`${plans.length} plans tracked`}
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
                width: { xs: "100%", md: 340 },
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
                    <AutoGraphIcon />
                  </Box>
                  <Stack spacing={0.2}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.76)" }}
                    >
                      Active plan
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#FFFFFF", fontWeight: 800 }}
                    >
                      {currentPlan
                        ? `Plan v${currentPlan.version}`
                        : "No plan yet"}
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
                      Upcoming sessions
                    </Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 800 }}>
                      {
                        sessions.filter(
                          (session) => session.status !== "Completed",
                        ).length
                      }
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.76)" }}>
                      Target date
                    </Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 800 }}>
                      {targetDate
                        ? new Date(targetDate).toLocaleDateString()
                        : "Unset"}
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

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: theme.borderRadius.card,
              border: `1px solid ${theme.colors.neutral[200]}`,
              p: 3,
              backgroundColor: "#FFFFFF",
              boxShadow: theme.shadows.sm,
            }}
          >
            <Stack spacing={3}>
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
                    <AutoGraphIcon fontSize="small" />
                  </Box>
                  <Stack spacing={0.3}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.colors.neutral[900],
                      }}
                    >
                      Generate New Plan
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.neutral[500] }}
                    >
                      Pick subjects and a target date to build the next version.
                    </Typography>
                  </Stack>
                </Stack>
                <Chip
                  label={`${selectedSubjectIds.length} selected`}
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

              <Stack spacing={2.5}>
                <TextField
                  select
                  fullWidth
                  label="Subjects for plan"
                  value={selectedSubjectIds}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedSubjectIds(
                      typeof value === "string" ? value.split(",") : value,
                    );
                  }}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => {
                      const names = subjects
                        .filter((item) => selected.includes(String(item.id)))
                        .map((item) => item.name);
                      return names.length
                        ? names.join(", ")
                        : "No subjects selected";
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: theme.borderRadius.md,
                    },
                  }}
                >
                  {subjects.map((subject) => {
                    const value = String(subject.id);
                    return (
                      <MenuItem key={subject.id} value={value}>
                        <Checkbox
                          checked={selectedSubjectIds.includes(value)}
                        />
                        <ListItemText
                          primary={subject.name}
                          secondary={`Difficulty: ${subject.difficulty} | ${subject.total_hours}h`}
                        />
                      </MenuItem>
                    );
                  })}
                </TextField>

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ md: "flex-end" }}
                >
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Target end date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: theme.borderRadius.md,
                      },
                    }}
                  />
                  <CustomButton
                    variant="primary"
                    size="medium"
                    startIcon={<AutoGraphIcon />}
                    onClick={handleGeneratePlan}
                    loading={loading}
                  >
                    Generate Plan
                  </CustomButton>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    icon={<MenuBookRoundedIcon />}
                    label="Subjects sync into the generator"
                    size="small"
                    sx={{
                      backgroundColor: theme.colors.neutral[50],
                      color: theme.colors.neutral[700],
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    icon={<TaskAltRoundedIcon />}
                    label="Adjusting keeps the current plan structure"
                    size="small"
                    sx={{
                      backgroundColor: theme.colors.neutral[50],
                      color: theme.colors.neutral[700],
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      fontWeight: 700,
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            sx={{
              height: "100%",
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
                      width: 38,
                      height: 38,
                      borderRadius: theme.borderRadius.md,
                      background: `${theme.colors.secondary.main}14`,
                      color: theme.colors.secondary.main,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <EventRepeatRoundedIcon fontSize="small" />
                  </Box>
                  <Stack spacing={0.3}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.colors.neutral[900],
                      }}
                    >
                      Manage Plans
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.neutral[500] }}
                    >
                      Adjust, delete, or clear all generated plans.
                    </Typography>
                  </Stack>
                </Stack>
                <Chip
                  label={`${plans.length} available`}
                  size="small"
                  sx={{
                    background: `${theme.colors.secondary.main}14`,
                    color: theme.colors.secondary.main,
                    border: `1px solid ${theme.colors.secondary.main}30`,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <TextField
                  select
                  fullWidth
                  label="Select plan"
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  sx={{
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

                <Stack spacing={1.25}>
                  <CustomButton
                    variant="secondary"
                    size="medium"
                    startIcon={<RefreshIcon />}
                    onClick={handleAdjust}
                    disabled={!planId || loading}
                  >
                    Adjust Remaining Plan
                  </CustomButton>
                  <CustomButton
                    variant="danger"
                    size="medium"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeletePlan}
                    disabled={!planId || loading}
                  >
                    Delete Selected Plan
                  </CustomButton>
                  <CustomButton
                    variant="danger"
                    size="medium"
                    onClick={handleDeleteAllPlans}
                    disabled={loading || !plans.length}
                  >
                    Delete All Plans
                  </CustomButton>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>

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
          <Stack spacing={2.25}>
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
                    background: `${theme.colors.accent.main}14`,
                    color: theme.colors.accent.main,
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
                    Planned Sessions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.neutral[500] }}
                  >
                    Review the study schedule for the selected plan.
                  </Typography>
                </Stack>
              </Stack>
              <Chip
                icon={
                  <TaskAltRoundedIcon sx={{ fontSize: "16px !important" }} />
                }
                label={`${sessions.length} sessions`}
                size="small"
                sx={{
                  background: `${theme.colors.accent.main}14`,
                  color: theme.colors.accent.main,
                  border: `1px solid ${theme.colors.accent.main}30`,
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Typography
              variant="body2"
              sx={{ color: theme.colors.neutral[500] }}
            >
              Update the plan first if you need a different focus. Then review
              the sessions below and use the progress page to mark completed
              hours.
            </Typography>

            <Divider />

            <DataTable
              columns={tableColumns}
              rows={sessions.map((session) => ({
                date: new Date(session.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }),
                subject_name: session.subject_name,
                planned_hours: `${session.planned_hours}h`,
                status:
                  session.status === "Completed" ? "Completed" : "Upcoming",
              }))}
              loading={loading}
              emptyMessage="No sessions in this plan yet."
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
              renderCell={(columnId, value) => {
                if (columnId === "subject_name") {
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
      )}

      <Dialog
        open={Boolean(confirmType)}
        onClose={() => setConfirmType(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: theme.borderRadius.card,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: theme.colors.neutral[900],
          }}
        >
          {confirmType === "single"
            ? "Delete selected plan?"
            : "Delete all plans?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: theme.colors.neutral[600],
            }}
          >
            {confirmType === "single"
              ? "This will delete the selected plan and any dependent adjusted versions, including all their sessions."
              : "This will permanently delete all study plans and sessions."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <CustomButton
            variant="tertiary"
            onClick={() => setConfirmType(null)}
            disabled={loading}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="danger"
            onClick={handleConfirmDelete}
            loading={loading}
          >
            Delete
          </CustomButton>
        </DialogActions>
      </Dialog>

      <SubjectForm
        open={openSubjectForm}
        onClose={() => setOpenSubjectForm(false)}
        onSubmit={handleSubjectSubmit}
        initialValues={null}
        submitting={subjectSubmitting}
      />
    </Stack>
  );
}
