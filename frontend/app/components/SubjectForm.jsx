"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const defaultForm = {
  name: "",
  difficulty: "medium",
  total_hours: "",
};

export default function SubjectForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  submitting,
}) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        difficulty: initialValues.difficulty || "medium",
        total_hours: String(initialValues.total_hours || ""),
      });
      return;
    }
    setForm(defaultForm);
  }, [initialValues, open]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      name: form.name.trim(),
      difficulty: form.difficulty,
      total_hours: Number(form.total_hours),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialValues ? "Edit Subject" : "Add Subject"}
      </DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          spacing={2}
          sx={{ mt: 1 }}
          onSubmit={handleSubmit}
        >
          <TextField
            required
            label="Subject name"
            value={form.name}
            onChange={handleChange("name")}
            inputProps={{ maxLength: 120 }}
          />
          <FormControl fullWidth>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              label="Difficulty"
              value={form.difficulty}
              onChange={handleChange("difficulty")}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <TextField
            required
            type="number"
            label="Total hours"
            value={form.total_hours}
            onChange={handleChange("total_hours")}
            inputProps={{ min: 1, step: 0.5 }}
          />
          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {initialValues ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
