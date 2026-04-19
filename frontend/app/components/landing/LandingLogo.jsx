"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function LandingLogo({ compact = false, inverse = false }) {
  const textColor = inverse ? "#F8FAFC" : "#0f172a";

  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box
        sx={{
          width: compact ? 34 : 40,
          height: compact ? 34 : 40,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(135deg, #0284C7 0%, #10B981 55%, #F59E0B 100%)",
          boxShadow: "0 10px 25px rgba(2, 132, 199, 0.35)",
        }}
      >
        <AutoAwesomeRoundedIcon
          sx={{ color: "#fff", fontSize: compact ? 18 : 22 }}
        />
      </Box>
      <Typography
        variant={compact ? "subtitle1" : "h6"}
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: textColor,
        }}
      >
        AI Study Planner
      </Typography>
    </Stack>
  );
}
