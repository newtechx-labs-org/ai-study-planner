import * as React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";
import CardAlert from "./CardAlert";
import { useRouter } from "next/navigation";

function SideMenuMobile({ open, toggleDrawer, user }) {
  const router = useRouter();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
          minWidth: 250,
          maxWidth: 500,
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={user.username.toUpperCase()}
              src="#"
              sx={{ width: 36, height: 36, fontWeight: 500 }}
            />
            <Typography
              component="p"
              variant="h6"
              sx={{
                textTransform: "capitalize",
              }}
            >
              {user.first_name + " " + user.last_name}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent toggleDrawer={toggleDrawer} />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => router.push("/signin")}
            startIcon={<LogoutRoundedIcon />}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
