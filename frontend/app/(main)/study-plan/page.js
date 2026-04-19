"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SubjectForm from "@/app/components/SubjectForm";
import StudyTable from "@/app/components/StudyTable";
import { createSubject, getSubjects } from "@/services/subjectService";
import {
  adjustPlan,
  deleteAllPlans,
  deletePlan,
  generatePlan,
  getPlanDetails,
  getPlans,
} from "@/services/planService";

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

  return (
    <Box sx={{ width: "100%", maxWidth: 1200 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Study Plan
          </Typography>
          <Typography color="text.secondary">
            Generate and manage AI-backed study plans.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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
              >
                {subjects.map((subject) => {
                  const value = String(subject.id);
                  return (
                    <MenuItem key={subject.id} value={value}>
                      <Checkbox checked={selectedSubjectIds.includes(value)} />
                      <ListItemText
                        primary={subject.name}
                        secondary={`Difficulty: ${subject.difficulty} | ${subject.total_hours} hours`}
                      />
                    </MenuItem>
                  );
                })}
              </TextField>
              <Button
                variant="outlined"
                onClick={() => setOpenSubjectForm(true)}
                sx={{ minWidth: { md: 160 } }}
              >
                Add Subject
              </Button>
            </Stack>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "center" }}
            >
              <TextField
                fullWidth
                type="datetime-local"
                label="Target end date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                onClick={handleGeneratePlan}
                disabled={loading}
              >
                Generate New Plan
              </Button>
              <Button
                variant="outlined"
                onClick={handleAdjust}
                disabled={loading || !planId}
              >
                Adjust Remaining Plan
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={handleDeletePlan}
                disabled={loading || !planId}
              >
                Delete Selected Plan
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={handleDeleteAllPlans}
                disabled={loading || !plans.length}
              >
                Delete All Plans
              </Button>
            </Stack>
          </Stack>
        </Card>

        <TextField
          select
          label="Select plan"
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
        >
          {plans.map((plan) => (
            <MenuItem key={plan.id} value={String(plan.id)}>
              Plan v{plan.version} -{" "}
              {new Date(plan.created_at).toLocaleDateString()}
            </MenuItem>
          ))}
        </TextField>

        <StudyTable rows={sessions} loading={loading} />
      </Stack>

      <Dialog open={Boolean(confirmType)} onClose={() => setConfirmType(null)}>
        <DialogTitle>
          {confirmType === "single"
            ? "Delete selected plan?"
            : "Delete all plans?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmType === "single"
              ? "This will delete the selected plan and any dependent adjusted versions, including all their sessions."
              : "This will permanently delete all study plans and sessions."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmType(null)} disabled={loading}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <SubjectForm
        open={openSubjectForm}
        onClose={() => setOpenSubjectForm(false)}
        onSubmit={handleSubjectSubmit}
        initialValues={null}
        submitting={subjectSubmitting}
      />
    </Box>
  );
}
