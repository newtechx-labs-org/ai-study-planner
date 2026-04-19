"use client";

import { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Sidebar from "../components/chrome/Sidebar";
import Topbar from "../components/chrome/Topbar";
import PageContainer from "../components/chrome/PageContainer";
import { myProfile } from "@/services/userService";
import theme from "@/app/theme/authenticatedTheme";

export default function MainLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await myProfile();
        if (!res?.success) {
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
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Topbar */}
        <Topbar />

        {/* Main Content Area */}
        <PageContainer>{children}</PageContainer>
      </Box>
    </>
  );
}
