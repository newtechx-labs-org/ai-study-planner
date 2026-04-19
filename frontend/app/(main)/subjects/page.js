"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import SubjectForm from "@/app/components/SubjectForm";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/services/subjectService";
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

  return (
    <Box sx={{ width: "100%", maxWidth: 1200 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Subject Management
          </Typography>
          <Typography color="text.secondary">
            Add, update, and manage your study subjects.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Add Subject
        </Button>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {subject.difficulty}
                </TableCell>
                <TableCell>{subject.total_hours}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setEditingSubject(subject);
                      setOpenForm(true);
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    aria-label="delete"
                    onClick={() => setSubjectToDelete(subject)}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!subjects.length ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No subjects added yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

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

      <Dialog
        open={Boolean(subjectToDelete)}
        onClose={() => setSubjectToDelete(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete subject?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This subject may already exist in generated study plans. Deleting it
            will remove it from all affected plans and update progress
            calculations. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubjectToDelete(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => subjectToDelete && handleDelete(subjectToDelete.id)}
          >
            Delete subject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
