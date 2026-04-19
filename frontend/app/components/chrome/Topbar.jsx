"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Avatar,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  HomeRounded as HomeRoundedIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { signOut } from "@/services/userService";
import {
  mainListItems,
  secondaryListItems,
} from "@/app/(main)/utils/NavListItems";
import LandingLogo from "@/app/components/landing/LandingLogo";
import theme from "@/app/theme/authenticatedTheme";
import { List, ListItemButton, ListItemText, Stack } from "@mui/material";
import { usePathname } from "next/navigation";

/**
 * Premium Topbar Component
 * Mobile-only header with menu toggle and user dropdown.
 * Desktop shows sidebar instead.
 */
export default function Topbar() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === `/app${path}` || pathname === path;
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderListItems = (items) => {
    return items.map((item, index) => (
      <ListItemButton
        key={`${item.text}-${index}`}
        href={item.path}
        component="a"
        selected={isActive(item.path)}
        onClick={() => setMobileDrawerOpen(false)}
        sx={{
          my: 0.75,
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

  if (!isMobile) {
    return null; // Desktop uses sidebar
  }

  return (
    <>
      {/* Mobile Topbar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${theme.colors.neutral[200]}`,
          boxShadow: theme.shadows.sm,
          zIndex: muiTheme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: theme.topbar.height,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          {/* Logo */}
          <Box
            sx={{ transform: "scale(0.92)", transformOrigin: "left center" }}
          >
            <LandingLogo compact />
          </Box>

          {/* Right actions */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              sx={{
                p: 0.5,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: theme.colors.gradient,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontSize: "14px",
                }}
              >
                {user?.first_name?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMobileDrawerToggle}
              sx={{
                color: theme.colors.neutral[700],
                border: `1px solid ${theme.colors.neutral[200]}`,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: theme.colors.neutral[100],
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.md,
            border: `1px solid ${theme.colors.neutral[200]}`,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user && (
          <>
            <MenuItem
              disabled
              sx={{
                p: 2,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: theme.colors.neutral[900] }}
                >
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.colors.neutral[500] }}
                >
                  {user?.email}
                </Typography>
              </Stack>
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem
          href="/profile"
          component="a"
          onClick={handleUserMenuClose}
          sx={{
            "&:hover": {
              backgroundColor: `${theme.colors.primary.main}08`,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <MenuItem
          href="/settings"
          component="a"
          onClick={handleUserMenuClose}
          sx={{
            "&:hover": {
              backgroundColor: `${theme.colors.primary.main}08`,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <MenuItem
          href="/"
          component="a"
          onClick={handleUserMenuClose}
          sx={{
            "&:hover": {
              backgroundColor: `${theme.colors.primary.main}08`,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <HomeRoundedIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Landing Page</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleUserMenuClose();
            handleLogout();
          }}
          sx={{
            color: theme.colors.error,
            "&:hover": {
              backgroundColor: `${theme.colors.error}08`,
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 300,
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)",
            borderRight: `1px solid ${theme.colors.neutral[200]}`,
            mt: `${theme.topbar.height}`,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <List sx={{ p: 0, flex: 1, overflowY: "auto" }}>
            {renderListItems(mainListItems)}
          </List>

          <Divider sx={{ my: 2 }} />

          <List sx={{ p: 0 }}>{renderListItems(secondaryListItems)}</List>

          <List sx={{ p: 0, mt: 1 }}>
            <ListItemButton
              href="/"
              component="a"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                my: 0.75,
                px: 2.25,
                py: 1.35,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.neutral[600],
                "&:hover": {
                  backgroundColor: `${theme.colors.primary.main}08`,
                  color: theme.colors.primary.main,
                },
                "& .MuiListItemIcon-root": {
                  minWidth: 36,
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
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Spacer for fixed topbar */}
      <Box sx={{ height: theme.topbar.height }} />
    </>
  );
}
