"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Navbar({ onLogin, onRegister }) {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(6px)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          AI Study Planner
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1}>
          <Button variant="text" onClick={onLogin}>
            Login
          </Button>
          <Button variant="contained" onClick={onRegister}>
            Register
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
