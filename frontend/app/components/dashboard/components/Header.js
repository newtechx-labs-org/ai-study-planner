import * as React from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { signOut } from "@/services/userService";

export default function Header() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleViewProfile = () => {
    handleCloseMenu();
    router.push("/profile");
  };

  const handleLogout = async () => {
    handleCloseMenu();
    await signOut();
    router.push("/signin");
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <MenuButton aria-label="Open profile menu" onClick={handleOpenMenu}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
            {(
              user?.first_name?.[0] ||
              user?.username?.[0] ||
              "U"
            ).toUpperCase()}
          </Avatar>
        </MenuButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleViewProfile}>
            <PersonRounded fontSize="small" sx={{ mr: 1 }} />
            View Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutRounded fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
}
