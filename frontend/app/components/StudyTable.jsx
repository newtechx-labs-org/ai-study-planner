"use client";

import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

function normalizeDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export default function StudyTable({
  rows = [],
  onMarkComplete,
  loading = false,
}) {
  const [hoursMap, setHoursMap] = useState({});

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [rows],
  );

  if (loading) {
    return <Typography color="text.secondary">Loading sessions...</Typography>;
  }

  if (!rows.length) {
    return (
      <Typography color="text.secondary">No study sessions found.</Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Planned Hours</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => {
            const value =
              hoursMap[row.id] ?? row.completed_hours ?? row.planned_hours;
            return (
              <TableRow key={row.id || `${row.subject_id}-${row.date}`}>
                <TableCell>{normalizeDate(row.date)}</TableCell>
                <TableCell>{row.subject_name}</TableCell>
                <TableCell>{row.planned_hours}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={row.completed ? "success" : "default"}
                    label={row.completed ? "Completed" : "Pending"}
                  />
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 240 }}>
                  {onMarkComplete && row.id ? (
                    <>
                      <TextField
                        size="small"
                        type="number"
                        value={value}
                        onChange={(event) =>
                          setHoursMap((prev) => ({
                            ...prev,
                            [row.id]: event.target.value,
                          }))
                        }
                        inputProps={{
                          min: 0,
                          max: row.planned_hours,
                          step: 0.5,
                        }}
                        sx={{ width: 110, mr: 1 }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onMarkComplete(row.id, Number(value))}
                      >
                        Mark Complete
                      </Button>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
