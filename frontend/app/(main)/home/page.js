"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import SummaryCard from "@/app/components/SummaryCard";
import SubjectForm from "@/app/components/SubjectForm";
import StudyTable from "@/app/components/StudyTable";
import { createSubject, getSubjects } from "@/services/subjectService";
import { generatePlan, getPlanDetails, getPlans } from "@/services/planService";
import { getProgress } from "@/services/progressService";

function in30DaysIso() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [subjects, setSubjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
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
  }, []);

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

  return (
    <Box sx={{ width: "100%", maxWidth: 1200 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Welcome back, {user?.first_name || user?.username || "Learner"}
          </Typography>
          <Typography color="text.secondary">
            Here is your study momentum for today.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard title="Total Subjects" value={subjects.length} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard
              title="Total Study Hours"
              value={totalHours}
              subtitle="Estimated workload"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard
              title="Completed %"
              value={`${progress?.completion_percentage || 0}%`}
              subtitle="Latest plan completion"
            />
          </Grid>
        </Grid>

        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              onClick={() => setOpenSubjectDialog(true)}
            >
              Add Subject
            </Button>
            <Button variant="outlined" onClick={handleGeneratePlan}>
              Generate Plan
            </Button>
          </Stack>
        </Card>

        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Upcoming Study Sessions
          </Typography>
          <StudyTable rows={upcomingSessions} />
        </Card>
      </Stack>

      <SubjectForm
        open={openSubjectDialog}
        onClose={() => setOpenSubjectDialog(false)}
        onSubmit={handleCreateSubject}
      />
    </Box>
  );
}
