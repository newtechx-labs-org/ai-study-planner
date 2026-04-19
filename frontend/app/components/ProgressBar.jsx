"use client";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function ProgressBar({
  value = 0,
  completedHours = 0,
  remainingHours = 0,
}) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Plan completion
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {value}%
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Number.isFinite(value) ? value : 0}
        sx={{ height: 10, borderRadius: 10 }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.25 }}>
        <Typography variant="caption" color="text.secondary">
          Completed: {completedHours}h
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Remaining: {remainingHours}h
        </Typography>
      </Stack>
    </Box>
  );
}
