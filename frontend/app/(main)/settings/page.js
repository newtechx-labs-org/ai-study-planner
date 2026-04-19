"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePassword, getMe, updateMe } from "@/services/userService";
import {
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
  TextField,
  Divider,
  Alert,
  Card,
} from "@mui/material";
import {
  Lock as LockIcon,
  Person as PersonIcon,
  ShieldRounded as ShieldRoundedIcon,
  VerifiedUserRounded as VerifiedUserRoundedIcon,
  ManageAccountsRounded as ManageAccountsRoundedIcon,
  KeyRounded as KeyRoundedIcon,
} from "@mui/icons-material";

import GradientCard from "@/app/components/primitives/GradientCard";
import CustomButton from "@/app/components/primitives/CustomButton";
import theme from "@/app/theme/authenticatedTheme";

// Profile form schema
const profileSchema = yup.object().shape({
  username: yup.string().min(3).max(30).nullable(),
  first_name: yup.string().max(50).nullable(),
  last_name: yup.string().max(50).nullable(),
});

// Password form schema
const passwordSchema = yup.object().shape({
  current_password: yup
    .string()
    .min(8)
    .required("Current password is required"),
  new_password: yup.string().min(8).required("New password is required"),
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

  // Profile form
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

  // Password form
  const {
    register: regPw,
    handleSubmit: submitPw,
    reset: resetPw,
    formState: { errors: errPw, isSubmitting: subPw },
  } = useForm({ resolver: yupResolver(passwordSchema) });

  const onProfileSubmit = async (data) => {
    setProfileSuccess("");
    setProfileError("");
    try {
      await updateMe(data);
      setProfileSuccess("Profile updated successfully!");
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
        setPasswordSuccess("Password changed successfully!");
        resetPw();
      } else {
        setPasswordError(res.error || "Failed to change password.");
      }
    } catch (e) {
      setPasswordError("Failed to change password.");
    }
  };

  return (
    <Stack spacing={4} sx={{ width: "100%" }}>
      <GradientCard
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: theme.borderRadius.xl,
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(168, 85, 247, 0.9) 100%)",
        }}
      >
        <Stack spacing={2}>
          <Chip
            icon={<ShieldRoundedIcon />}
            label="Account security"
            size="small"
            sx={{
              width: "fit-content",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              color: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              fontWeight: 700,
              "& .MuiChip-icon": {
                color: "#FFFFFF",
              },
            }}
          />
          <Stack spacing={1}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                fontSize: { xs: "2rem", md: "2.6rem" },
              }}
            >
              Personalize your account
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.82)", maxWidth: 720 }}
            >
              Keep your profile up to date, manage your password, and maintain a
              secure workspace for your study plans.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<ManageAccountsRoundedIcon />}
              label="Profile details"
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#FFFFFF" },
              }}
            />
            <Chip
              icon={<KeyRoundedIcon />}
              label="Password security"
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#FFFFFF" },
              }}
            />
            <Chip
              icon={<VerifiedUserRoundedIcon />}
              label="Always current"
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                fontWeight: 700,
                "& .MuiChip-icon": { color: "#FFFFFF" },
              }}
            />
          </Stack>
        </Stack>
      </GradientCard>

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: theme.borderRadius.card,
              border: `1px solid ${theme.colors.neutral[200]}`,
              p: 3,
              backgroundColor: "#FFFFFF",
              boxShadow: theme.shadows.sm,
            }}
          >
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: `${theme.colors.primary.main}12`,
                    color: theme.colors.primary.main,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <PersonIcon />
                </Box>
                <Stack spacing={0.25}>
                  <Typography
                    variant="overline"
                    sx={{ color: theme.colors.primary.main, fontWeight: 700 }}
                  >
                    Profile
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: theme.colors.neutral[900] }}
                  >
                    Update identity
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.colors.neutral[600], lineHeight: 1.7 }}
                >
                  Keep the name shown across your study planner current and easy
                  to recognize.
                </Typography>
                <Stack spacing={1}>
                  {[
                    "Visible in your dashboard greeting",
                    "Used in account-related pages",
                    "Saved securely with your profile",
                  ].map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: theme.colors.primary.main,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.neutral[700] }}
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {initial && (
              <Card
                sx={{
                  borderRadius: theme.borderRadius.card,
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  p: { xs: 3, md: 4 },
                  backgroundColor: "#FFFFFF",
                  boxShadow: theme.shadows.sm,
                }}
              >
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: `${theme.colors.primary.main}12`,
                        color: theme.colors.primary.main,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Stack spacing={0.25}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: theme.colors.neutral[900],
                        }}
                      >
                        Profile Information
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.neutral[500] }}
                      >
                        Update your personal information
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider />

                  <Box
                    component="form"
                    onSubmit={handleSubmit(onProfileSubmit)}
                    noValidate
                  >
                    <Stack spacing={2.25}>
                      {profileSuccess && (
                        <Alert severity="success">{profileSuccess}</Alert>
                      )}
                      {profileError && (
                        <Alert severity="error">{profileError}</Alert>
                      )}

                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <TextField
                          label="First name"
                          fullWidth
                          {...register("first_name")}
                          error={!!errors.first_name}
                          helperText={errors.first_name?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: theme.borderRadius.md,
                            },
                          }}
                        />
                        <TextField
                          label="Last name"
                          fullWidth
                          {...register("last_name")}
                          error={!!errors.last_name}
                          helperText={errors.last_name?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: theme.borderRadius.md,
                            },
                          }}
                        />
                      </Stack>

                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <CustomButton
                          type="submit"
                          variant="primary"
                          size="medium"
                          loading={isSubmitting}
                        >
                          Save Changes
                        </CustomButton>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            )}

            <Card
              sx={{
                borderRadius: theme.borderRadius.card,
                border: `1px solid ${theme.colors.neutral[200]}`,
                p: { xs: 3, md: 4 },
                backgroundColor: "#FFFFFF",
                boxShadow: theme.shadows.sm,
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: `${theme.colors.accent.main}12`,
                      color: theme.colors.accent.main,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <LockIcon />
                  </Box>
                  <Stack spacing={0.25}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: theme.colors.neutral[900] }}
                    >
                      Change Password
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.neutral[500] }}
                    >
                      Use a strong password you haven&apos;t used elsewhere
                    </Typography>
                  </Stack>
                </Stack>

                <Divider />

                <Box
                  component="form"
                  onSubmit={submitPw(onPasswordSubmit)}
                  noValidate
                >
                  <Stack spacing={2.25}>
                    {passwordSuccess && (
                      <Alert severity="success">{passwordSuccess}</Alert>
                    )}
                    {passwordError && (
                      <Alert severity="error">{passwordError}</Alert>
                    )}

                    <TextField
                      label="Current password"
                      type="password"
                      fullWidth
                      {...regPw("current_password")}
                      error={!!errPw.current_password}
                      helperText={errPw.current_password?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: theme.borderRadius.md,
                        },
                      }}
                    />
                    <TextField
                      label="New password"
                      type="password"
                      fullWidth
                      {...regPw("new_password")}
                      error={!!errPw.new_password}
                      helperText={errPw.new_password?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: theme.borderRadius.md,
                        },
                      }}
                    />
                    <TextField
                      label="Confirm new password"
                      type="password"
                      fullWidth
                      {...regPw("confirm")}
                      error={!!errPw.confirm}
                      helperText={errPw.confirm?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: theme.borderRadius.md,
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <CustomButton
                        type="submit"
                        variant="primary"
                        size="medium"
                        loading={subPw}
                      >
                        Change Password
                      </CustomButton>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
