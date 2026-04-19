"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  Divider,
  Stack,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { getMe } from "@/services/userService";
import theme from "@/app/theme/authenticatedTheme";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMe();
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load profile");
      }
    })();
  }, []);

  return (
    <Stack spacing={4} sx={{ width: "100%" }}>
      {/* Header */}
      <Stack spacing={0.5}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.colors.neutral[900],
          }}
        >
          User Profile
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.neutral[500],
          }}
        >
          View your account information and status
        </Typography>
      </Stack>

      {/* Error Alert */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Profile Card */}
      {profile && (
        <Grid container spacing={3}>
          {/* Main Profile Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                borderRadius: theme.borderRadius.card,
                border: `1px solid ${theme.colors.neutral[200]}`,
                backgroundColor: "#FFFFFF",
                p: 4,
              }}
            >
              <Stack spacing={3}>
                {/* Avatar and Basic Info */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: theme.colors.gradient,
                      fontSize: "32px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                    }}
                  >
                    {(
                      profile.first_name?.[0] ||
                      profile.username?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </Avatar>
                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: theme.colors.neutral[900],
                      }}
                    >
                      {[profile.first_name, profile.last_name]
                        .filter(Boolean)
                        .join(" ") || profile.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.neutral[500],
                      }}
                    >
                      {profile.email}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider />

                {/* Details Grid */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.neutral[500],
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Username
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.colors.neutral[900],
                          fontWeight: 500,
                        }}
                      >
                        {profile.username}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.neutral[500],
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.colors.neutral[900],
                          fontWeight: 500,
                        }}
                      >
                        {profile.email}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.neutral[500],
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        First Name
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.colors.neutral[900],
                          fontWeight: 500,
                        }}
                      >
                        {profile.first_name || "—"}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.neutral[500],
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Last Name
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.colors.neutral[900],
                          fontWeight: 500,
                        }}
                      >
                        {profile.last_name || "—"}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Card>
          </Grid>

          {/* Status Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: theme.borderRadius.card,
                border: `1px solid ${theme.colors.neutral[200]}`,
                backgroundColor: "#FFFFFF",
                p: 3,
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                sx={{ textAlign: "center" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: profile.is_active
                      ? `${theme.colors.success}20`
                      : `${theme.colors.warning}20`,
                    color: profile.is_active
                      ? theme.colors.success
                      : theme.colors.warning,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: "28px" }} />
                </Box>

                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.colors.neutral[500],
                      fontWeight: 500,
                    }}
                  >
                    Account Status
                  </Typography>
                  <Chip
                    label={profile.is_active ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      backgroundColor: profile.is_active
                        ? theme.colors.success
                        : theme.colors.warning,
                      color: "#FFFFFF",
                      fontWeight: 600,
                      alignSelf: "center",
                    }}
                  />
                </Stack>

                <Typography
                  variant="caption"
                  sx={{
                    color: theme.colors.neutral[500],
                  }}
                >
                  Your account is{" "}
                  <strong>
                    {profile.is_active ? "active and ready to use" : "inactive"}
                  </strong>
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
