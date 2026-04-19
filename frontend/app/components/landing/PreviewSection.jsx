"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
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
    <Box sx={{ py: { xs: 8, md: 11 } }}>
      <Container maxWidth="lg">
        <MotionCard
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "26px",
            border: "1px solid rgba(2,132,199,0.18)",
            background:
              "linear-gradient(150deg, rgba(2,132,199,0.12) 0%, rgba(16,185,129,0.1) 55%, rgba(245,158,11,0.1) 100%)",
            boxShadow: "0 18px 36px rgba(15, 23, 42, 0.12)",
          }}
        >
          <Grid container spacing={2.2} alignItems="stretch">
            <Grid size={{ xs: 12, md: 7 }}>
              <Card
                sx={{
                  borderRadius: "18px",
                  p: 2,
                  border: "1px solid rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.88)",
                  boxShadow: "none",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                    fontSize: { xs: "1.6rem", md: "2rem" },
                  }}
                >
                  See your week before it starts
                </Typography>
                <Typography sx={{ mt: 1, color: "#475569" }}>
                  Instant clarity across sessions, hours, and priority subjects.
                  Your roadmap updates as your progress changes.
                </Typography>

                <Stack spacing={1.2} sx={{ mt: 2.2 }}>
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
                                : "rgba(2,132,199,0.14)",
                            color: row.status === "Completed" ? "#047857" : "#0C4A6E",
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
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={1.2} sx={{ height: "100%" }}>
                {[
                  { label: "Planned Hours", value: "24h", hint: "This week" },
                  { label: "Completion", value: "72%", hint: "Current plan" },
                  { label: "Streak", value: "6 days", hint: "Consistency" },
                ].map((item) => (
                  <Card
                    key={item.label}
                    sx={{
                      p: 1.7,
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.5)",
                      background: "rgba(255,255,255,0.88)",
                      boxShadow: "none",
                    }}
                  >
                    <Typography sx={{ color: "#0C4A6E", fontWeight: 700, fontSize: 13 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ color: "#0F172A", fontWeight: 900, fontSize: 27, lineHeight: 1.1 }}>
                      {item.value}
                    </Typography>
                    <Typography sx={{ color: "#64748B", fontSize: 12.5 }}>
                      {item.hint}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </MotionCard>
      </Container>
    </Box>
  );
}
