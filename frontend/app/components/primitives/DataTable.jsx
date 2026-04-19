"use client";

import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import theme from "@/app/theme/authenticatedTheme";

/**
 * DataTable Component
 * Enhanced table wrapper with premium styling, sorting, and responsive design.
 * Props:
 *  - columns: array of { id, label, align?, minWidth? }
 *  - rows: array of row objects
 *  - loading: boolean for loading state
 *  - emptyMessage: message to show when no rows
 *  - statusMap: object mapping status values to colors/labels
 *  - onRowClick: callback for row clicks
 */
export default function DataTable({
  columns,
  rows,
  loading = false,
  emptyMessage = "No data available",
  statusMap = {},
  onRowClick,
  renderCell,
  sx = {},
  ...props
}) {
  const getStatusColor = (status) => {
    const statusConfig = statusMap[status];
    if (!statusConfig) {
      return theme.colors.neutral[500];
    }
    return statusConfig.color || theme.colors.neutral[500];
  };

  const getStatusLabel = (status) => {
    const statusConfig = statusMap[status];
    if (!statusConfig) {
      return status;
    }
    return statusConfig.label || status;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: theme.borderRadius.card,
        border: `1px solid ${theme.colors.neutral[200]}`,
        boxShadow: theme.shadows.sm,
        overflow: "hidden",
        transition: theme.transitions.normal,
        "&:hover": {
          boxShadow: theme.shadows.md,
        },
        ...sx,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress />
        </Box>
      ) : rows?.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            color: theme.colors.neutral[500],
          }}
        >
          <Typography variant="body2">{emptyMessage}</Typography>
        </Box>
      ) : (
        <Table sx={{ minWidth: 650 }} {...props}>
          {/* Table Head */}
          <TableHead
            sx={{
              backgroundColor: theme.colors.neutral[50],
              borderBottom: `1px solid ${theme.colors.neutral[200]}`,
            }}
          >
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    minWidth: column.minWidth || 100,
                    color: theme.colors.neutral[600],
                    fontWeight: 600,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    padding: "16px 12px",
                    borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  transition: theme.transitions.fast,
                  "&:hover": {
                    backgroundColor: onRowClick
                      ? `${theme.colors.primary.main}06`
                      : "transparent",
                  },
                  borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                  "&:last-child td": {
                    borderBottom: "none",
                  },
                }}
              >
                {columns.map((column) => {
                  const value = row[column.id];

                  // Custom rendering if provided
                  if (renderCell) {
                    const customContent = renderCell(column.id, value, row);
                    if (customContent) {
                      return (
                        <TableCell
                          key={`${rowIndex}-${column.id}`}
                          align={column.align || "left"}
                          sx={{
                            padding: "12px",
                            color: theme.colors.neutral[700],
                            fontSize: "13px",
                          }}
                        >
                          {customContent}
                        </TableCell>
                      );
                    }
                  }

                  // Default rendering
                  let cellContent = value;

                  // Handle status chips
                  if (column.id === "status" && value) {
                    const statusColor = getStatusColor(value);
                    const statusLabel = getStatusLabel(value);
                    cellContent = (
                      <Chip
                        label={statusLabel}
                        size="small"
                        sx={{
                          backgroundColor: statusColor,
                          color: "#FFFFFF",
                          fontWeight: 600,
                          fontSize: "11px",
                        }}
                      />
                    );
                  }

                  // Handle date formatting
                  if (column.id === "date" && value instanceof Date) {
                    cellContent = value.toLocaleDateString();
                  }

                  return (
                    <TableCell
                      key={`${rowIndex}-${column.id}`}
                      align={column.align || "left"}
                      sx={{
                        padding: "12px",
                        color: theme.colors.neutral[700],
                        fontSize: "13px",
                      }}
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
