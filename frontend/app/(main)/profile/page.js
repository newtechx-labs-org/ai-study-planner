"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { getMe } from "@/services/userService";

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
    <Box sx={{ width: "100%", maxWidth: 900 }}>
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          User Profile
        </Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {profile ? (
          <Card variant="outlined">
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ sm: "center" }}
              >
                <Avatar sx={{ width: 72, height: 72 }}>
                  {(
                    profile.first_name?.[0] ||
                    profile.username?.[0] ||
                    "U"
                  ).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {[profile.first_name, profile.last_name]
                      .filter(Boolean)
                      .join(" ") || profile.username}
                  </Typography>
                  <Typography color="text.secondary">
                    {profile.email}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Typography variant="body2">
                  Username: <strong>{profile.username}</strong>
                </Typography>
                <Typography variant="body2">
                  Account Status:{" "}
                  <strong>{profile.is_active ? "Active" : "Inactive"}</strong>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </Box>
  );
}
