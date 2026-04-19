"use client";

import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  mainListItems,
  secondaryListItems,
} from "@/app/(main)/utils/NavListItems";
import LandingLogo from "@/app/components/landing/LandingLogo";
import theme from "@/app/theme/authenticatedTheme";
import { logout } from "@/store/slices/authSlice";
import { signOut } from "@/services/userService";
import {
  Logout as LogoutIcon,
  HomeRounded as HomeRoundedIcon,
} from "@mui/icons-material";

/**
 * Premium Sidebar Component
 * Fixed desktop navigation, hidden on mobile.
 * Displays navigation items with active state highlight and user profile.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const isActive = (path) => {
    return pathname === `/app${path}` || pathname === path;
  };

  const renderListItems = (items) => {
    return items.map((item, index) => (
      <ListItemButton
        key={`${item.text}-${index}`}
        href={item.path}
        component="a"
        selected={isActive(item.path)}
        sx={{
          my: 0.75,
          mx: 1,
          px: 2.25,
          py: 1.35,
          borderRadius: theme.borderRadius.md,
          color: isActive(item.path)
            ? theme.colors.primary.main
            : theme.colors.neutral[600],
          backgroundColor: isActive(item.path)
            ? `${theme.colors.primary.main}12`
            : "transparent",
          border: isActive(item.path)
            ? `1px solid ${theme.colors.primary.main}30`
            : "none",
          "&:hover": {
            backgroundColor: `${theme.colors.primary.main}08`,
            color: theme.colors.primary.main,
          },
          transition: theme.transitions.normal,
          "& .MuiListItemIcon-root": {
            minWidth: 36,
            color: "inherit",
          },
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{
            sx: {
              fontSize: "13px",
              fontWeight: isActive(item.path) ? 600 : 500,
            },
          }}
        />
      </ListItemButton>
    ));
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout());
      router.push("/");
    }
  };

  if (isMobile) {
    return null; // Mobile uses drawer via Topbar
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: theme.sidebar.width,
        "& .MuiDrawer-paper": {
          width: theme.sidebar.width,
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)",
          border: `1px solid ${theme.sidebar.borderColor}`,
          boxShadow: theme.shadows.sm,
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          px: 2,
          py: 3,
        }}
      >
        {/* Logo / Branding */}
        <Box sx={{ mb: 2.5, px: 0.5 }}>
          <LandingLogo />
        </Box>

        {/* Navigation Items */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.colors.neutral[500],
              display: "block",
              px: 2,
              mb: 0.75,
              mt: 0.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.55px",
            }}
          >
            Main
          </Typography>
          <List sx={{ p: 0 }}>{renderListItems(mainListItems)}</List>

          <Divider sx={{ my: 2, borderColor: theme.colors.neutral[200] }} />

          <Typography
            variant="caption"
            sx={{
              color: theme.colors.neutral[500],
              display: "block",
              px: 2,
              mb: 1,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Settings
          </Typography>
          <List sx={{ p: 0 }}>{renderListItems(secondaryListItems)}</List>
        </Box>

        {/* User Profile Section */}
        {user && (
          <>
            <Divider sx={{ my: 2, borderColor: theme.colors.neutral[200] }} />
            <Stack
              sx={{
                p: 1.5,
                borderRadius: theme.borderRadius.md,
                backgroundColor: "rgba(255, 255, 255, 0.92)",
                border: `1px solid ${theme.colors.neutral[200]}`,
                boxShadow: `0 8px 20px ${theme.colors.neutral[900]}10`,
              }}
              spacing={1}
              direction="row"
              alignItems="center"
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: theme.colors.gradient,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                {user?.first_name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.colors.neutral[900],
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.colors.neutral[500],
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 1 }}>
              <ListItemButton
                href="/"
                component="a"
                sx={{
                  mb: 1,
                  px: 2,
                  py: 1.25,
                  borderRadius: theme.borderRadius.md,
                  color: theme.colors.primary.main,
                  backgroundColor: `${theme.colors.primary.main}10`,
                  border: `1px solid ${theme.colors.primary.main}26`,
                  transition: theme.transitions.normal,
                  "&:hover": {
                    backgroundColor: `${theme.colors.primary.main}18`,
                    color: theme.colors.primary.main,
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 40,
                    color: "inherit",
                  },
                }}
              >
                <ListItemIcon>
                  <HomeRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Landing Page"
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "13px",
                      fontWeight: 600,
                    },
                  }}
                />
              </ListItemButton>

              <ListItemButton
                onClick={handleLogout}
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius: theme.borderRadius.md,
                  color: theme.colors.error,
                  backgroundColor: `${theme.colors.error}10`,
                  border: `1px solid ${theme.colors.error}26`,
                  transition: theme.transitions.normal,
                  "&:hover": {
                    backgroundColor: `${theme.colors.error}18`,
                    color: theme.colors.error,
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 40,
                    color: "inherit",
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "13px",
                      fontWeight: 600,
                    },
                  }}
                />
              </ListItemButton>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
