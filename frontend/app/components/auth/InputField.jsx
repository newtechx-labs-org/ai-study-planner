"use client";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { alpha, styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    fontWeight: 600,
    color: "#334155",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 18,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.92) 100%)",
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha("#6366F1", 0.14),
      borderWidth: 1.4,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha("#6366F1", 0.3),
    },
    "&.Mui-focused": {
      transform: "translateY(-1px)",
      boxShadow: `0 0 0 4px ${alpha("#6366F1", 0.12)}`,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4F46E5",
      borderWidth: 1.5,
    },
  },
  "& .MuiOutlinedInput-input": {
    paddingTop: 17,
    paddingBottom: 17,
    fontSize: "1rem",
    fontWeight: 500,
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 2,
    marginTop: 8,
    fontSize: "0.86rem",
    fontWeight: 500,
  },
}));

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  helperText,
  placeholder,
  autoComplete,
  autoFocus = false,
  startIcon,
  endAdornment,
  disabled = false,
}) {
  return (
    <StyledTextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={helperText}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      disabled={disabled}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endAdornment,
      }}
    />
  );
}
