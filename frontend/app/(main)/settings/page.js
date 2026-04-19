"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePassword, getMe, updateMe } from "@/services/userService";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Alert,
} from "@mui/material";

// ---------------- profile form schema ----------------
const profileSchema = yup.object().shape({
  username: yup.string().min(3).max(30).nullable(),
  first_name: yup.string().max(50).nullable(),
  last_name: yup.string().max(50).nullable(),
});

// ---------------- password form schema ----------------
const passwordSchema = yup.object().shape({
  current_password: yup
    .string()
    .min(8)
    .required("Current password is required"),
  new_password: yup.string().min(8).required(),
  confirm: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function Settings() {
  const [initial, setInitial] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await getMe();
      setInitial(res.data);
    } catch (e) {
      setProfileError("Failed to load profile.");
    }
  };

  // Profile form hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: initial || {},
  });

  useEffect(() => {
    if (initial) reset(initial);
  }, [initial, reset]);

  // Password form hook
  const {
    register: regPw,
    handleSubmit: submitPw,
    reset: resetPw,
    formState: { errors: errPw, isSubmitting: subPw },
  } = useForm({ resolver: yupResolver(passwordSchema) });

  // Handlers
  const onProfileSubmit = async (data) => {
    setProfileSuccess("");
    setProfileError("");
    try {
      await updateMe(data);
      setProfileSuccess("Profile updated!");
    } catch (e) {
      setProfileError("Failed to update profile.");
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordSuccess("");
    setPasswordError("");
    try {
      const res = await changePassword(data);
      if (res.success) {
        setPasswordSuccess("Password changed – please log in again.");
        resetPw();
      } else {
        setPasswordError(res.error);
      }
    } catch (e) {
      setPasswordError("Failed to change password.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Change your name and password here.
      </Typography>
      <Divider
        sx={{
          mb: 4,
        }}
      />

      {/* ---------- PROFILE SECTION ---------- */}
      {initial && (
        <Box sx={{ mb: 8 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update your personal information.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onProfileSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Stack spacing={3}>
              {profileSuccess && (
                <Alert severity="success">{profileSuccess}</Alert>
              )}
              {profileError && <Alert severity="error">{profileError}</Alert>}

              <TextField
                label="First name"
                fullWidth
                variant="standard"
                {...register("first_name")}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
              <TextField
                label="Last name"
                fullWidth
                variant="standard"
                {...register("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
                sx={{ alignSelf: "flex-end", minWidth: 160 }}
              >
                Save Changes
              </Button>
            </Stack>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* ---------- PASSWORD SECTION ---------- */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Change Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          For your security, use a strong password you haven&apos;t used
          elsewhere.
        </Typography>
        <Box
          component="form"
          onSubmit={submitPw(onPasswordSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Stack spacing={3}>
            {passwordSuccess && (
              <Alert severity="success">{passwordSuccess}</Alert>
            )}
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
              label="Current password"
              type="password"
              fullWidth
              variant="standard"
              {...regPw("current_password")}
              error={!!errPw.current_password}
              helperText={errPw.current_password?.message}
            />
            <TextField
              label="New password"
              type="password"
              fullWidth
              variant="standard"
              {...regPw("new_password")}
              error={!!errPw.new_password}
              helperText={errPw.new_password?.message}
            />
            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              variant="standard"
              {...regPw("confirm")}
              error={!!errPw.confirm}
              helperText={errPw.confirm?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={subPw}
              sx={{ alignSelf: "flex-end", minWidth: 160 }}
            >
              Change Password
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
