"use client";

import { useEffect, useState } from "react";
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
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Sora } from "next/font/google";

import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import { signIn } from "@/services/userService";
import { mainListItems } from "@/app/(main)/utils/NavListItems";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const MotionButton = motion.create(Button);

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password || form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    const res = await signIn({
      email: form.email.trim(),
      password: form.password,
    });

    if (res.success) {
      const navItem = mainListItems.find((item) =>
        item.users.includes(res.user.role),
      );
      router.push(navItem?.path || "/");
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
          Secure access
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
          Welcome back
        </Typography>
        <Typography sx={{ color: "#64748B", lineHeight: 1.7 }}>
          Sign in to continue your study plan and pick up exactly where you left
          off.
        </Typography>
      </Stack>

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
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            helperText={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            startIcon={<MailRoundedIcon sx={{ color: "#64748B" }} />}
          />

          <InputField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            helperText={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
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
            {isLoading ? "Signing in..." : "Sign In"}
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
          Don&apos;t have an account?
        </Typography>
        <Link
          component="button"
          type="button"
          onClick={() => router.push("/signup")}
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
          Sign Up
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
