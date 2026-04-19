"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import CustomButton from "@/app/components/primitives/CustomButton";
import theme from "@/app/theme/authenticatedTheme";

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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.card,
          border: `1px solid ${theme.colors.neutral[200]}`,
          boxShadow: theme.shadows.lg,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, pt: 2.5, px: 3 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
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
            <AutoStoriesRoundedIcon fontSize="small" />
          </Box>
          <Stack spacing={0.25}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.colors.neutral[900],
                fontSize: "18px",
              }}
            >
              {initialValues ? "Edit Subject" : "Add Subject"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.colors.neutral[500] }}
            >
              {initialValues
                ? "Update subject details and study hours."
                : "Create a new subject with difficulty and total hours."}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>
      <Divider sx={{ borderColor: theme.colors.neutral[200] }} />
      <DialogContent>
        <Stack
          component="form"
          spacing={2.25}
          sx={{ mt: 1.5 }}
          onSubmit={handleSubmit}
        >
          <TextField
            required
            label="Subject name"
            value={form.name}
            onChange={handleChange("name")}
            inputProps={{ maxLength: 120 }}
            fullWidth
            placeholder="e.g. Mathematics"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: theme.borderRadius.md,
              },
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              label="Difficulty"
              value={form.difficulty}
              onChange={handleChange("difficulty")}
              sx={{
                borderRadius: theme.borderRadius.md,
              }}
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
            InputProps={{
              endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: theme.borderRadius.md,
              },
            }}
          />
          <DialogActions sx={{ px: 0, pt: 0.5 }}>
            <CustomButton variant="tertiary" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={submitting}>
              {initialValues ? "Save" : "Create"}
            </CustomButton>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
