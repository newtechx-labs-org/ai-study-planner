"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Sora } from "next/font/google";

import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import { signUp } from "@/services/userService";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const MotionButton = motion.create(Button);

function createUsernameFromName(name, email) {
  const base = name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 24);

  if (base.length >= 3) {
    return base;
  }

  const emailBase = email
    .split("@")[0]
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 24);

  if (emailBase.length >= 3) {
    return emailBase;
  }

  return `student${Date.now().toString().slice(-5)}`;
}

function splitName(fullName) {
  const cleaned = fullName.trim().replace(/\s+/g, " ");
  const [firstName = "", ...rest] = cleaned.split(" ");
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

export default function SignUp() {
  const router = useRouter();
  const redirectRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    return () => {
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
      }
    };
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password || form.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const normalizedName = form.name.trim().replace(/\s+/g, " ");
    const { firstName, lastName } = splitName(normalizedName);
    const email = form.email.trim();
    const username = createUsernameFromName(normalizedName, email);

    setIsLoading(true);
    const res = await signUp({
      username,
      email,
      password: form.password,
      first_name: firstName,
      last_name: lastName,
    });

    if (res.success) {
      setSuccessMessage("Account created. Redirecting to Sign In...");
      redirectRef.current = setTimeout(() => router.push("/signin"), 1400);
      return;
    }

    setSubmitError(res.error);
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <Stack spacing={1.1} sx={{ mb: 4.5 }}>
        <Typography
          className={sora.className}
          sx={{
            fontSize: "0.84rem",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4F46E5",
          }}
        >
          Create account
        </Typography>
        <Typography
          component="h1"
          className={sora.className}
          sx={{
            fontSize: { xs: "1.9rem", sm: "2.2rem" },
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            fontWeight: 800,
            color: "#0F172A",
          }}
        >
          Start your study system
        </Typography>
        <Typography sx={{ color: "#64748B", lineHeight: 1.7 }}>
          Build a sharper routine with an account designed for organized,
          AI-assisted learning.
        </Typography>
      </Stack>

      {successMessage ? (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${alpha("#10B981", 0.2)}`,
            backgroundColor: alpha("#10B981", 0.08),
            color: "#065F46",
            "& .MuiAlert-icon": { color: "#10B981" },
          }}
        >
          {successMessage}
        </Alert>
      ) : null}

      {submitError ? (
        <Alert
          severity="error"
          onClose={() => setSubmitError("")}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${alpha("#DC2626", 0.2)}`,
            backgroundColor: alpha("#DC2626", 0.06),
            color: "#7F1D1D",
            "& .MuiAlert-icon": { color: "#DC2626" },
          }}
        >
          {submitError}
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.2}>
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
            helperText={
              errors.name || "This will be used for your profile display name."
            }
            placeholder="Alex Johnson"
            autoComplete="name"
            autoFocus
            startIcon={<PersonRoundedIcon sx={{ color: "#64748B" }} />}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            helperText={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            startIcon={<MailRoundedIcon sx={{ color: "#64748B" }} />}
          />

          <InputField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            helperText={
              errors.password || "Use 8+ characters for a stronger account."
            }
            placeholder="Create a password"
            autoComplete="new-password"
            startIcon={<LockRoundedIcon sx={{ color: "#64748B" }} />}
            endAdornment={
              <IconButton
                onClick={() => setShowPassword((current) => !current)}
                edge="end"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <VisibilityOffRoundedIcon />
                ) : (
                  <VisibilityRoundedIcon />
                )}
              </IconButton>
            }
          />

          <InputField
            label="Confirm password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword}
            placeholder="Repeat your password"
            autoComplete="new-password"
            startIcon={<LockRoundedIcon sx={{ color: "#64748B" }} />}
            endAdornment={
              <IconButton
                onClick={() => setShowConfirmPassword((current) => !current)}
                edge="end"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <VisibilityOffRoundedIcon />
                ) : (
                  <VisibilityRoundedIcon />
                )}
              </IconButton>
            }
          />

          <MotionButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            sx={{
              mt: 0.5,
              minHeight: 56,
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, #4F46E5 0%, #2563EB 48%, #A855F7 100%)",
              color: "#FFFFFF",
              fontSize: "0.98rem",
              fontWeight: 800,
              textTransform: "none",
              boxShadow:
                "0 18px 34px rgba(79,70,229,0.28), 0 6px 16px rgba(37,99,235,0.22)",
              transition: "box-shadow 180ms ease, transform 180ms ease",
              "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                color: "inherit",
              },
              "&:hover": {
                background:
                  "linear-gradient(135deg, #4338CA 0%, #2563EB 48%, #9333EA 100%)",
                color: "#FFFFFF",
                boxShadow:
                  "0 24px 44px rgba(79,70,229,0.34), 0 8px 20px rgba(37,99,235,0.24)",
              },
              "&.Mui-disabled": {
                color: "#FFFFFF",
                opacity: 0.72,
              },
            }}
            endIcon={<ArrowForwardRoundedIcon />}
          >
            {isLoading ? "Creating account..." : "Register"}
          </MotionButton>
        </Stack>
      </Box>

      <Divider sx={{ my: 3.2, borderColor: alpha("#4F46E5", 0.12) }} />

      <Stack
        direction="row"
        spacing={0.6}
        alignItems="center"
        justifyContent="center"
      >
        <Typography sx={{ color: "#64748B" }}>
          Already have an account?
        </Typography>
        <Link
          component="button"
          type="button"
          onClick={() => router.push("/signin")}
          sx={{
            border: 0,
            bgcolor: "transparent",
            p: 0,
            color: "#4F46E5",
            fontWeight: 800,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Sign In
        </Link>
      </Stack>

      <Stack direction="row" justifyContent="center" sx={{ mt: 1.2 }}>
        <Link
          component="button"
          type="button"
          onClick={() => router.push("/")}
          sx={{
            border: 0,
            bgcolor: "transparent",
            p: 0,
            color: "#2563EB",
            fontWeight: 700,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Back to Landing Page
        </Link>
      </Stack>
    </AuthLayout>
  );
}
