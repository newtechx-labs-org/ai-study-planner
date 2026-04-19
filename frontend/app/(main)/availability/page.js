"use client";

import { Container, Typography } from "@mui/material";

import StudyAvailabilityForm from "@/app/components/StudyAvailabilityForm";

export default function AvailabilityPage() {
  return (
    <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Study Availability
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Update the time you have available for study planning.
      </Typography>
      <StudyAvailabilityForm />
    </Container>
  );
}
