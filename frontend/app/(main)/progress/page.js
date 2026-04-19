"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ProgressBar from "@/app/components/ProgressBar";
import StudyTable from "@/app/components/StudyTable";
import { getPlanDetails, getPlans } from "@/services/planService";
import { getProgress, markComplete } from "@/services/progressService";

export default function ProgressPage() {
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState("");
  const [planDetails, setPlanDetails] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      await markComplete(sessionId, completedHours);
      await loadPlanData(planId);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to mark session complete");
    }
  };

  const sessions = useMemo(() => planDetails?.sessions || [], [planDetails]);

  return (
    <Box sx={{ width: "100%", maxWidth: 1200 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Progress
          </Typography>
          <Typography color="text.secondary">
            Track completion and update study session outcomes.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          select
          label="Plan"
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
        >
          {plans.map((plan) => (
            <MenuItem key={plan.id} value={String(plan.id)}>
              Plan v{plan.version}
            </MenuItem>
          ))}
        </TextField>

        <Card variant="outlined" sx={{ p: 2 }}>
          <ProgressBar
            value={progress?.completion_percentage || 0}
            completedHours={progress?.completed_hours || 0}
            remainingHours={progress?.remaining_hours || 0}
          />
        </Card>

        <StudyTable
          rows={sessions}
          loading={loading}
          onMarkComplete={handleMarkComplete}
        />
      </Stack>
    </Box>
  );
}
