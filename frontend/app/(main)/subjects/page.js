"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Add as AddIcon } from "@mui/icons-material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

import SubjectForm from "@/app/components/SubjectForm";
import GradientCard from "@/app/components/primitives/GradientCard";
import CustomButton from "@/app/components/primitives/CustomButton";
import DataTable from "@/app/components/primitives/DataTable";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/services/subjectService";
import theme from "@/app/theme/authenticatedTheme";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadSubjects = async () => {
    try {
      const payload = await getSubjects();
      setSubjects(payload);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load subjects");
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, payload);
      } else {
        await createSubject(payload);
      }
      setOpenForm(false);
      setEditingSubject(null);
      await loadSubjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save subject");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      await loadSubjects();
      setSubjectToDelete(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete subject");
    }
  };

  const getDifficultyColor = (difficulty) => {
    const normalizedDifficulty = String(difficulty || "")
      .trim()
      .toLowerCase();
    const difficultyMap = {
      easy: theme.colors.success,
      medium: theme.colors.warning,
      hard: theme.colors.error,
    };
    return difficultyMap[normalizedDifficulty] || theme.colors.neutral[500];
  };

  const formatDifficultyLabel = (difficulty) => {
    const normalizedDifficulty = String(difficulty || "")
      .trim()
      .toLowerCase();
    if (!normalizedDifficulty) return "Unknown";
    return (
      normalizedDifficulty.charAt(0).toUpperCase() +
      normalizedDifficulty.slice(1)
    );
  };

  const tableColumns = [
    { id: "name", label: "Subject Name", minWidth: 180 },
    { id: "difficulty", label: "Difficulty", minWidth: 120 },
    { id: "total_hours", label: "Total Hours", minWidth: 100, align: "center" },
    { id: "actions", label: "Actions", minWidth: 100, align: "right" },
  ];

  const subjectCounts = subjects.reduce(
    (accumulator, subject) => {
      const difficulty = String(subject.difficulty || "")
        .trim()
        .toLowerCase();
      if (difficulty === "easy") accumulator.easy += 1;
      if (difficulty === "medium") accumulator.medium += 1;
      if (difficulty === "hard") accumulator.hard += 1;
      accumulator.totalHours += Number(subject.total_hours || 0);
      return accumulator;
    },
    { easy: 0, medium: 0, hard: 0, totalHours: 0 },
  );

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
                icon={<Inventory2RoundedIcon />}
                label="Subject library"
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
                  Organize every subject in one premium workspace
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.82)", maxWidth: 760 }}
                >
                  Add, update, and manage your study subjects with difficulty
                  levels, total hours, and quick actions that stay easy to scan.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<SchoolRoundedIcon />}
                  label={`${subjects.length} subjects total`}
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
                  icon={<AutoGraphRoundedIcon />}
                  label={`${subjectCounts.totalHours} total hours`}
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
                    <MenuBookRoundedIcon />
                  </Box>
                  <Stack spacing={0.2}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.76)" }}
                    >
                      Subject breakdown
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#FFFFFF", fontWeight: 800 }}
                    >
                      {subjects.length} active subjects
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.16)" }} />

                <Stack spacing={1.2}>
                  {[
                    {
                      label: "Easy",
                      value: subjectCounts.easy,
                      color: "#10B981",
                    },
                    {
                      label: "Medium",
                      value: subjectCounts.medium,
                      color: "#F59E0B",
                    },
                    {
                      label: "Hard",
                      value: subjectCounts.hard,
                      color: "#EF4444",
                    },
                  ].map((item) => (
                    <Stack
                      key={item.label}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                          }}
                        />
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.78)" }}>
                          {item.label}
                        </Typography>
                      </Stack>
                      <Typography sx={{ color: "#FFFFFF", fontWeight: 800 }}>
                        {item.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <CustomButton
              variant="primary"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
            >
              Add Subject
            </CustomButton>
          </Stack>
        </Stack>
      </GradientCard>

      {/* Error Alert */}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 12 }}>
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
                      background: `${theme.colors.primary.main}14`,
                      color: theme.colors.primary.main,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <MenuBookRoundedIcon fontSize="small" />
                  </Box>
                  <Stack spacing={0.3}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.colors.neutral[900],
                      }}
                    >
                      Subjects Library
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.neutral[500] }}
                    >
                      Manage your subjects, difficulty levels, and total planned
                      hours.
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`${subjects.length} subjects`}
                    size="small"
                    sx={{
                      background: `${theme.colors.primary.main}14`,
                      color: theme.colors.primary.main,
                      border: `1px solid ${theme.colors.primary.main}30`,
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={`${subjectCounts.totalHours} total hours`}
                    size="small"
                    sx={{
                      background: `${theme.colors.secondary.main}14`,
                      color: theme.colors.secondary.main,
                      border: `1px solid ${theme.colors.secondary.main}30`,
                      fontWeight: 700,
                    }}
                  />
                </Stack>
              </Stack>

              <Divider />

              <DataTable
                columns={tableColumns}
                rows={subjects}
                sx={{
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  boxShadow: "none",
                }}
                renderCell={(columnId, value, row) => {
                  if (columnId === "name") {
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
                  if (columnId === "difficulty") {
                    return (
                      <Chip
                        label={formatDifficultyLabel(value)}
                        size="small"
                        sx={{
                          backgroundColor: getDifficultyColor(value),
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "11px",
                          borderRadius: "999px",
                        }}
                      />
                    );
                  }
                  if (columnId === "total_hours") {
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
                  if (columnId === "actions") {
                    return (
                      <Stack
                        direction="row"
                        spacing={0.75}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingSubject(row);
                            setOpenForm(true);
                          }}
                          sx={{
                            color: theme.colors.primary.main,
                            backgroundColor: `${theme.colors.primary.main}10`,
                            border: `1px solid ${theme.colors.primary.main}26`,
                            "&:hover": {
                              backgroundColor: `${theme.colors.primary.main}18`,
                            },
                          }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setSubjectToDelete(row)}
                          sx={{
                            color: theme.colors.error,
                            backgroundColor: `${theme.colors.error}10`,
                            border: `1px solid ${theme.colors.error}26`,
                            "&:hover": {
                              backgroundColor: `${theme.colors.error}18`,
                            },
                          }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    );
                  }
                  return value;
                }}
                emptyMessage="No subjects added yet. Create your first subject to get started!"
              />
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Subject Form Dialog */}
      <SubjectForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingSubject(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingSubject}
        submitting={submitting}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(subjectToDelete)}
        onClose={() => setSubjectToDelete(null)}
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
          Delete subject?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: theme.colors.neutral[600],
            }}
          >
            This subject may already exist in generated study plans. Deleting it
            will remove it from all affected plans and update progress
            calculations. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <CustomButton
            variant="tertiary"
            onClick={() => setSubjectToDelete(null)}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="danger"
            onClick={() => subjectToDelete && handleDelete(subjectToDelete.id)}
          >
            Delete
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
