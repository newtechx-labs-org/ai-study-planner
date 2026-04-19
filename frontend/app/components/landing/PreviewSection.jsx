"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const rows = [
  {
    day: "Monday",
    subject: "Mathematics",
    time: "7:00 PM - 8:30 PM",
    status: "Planned",
  },
  {
    day: "Tuesday",
    subject: "Chemistry",
    time: "6:30 PM - 8:00 PM",
    status: "Completed",
  },
  {
    day: "Thursday",
    subject: "Physics",
    time: "7:30 PM - 9:00 PM",
    status: "Planned",
  },
  {
    day: "Saturday",
    subject: "Biology",
    time: "10:00 AM - 11:30 AM",
    status: "Planned",
  },
];

const MotionCard = motion.create(Card);

export default function PreviewSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <MotionCard
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "24px",
            border: "1px solid rgba(79,70,229,0.14)",
            background:
              "linear-gradient(150deg, rgba(79,70,229,0.08) 0%, rgba(6,182,212,0.08) 60%, rgba(168,85,247,0.08) 100%)",
            boxShadow: "0 18px 36px rgba(15, 23, 42, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}
          >
            Live plan preview
          </Typography>
          <Typography sx={{ mt: 1, color: "#475569" }}>
            A clean, practical schedule you can generate and manage in seconds.
          </Typography>

          <Stack spacing={1.3} sx={{ mt: 2.4 }}>
            {rows.map((row, idx) => (
              <Box key={`${row.day}-${idx}`}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ md: "center" }}
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ py: 1 }}
                >
                  <Stack>
                    <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                      {row.subject}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13, color: "#64748b" }}
                    >{`${row.day} - ${row.time}`}</Typography>
                  </Stack>
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      width: "fit-content",
                      bgcolor:
                        row.status === "Completed"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(79,70,229,0.14)",
                      color: row.status === "Completed" ? "#047857" : "#4338CA",
                      fontWeight: 700,
                    }}
                  />
                </Stack>
                {idx < rows.length - 1 ? (
                  <Divider sx={{ borderColor: "rgba(15,23,42,0.08)" }} />
                ) : null}
              </Box>
            ))}
          </Stack>
        </MotionCard>
      </Container>
    </Box>
  );
}
