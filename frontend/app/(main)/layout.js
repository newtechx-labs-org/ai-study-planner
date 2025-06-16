"use client";

import { useEffect } from "react";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import AppNavbar from "../components/dashboard/components/AppNavbar";
import Header from "../components/dashboard/components/Header";
import SideMenu from "../components/dashboard/components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import { myProfile } from "@/services/userService";

export default function MainLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await myProfile();
        if (!res) {
          router.push("/signin");
        }
      } catch (err) {
        console.error("User not logged in or token expired");
        router.push("/signin");
      }
    };

    if (!user) fetchUser();
  }, [user, router]);

  // Show nothing while checking auth (avoid flicker)
  if (!user) return null;

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu user={user} />
        <AppNavbar user={user} />

        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            {children}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
